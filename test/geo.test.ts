import { describe, it, expect } from 'vitest';
import { haversineMeters, boundsOf, mergeBounds, roundTo, decimalsToMeters } from '../src/core/geo';

describe('haversineMeters', () => {
  it('is zero for identical points', () => {
    expect(haversineMeters(40, -74, 40, -74)).toBe(0);
  });

  it('matches a known distance (London to Paris ~343 km)', () => {
    const d = haversineMeters(51.5074, -0.1278, 48.8566, 2.3522);
    expect(d / 1000).toBeGreaterThan(330);
    expect(d / 1000).toBeLessThan(355);
  });

  it('measures ~111 km for one degree of latitude', () => {
    const d = haversineMeters(0, 0, 1, 0);
    expect(d).toBeGreaterThan(110_000);
    expect(d).toBeLessThan(112_000);
  });
});

describe('boundsOf', () => {
  it('returns null for no points', () => {
    expect(boundsOf([])).toBeNull();
  });

  it('computes the bounding box', () => {
    const b = boundsOf([
      { lat: 1, lon: 2 },
      { lat: -3, lon: 5 },
      { lat: 0, lon: -1 },
    ]);
    expect(b).toEqual({ minLat: -3, minLon: -1, maxLat: 1, maxLon: 5 });
  });
});

describe('mergeBounds', () => {
  it('handles nulls', () => {
    const b = { minLat: 0, minLon: 0, maxLat: 1, maxLon: 1 };
    expect(mergeBounds(null, b)).toBe(b);
    expect(mergeBounds(b, null)).toBe(b);
    expect(mergeBounds(null, null)).toBeNull();
  });

  it('unions two boxes', () => {
    expect(
      mergeBounds(
        { minLat: 0, minLon: 0, maxLat: 2, maxLon: 2 },
        { minLat: -1, minLon: 1, maxLat: 1, maxLon: 3 },
      ),
    ).toEqual({ minLat: -1, minLon: 0, maxLat: 2, maxLon: 3 });
  });
});

describe('roundTo / decimalsToMeters', () => {
  it('rounds to decimals', () => {
    expect(roundTo(12.34567, 3)).toBe(12.346);
    expect(roundTo(-0.00049, 3)).toBe(-0);
  });

  it('maps precision to ground resolution', () => {
    expect(Math.round(decimalsToMeters(3))).toBe(111); // ~111 m
    expect(Math.round(decimalsToMeters(5))).toBe(1); // ~1 m
  });
});
