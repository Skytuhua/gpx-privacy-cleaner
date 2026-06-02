import { describe, it, expect } from 'vitest';
import { simplifyPoints } from '../src/core/simplify';
import type { GeoPoint } from '../src/core/types';

describe('simplifyPoints', () => {
  it('keeps endpoints and drops collinear midpoints', () => {
    // A straight line of points; only the two ends are needed.
    const pts: GeoPoint[] = [];
    for (let i = 0; i <= 10; i++) pts.push({ lat: 40 + i * 0.001, lon: -73 });
    const out = simplifyPoints(pts, 5);
    expect(out[0]).toEqual(pts[0]);
    expect(out[out.length - 1]).toEqual(pts[pts.length - 1]);
    expect(out.length).toBeLessThan(pts.length);
    expect(out.length).toBe(2);
  });

  it('preserves a sharp corner above tolerance', () => {
    const pts: GeoPoint[] = [
      { lat: 40.0, lon: -73.0 },
      { lat: 40.0, lon: -72.99 }, // corner
      { lat: 40.01, lon: -72.99 },
    ];
    const out = simplifyPoints(pts, 5);
    expect(out.length).toBe(3);
  });

  it('returns a copy for <= 2 points', () => {
    const pts: GeoPoint[] = [{ lat: 1, lon: 2 }];
    const out = simplifyPoints(pts, 5);
    expect(out).toEqual(pts);
    expect(out).not.toBe(pts);
  });

  it('handles a large track without stack overflow', () => {
    const pts: GeoPoint[] = [];
    for (let i = 0; i < 50_000; i++) {
      pts.push({ lat: 40 + Math.sin(i / 100) * 0.01, lon: -73 + i * 0.0001 });
    }
    const out = simplifyPoints(pts, 10);
    expect(out.length).toBeGreaterThan(2);
    expect(out.length).toBeLessThan(pts.length);
  });

  it('retains original point data (elevation/time) on kept points', () => {
    const pts: GeoPoint[] = [
      { lat: 40, lon: -73, ele: 5, time: 't0' },
      { lat: 40.0001, lon: -73, ele: 6 },
      { lat: 40.01, lon: -73, ele: 50, time: 't2' },
    ];
    const out = simplifyPoints(pts, 5);
    expect(out[0]!.ele).toBe(5);
    expect(out[out.length - 1]!.time).toBe('t2');
  });
});
