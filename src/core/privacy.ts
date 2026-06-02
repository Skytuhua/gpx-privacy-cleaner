/**
 * Privacy operations — the heart of the product.
 *
 *  - detectHomeZone: cluster start/end points to propose a "home" privacy zone.
 *  - applyPrivacyZone: crop the ends (anti-doxxing) or cut every in-zone point.
 *  - stripMetadata: remove timestamps / extensions / elevation / names / creator.
 *  - fuzzCoordinates: reduce coordinate precision.
 *
 * Everything is pure and returns new documents; originals are never mutated.
 */
import { haversineMeters, pointDistanceM, roundTo } from './geo';
import type {
  GeoPoint,
  GpxDoc,
  PrivacyMode,
  PrivacyZone,
  Route,
  Segment,
  StripOptions,
  Track,
} from './types';

const HOME_CLUSTER_THRESHOLD_M = 150;
const HOME_RADIUS_MARGIN_M = 100;
const HOME_RADIUS_MIN_M = 150;
const HOME_RADIUS_MAX_M = 500;

interface Cluster {
  lat: number;
  lon: number;
  members: GeoPoint[];
}

/** Endpoints to consider for home detection: first & last of every segment. */
function collectEndpoints(doc: GpxDoc): GeoPoint[] {
  const eps: GeoPoint[] = [];
  for (const trk of doc.tracks) {
    for (const seg of trk.segments) {
      if (seg.points.length === 0) continue;
      eps.push(seg.points[0]!);
      eps.push(seg.points[seg.points.length - 1]!);
    }
  }
  for (const rte of doc.routes) {
    if (rte.points.length === 0) continue;
    eps.push(rte.points[0]!);
    eps.push(rte.points[rte.points.length - 1]!);
  }
  return eps;
}

/**
 * Greedily cluster endpoints; if the largest cluster contains at least two
 * endpoints, propose its centroid + a snug radius as the home privacy zone.
 * Returns null when endpoints don't cluster (e.g. a one-way A→B trip), to avoid
 * guessing wrong.
 */
export function detectHomeZone(doc: GpxDoc): PrivacyZone | null {
  const eps = collectEndpoints(doc);
  if (eps.length < 2) return null;

  const clusters: Cluster[] = [];
  for (const ep of eps) {
    let best: Cluster | null = null;
    let bestDist = Infinity;
    for (const c of clusters) {
      const d = haversineMeters(ep.lat, ep.lon, c.lat, c.lon);
      if (d <= HOME_CLUSTER_THRESHOLD_M && d < bestDist) {
        best = c;
        bestDist = d;
      }
    }
    if (best) {
      best.members.push(ep);
      // Recompute centroid.
      best.lat = best.members.reduce((s, p) => s + p.lat, 0) / best.members.length;
      best.lon = best.members.reduce((s, p) => s + p.lon, 0) / best.members.length;
    } else {
      clusters.push({ lat: ep.lat, lon: ep.lon, members: [ep] });
    }
  }

  let largest = clusters[0]!;
  for (const c of clusters) if (c.members.length > largest.members.length) largest = c;
  if (largest.members.length < 2) return null;

  const maxDist = Math.max(
    0,
    ...largest.members.map((p) => haversineMeters(p.lat, p.lon, largest.lat, largest.lon)),
  );
  const radiusM = Math.min(
    HOME_RADIUS_MAX_M,
    Math.max(HOME_RADIUS_MIN_M, Math.round(maxDist + HOME_RADIUS_MARGIN_M)),
  );
  return { lat: largest.lat, lon: largest.lon, radiusM };
}

export function inZone(p: GeoPoint, zone: PrivacyZone): boolean {
  return haversineMeters(p.lat, p.lon, zone.lat, zone.lon) <= zone.radiusM;
}

/** Crop leading/trailing in-zone points from one run; returns the kept slice. */
function cropEnds(points: GeoPoint[], zone: PrivacyZone): { kept: GeoPoint[]; removed: number } {
  let start = 0;
  let end = points.length - 1;
  while (start <= end && inZone(points[start]!, zone)) start++;
  while (end >= start && inZone(points[end]!, zone)) end--;
  const kept = start <= end ? points.slice(start, end + 1) : [];
  return { kept, removed: points.length - kept.length };
}

/** Cut every in-zone point; splits the run into multiple runs at the gaps. */
function cutAll(points: GeoPoint[], zone: PrivacyZone): { runs: GeoPoint[][]; removed: number } {
  const runs: GeoPoint[][] = [];
  let current: GeoPoint[] = [];
  let removed = 0;
  for (const p of points) {
    if (inZone(p, zone)) {
      removed++;
      if (current.length > 0) {
        runs.push(current);
        current = [];
      }
    } else {
      current.push(p);
    }
  }
  if (current.length > 0) runs.push(current);
  return { runs, removed };
}

export interface PrivacyZoneResult {
  doc: GpxDoc;
  removed: number;
}

export function applyPrivacyZone(
  doc: GpxDoc,
  zone: PrivacyZone,
  mode: PrivacyMode,
): PrivacyZoneResult {
  let removed = 0;

  const processSegments = (segments: Segment[]): Segment[] => {
    const out: Segment[] = [];
    for (const seg of segments) {
      if (mode === 'crop-ends') {
        const { kept, removed: r } = cropEnds(seg.points, zone);
        removed += r;
        if (kept.length > 0) out.push({ points: kept });
      } else {
        const { runs, removed: r } = cutAll(seg.points, zone);
        removed += r;
        for (const run of runs) out.push({ points: run });
      }
    }
    return out;
  };

  const tracks: Track[] = doc.tracks
    .map((t) => ({ ...t, segments: processSegments(t.segments) }))
    .filter((t) => t.segments.length > 0);

  const routes: Route[] = doc.routes
    .map((r) => {
      if (mode === 'crop-ends') {
        const { kept, removed: rr } = cropEnds(r.points, zone);
        removed += rr;
        return { ...r, points: kept };
      }
      const { runs, removed: rr } = cutAll(r.points, zone);
      removed += rr;
      return { ...r, points: runs.flat() };
    })
    .filter((r) => r.points.length > 0);

  // Waypoints inside the zone are removed in both modes (a marker at home leaks too).
  const waypoints = doc.waypoints.filter((w) => {
    if (inZone(w, zone)) {
      removed++;
      return false;
    }
    return true;
  });

  return { doc: { ...doc, tracks, routes, waypoints }, removed };
}

/** Map a transform over every point in a doc (tracks, routes, waypoints). */
function mapAllPoints(doc: GpxDoc, fn: (p: GeoPoint) => GeoPoint): GpxDoc {
  return {
    ...doc,
    tracks: doc.tracks.map((t) => ({
      ...t,
      segments: t.segments.map((s) => ({ points: s.points.map(fn) })),
    })),
    routes: doc.routes.map((r) => ({ ...r, points: r.points.map(fn) })),
    waypoints: doc.waypoints.map(fn),
  };
}

export function stripMetadata(doc: GpxDoc, opts: StripOptions): GpxDoc {
  const stripPoint = (p: GeoPoint): GeoPoint => {
    const np: GeoPoint = { lat: p.lat, lon: p.lon };
    if (!opts.elevation && p.ele !== undefined) np.ele = p.ele;
    if (!opts.time && p.time) np.time = p.time;
    if (!opts.names) {
      if (p.name) np.name = p.name;
      if (p.cmt) np.cmt = p.cmt;
      if (p.desc) np.desc = p.desc;
      if (p.sym) np.sym = p.sym;
    }
    if (!opts.extensions) {
      if (p.ext) np.ext = p.ext;
      if (p.extRaw) np.extRaw = p.extRaw;
    }
    return np;
  };

  let out = mapAllPoints(doc, stripPoint);

  // Metadata-level fields.
  const metadata = { ...out.metadata };
  if (opts.time) delete metadata.time;
  if (opts.creator) {
    delete metadata.creator;
    delete metadata.author;
  }
  if (opts.names) {
    delete metadata.name;
    delete metadata.desc;
  }
  out = { ...out, metadata };

  if (opts.names) {
    out = {
      ...out,
      tracks: out.tracks.map((t) => {
        const nt: Track = { segments: t.segments };
        if (t.type) nt.type = t.type;
        return nt;
      }),
      routes: out.routes.map((r) => ({ points: r.points })),
    };
  }

  return out;
}

export function fuzzCoordinates(doc: GpxDoc, decimals: number): GpxDoc {
  return mapAllPoints(doc, (p) => ({
    ...p,
    lat: roundTo(p.lat, decimals),
    lon: roundTo(p.lon, decimals),
  }));
}

/** True if any point in the doc carries the given kind of personal data. */
export function inventory(doc: GpxDoc): {
  hasTime: boolean;
  hasExtensions: boolean;
  hasElevation: boolean;
  hasNames: boolean;
  hasCreator: boolean;
} {
  let hasTime = false;
  let hasExtensions = false;
  let hasElevation = false;
  let hasNames = doc.waypoints.some((w) => w.name || w.cmt || w.desc);

  const scan = (p: GeoPoint) => {
    if (p.time) hasTime = true;
    if (p.ele !== undefined) hasElevation = true;
    if (p.extRaw || (p.ext && Object.keys(p.ext).length > 0)) hasExtensions = true;
    if (p.name || p.cmt || p.desc || p.sym) hasNames = true;
  };
  for (const t of doc.tracks) {
    if (t.name || t.desc || t.cmt) hasNames = true;
    for (const s of t.segments) for (const p of s.points) scan(p);
  }
  for (const r of doc.routes) {
    if (r.name || r.desc) hasNames = true;
    for (const p of r.points) scan(p);
  }
  for (const w of doc.waypoints) scan(w);
  if (doc.metadata.time) hasTime = true;

  const hasCreator = !!(doc.metadata.creator || doc.metadata.author);
  return { hasTime, hasExtensions, hasElevation, hasNames, hasCreator };
}

/** Distance between the start points of consecutive segments, for diagnostics. */
export function segmentGapMeters(a: Segment, b: Segment): number | null {
  const pa = a.points[a.points.length - 1];
  const pb = b.points[0];
  if (!pa || !pb) return null;
  return pointDistanceM(pa, pb);
}
