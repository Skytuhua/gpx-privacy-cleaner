import { describe, it, expect } from 'vitest';
import { parseGpx, allTrackPoints, countPoints } from '../src/core/parse';

const GPX_11 = `<?xml version="1.0"?>
<gpx version="1.1" creator="GarminConnect"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">
  <metadata><name>Morning Run</name><author><name>Jane</name></author><time>2024-01-01T08:00:00Z</time></metadata>
  <wpt lat="40.0" lon="-73.0"><name>Home</name></wpt>
  <trk><name>Run</name><type>running</type>
    <trkseg>
      <trkpt lat="40.0000" lon="-73.0000">
        <ele>10</ele><time>2024-01-01T08:00:00Z</time><hdop>1.2</hdop>
        <extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>120</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions>
      </trkpt>
      <trkpt lat="40.0010" lon="-73.0000"><ele>12</ele><time>2024-01-01T08:00:30Z</time></trkpt>
      <trkpt lat="40.0020" lon="-73.0000"><ele>15</ele><time>2024-01-01T08:01:00Z</time></trkpt>
    </trkseg>
  </trk>
</gpx>`;

const GPX_10 = `<?xml version="1.0"?>
<gpx version="1.0" creator="oldDevice" xmlns="http://www.topografix.com/GPX/1/0">
  <name>Old Track</name>
  <trk><trkseg>
    <trkpt lat="51.5" lon="-0.1"><ele>5</ele></trkpt>
    <trkpt lat="51.6" lon="-0.2"><ele>7</ele></trkpt>
  </trkseg></trk>
</gpx>`;

describe('parseGpx — GPX 1.1', () => {
  const res = parseGpx(GPX_11, 'run.gpx');
  it('parses successfully', () => {
    expect(res.ok).toBe(true);
  });
  it('reads metadata, creator and author', () => {
    if (!res.ok) throw new Error('parse failed');
    expect(res.doc.metadata.creator).toBe('GarminConnect');
    expect(res.doc.metadata.name).toBe('Morning Run');
    expect(res.doc.metadata.author).toBe('Jane');
    expect(res.doc.sourceName).toBe('run.gpx');
  });
  it('reads tracks, points, elevation, time and extensions', () => {
    if (!res.ok) throw new Error('parse failed');
    const pts = allTrackPoints(res.doc);
    expect(pts).toHaveLength(3);
    expect(pts[0]!.ele).toBe(10);
    expect(pts[0]!.time).toBe('2024-01-01T08:00:00Z');
    expect(pts[0]!.ext?.hdop).toBe('1.2');
    expect(pts[0]!.extRaw).toContain('hr');
    expect(res.doc.tracks[0]!.type).toBe('running');
  });
  it('reads waypoints', () => {
    if (!res.ok) throw new Error('parse failed');
    expect(res.doc.waypoints).toHaveLength(1);
    expect(res.doc.waypoints[0]!.name).toBe('Home');
  });
  it('counts all points', () => {
    if (!res.ok) throw new Error('parse failed');
    expect(countPoints(res.doc)).toBe(4); // 3 track + 1 waypoint
  });
});

describe('parseGpx — GPX 1.0 (legacy layout)', () => {
  it('parses name directly under gpx and points', () => {
    const res = parseGpx(GPX_10);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.doc.metadata.name).toBe('Old Track');
    expect(allTrackPoints(res.doc)).toHaveLength(2);
  });
});

describe('parseGpx — tolerance and errors', () => {
  it('rejects empty input', () => {
    expect(parseGpx('')).toMatchObject({ ok: false });
    expect(parseGpx('   ')).toMatchObject({ ok: false });
  });
  it('rejects non-GPX XML', () => {
    expect(parseGpx('<html><body>hi</body></html>')).toMatchObject({ ok: false });
  });
  it('rejects malformed XML', () => {
    expect(parseGpx('<gpx><trk><trkseg>')).toMatchObject({ ok: false });
  });
  it('skips points with invalid coordinates but keeps valid ones', () => {
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg>
      <trkpt lat="999" lon="0"/>
      <trkpt lat="40" lon="-73"/>
      <trkpt lat="bad" lon="-73"/>
    </trkseg></trk></gpx>`;
    const res = parseGpx(gpx);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(allTrackPoints(res.doc)).toHaveLength(1);
    expect(res.doc.warnings.length).toBeGreaterThanOrEqual(2);
  });
  it('handles unicode names', () => {
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
      <trk><name>Café Münchën 日本語 🏔</name><trkseg><trkpt lat="1" lon="2"/></trkseg></trk></gpx>`;
    const res = parseGpx(gpx);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.doc.tracks[0]!.name).toBe('Café Münchën 日本語 🏔');
  });
});
