import { describe, it, expect } from 'vitest';
import { computeStats, elevationGainLoss, statsForSegments } from '../src/core/stats';
import type { GeoPoint, GpxDoc } from '../src/core/types';

describe('elevationGainLoss', () => {
  it('is zero for flat or tiny changes (below threshold)', () => {
    expect(elevationGainLoss([10, 11, 10, 12])).toEqual({ gain: 0, loss: 0 });
  });
  it('accumulates gain and loss above threshold', () => {
    const { gain, loss } = elevationGainLoss([0, 10, 5, 20]);
    expect(gain).toBeGreaterThan(0);
    expect(loss).toBeGreaterThan(0);
  });
  it('handles empty / single', () => {
    expect(elevationGainLoss([])).toEqual({ gain: 0, loss: 0 });
    expect(elevationGainLoss([5])).toEqual({ gain: 0, loss: 0 });
  });
});

describe('statsForSegments', () => {
  const points: GeoPoint[] = [
    { lat: 0, lon: 0, ele: 0, time: '2024-01-01T00:00:00Z' },
    { lat: 0, lon: 0.001, ele: 10, time: '2024-01-01T00:00:20Z' },
    { lat: 0, lon: 0.002, ele: 20, time: '2024-01-01T00:00:40Z' },
  ];
  const s = statsForSegments([{ points }]);

  it('counts points and computes distance', () => {
    expect(s.pointCount).toBe(3);
    expect(s.distanceM).toBeGreaterThan(100);
  });
  it('computes duration from timestamps', () => {
    expect(s.durationS).toBe(40);
  });
  it('computes elevation range', () => {
    expect(s.minEleM).toBe(0);
    expect(s.maxEleM).toBe(20);
  });
  it('computes an average speed', () => {
    expect(s.avgSpeedMps).not.toBeNull();
    expect(s.avgSpeedMps!).toBeGreaterThan(0);
  });
  it('has a bounding box', () => {
    expect(s.bbox).not.toBeNull();
  });
});

describe('statsForSegments — no timestamps', () => {
  it('returns null durations but still measures distance', () => {
    const s = statsForSegments([
      {
        points: [
          { lat: 0, lon: 0 },
          { lat: 0, lon: 0.01 },
        ],
      },
    ]);
    expect(s.durationS).toBeNull();
    expect(s.movingTimeS).toBeNull();
    expect(s.distanceM).toBeGreaterThan(0);
  });
});

describe('computeStats', () => {
  it('aggregates total and per-track', () => {
    const doc: GpxDoc = {
      metadata: {},
      tracks: [
        { segments: [{ points: [{ lat: 0, lon: 0 }, { lat: 0, lon: 0.01 }] }] },
        { segments: [{ points: [{ lat: 1, lon: 1 }, { lat: 1, lon: 1.01 }] }] },
      ],
      routes: [],
      waypoints: [],
      warnings: [],
    };
    const stats = computeStats(doc);
    expect(stats.perTrack).toHaveLength(2);
    expect(stats.total.pointCount).toBe(4);
  });
});
