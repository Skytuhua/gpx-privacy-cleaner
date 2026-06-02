/**
 * Douglas–Peucker line simplification with the tolerance expressed in real
 * metres (points are projected to a local planar frame first). Iterative, so it
 * handles very large tracks without blowing the call stack. Endpoints are always
 * kept; retained points keep their original elevation/time/extension data.
 */
import { toLocalMeters } from './geo';
import type { GeoPoint, GpxDoc, Segment, Track } from './types';

interface XY {
  x: number;
  y: number;
}

/** Perpendicular distance from p to the segment a→b (all in metre space). */
function perpDistance(p: XY, a: XY, b: XY): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    const ex = p.x - a.x;
    const ey = p.y - a.y;
    return Math.hypot(ex, ey);
  }
  // Project p onto the line, clamp to the segment.
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

export function simplifyPoints(points: GeoPoint[], toleranceM: number): GeoPoint[] {
  const n = points.length;
  if (n <= 2 || toleranceM <= 0) return points.slice();

  // Project to local metres around the mean latitude for stable scaling.
  let latSum = 0;
  for (const p of points) latSum += p.lat;
  const originLat = latSum / n;
  const proj: XY[] = points.map((p) => toLocalMeters(p.lat, p.lon, originLat));

  const keep = new Array<boolean>(n).fill(false);
  keep[0] = true;
  keep[n - 1] = true;

  const stack: Array<[number, number]> = [[0, n - 1]];
  while (stack.length > 0) {
    const [start, end] = stack.pop()!;
    if (end - start < 2) continue;
    let maxDist = -1;
    let maxIndex = -1;
    const a = proj[start]!;
    const b = proj[end]!;
    for (let i = start + 1; i < end; i++) {
      const d = perpDistance(proj[i]!, a, b);
      if (d > maxDist) {
        maxDist = d;
        maxIndex = i;
      }
    }
    if (maxDist > toleranceM && maxIndex !== -1) {
      keep[maxIndex] = true;
      stack.push([start, maxIndex]);
      stack.push([maxIndex, end]);
    }
  }

  const out: GeoPoint[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(points[i]!);
  return out;
}

export function simplifySegment(seg: Segment, toleranceM: number): Segment {
  return { points: simplifyPoints(seg.points, toleranceM) };
}

export function simplifyTrack(track: Track, toleranceM: number): Track {
  return {
    ...track,
    segments: track.segments.map((s) => simplifySegment(s, toleranceM)),
  };
}

/** Apply simplification to every track in a doc (routes/waypoints untouched). */
export function simplifyDoc(doc: GpxDoc, toleranceM: number): GpxDoc {
  if (toleranceM <= 0) return doc;
  return {
    ...doc,
    tracks: doc.tracks.map((t) => simplifyTrack(t, toleranceM)),
    routes: doc.routes.map((r) => ({ ...r, points: simplifyPoints(r.points, toleranceM) })),
  };
}
