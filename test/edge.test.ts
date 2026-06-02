/**
 * Aggressive edge-case / robustness tests aimed at BREAKING the core library.
 *
 * These tests are intentionally adversarial. Many assertions describe what a
 * *correct* implementation should do; failures here are reported as DEFECTS.
 * Nothing under src/ is modified.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

import { parseGpx, allTrackPoints } from '../src/core/parse';
import { toGpx, toGeoJson, toCsv, byteLength } from '../src/core/serialize';
import {
  detectHomeZone,
  applyPrivacyZone,
  fuzzCoordinates,
  stripMetadata,
} from '../src/core/privacy';
import { simplifyPoints } from '../src/core/simplify';
import { computeStats, statsForSegments } from '../src/core/stats';
import { applyEdits } from '../src/core/transform';
import { defaultEditConfig } from '../src/core/types';
import type { GeoPoint, GpxDoc, EditConfig, PrivacyZone } from '../src/core/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE = readFileSync(path.resolve(__dirname, '../src/data/sample.gpx'), 'utf8');

function pt(lat: number, lon: number, extra: Partial<GeoPoint> = {}): GeoPoint {
  return { lat, lon, ...extra };
}

function docOf(points: GeoPoint[]): GpxDoc {
  return {
    metadata: {},
    tracks: [{ segments: [{ points }] }],
    routes: [],
    waypoints: [],
    warnings: [],
  };
}

function fullOnConfig(zone: PrivacyZone | null, mode: 'crop-ends' | 'cut-all'): EditConfig {
  return {
    privacyZone: zone,
    privacyMode: mode,
    strip: { time: true, extensions: true, elevation: true, names: true, creator: true },
    fuzzDecimals: 5,
    trimRange: null,
    simplifyToleranceM: 5,
    merge: true,
  };
}

// ---------------------------------------------------------------------------
// 1. Degenerate documents
// ---------------------------------------------------------------------------
describe('degenerate documents', () => {
  it('empty <gpx> -> ok:false (no content)', () => {
    const r = parseGpx('<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"></gpx>');
    expect(r.ok).toBe(false);
  });

  it('only waypoints parses ok', () => {
    const r = parseGpx(
      '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><wpt lat="1" lon="2"><name>w</name></wpt></gpx>',
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.doc.waypoints).toHaveLength(1);
  });

  it('only routes parses ok', () => {
    const r = parseGpx(
      '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><rte><rtept lat="1" lon="2"/><rtept lat="1.1" lon="2.1"/></rte></gpx>',
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.doc.routes).toHaveLength(1);
  });

  it('only an empty <trkseg> -> ok:false (no points)', () => {
    const r = parseGpx(
      '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg></trkseg></trk></gpx>',
    );
    expect(r.ok).toBe(false);
  });

  it('single-point track parses ok and round-trips', () => {
    const r = parseGpx(
      '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg><trkpt lat="40" lon="-73"/></trkseg></trk></gpx>',
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const out = toGpx(r.doc);
    const r2 = parseGpx(out);
    expect(r2.ok).toBe(true);
  });

  it('computeStats on a single-point doc does not throw / no NaN', () => {
    const doc = docOf([pt(40, -73, { ele: 10, time: '2024-01-01T00:00:00Z' })]);
    const s = computeStats(doc);
    expect(Number.isNaN(s.total.distanceM)).toBe(false);
    expect(Number.isFinite(s.total.distanceM)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Malformed / hostile XML
// ---------------------------------------------------------------------------
describe('malformed / hostile XML', () => {
  it('truncated XML -> ok:false, no throw', () => {
    expect(() => parseGpx('<gpx><trk><trkseg><trkpt lat="1" lon="2">')).not.toThrow();
    expect(parseGpx('<gpx><trk><trkseg><trkpt lat="1" lon="2">').ok).toBe(false);
  });

  it('plain garbage -> ok:false, no throw', () => {
    expect(() => parseGpx('not xml at all <<<>>>')).not.toThrow();
    expect(parseGpx('not xml at all <<<>>>').ok).toBe(false);
  });

  it('non-GPX XML -> ok:false', () => {
    expect(parseGpx('<root><child/></root>').ok).toBe(false);
  });

  it('wrong namespace still recognised by localName (tolerant)', () => {
    const r = parseGpx(
      '<x:gpx xmlns:x="urn:bogus"><x:trk><x:trkseg><x:trkpt lat="1" lon="2"/></x:trkseg></x:trk></x:gpx>',
    );
    // localName matching means this is recognised; just must not throw.
    expect(typeof r.ok).toBe('boolean');
  });

  it('huge attribute value does not hang or throw', () => {
    const big = '9'.repeat(100000);
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg><trkpt lat="${big}" lon="0"/><trkpt lat="40" lon="-73"/></trkseg></trk></gpx>`;
    expect(() => parseGpx(gpx)).not.toThrow();
  });

  it('huge name value round-trips without throwing', () => {
    const bigName = 'A'.repeat(50000);
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>${bigName}</name><trkseg><trkpt lat="1" lon="2"/></trkseg></trk></gpx>`;
    const r = parseGpx(gpx);
    expect(r.ok).toBe(true);
    if (r.ok) expect(() => toGpx(r.doc)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 3. Privacy zone covering the WHOLE track
// ---------------------------------------------------------------------------
describe('privacy zone covering everything', () => {
  const sampleDoc = (() => {
    const r = parseGpx(SAMPLE);
    if (!r.ok) throw new Error('sample failed to parse: ' + r.error);
    return r.doc;
  })();

  // A zone large enough to swallow the entire sample track.
  const hugeZone: PrivacyZone = { lat: 47.6512, lon: -122.3456, radiusM: 10_000_000 };

  it('crop-ends with all-in-zone yields an empty/clean doc, no throw', () => {
    const res = applyPrivacyZone(sampleDoc, hugeZone, 'crop-ends');
    expect(res.doc.tracks.every((t) => t.segments.length === 0)).toBe(true);
    expect(() => toGpx(res.doc)).not.toThrow();
    const out = toGpx(res.doc);
    // Output (no points) should re-parse as ok:false gracefully (nothing left).
    expect(parseGpx(out).ok).toBe(false);
  });

  it('cut-all with all-in-zone yields empty doc, no throw', () => {
    const res = applyPrivacyZone(sampleDoc, hugeZone, 'cut-all');
    expect(
      res.doc.tracks.length === 0 || res.doc.tracks.every((t) => t.segments.length === 0),
    ).toBe(true);
    expect(() => toGpx(res.doc)).not.toThrow();
  });

  it('applyEdits with everything-on + all-in-zone produces valid output', () => {
    const cfgCrop = fullOnConfig(hugeZone, 'crop-ends');
    let tr: ReturnType<typeof applyEdits>;
    expect(() => {
      tr = applyEdits([sampleDoc], cfgCrop);
    }).not.toThrow();
    // @ts-expect-error assigned in callback above
    const out = toGpx(tr.result);
    expect(out).toContain('<gpx');
    // Report numbers must be finite, not NaN.
    // @ts-expect-error
    expect(Number.isFinite(tr.report.bytesAfter)).toBe(true);
  });

  it('cut-all on a ROUTE splits into separate routes at the gap (no bridging)', () => {
    // Route: two clusters of points with a home zone in the MIDDLE.
    const routeDoc: GpxDoc = {
      metadata: {},
      tracks: [],
      routes: [
        {
          points: [
            pt(40.0, -73.0),
            pt(40.001, -73.0),
            pt(47.6512, -122.3456), // inside home zone -> removed
            pt(41.0, -74.0),
            pt(41.001, -74.0),
          ],
        },
      ],
      waypoints: [],
      warnings: [],
    };
    const homeZone: PrivacyZone = { lat: 47.6512, lon: -122.3456, radiusM: 300 };
    const res = applyPrivacyZone(routeDoc, homeZone, 'cut-all');
    // The redacted centre must NOT be bridged: the route splits into two routes,
    // mirroring how tracks split into segments.
    expect(res.doc.routes).toHaveLength(2);
    expect(res.doc.routes[0]!.points).toHaveLength(2);
    expect(res.doc.routes[1]!.points).toHaveLength(2);
    expect(res.removed).toBe(1);
  });

  it('applyEdits everything-on (cut-all) on empty result re-parses gracefully', () => {
    const tr = applyEdits([sampleDoc], fullOnConfig(hugeZone, 'cut-all'));
    const out = toGpx(tr.result);
    const re = parseGpx(out);
    // empty doc -> ok:false is acceptable; must not throw.
    expect(typeof re.ok).toBe('boolean');
  });
});

// ---------------------------------------------------------------------------
// 4. detectHomeZone edge cases
// ---------------------------------------------------------------------------
describe('detectHomeZone edge cases', () => {
  it('single-point track -> null (one lone point is not a clustered home)', () => {
    // collectEndpoints now pushes a segment's end only when it differs from the
    // start, so a 1-point segment yields a single endpoint and detection
    // correctly declines to guess a home zone.
    const z = detectHomeZone(docOf([pt(40, -73)]));
    expect(z).toBeNull();
  });

  it('two identical points -> a finite zone, radius within bounds', () => {
    const z = detectHomeZone(docOf([pt(40, -73), pt(40, -73)]));
    expect(z).not.toBeNull();
    if (z) {
      expect(Number.isFinite(z.lat)).toBe(true);
      expect(Number.isFinite(z.lon)).toBe(true);
      expect(Number.isFinite(z.radiusM)).toBe(true);
      expect(z.radiusM).toBeGreaterThan(0);
    }
  });

  it('perfect grid -> finite zone or null, never NaN', () => {
    const grid: GeoPoint[] = [];
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) grid.push(pt(40 + i * 0.01, -73 + j * 0.01));
    const z = detectHomeZone(docOf(grid));
    if (z) {
      expect(Number.isFinite(z.lat) && Number.isFinite(z.lon) && Number.isFinite(z.radiusM)).toBe(
        true,
      );
    }
  });

  it('poles: lat 90 / -90 endpoints, no NaN', () => {
    const z = detectHomeZone(docOf([pt(90, 0), pt(90, 0), pt(-90, 0)]));
    if (z) expect(Number.isFinite(z.radiusM)).toBe(true);
  });

  it('antimeridian lon 180 / -180 (same physical place) -> radius should be small, not ~half-globe', () => {
    // Two endpoints at lon 180 and lon -180 are the SAME meridian.
    const z = detectHomeZone(docOf([pt(0, 180), pt(0, -180)]));
    if (z) {
      expect(Number.isFinite(z.radiusM)).toBe(true);
      // If clustered as "home", a sane radius is capped at HOME_RADIUS_MAX_M (500).
      // Document whatever happens; antimeridian wrap is a known geo hazard.
      expect(z.radiusM).toBeLessThanOrEqual(500);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. simplifyPoints edge cases
// ---------------------------------------------------------------------------
describe('simplifyPoints edge cases', () => {
  const line: GeoPoint[] = Array.from({ length: 20 }, (_, i) => pt(40 + i * 0.001, -73));

  it('tolerance 0 returns all points', () => {
    expect(simplifyPoints(line, 0)).toHaveLength(line.length);
  });

  it('negative tolerance returns all points (no crash)', () => {
    expect(() => simplifyPoints(line, -10)).not.toThrow();
    expect(simplifyPoints(line, -10)).toHaveLength(line.length);
  });

  it('huge tolerance collapses to endpoints', () => {
    const out = simplifyPoints(line, 1e12);
    expect(out.length).toBeLessThanOrEqual(2);
  });

  it('duplicate consecutive points do not throw', () => {
    const dup = [pt(40, -73), pt(40, -73), pt(40, -73), pt(40.001, -73)];
    expect(() => simplifyPoints(dup, 5)).not.toThrow();
  });

  it('all-identical points -> endpoints only, no NaN', () => {
    const same = Array.from({ length: 100 }, () => pt(40, -73));
    const out = simplifyPoints(same, 5);
    expect(out.every((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. fuzzCoordinates precision
// ---------------------------------------------------------------------------
describe('fuzzCoordinates precision', () => {
  it('0 decimals rounds to whole degrees', () => {
    const d = fuzzCoordinates(docOf([pt(47.6512345, -122.3456789)]), 0);
    const p = d.tracks[0]!.segments[0]!.points[0]!;
    expect(p.lat).toBe(48);
    expect(p.lon).toBe(-122);
  });

  it('10 decimals keeps fine precision, stays finite', () => {
    const d = fuzzCoordinates(docOf([pt(47.65123456789, -122.34567891234)]), 10);
    const p = d.tracks[0]!.segments[0]!.points[0]!;
    expect(Number.isFinite(p.lat) && Number.isFinite(p.lon)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. stats edge cases
// ---------------------------------------------------------------------------
describe('stats edge cases', () => {
  it('no timestamps -> durationS null, speeds null, distance finite', () => {
    const s = statsForSegments([{ points: [pt(40, -73), pt(40.001, -73), pt(40.002, -73)] }]);
    expect(s.durationS).toBeNull();
    expect(s.avgSpeedMps).toBeNull();
    expect(Number.isFinite(s.distanceM)).toBe(true);
  });

  it('out-of-order timestamps -> no negative duration, finite speeds', () => {
    const s = statsForSegments([
      {
        points: [
          pt(40, -73, { time: '2024-01-01T01:00:00Z' }),
          pt(40.01, -73, { time: '2024-01-01T00:00:00Z' }),
          pt(40.02, -73, { time: '2024-01-01T02:00:00Z' }),
        ],
      },
    ]);
    if (s.durationS !== null) expect(s.durationS).toBeGreaterThanOrEqual(0);
    if (s.avgSpeedMps !== null) expect(Number.isFinite(s.avgSpeedMps)).toBe(true);
    if (s.maxSpeedMps !== null) expect(Number.isFinite(s.maxSpeedMps)).toBe(true);
  });

  it('identical timestamps -> NO Infinity speed (div-by-zero guard)', () => {
    const t = '2024-01-01T00:00:00Z';
    const s = statsForSegments([
      { points: [pt(40, -73, { time: t }), pt(41, -73, { time: t }), pt(42, -73, { time: t })] },
    ]);
    // tb > ta guard should prevent division by zero -> maxSpeed stays null.
    if (s.maxSpeedMps !== null) expect(Number.isFinite(s.maxSpeedMps)).toBe(true);
    if (s.avgSpeedMps !== null) expect(Number.isFinite(s.avgSpeedMps)).toBe(true);
    expect(s.maxSpeedMps === null || s.maxSpeedMps !== Infinity).toBe(true);
  });

  it('missing elevation on some points -> gain/loss finite', () => {
    const s = statsForSegments([
      {
        points: [
          pt(40, -73, { ele: 10 }),
          pt(40.001, -73),
          pt(40.002, -73, { ele: 30 }),
          pt(40.003, -73, { ele: 5 }),
        ],
      },
    ]);
    expect(Number.isFinite(s.elevationGainM) && Number.isFinite(s.elevationLossM)).toBe(true);
  });

  it('unicode + emoji names round-trip parse->serialize->parse', () => {
    const name = 'Café Münchën 日本語 🏔️🚴‍♀️ <&>"\'';
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>${name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</name><trkseg><trkpt lat="1" lon="2"/></trkseg></trk></gpx>`;
    const r = parseGpx(gpx);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const out = toGpx(r.doc);
    const r2 = parseGpx(out);
    expect(r2.ok).toBe(true);
    if (r2.ok) expect(r2.doc.tracks[0]!.name).toBe(r.doc.tracks[0]!.name);
  });
});

// ---------------------------------------------------------------------------
// 8. Large tracks / performance & stack safety
// ---------------------------------------------------------------------------
describe('large tracks performance', () => {
  it('100k points: parse + stats + simplify finish in reasonable time, no stack overflow', () => {
    const N = 100_000;
    const points: GeoPoint[] = new Array(N);
    for (let i = 0; i < N; i++) {
      // wandering line so simplification has real work
      points[i] = pt(40 + Math.sin(i / 50) * 0.01 + i * 1e-6, -73 + Math.cos(i / 70) * 0.01);
    }
    const doc = docOf(points);

    const t0 = Date.now();
    const s = computeStats(doc);
    const t1 = Date.now();
    const simp = simplifyPoints(points, 5);
    const t2 = Date.now();

    // eslint-disable-next-line no-console
    console.log(`[perf] stats=${t1 - t0}ms simplify=${t2 - t1}ms simplified ${N}->${simp.length}`);
    expect(Number.isFinite(s.total.distanceM)).toBe(true);
    expect(simp.length).toBeGreaterThan(1);
    expect(t2 - t0).toBeLessThan(20_000);
  });

  it('100k points serialize round-trips ok', () => {
    const N = 100_000;
    const points: GeoPoint[] = new Array(N);
    for (let i = 0; i < N; i++) points[i] = pt(40 + i * 1e-6, -73 + i * 1e-6);
    const doc = docOf(points);
    const t0 = Date.now();
    const out = toGpx(doc);
    const t1 = Date.now();
    // eslint-disable-next-line no-console
    console.log(`[perf] serialize 100k=${t1 - t0}ms bytes=${byteLength(out)}`);
    expect(out.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 9. transform.trimRange out of bounds
// ---------------------------------------------------------------------------
describe('trimRange out of bounds', () => {
  const doc = docOf(Array.from({ length: 10 }, (_, i) => pt(40 + i * 0.001, -73)));
  const base = (range: EditConfig['trimRange']): EditConfig => ({
    ...defaultEditConfig(),
    trimRange: range,
  });

  it('start > end -> empty selection, no throw', () => {
    expect(() => applyEdits([doc], base({ start: 8, end: 2 }))).not.toThrow();
    const tr = applyEdits([doc], base({ start: 8, end: 2 }));
    expect(
      tr.result.tracks.every((t) => t.segments.length === 0) || tr.report.pointsAfter === 0,
    ).toBe(true);
  });

  it('negative start, beyond-length end -> keeps all valid, no throw', () => {
    expect(() => applyEdits([doc], base({ start: -5, end: 999 }))).not.toThrow();
    const tr = applyEdits([doc], base({ start: -5, end: 999 }));
    expect(Number.isFinite(tr.report.pointsAfter)).toBe(true);
  });

  it('range entirely beyond length -> empty, no throw', () => {
    const tr = applyEdits([doc], base({ start: 50, end: 60 }));
    expect(tr.report.pointsAfter).toBe(0);
  });

  it('NaN range -> no throw', () => {
    expect(() => applyEdits([doc], base({ start: NaN, end: NaN }))).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 10. Full round-trip with everything on
// ---------------------------------------------------------------------------
describe('full round-trip everything-on', () => {
  it('parse(sample) -> applyEdits(all) -> toGpx -> parse must be ok:true', () => {
    const r = parseGpx(SAMPLE);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const cfg: EditConfig = {
      privacyZone: { lat: 47.6512, lon: -122.3456, radiusM: 200 }, // small: home only
      privacyMode: 'crop-ends',
      strip: { time: true, extensions: true, elevation: true, names: true, creator: true },
      fuzzDecimals: 4,
      trimRange: null,
      simplifyToleranceM: 3,
      merge: true,
    };
    const tr = applyEdits([r.doc], cfg);
    const out = toGpx(tr.result);
    const r2 = parseGpx(out);
    expect(r2.ok).toBe(true);
    if (r2.ok) {
      // all timestamps / names stripped
      const pts = allTrackPoints(r2.doc);
      expect(pts.every((p) => p.time === undefined)).toBe(true);
      expect(pts.every((p) => p.ele === undefined)).toBe(true);
    }
  });

  it('GeoJSON + CSV serializers do not throw on the sample', () => {
    const r = parseGpx(SAMPLE);
    if (!r.ok) return;
    expect(() => toGeoJson(r.doc)).not.toThrow();
    expect(() => toCsv(r.doc)).not.toThrow();
    expect(() => JSON.parse(toGeoJson(r.doc))).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 11. Extreme coordinates round-trip / fmtCoord
// ---------------------------------------------------------------------------
describe('extreme coordinates & many decimals', () => {
  it('many-decimal coords survive serialize as finite numbers', () => {
    const doc = docOf([pt(47.123456789012345, -122.987654321098765)]);
    const out = toGpx(doc);
    const r = parseGpx(out);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const p = r.doc.tracks[0]!.segments[0]!.points[0]!;
      expect(Number.isFinite(p.lat) && Number.isFinite(p.lon)).toBe(true);
    }
  });

  it('pole + antimeridian coords serialize and re-parse', () => {
    const doc = docOf([pt(90, 180), pt(-90, -180), pt(0, 0)]);
    const out = toGpx(doc);
    const r = parseGpx(out);
    expect(r.ok).toBe(true);
    if (r.ok) expect(allTrackPoints(r.doc).length).toBe(3);
  });

  it('stripMetadata then serialize is well-formed', () => {
    const r = parseGpx(SAMPLE);
    if (!r.ok) return;
    const stripped = stripMetadata(r.doc, {
      time: true,
      extensions: true,
      elevation: true,
      names: true,
      creator: true,
    });
    const out = toGpx(stripped);
    expect(parseGpx(out).ok).toBe(true);
  });
});
