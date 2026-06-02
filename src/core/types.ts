/**
 * Core domain types for GPX Privacy Cleaner.
 *
 * A parsed document is treated as immutable; all edits are expressed as a
 * declarative `EditConfig` and applied by `transform.ts`, which produces a new
 * document plus a privacy report. Nothing here touches the DOM or the network.
 */

/** A single recorded point (track point, route point, or waypoint). */
export interface GeoPoint {
  lat: number;
  lon: number;
  /** Elevation in metres, if present. */
  ele?: number;
  /** Timestamp as an ISO string, if present. */
  time?: string;
  /** Optional name (mainly for waypoints/route points). */
  name?: string;
  /** Optional symbol/comment/description (waypoints). */
  cmt?: string;
  desc?: string;
  sym?: string;
  /** Raw extension key/values (heart rate, cadence, power, hdop, speed, ...). */
  ext?: Record<string, string>;
}

/** A contiguous run of track points. */
export interface Segment {
  points: GeoPoint[];
}

/** A track: named collection of segments. */
export interface Track {
  name?: string;
  desc?: string;
  cmt?: string;
  type?: string;
  segments: Segment[];
}

/** A route: an ordered list of route points. */
export interface Route {
  name?: string;
  desc?: string;
  points: GeoPoint[];
}

/** Top-level metadata block. */
export interface GpxMetadata {
  name?: string;
  desc?: string;
  author?: string;
  time?: string;
  /** The `creator` attribute of the <gpx> element (often a device/app id). */
  creator?: string;
}

/** A whole parsed GPX document. */
export interface GpxDoc {
  metadata: GpxMetadata;
  tracks: Track[];
  routes: Route[];
  waypoints: GeoPoint[];
  /** Non-fatal issues encountered while parsing (skipped/invalid nodes). */
  warnings: string[];
  /** Source filename, when known. */
  sourceName?: string;
}

/** A circular privacy zone on the map. */
export interface PrivacyZone {
  lat: number;
  lon: number;
  /** Radius in metres. */
  radiusM: number;
}

export type PrivacyMode = 'crop-ends' | 'cut-all';

/** Which personal fields to strip. */
export interface StripOptions {
  time: boolean;
  extensions: boolean;
  elevation: boolean;
  names: boolean;
  creator: boolean;
}

/**
 * The full, declarative description of the edits the user has configured.
 * Applying the same config to the same source always yields the same result.
 */
export interface EditConfig {
  privacyZone: PrivacyZone | null;
  privacyMode: PrivacyMode;
  strip: StripOptions;
  /** Round coordinates to this many decimal places; null = no fuzzing. */
  fuzzDecimals: number | null;
  /** Trim to an inclusive point-index range [start, end]; null = keep all. */
  trimRange: { start: number; end: number } | null;
  /** Douglas–Peucker tolerance in metres; null/0 = no simplification. */
  simplifyToleranceM: number | null;
  /** Merge all tracks/segments into a single track. */
  merge: boolean;
}

export interface BBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

/** What the transform actually removed — the trust artifact shown to the user. */
export interface PrivacyReport {
  pointsBefore: number;
  pointsAfter: number;
  pointsRemoved: number;
  bytesBefore: number;
  bytesAfter: number;
  bboxBefore: BBox | null;
  bboxAfter: BBox | null;
  removedTimestamps: boolean;
  removedExtensions: boolean;
  removedElevation: boolean;
  removedNames: boolean;
  removedCreator: boolean;
  fuzzedTo: number | null;
  privacyZoneApplied: PrivacyZone | null;
  privacyZonePointsRemoved: number;
  /** Human-readable summary lines. */
  notes: string[];
}

export function defaultStripOptions(): StripOptions {
  return { time: false, extensions: false, elevation: false, names: false, creator: false };
}

export function defaultEditConfig(): EditConfig {
  return {
    privacyZone: null,
    privacyMode: 'crop-ends',
    strip: defaultStripOptions(),
    fuzzDecimals: null,
    trimRange: null,
    simplifyToleranceM: null,
    merge: false,
  };
}
