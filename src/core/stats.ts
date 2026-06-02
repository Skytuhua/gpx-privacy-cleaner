/**
 * Track statistics: distance, duration, moving time, elevation gain/loss,
 * speed and pace. Pure functions over a GpxDoc. Distances are metres, times
 * seconds; the UI formats units (km/mi, pace).
 */
import { pointDistanceM, boundsOf, mergeBounds } from './geo';
import type { BBox, GeoPoint, GpxDoc, Segment } from './types';

export interface TrackStats {
  pointCount: number;
  distanceM: number;
  /** Wall-clock duration first→last timestamp, or null if no times. */
  durationS: number | null;
  /** Time spent above a small movement threshold, or null if no times. */
  movingTimeS: number | null;
  elevationGainM: number;
  elevationLossM: number;
  minEleM: number | null;
  maxEleM: number | null;
  avgSpeedMps: number | null;
  maxSpeedMps: number | null;
  startTime: string | null;
  endTime: string | null;
  bbox: BBox | null;
}

const MOVING_SPEED_THRESHOLD_MPS = 0.5; // ~1.8 km/h
const ELEVATION_THRESHOLD_M = 3; // hysteresis to suppress GPS jitter

export function elevationGainLoss(eles: number[]): { gain: number; loss: number } {
  let gain = 0;
  let loss = 0;
  if (eles.length < 2) return { gain, loss };
  let ref = eles[0]!;
  for (let i = 1; i < eles.length; i++) {
    const e = eles[i]!;
    const d = e - ref;
    if (d > ELEVATION_THRESHOLD_M) {
      gain += d;
      ref = e;
    } else if (d < -ELEVATION_THRESHOLD_M) {
      loss += -d;
      ref = e;
    }
  }
  return { gain, loss };
}

function parseTime(t: string | undefined): number | null {
  if (!t) return null;
  const ms = Date.parse(t);
  return Number.isFinite(ms) ? ms : null;
}

/** Stats for a flat list of points that form one continuous run (one segment). */
function statsForRun(points: GeoPoint[]): {
  distanceM: number;
  movingTimeS: number;
  hasTime: boolean;
  spanS: number;
  maxSpeedMps: number | null;
} {
  let distanceM = 0;
  let movingTimeS = 0;
  let maxSpeedMps: number | null = null;
  let hasTime = false;
  let spanS = 0;

  const firstT = parseTime(points[0]?.time);
  const lastT = parseTime(points[points.length - 1]?.time);
  if (firstT !== null && lastT !== null) {
    hasTime = true;
    spanS = Math.max(0, (lastT - firstT) / 1000);
  }

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const d = pointDistanceM(a, b);
    distanceM += d;
    const ta = parseTime(a.time);
    const tb = parseTime(b.time);
    if (ta !== null && tb !== null && tb > ta) {
      const dt = (tb - ta) / 1000;
      const speed = d / dt;
      if (speed >= MOVING_SPEED_THRESHOLD_MPS) movingTimeS += dt;
      if (maxSpeedMps === null || speed > maxSpeedMps) maxSpeedMps = speed;
    }
  }
  return { distanceM, movingTimeS, hasTime, spanS, maxSpeedMps };
}

export function statsForSegments(segments: Segment[]): TrackStats {
  let pointCount = 0;
  let distanceM = 0;
  let movingTimeS = 0;
  let anyTime = false;
  let maxSpeedMps: number | null = null;
  const eles: number[] = [];
  let minEleM: number | null = null;
  let maxEleM: number | null = null;
  let bbox: BBox | null = null;
  let startTime: string | null = null;
  let endTime: string | null = null;
  let gain = 0;
  let loss = 0;

  for (const seg of segments) {
    pointCount += seg.points.length;
    bbox = mergeBounds(bbox, boundsOf(seg.points));

    const run = statsForRun(seg.points);
    distanceM += run.distanceM;
    movingTimeS += run.movingTimeS;
    if (run.hasTime) anyTime = true;
    if (run.maxSpeedMps !== null && (maxSpeedMps === null || run.maxSpeedMps > maxSpeedMps)) {
      maxSpeedMps = run.maxSpeedMps;
    }

    const segEles = seg.points.map((p) => p.ele).filter((e): e is number => e !== undefined);
    const gl = elevationGainLoss(segEles);
    gain += gl.gain;
    loss += gl.loss;
    for (const e of segEles) {
      eles.push(e);
      if (minEleM === null || e < minEleM) minEleM = e;
      if (maxEleM === null || e > maxEleM) maxEleM = e;
    }

    const firstWithTime = seg.points.find((p) => p.time)?.time ?? null;
    const lastWithTime = [...seg.points].reverse().find((p) => p.time)?.time ?? null;
    if (
      firstWithTime &&
      (startTime === null || Date.parse(firstWithTime) < Date.parse(startTime))
    ) {
      startTime = firstWithTime;
    }
    if (lastWithTime && (endTime === null || Date.parse(lastWithTime) > Date.parse(endTime))) {
      endTime = lastWithTime;
    }
  }

  let durationS: number | null = null;
  if (anyTime && startTime && endTime) {
    durationS = Math.max(0, (Date.parse(endTime) - Date.parse(startTime)) / 1000);
  }
  const movingTime = anyTime ? movingTimeS : null;
  const avgSpeedMps = durationS && durationS > 0 ? distanceM / durationS : null;

  return {
    pointCount,
    distanceM,
    durationS,
    movingTimeS: movingTime,
    elevationGainM: gain,
    elevationLossM: loss,
    minEleM,
    maxEleM,
    avgSpeedMps,
    maxSpeedMps,
    startTime,
    endTime,
    bbox,
  };
}

export interface DocStats {
  total: TrackStats;
  perTrack: TrackStats[];
}

export function computeStats(doc: GpxDoc): DocStats {
  const perTrack = doc.tracks.map((t) => statsForSegments(t.segments));
  // Total combines all track segments as one set (distance summed per segment,
  // never bridging gaps between tracks).
  const allSegments = doc.tracks.flatMap((t) => t.segments);
  const total = statsForSegments(allSegments);
  return { total, perTrack };
}
