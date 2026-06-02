/**
 * Combining and merging. `combineDocs` concatenates several loaded files into
 * one document; `mergeTracks` collapses all tracks into a single track (keeping
 * segment breaks, or flattening into one continuous segment).
 */
import type { GpxDoc, Segment, Track } from './types';

/** Concatenate multiple parsed files into one document (order preserved). */
export function combineDocs(docs: GpxDoc[]): GpxDoc {
  if (docs.length === 0) {
    return { metadata: {}, tracks: [], routes: [], waypoints: [], warnings: [] };
  }
  if (docs.length === 1) return docs[0]!;

  const combined: GpxDoc = {
    // Keep the first file's metadata as the representative (creator etc.).
    metadata: { ...docs[0]!.metadata },
    tracks: [],
    routes: [],
    waypoints: [],
    warnings: [],
  };
  for (const d of docs) {
    combined.tracks.push(...d.tracks);
    combined.routes.push(...d.routes);
    combined.waypoints.push(...d.waypoints);
    if (d.warnings.length) combined.warnings.push(...d.warnings);
  }
  return combined;
}

export interface MergeOptions {
  /** Collapse every segment into a single continuous segment. */
  flattenSegments: boolean;
  /** Name for the merged track. */
  name?: string;
}

/**
 * Merge all tracks into one. Routes and waypoints are left untouched. If there
 * are zero or one tracks, the doc is returned unchanged (nothing to merge).
 */
export function mergeTracks(doc: GpxDoc, options: MergeOptions): GpxDoc {
  if (doc.tracks.length <= 1 && !options.flattenSegments) return doc;
  if (doc.tracks.length === 0) return doc;

  const allSegments: Segment[] = doc.tracks.flatMap((t) => t.segments);
  if (allSegments.length === 0) return doc;

  const mergedName = options.name ?? doc.tracks.find((t) => t.name)?.name ?? 'Merged track';

  let segments: Segment[];
  if (options.flattenSegments) {
    segments = [{ points: allSegments.flatMap((s) => s.points) }];
  } else {
    segments = allSegments;
  }

  const merged: Track = { name: mergedName, segments };
  return { ...doc, tracks: [merged] };
}
