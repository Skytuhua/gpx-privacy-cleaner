import { describe, it, expect } from 'vitest';
import { toGpx, toGeoJson, toCsv, byteLength } from '../src/core/serialize';
import { parseGpx, allTrackPoints } from '../src/core/parse';
import type { GpxDoc } from '../src/core/types';

const doc: GpxDoc = {
  metadata: { name: 'My "Run" & Loop', creator: 'test' },
  tracks: [
    {
      name: 'Trk <1>',
      segments: [
        {
          points: [
            { lat: 40.1234567, lon: -73.7654321, ele: 12.5, time: '2024-01-01T08:00:00Z' },
            { lat: 40.124, lon: -73.766, extRaw: '<gpxtpx:hr>120</gpxtpx:hr>' },
          ],
        },
      ],
    },
  ],
  routes: [],
  waypoints: [{ lat: 40.0, lon: -73.0, name: 'WP & <test>' }],
  warnings: [],
};

describe('toGpx', () => {
  const gpx = toGpx(doc);
  it('produces a valid XML declaration and gpx root', () => {
    expect(gpx).toContain('<?xml version="1.0"');
    expect(gpx).toContain('<gpx version="1.1"');
  });
  it('escapes special characters in names', () => {
    expect(gpx).toContain('&amp;');
    expect(gpx).toContain('&lt;1&gt;');
    expect(gpx).not.toContain('Trk <1>');
  });
  it('declares extension namespaces when extensions present', () => {
    expect(gpx).toContain('xmlns:gpxtpx');
    expect(gpx).toContain('<extensions><gpxtpx:hr>120</gpxtpx:hr></extensions>');
  });
  it('round-trips back through the parser', () => {
    const res = parseGpx(gpx);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const pts = allTrackPoints(res.doc);
    expect(pts).toHaveLength(2);
    expect(pts[0]!.ele).toBe(12.5);
    expect(res.doc.waypoints[0]!.name).toBe('WP & <test>');
  });
});

describe('toGeoJson', () => {
  const gj = JSON.parse(toGeoJson(doc));
  it('is a FeatureCollection', () => {
    expect(gj.type).toBe('FeatureCollection');
  });
  it('emits a LineString for the track and a Point for the waypoint', () => {
    const types = gj.features.map((f: { geometry: { type: string } }) => f.geometry.type);
    expect(types).toContain('LineString');
    expect(types).toContain('Point');
  });
  it('uses [lon, lat, ele] ordering', () => {
    const line = gj.features.find(
      (f: { geometry: { type: string } }) => f.geometry.type === 'LineString',
    );
    expect(line.geometry.coordinates[0][0]).toBeCloseTo(-73.7654321, 4); // lon first
    expect(line.geometry.coordinates[0][2]).toBe(12.5); // ele third
  });
});

describe('toCsv', () => {
  const csv = toCsv(doc);
  it('has a header row', () => {
    expect(csv.split('\n')[0]).toBe('type,track,segment,index,lat,lon,ele,time,name');
  });
  it('leaves a comma-free name unquoted', () => {
    expect(csv).toContain('WP & <test>');
  });
  it('quotes cells that contain commas or quotes', () => {
    const tricky: GpxDoc = {
      metadata: {},
      tracks: [],
      routes: [],
      waypoints: [{ lat: 1, lon: 2, name: 'Park, "North" entrance' }],
      warnings: [],
    };
    expect(toCsv(tricky)).toContain('"Park, ""North"" entrance"');
  });
  it('has one row per point plus header', () => {
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(1 + 3); // header + 2 track + 1 waypoint
  });
});

describe('byteLength', () => {
  it('measures UTF-8 byte length', () => {
    expect(byteLength('abc')).toBe(3);
    expect(byteLength('café')).toBe(5); // é is 2 bytes
  });
});
