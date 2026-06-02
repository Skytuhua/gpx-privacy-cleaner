# SPEC — GPX Privacy Cleaner (v1.0.0)

> Product requirements. The v1 feature set, non-goals, user flows, and the
> definition of "done". This is a binding contract for the build.

## One-line

A privacy-first, 100%-in-browser tool that strips your home location and personal
metadata out of `.gpx` GPS tracks before you share them — nothing is ever uploaded.

## Target user

Runners, cyclists, hikers, geocachers and drone pilots who export GPX from Strava /
Garmin / Komoot / phone apps and want to publish or send a track without leaking
where they live or train.

## Core principle (non-negotiable)

**Zero network.** The app makes no network requests after the static assets load.
No uploads, no analytics, no map tiles, no fonts fetched at runtime (fonts are
self-hosted/bundled), no telemetry. This is verifiable in DevTools and is the
product's entire reason to exist.

## v1 feature set (every item must fully work — no placeholders)

### F1 — Load & parse

- Drag-and-drop or file-pick **one or more** `.gpx` files (also accept paste of GPX text).
- Parse GPX 1.0 and 1.1: tracks (`trk`/`trkseg`/`trkpt`), routes (`rte`/`rtept`),
  waypoints (`wpt`), elevation (`ele`), time, and common extensions (heart rate,
  cadence, power, temperature, speed, hdop/vdop, Garmin TrackPointExtension).
- Robust to malformed/partial files: show a clear error, never crash; parse what is
  valid and report what was skipped.
- Provide a built-in **sample track** so the tool is usable with no personal file.

### F2 — Local visualization (no map tiles)

- Render the track polyline on a `<canvas>` with start (green) and end (red-ish)
  markers, using an equirectangular projection scaled to the bounding box.
- Pan (drag) and zoom (wheel / buttons). Show a scale bar and N/E orientation.
- Overlay the **privacy zone** as a translucent ring; render removed/trimmed points
  dimmed so the user sees exactly what will be cut.
- Multiple loaded tracks render in distinct shades.

### F3 — Stats

- Per track and total: point count, distance (km/mi toggle), duration, moving time,
  elevation gain/loss, min/max/avg elevation, avg/max speed, avg pace, bounding box,
  start/end timestamps. All in tabular mono. Recompute live as edits apply.

### F4 — Privacy zone (the flagship feature)

- **Auto-detect home:** cluster the start and end points across all loaded tracks;
  if they fall within a small radius, propose that centroid as the "home" zone.
- Manual center: type lat/lng, or click a point on the canvas to set the center.
- Adjustable radius (meters). Live preview of the ring and of how many points and how
  much distance will be removed.
- Two modes: **Crop ends** (remove leading/trailing points inside the zone — the
  common anti-doxxing case) and **Cut all** (remove every point inside the zone,
  splitting the track if it passes through the middle).

### F5 — Metadata strip

Independent toggles, each clearly explaining what it removes:

- Remove **timestamps** (`<time>`).
- Remove **extensions** (HR, cadence, power, temp, hdop/vdop, speed, course).
- Remove **elevation**.
- Remove **waypoint/route/track names, descriptions, comments**.
- Remove **creator / device / software metadata** (the `creator` attr and `<metadata>`).
- A live "personal-data inventory" lists what the loaded file currently contains so
  the user knows what is at risk.

### F6 — Coordinate fuzzing

- Round coordinates to a chosen precision (decimal places, mapped to an approximate
  meter resolution shown to the user). Off by default; clearly explained trade-off.

### F7 — Trim

- Range slider over the point index (and/or by time) to crop start/end manually,
  with the trimmed portion shown dimmed on the canvas and live updated stats.

### F8 — Simplify / reduce points

- Douglas–Peucker simplification with an adjustable tolerance (meters). Live preview
  of resulting point count and estimated output file size. Preserves elevation/time
  on retained points.

### F9 — Merge

- Combine multiple loaded files/tracks/segments into a single track in a chosen
  order; optionally treat as one continuous track or keep segment breaks.

### F10 — Export + privacy report

- Export to **GPX** (clean, well-formed, valid), **GeoJSON**, and **CSV**.
- Show a before→after **privacy report**: points, file size, bounding box, and an
  explicit list of which personal fields were removed and whether the home zone was
  cropped. The report is the trust artifact.
- Download via the browser; a copy-to-clipboard option for the GPX text.

### F11 — App-wide UX

- Persistent "Offline · nothing uploaded" badge.
- Full keyboard operability, visible focus, ARIA labels, `prefers-reduced-motion`.
- Empty / loading / error / success states on every panel.
- Responsive 375 → 1440px.

## Non-goals (explicitly out of scope for v1)

- No route/turn-by-turn **planning** or drawing new routes (that's gpx.studio's lane).
- No base-map tiles / reverse geocoding / address lookup (would require network).
- No DEM-based elevation _correction from external data_ (smoothing of existing
  elevation only; external SRTM lookups would need network — out).
- No accounts, cloud sync, sharing links, or server of any kind.
- No FIT/TCX import in v1 (GPX only; noted as future work).
- No mobile-native app (responsive web only).

## Primary user flows

1. **Anti-doxxing (headline):** drop a Strava export → tool auto-proposes the home
   zone → user confirms radius → enables "remove timestamps + extensions" → reviews
   privacy report → exports clean GPX. Done in under a minute, fully offline.
2. **Slim a bloated track:** load a huge track → simplify to a tolerance until point
   count/size is acceptable → export.
3. **Stitch a multi-day trip:** load several files → merge in order → trim the dead
   ends → export one track.

## Definition of done

- Every F1–F11 feature works for real on real GPX files, verified with screenshots
  and tests. No TODOs in shipped code, no advertised-but-broken feature.
- Core logic (parser, stats, privacy crop, simplify, merge, serializers, fuzz) has
  passing automated unit tests, including edge cases (empty, malformed, huge,
  single-point, unicode names, missing elevation/time).
- Zero network requests at runtime (verified).
- Design-system fidelity verified against `design-system/MASTER.md` and the
  Pre-Delivery Checklist.
- Builds to a static bundle that opens and works from a clean `file://`/static host.
