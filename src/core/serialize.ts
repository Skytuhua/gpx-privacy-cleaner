/**
 * Serializers: GpxDoc -> GPX 1.1 / GeoJSON / CSV. Pure string builders, no DOM.
 */
import type { GeoPoint, GpxDoc } from './types';

const APP_CREATOR = 'GPX Privacy Cleaner';

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Trim coordinate noise but keep full precision unless the caller fuzzed it. */
function fmtCoord(n: number): string {
  // Avoid scientific notation; keep up to 7 decimals (≈1 cm) of meaningful data.
  return Number(n.toFixed(7)).toString();
}

function pointHasExtensions(doc: GpxDoc): boolean {
  const check = (p: GeoPoint) => !!p.extRaw || (p.ext && Object.keys(p.ext).length > 0);
  if (doc.waypoints.some(check)) return true;
  if (doc.routes.some((r) => r.points.some(check))) return true;
  return doc.tracks.some((t) => t.segments.some((s) => s.points.some(check)));
}

function serializePointChildren(p: GeoPoint, indent: string, includeNames: boolean): string {
  const lines: string[] = [];
  if (p.ele !== undefined) lines.push(`${indent}<ele>${p.ele}</ele>`);
  if (p.time) lines.push(`${indent}<time>${escXml(p.time)}</time>`);
  if (includeNames) {
    if (p.name) lines.push(`${indent}<name>${escXml(p.name)}</name>`);
    if (p.cmt) lines.push(`${indent}<cmt>${escXml(p.cmt)}</cmt>`);
    if (p.desc) lines.push(`${indent}<desc>${escXml(p.desc)}</desc>`);
    if (p.sym) lines.push(`${indent}<sym>${escXml(p.sym)}</sym>`);
  }
  if (p.ext) {
    for (const [tag, value] of Object.entries(p.ext)) {
      lines.push(`${indent}<${tag}>${escXml(value)}</${tag}>`);
    }
  }
  if (p.extRaw) {
    lines.push(`${indent}<extensions>${p.extRaw}</extensions>`);
  }
  return lines.join('\n');
}

/** Serialize a doc to a well-formed GPX 1.1 string. */
export function toGpx(doc: GpxDoc): string {
  const includeExtNs = pointHasExtensions(doc);
  const nsLines = [
    'xmlns="http://www.topografix.com/GPX/1/1"',
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"',
  ];
  if (includeExtNs) {
    nsLines.push(
      'xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"',
      'xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"',
      'xmlns:gpxtrkx="http://www.garmin.com/xmlschemas/TrackStatsExtension/v1"',
    );
  }

  const out: string[] = [];
  out.push('<?xml version="1.0" encoding="UTF-8"?>');
  out.push(`<gpx version="1.1" creator="${escXml(doc.metadata.creator ?? APP_CREATOR)}"`);
  out.push(`  ${nsLines.join('\n  ')}>`);

  // metadata
  const m = doc.metadata;
  if (m.name || m.desc || m.author || m.time) {
    out.push('  <metadata>');
    if (m.name) out.push(`    <name>${escXml(m.name)}</name>`);
    if (m.desc) out.push(`    <desc>${escXml(m.desc)}</desc>`);
    if (m.author) out.push(`    <author><name>${escXml(m.author)}</name></author>`);
    if (m.time) out.push(`    <time>${escXml(m.time)}</time>`);
    out.push('  </metadata>');
  }

  // waypoints
  for (const w of doc.waypoints) {
    out.push(`  <wpt lat="${fmtCoord(w.lat)}" lon="${fmtCoord(w.lon)}">`);
    const children = serializePointChildren(w, '    ', true);
    if (children) out.push(children);
    out.push('  </wpt>');
  }

  // routes
  for (const r of doc.routes) {
    out.push('  <rte>');
    if (r.name) out.push(`    <name>${escXml(r.name)}</name>`);
    if (r.desc) out.push(`    <desc>${escXml(r.desc)}</desc>`);
    for (const p of r.points) {
      out.push(`    <rtept lat="${fmtCoord(p.lat)}" lon="${fmtCoord(p.lon)}">`);
      const children = serializePointChildren(p, '      ', true);
      if (children) out.push(children);
      out.push('    </rtept>');
    }
    out.push('  </rte>');
  }

  // tracks
  for (const t of doc.tracks) {
    out.push('  <trk>');
    if (t.name) out.push(`    <name>${escXml(t.name)}</name>`);
    if (t.cmt) out.push(`    <cmt>${escXml(t.cmt)}</cmt>`);
    if (t.desc) out.push(`    <desc>${escXml(t.desc)}</desc>`);
    if (t.type) out.push(`    <type>${escXml(t.type)}</type>`);
    for (const seg of t.segments) {
      out.push('    <trkseg>');
      for (const p of seg.points) {
        out.push(`      <trkpt lat="${fmtCoord(p.lat)}" lon="${fmtCoord(p.lon)}">`);
        const children = serializePointChildren(p, '        ', true);
        if (children) out.push(children);
        out.push('      </trkpt>');
      }
      out.push('    </trkseg>');
    }
    out.push('  </trk>');
  }

  out.push('</gpx>');
  out.push('');
  return out.join('\n');
}

/** Serialize a doc to GeoJSON (tracks/routes as LineStrings, waypoints as Points). */
export function toGeoJson(doc: GpxDoc): string {
  const features: unknown[] = [];
  const coord = (p: GeoPoint) => (p.ele !== undefined ? [p.lon, p.lat, p.ele] : [p.lon, p.lat]);

  for (const t of doc.tracks) {
    const lines = t.segments.map((s) => s.points.map(coord)).filter((l) => l.length > 0);
    if (lines.length === 0) continue;
    features.push({
      type: 'Feature',
      properties: { name: t.name ?? null, kind: 'track' },
      geometry:
        lines.length === 1
          ? { type: 'LineString', coordinates: lines[0] }
          : { type: 'MultiLineString', coordinates: lines },
    });
  }
  for (const r of doc.routes) {
    if (r.points.length === 0) continue;
    features.push({
      type: 'Feature',
      properties: { name: r.name ?? null, kind: 'route' },
      geometry: { type: 'LineString', coordinates: r.points.map(coord) },
    });
  }
  for (const w of doc.waypoints) {
    features.push({
      type: 'Feature',
      properties: { name: w.name ?? null, kind: 'waypoint' },
      geometry: { type: 'Point', coordinates: coord(w) },
    });
  }

  return JSON.stringify({ type: 'FeatureCollection', features }, null, 2);
}

function csvCell(v: string | number | undefined): string {
  if (v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Serialize all points to a flat CSV (one row per point). */
export function toCsv(doc: GpxDoc): string {
  const rows: string[] = ['type,track,segment,index,lat,lon,ele,time,name'];
  doc.tracks.forEach((t, ti) => {
    t.segments.forEach((s, si) => {
      s.points.forEach((p, pi) => {
        rows.push(
          [
            'track',
            csvCell(t.name ?? ti),
            si,
            pi,
            fmtCoord(p.lat),
            fmtCoord(p.lon),
            csvCell(p.ele),
            csvCell(p.time),
            csvCell(p.name),
          ].join(','),
        );
      });
    });
  });
  doc.routes.forEach((r, ri) => {
    r.points.forEach((p, pi) => {
      rows.push(
        [
          'route',
          csvCell(r.name ?? ri),
          0,
          pi,
          fmtCoord(p.lat),
          fmtCoord(p.lon),
          csvCell(p.ele),
          csvCell(p.time),
          csvCell(p.name),
        ].join(','),
      );
    });
  });
  doc.waypoints.forEach((p, pi) => {
    rows.push(
      [
        'waypoint',
        '',
        '',
        pi,
        fmtCoord(p.lat),
        fmtCoord(p.lon),
        csvCell(p.ele),
        csvCell(p.time),
        csvCell(p.name),
      ].join(','),
    );
  });
  return rows.join('\n') + '\n';
}

/** Byte length of a UTF-8 string (used for before/after size reporting). */
export function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}
