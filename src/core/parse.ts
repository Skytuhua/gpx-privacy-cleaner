/**
 * GPX parser. Turns GPX text into an immutable `GpxDoc`.
 *
 * Goals:
 *  - Support GPX 1.0 and 1.1, with or without namespace prefixes.
 *  - Preserve track/route/waypoint structure, elevation, time, names, the
 *    standard accuracy children (hdop/vdop/…) and the raw <extensions> XML
 *    (so non-stripped data round-trips faithfully).
 *  - Be tolerant: malformed/partial input yields warnings and whatever could be
 *    parsed, never an exception thrown at the UI.
 */
import type { GeoPoint, GpxDoc, GpxMetadata, Route, Segment, Track } from './types';

export type ParseResult = { ok: true; doc: GpxDoc } | { ok: false; error: string };

/** Standard scalar children of a point that aren't core fields but may carry data. */
const SCALAR_EXTRA_TAGS = [
  'magvar',
  'geoidheight',
  'src',
  'sym',
  'type',
  'fix',
  'sat',
  'hdop',
  'vdop',
  'pdop',
  'ageofdgpsdata',
  'dgpsid',
  'speed',
  'course',
];

function firstChildText(el: Element, localName: string): string | undefined {
  for (const child of Array.from(el.children)) {
    if (child.localName === localName) {
      const t = child.textContent?.trim();
      return t && t.length > 0 ? t : undefined;
    }
  }
  return undefined;
}

function parseFloatSafe(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Serialize the inner XML of an <extensions> element (its child nodes), verbatim. */
function serializeExtensions(extEl: Element): string | undefined {
  const serializer = new XMLSerializer();
  const parts: string[] = [];
  for (const node of Array.from(extEl.childNodes)) {
    parts.push(serializer.serializeToString(node));
  }
  const joined = parts.join('').trim();
  return joined.length > 0 ? joined : undefined;
}

function parsePoint(el: Element, warnings: string[], kind: string): GeoPoint | null {
  const lat = parseFloatSafe(el.getAttribute('lat') ?? undefined);
  const lon = parseFloatSafe(el.getAttribute('lon') ?? undefined);
  if (lat === undefined || lon === undefined) {
    warnings.push(`Skipped a ${kind} with missing/invalid lat/lon.`);
    return null;
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    warnings.push(`Skipped a ${kind} with out-of-range coordinates (${lat}, ${lon}).`);
    return null;
  }

  const point: GeoPoint = { lat, lon };

  const ele = parseFloatSafe(firstChildText(el, 'ele'));
  if (ele !== undefined) point.ele = ele;

  const time = firstChildText(el, 'time');
  if (time) point.time = time;

  const name = firstChildText(el, 'name');
  if (name) point.name = name;
  const cmt = firstChildText(el, 'cmt');
  if (cmt) point.cmt = cmt;
  const desc = firstChildText(el, 'desc');
  if (desc) point.desc = desc;
  const sym = firstChildText(el, 'sym');
  if (sym) point.sym = sym;

  // Standard scalar extras (accuracy/sensor fields living as direct children).
  const ext: Record<string, string> = {};
  for (const tag of SCALAR_EXTRA_TAGS) {
    if (tag === 'sym') continue; // already a core-ish field
    const v = firstChildText(el, tag);
    if (v !== undefined) ext[tag] = v;
  }

  // The <extensions> block (HR, cadence, power, Garmin TrackPointExtension, …).
  for (const child of Array.from(el.children)) {
    if (child.localName === 'extensions') {
      const raw = serializeExtensions(child);
      if (raw) point.extRaw = raw;
    }
  }

  if (Object.keys(ext).length > 0) point.ext = ext;
  return point;
}

function parseMetadata(gpxEl: Element): GpxMetadata {
  const meta: GpxMetadata = {};
  const creator = gpxEl.getAttribute('creator');
  if (creator) meta.creator = creator;

  let metaEl: Element | undefined;
  for (const child of Array.from(gpxEl.children)) {
    if (child.localName === 'metadata') {
      metaEl = child;
      break;
    }
  }
  if (metaEl) {
    const name = firstChildText(metaEl, 'name');
    if (name) meta.name = name;
    const desc = firstChildText(metaEl, 'desc');
    if (desc) meta.desc = desc;
    const time = firstChildText(metaEl, 'time');
    if (time) meta.time = time;
    for (const child of Array.from(metaEl.children)) {
      if (child.localName === 'author') {
        const an = firstChildText(child, 'name');
        if (an) meta.author = an;
      }
    }
  } else {
    // GPX 1.0 keeps name/desc/author/time directly under <gpx>.
    const name = firstChildText(gpxEl, 'name');
    if (name) meta.name = name;
    const desc = firstChildText(gpxEl, 'desc');
    if (desc) meta.desc = desc;
    const author = firstChildText(gpxEl, 'author');
    if (author) meta.author = author;
    const time = firstChildText(gpxEl, 'time');
    if (time) meta.time = time;
  }
  return meta;
}

function childrenByLocalName(el: Element, localName: string): Element[] {
  return Array.from(el.children).filter((c) => c.localName === localName);
}

export function parseGpx(text: string, sourceName?: string): ParseResult {
  if (!text || text.trim().length === 0) {
    return { ok: false, error: 'The file is empty.' };
  }

  let xml: Document;
  try {
    xml = new DOMParser().parseFromString(text, 'application/xml');
  } catch {
    return { ok: false, error: 'Could not parse the file as XML.' };
  }

  // Find the <gpx> root regardless of namespace prefix.
  let gpxEl: Element | null =
    xml.documentElement && xml.documentElement.localName === 'gpx' ? xml.documentElement : null;
  if (!gpxEl) {
    gpxEl = Array.from(xml.getElementsByTagName('*')).find((e) => e.localName === 'gpx') ?? null;
  }

  // DOMParser reports malformed XML via a <parsererror> node instead of throwing.
  const hadParserError =
    xml.documentElement?.localName === 'parsererror' ||
    xml.getElementsByTagName('parsererror').length > 0;

  if (!gpxEl) {
    return {
      ok: false,
      error: hadParserError
        ? 'This file is not valid XML, so it could not be read as GPX.'
        : 'No <gpx> element found — is this really a GPX file?',
    };
  }

  const warnings: string[] = [];
  const metadata = parseMetadata(gpxEl);

  // Waypoints
  const waypoints: GeoPoint[] = [];
  for (const wptEl of childrenByLocalName(gpxEl, 'wpt')) {
    const p = parsePoint(wptEl, warnings, 'waypoint');
    if (p) waypoints.push(p);
  }

  // Routes
  const routes: Route[] = [];
  for (const rteEl of childrenByLocalName(gpxEl, 'rte')) {
    const route: Route = { points: [] };
    const rname = firstChildText(rteEl, 'name');
    if (rname) route.name = rname;
    const rdesc = firstChildText(rteEl, 'desc');
    if (rdesc) route.desc = rdesc;
    for (const rptEl of childrenByLocalName(rteEl, 'rtept')) {
      const p = parsePoint(rptEl, warnings, 'route point');
      if (p) route.points.push(p);
    }
    if (route.points.length > 0) routes.push(route);
    else warnings.push('Skipped an empty route.');
  }

  // Tracks
  const tracks: Track[] = [];
  for (const trkEl of childrenByLocalName(gpxEl, 'trk')) {
    const track: Track = { segments: [] };
    const tname = firstChildText(trkEl, 'name');
    if (tname) track.name = tname;
    const tdesc = firstChildText(trkEl, 'desc');
    if (tdesc) track.desc = tdesc;
    const tcmt = firstChildText(trkEl, 'cmt');
    if (tcmt) track.cmt = tcmt;
    const ttype = firstChildText(trkEl, 'type');
    if (ttype) track.type = ttype;

    for (const segEl of childrenByLocalName(trkEl, 'trkseg')) {
      const seg: Segment = { points: [] };
      for (const ptEl of childrenByLocalName(segEl, 'trkpt')) {
        const p = parsePoint(ptEl, warnings, 'track point');
        if (p) seg.points.push(p);
      }
      if (seg.points.length > 0) track.segments.push(seg);
    }
    if (track.segments.length > 0) tracks.push(track);
    else warnings.push(`Skipped track "${track.name ?? '(unnamed)'}" with no valid points.`);
  }

  if (tracks.length === 0 && routes.length === 0 && waypoints.length === 0) {
    return {
      ok: false,
      error: 'No tracks, routes, or waypoints found in this GPX file.',
    };
  }

  const doc: GpxDoc = { metadata, tracks, routes, waypoints, warnings };
  if (sourceName) doc.sourceName = sourceName;
  return { ok: true, doc };
}

/** Convenience: collect every track point across all tracks/segments, in order. */
export function allTrackPoints(doc: GpxDoc): GeoPoint[] {
  const out: GeoPoint[] = [];
  for (const trk of doc.tracks) {
    for (const seg of trk.segments) {
      for (const p of seg.points) out.push(p);
    }
  }
  return out;
}

/** Total number of points in a doc (tracks + routes + waypoints). */
export function countPoints(doc: GpxDoc): number {
  let n = doc.waypoints.length;
  for (const r of doc.routes) n += r.points.length;
  for (const t of doc.tracks) for (const s of t.segments) n += s.points.length;
  return n;
}
