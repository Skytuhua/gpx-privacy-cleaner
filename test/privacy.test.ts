import { describe, it, expect } from 'vitest';
import {
  detectHomeZone,
  applyPrivacyZone,
  stripMetadata,
  fuzzCoordinates,
  inZone,
  inventory,
} from '../src/core/privacy';
import type { GeoPoint, GpxDoc } from '../src/core/types';

function track(points: GeoPoint[]): GpxDoc {
  return {
    metadata: { creator: 'device-x', author: 'Bob', time: '2024-01-01T00:00:00Z' },
    tracks: [{ name: 'T', segments: [{ points }] }],
    routes: [],
    waypoints: [],
    warnings: [],
  };
}

// A loop that starts and ends at "home" (40.000, -73.000) and goes out ~1km north.
const loop: GeoPoint[] = [
  { lat: 40.0, lon: -73.0, ele: 10, time: '2024-01-01T08:00:00Z' },
  { lat: 40.0005, lon: -73.0, ele: 11, time: '2024-01-01T08:00:30Z' },
  { lat: 40.005, lon: -73.0, ele: 20, time: '2024-01-01T08:05:00Z' },
  { lat: 40.009, lon: -73.0, ele: 30, time: '2024-01-01T08:10:00Z' },
  { lat: 40.005, lon: -73.0005, ele: 20, time: '2024-01-01T08:15:00Z' },
  { lat: 40.0005, lon: -73.0003, ele: 11, time: '2024-01-01T08:19:30Z' },
  { lat: 40.0001, lon: -73.0001, ele: 10, time: '2024-01-01T08:20:00Z' },
];

describe('detectHomeZone', () => {
  it('proposes a zone around the clustered start/end of a loop', () => {
    const zone = detectHomeZone(track(loop));
    expect(zone).not.toBeNull();
    expect(zone!.lat).toBeCloseTo(40.0, 2);
    expect(zone!.lon).toBeCloseTo(-73.0, 2);
    expect(zone!.radiusM).toBeGreaterThanOrEqual(150);
    expect(zone!.radiusM).toBeLessThanOrEqual(500);
  });

  it('returns null for a one-way trip whose ends do not cluster', () => {
    const oneWay: GeoPoint[] = [
      { lat: 40.0, lon: -73.0 },
      { lat: 41.0, lon: -72.0 },
    ];
    expect(detectHomeZone(track(oneWay))).toBeNull();
  });
});

describe('applyPrivacyZone — crop-ends', () => {
  it('removes the leading and trailing in-zone points only', () => {
    const zone = { lat: 40.0, lon: -73.0, radiusM: 200 };
    const { doc, removed } = applyPrivacyZone(track(loop), zone, 'crop-ends');
    const kept = doc.tracks[0]!.segments.flatMap((s) => s.points);
    expect(removed).toBeGreaterThan(0);
    // No kept point should still be inside the zone at the ends.
    expect(inZone(kept[0]!, zone)).toBe(false);
    expect(inZone(kept[kept.length - 1]!, zone)).toBe(false);
  });
});

describe('applyPrivacyZone — cut-all (splits track)', () => {
  it('removes every in-zone point and can split into multiple segments', () => {
    // A track that passes through the zone in the middle.
    const through: GeoPoint[] = [
      { lat: 40.01, lon: -73.0 },
      { lat: 40.005, lon: -73.0 },
      { lat: 40.0, lon: -73.0 }, // in zone
      { lat: 40.0001, lon: -73.0 }, // in zone
      { lat: 40.005, lon: -73.0 },
      { lat: 40.01, lon: -73.0 },
    ];
    const zone = { lat: 40.0, lon: -73.0, radiusM: 150 };
    const { doc, removed } = applyPrivacyZone(track(through), zone, 'cut-all');
    expect(removed).toBe(2);
    expect(doc.tracks[0]!.segments.length).toBe(2); // split into two runs
  });
});

describe('stripMetadata', () => {
  const doc = track(loop);
  it('removes timestamps and metadata time', () => {
    const out = stripMetadata(doc, {
      time: true,
      extensions: false,
      elevation: false,
      names: false,
      creator: false,
    });
    expect(out.tracks[0]!.segments[0]!.points.every((p) => p.time === undefined)).toBe(true);
    expect(out.metadata.time).toBeUndefined();
  });
  it('removes elevation', () => {
    const out = stripMetadata(doc, {
      time: false,
      extensions: false,
      elevation: true,
      names: false,
      creator: false,
    });
    expect(out.tracks[0]!.segments[0]!.points.every((p) => p.ele === undefined)).toBe(true);
  });
  it('removes creator and author', () => {
    const out = stripMetadata(doc, {
      time: false,
      extensions: false,
      elevation: false,
      names: false,
      creator: true,
    });
    expect(out.metadata.creator).toBeUndefined();
    expect(out.metadata.author).toBeUndefined();
  });
  it('removes track names when names stripped', () => {
    const out = stripMetadata(doc, {
      time: false,
      extensions: false,
      elevation: false,
      names: true,
      creator: false,
    });
    expect(out.tracks[0]!.name).toBeUndefined();
  });
  it('does not mutate the original', () => {
    stripMetadata(doc, { time: true, extensions: true, elevation: true, names: true, creator: true });
    expect(doc.tracks[0]!.segments[0]!.points[0]!.time).toBe('2024-01-01T08:00:00Z');
    expect(doc.metadata.creator).toBe('device-x');
  });
});

describe('fuzzCoordinates', () => {
  it('rounds coordinates to the given decimals', () => {
    const out = fuzzCoordinates(track([{ lat: 40.123456, lon: -73.987654 }]), 3);
    const p = out.tracks[0]!.segments[0]!.points[0]!;
    expect(p.lat).toBe(40.123);
    expect(p.lon).toBe(-73.988);
  });
});

describe('inventory', () => {
  it('detects present personal data', () => {
    const inv = inventory(track(loop));
    expect(inv.hasTime).toBe(true);
    expect(inv.hasElevation).toBe(true);
    expect(inv.hasCreator).toBe(true);
  });
});
