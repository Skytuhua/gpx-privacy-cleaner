# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — 2026-06-02

Usability polish and accessibility fixes — no change to how cleaning works.

### Added
- **"Where do I get my .gpx file?" help** on the start screen, with plain-language
  export steps for Strava, Garmin Connect, Komoot and phone apps — so first-time
  users who have never exported a track know exactly what to do.
- **Plain explanation of the two privacy-zone modes** ("Crop ends" vs "Cut all")
  shown right under the choice, so you can pick the right one without reading the docs.
- A **browser-tab icon (favicon)** and theme colour, so the tab is recognisable.

### Fixed / Accessibility
- Screen readers now announce the selected state of the **km/mi** toggle and the
  **"Pick on map"** button (`aria-pressed`), and whether the **"Paste GPX text"**
  panel is open (`aria-expanded`).
- The icon-only **Add files** / **Reset** buttons now have accessible names on small
  screens.
- Text inputs show a clear **keyboard focus ring** again.
- Friendlier wording: correct singular/plural in the privacy report and zone count
  ("1 point" vs "3 points"), and the empty report now guides you to the cleaning
  controls in a way that reads correctly on phones too.

## [1.0.0] — 2026-06-02

First public release.

### Added
- **Privacy zone** with automatic home-location detection, adjustable radius,
  manual lat/lon entry, click-the-map centre picking, and two modes (crop-ends,
  cut-all). Cut-all splits tracks **and** routes at the redacted area so it is never
  bridged.
- **Remove personal data** toggles with live "present / none" inventory badges:
  timestamps, sensor/extension data (HR, cadence, power, accuracy), elevation,
  names & notes, and device & author metadata.
- **Coordinate fuzzing** (round to N decimals, with approximate ground resolution).
- **Trim** by point range and **Simplify** (Douglas–Peucker, tolerance in metres)
  with a live point-count and output-size preview.
- **Merge** multiple loaded files/tracks into one.
- **Local canvas map preview** (pan/zoom, start/end markers, privacy ring, removed
  points, scale bar) — no map tiles, no network.
- **Live statistics**: distance, duration, moving time, elevation gain/loss, speed,
  pace, bounding box, with a km/mi toggle.
- **Export** to GPX, GeoJSON and CSV, plus copy-to-clipboard, and a transparent
  before→after **privacy report**.
- GPX 1.0/1.1 parsing including routes, waypoints and common extensions, tolerant of
  malformed input.
- Drag-and-drop, multi-file load, paste-GPX, and a bundled sample track.
- Fully responsive dark UI (375–1440px), keyboard accessible, `prefers-reduced-motion`
  aware.

### Security & privacy
- **Zero network requests at runtime**, enforced by a strict
  `connect-src 'none'` CSP and verified by an automated build guard
  (`scripts/check-no-network.mjs`).
- Self-hosted fonts; sample inlined at build time; downloads via in-memory Blobs.
- All GPX-derived text is escaped before display; tightened CSP to
  `style-src 'self'` (no `unsafe-inline`).

### Tested
- 113 unit tests (core logic + 45 adversarial edge cases). axe-core reports zero
  accessibility violations.
