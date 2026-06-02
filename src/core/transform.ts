/**
 * The declarative edit pipeline. `applyEdits(docs, config)` combines the loaded
 * files and applies — in a deterministic order — merge, trim, privacy-zone crop,
 * simplification, coordinate fuzzing and metadata stripping, returning the
 * resulting document plus a `PrivacyReport` describing exactly what changed.
 *
 * Pure: same inputs always yield the same output. The UI re-runs this on every
 * config change to drive the live preview, stats, and report.
 */
import { boundsOf, mergeBounds } from './geo';
import { combineDocs, mergeTracks } from './merge';
import { countPoints } from './parse';
import { applyPrivacyZone, fuzzCoordinates, inventory, stripMetadata } from './privacy';
import { byteLength, toGpx } from './serialize';
import { simplifyDoc } from './simplify';
import type { BBox, EditConfig, GpxDoc, PrivacyReport } from './types';

function trackPointCount(doc: GpxDoc): number {
  let n = 0;
  for (const t of doc.tracks) for (const s of t.segments) n += s.points.length;
  return n;
}

/** Keep only track points whose global index falls within [start, end]. */
function trimDoc(doc: GpxDoc, range: { start: number; end: number }): GpxDoc {
  const { start, end } = range;
  let idx = 0;
  const tracks = doc.tracks
    .map((t) => {
      const segments = t.segments
        .map((s) => {
          const points = s.points.filter(() => {
            const keep = idx >= start && idx <= end;
            idx++;
            return keep;
          });
          return { points };
        })
        .filter((s) => s.points.length > 0);
      return { ...t, segments };
    })
    .filter((t) => t.segments.length > 0);
  return { ...doc, tracks };
}

function docBounds(doc: GpxDoc): BBox | null {
  let b: BBox | null = null;
  for (const t of doc.tracks) for (const s of t.segments) b = mergeBounds(b, boundsOf(s.points));
  for (const r of doc.routes) b = mergeBounds(b, boundsOf(r.points));
  b = mergeBounds(b, boundsOf(doc.waypoints));
  return b;
}

export interface TransformResult {
  /** The combined, unedited source (for "before" comparisons & the canvas base). */
  source: GpxDoc;
  /** The edited output. */
  result: GpxDoc;
  report: PrivacyReport;
}

export function applyEdits(docs: GpxDoc[], config: EditConfig): TransformResult {
  const source = combineDocs(docs);
  const inv = inventory(source);

  let doc = source;

  // 1. Merge tracks into one (keeps segment breaks unless flattened elsewhere).
  if (config.merge) {
    doc = mergeTracks(doc, { flattenSegments: false });
  }

  // 2. Trim by global track-point index.
  if (config.trimRange) {
    doc = trimDoc(doc, config.trimRange);
  }

  // 3. Privacy-zone crop / cut.
  let privacyZonePointsRemoved = 0;
  if (config.privacyZone) {
    const r = applyPrivacyZone(doc, config.privacyZone, config.privacyMode);
    doc = r.doc;
    privacyZonePointsRemoved = r.removed;
  }

  // 4. Simplify.
  if (config.simplifyToleranceM && config.simplifyToleranceM > 0) {
    doc = simplifyDoc(doc, config.simplifyToleranceM);
  }

  // 5. Fuzz coordinates.
  if (config.fuzzDecimals !== null) {
    doc = fuzzCoordinates(doc, config.fuzzDecimals);
  }

  // 6. Strip metadata (last, so the report reflects the final document).
  doc = stripMetadata(doc, config.strip);

  const gpxBefore = toGpx(source);
  const gpxAfter = toGpx(doc);

  const report: PrivacyReport = {
    pointsBefore: countPoints(source),
    pointsAfter: countPoints(doc),
    pointsRemoved: countPoints(source) - countPoints(doc),
    bytesBefore: byteLength(gpxBefore),
    bytesAfter: byteLength(gpxAfter),
    bboxBefore: docBounds(source),
    bboxAfter: docBounds(doc),
    removedTimestamps: config.strip.time && inv.hasTime,
    removedExtensions: config.strip.extensions && inv.hasExtensions,
    removedElevation: config.strip.elevation && inv.hasElevation,
    removedNames: config.strip.names && inv.hasNames,
    removedCreator: config.strip.creator && inv.hasCreator,
    fuzzedTo: config.fuzzDecimals,
    privacyZoneApplied: config.privacyZone,
    privacyZonePointsRemoved,
    notes: [],
  };

  // Human-readable summary lines.
  const notes: string[] = [];
  if (report.privacyZoneApplied) {
    notes.push(
      `Privacy zone (${report.privacyZoneApplied.radiusM} m) removed ` +
        `${privacyZonePointsRemoved} point(s) near the centre.`,
    );
  }
  if (report.removedTimestamps) notes.push('Removed all timestamps.');
  if (report.removedExtensions)
    notes.push('Removed sensor/extension data (heart rate, cadence, power, accuracy…).');
  if (report.removedElevation) notes.push('Removed elevation data.');
  if (report.removedNames) notes.push('Removed names, comments and descriptions.');
  if (report.removedCreator) notes.push('Removed creator/device and author metadata.');
  if (report.fuzzedTo !== null)
    notes.push(`Rounded coordinates to ${report.fuzzedTo} decimal place(s).`);
  if (config.simplifyToleranceM && config.simplifyToleranceM > 0)
    notes.push(`Simplified geometry at ${config.simplifyToleranceM} m tolerance.`);
  if (config.trimRange) notes.push('Trimmed the track to the selected range.');
  if (config.merge) notes.push('Merged all tracks into one.');
  if (notes.length === 0) notes.push('No edits applied yet — the output equals the input.');
  trackPointCountIntoNotes(notes, source, doc);
  report.notes = notes;

  return { source, result: doc, report };
}

function trackPointCountIntoNotes(notes: string[], source: GpxDoc, result: GpxDoc): void {
  const before = trackPointCount(source);
  const after = trackPointCount(result);
  if (before !== after) {
    notes.push(`Track points: ${before.toLocaleString()} → ${after.toLocaleString()}.`);
  }
}
