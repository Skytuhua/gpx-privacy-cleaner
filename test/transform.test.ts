import { describe, it, expect } from 'vitest';
import { applyEdits } from '../src/core/transform';
import { combineDocs, mergeTracks } from '../src/core/merge';
import { defaultEditConfig } from '../src/core/types';
import type { GeoPoint, GpxDoc } from '../src/core/types';

function makeDoc(points: GeoPoint[], extras: Partial<GpxDoc> = {}): GpxDoc {
  return {
    metadata: { creator: 'dev', author: 'A', time: '2024-01-01T00:00:00Z' },
    tracks: [{ name: 'T', segments: [{ points }] }],
    routes: [],
    waypoints: [],
    warnings: [],
    ...extras,
  };
}

const loop: GeoPoint[] = [
  { lat: 40.0, lon: -73.0, ele: 10, time: '2024-01-01T08:00:00Z', extRaw: '<hr>120</hr>' },
  { lat: 40.0005, lon: -73.0, ele: 11, time: '2024-01-01T08:00:30Z' },
  { lat: 40.005, lon: -73.0, ele: 20, time: '2024-01-01T08:05:00Z' },
  { lat: 40.009, lon: -73.0, ele: 30, time: '2024-01-01T08:10:00Z' },
  { lat: 40.0005, lon: -73.0003, ele: 11, time: '2024-01-01T08:19:30Z' },
  { lat: 40.0001, lon: -73.0001, ele: 10, time: '2024-01-01T08:20:00Z' },
];

describe('applyEdits — no edits', () => {
  it('returns the input unchanged and a friendly note', () => {
    const { result, report } = applyEdits([makeDoc(loop)], defaultEditConfig());
    expect(report.pointsRemoved).toBe(0);
    expect(report.notes.join(' ')).toMatch(/No edits applied/);
    expect(result.tracks[0]!.segments[0]!.points).toHaveLength(6);
  });
});

describe('applyEdits — privacy + strip pipeline', () => {
  const config = {
    ...defaultEditConfig(),
    privacyZone: { lat: 40.0, lon: -73.0, radiusM: 200 },
    privacyMode: 'crop-ends' as const,
    strip: { time: true, extensions: true, elevation: false, names: false, creator: true },
  };
  const { result, report } = applyEdits([makeDoc(loop)], config);

  it('removes in-zone end points', () => {
    expect(report.privacyZonePointsRemoved).toBeGreaterThan(0);
    expect(report.pointsAfter).toBeLessThan(report.pointsBefore);
  });
  it('strips timestamps and extensions from the output', () => {
    const pts = result.tracks[0]!.segments.flatMap((s) => s.points);
    expect(pts.every((p) => p.time === undefined)).toBe(true);
    expect(pts.every((p) => p.extRaw === undefined)).toBe(true);
  });
  it('reports what was removed honestly', () => {
    expect(report.removedTimestamps).toBe(true);
    expect(report.removedExtensions).toBe(true);
    expect(report.removedCreator).toBe(true);
    expect(report.removedElevation).toBe(false);
  });
  it('shrinks the byte size', () => {
    expect(report.bytesAfter).toBeLessThan(report.bytesBefore);
  });
});

describe('applyEdits — does not report removing data that was not present', () => {
  it('removedElevation is false when stripping elevation from a doc without elevation', () => {
    const flat: GeoPoint[] = [
      { lat: 1, lon: 1 },
      { lat: 1, lon: 1.01 },
    ];
    const config = {
      ...defaultEditConfig(),
      strip: { time: false, extensions: false, elevation: true, names: false, creator: false },
    };
    const { report } = applyEdits([makeDoc(flat)], config);
    expect(report.removedElevation).toBe(false);
  });
});

describe('applyEdits — trim', () => {
  it('keeps only the selected index range', () => {
    const config = { ...defaultEditConfig(), trimRange: { start: 1, end: 3 } };
    const { result } = applyEdits([makeDoc(loop)], config);
    expect(result.tracks[0]!.segments.flatMap((s) => s.points)).toHaveLength(3);
  });
});

describe('combineDocs + mergeTracks', () => {
  it('combines two files then merges into one track', () => {
    const combined = combineDocs([makeDoc(loop), makeDoc(loop)]);
    expect(combined.tracks).toHaveLength(2);
    const merged = mergeTracks(combined, { flattenSegments: false });
    expect(merged.tracks).toHaveLength(1);
    expect(merged.tracks[0]!.segments).toHaveLength(2);
  });

  it('flattens into a single segment when requested', () => {
    const combined = combineDocs([makeDoc(loop), makeDoc(loop)]);
    const merged = mergeTracks(combined, { flattenSegments: true });
    expect(merged.tracks[0]!.segments).toHaveLength(1);
    expect(merged.tracks[0]!.segments[0]!.points).toHaveLength(12);
  });
});

describe('applyEdits — simplify reduces points', () => {
  it('reduces a dense straight line', () => {
    const dense: GeoPoint[] = [];
    for (let i = 0; i <= 100; i++) dense.push({ lat: 40 + i * 0.0001, lon: -73 });
    const config = { ...defaultEditConfig(), simplifyToleranceM: 10 };
    const { result } = applyEdits([makeDoc(dense)], config);
    expect(result.tracks[0]!.segments[0]!.points.length).toBeLessThan(100);
  });
});
