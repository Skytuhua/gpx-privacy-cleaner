/**
 * Geospatial helpers: distance, bounds, and a simple equirectangular
 * projection used both for on-canvas rendering and for measuring
 * perpendicular distances during simplification. Pure functions only.
 */
import type { BBox, GeoPoint } from './types';

const EARTH_RADIUS_M = 6_371_008.8;
const DEG2RAD = Math.PI / 180;

/** Great-circle distance between two points, in metres (haversine). */
export function haversineMeters(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = (bLat - aLat) * DEG2RAD;
  const dLon = (bLon - aLon) * DEG2RAD;
  const lat1 = aLat * DEG2RAD;
  const lat2 = bLat * DEG2RAD;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function pointDistanceM(a: GeoPoint, b: GeoPoint): number {
  return haversineMeters(a.lat, a.lon, b.lat, b.lon);
}

/** Bounding box of a set of points, or null if empty. */
export function boundsOf(points: GeoPoint[]): BBox | null {
  if (points.length === 0) return null;
  let minLat = Infinity;
  let minLon = Infinity;
  let maxLat = -Infinity;
  let maxLon = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }
  return { minLat, minLon, maxLat, maxLon };
}

/** Merge two bounding boxes (either may be null). */
export function mergeBounds(a: BBox | null, b: BBox | null): BBox | null {
  if (!a) return b;
  if (!b) return a;
  return {
    minLat: Math.min(a.minLat, b.minLat),
    minLon: Math.min(a.minLon, b.minLon),
    maxLat: Math.max(a.maxLat, b.maxLat),
    maxLon: Math.max(a.maxLon, b.maxLon),
  };
}

/**
 * Local planar projection (metres) relative to an origin latitude. Good enough
 * for short tracks and for measuring perpendicular distances. x = east, y = north.
 */
export function toLocalMeters(
  lat: number,
  lon: number,
  originLat: number,
): { x: number; y: number } {
  const x = lon * DEG2RAD * EARTH_RADIUS_M * Math.cos(originLat * DEG2RAD);
  const y = lat * DEG2RAD * EARTH_RADIUS_M;
  return { x, y };
}

/** Round a coordinate to n decimal places (used by coordinate fuzzing). */
export function roundTo(value: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}

/** Approximate ground resolution of a given decimal-place precision, in metres. */
export function decimalsToMeters(decimals: number): number {
  // 1 degree of latitude ~= 111_320 m; each decimal place is 10x finer.
  return 111_320 / Math.pow(10, decimals);
}
