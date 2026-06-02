# RESEARCH — Discovery & Demand Validation

> Phase 1 artifact. How the product was chosen, with cited evidence.
> Research was run as a fan-out of parallel research sub-agents (dynamic-workflow
> style): one deep pass on the GPX/GPS-cleaning niche, one comparative pass across
> three alternative utility ideas. Findings cross-checked below.

## The chosen product (one-paragraph pitch)

**GPX Privacy Cleaner** is a privacy-first, 100%-in-browser tool that removes your
home address and personal metadata from `.gpx` GPS tracks before you share them.
You drop in a track exported from Strava, Garmin, Komoot or your phone; it renders
the route **entirely locally** (no map-tile server is ever contacted), automatically
finds the start/end cluster near your home, and lets you cut a circular **privacy
zone**, strip timestamps / speed / heart-rate / device IDs, fuzz coordinate
precision, trim, simplify and merge — then exports a clean GPX/GeoJSON/CSV with a
plain-English before→after **privacy report**. Nothing is ever uploaded. It exists
because deleting your location footprint from a GPS file today means hand-writing
XSLT scripts or trusting an upload-based website — and the leading in-browser editor
(gpx.studio) treats privacy as an afterthought buried under route-planning.

- **Target user:** runners, cyclists, hikers, trail/ultra runners, geocachers, drone
  pilots and OSINT-aware outdoorspeople who export GPX files and want to publish or
  send a track **without** leaking where they live or train.
- **Core problem:** GPX files embed precise home/start coordinates and rich personal
  metadata. Sharing one can dox you (documented: Strava heatmap exposed military
  bases; #StravaLeaks exposed Macron's & US Secret Service details). Removing it is
  fiddly, technical, and usually requires uploading sensitive location data.

## Why this is doable with the tools I have

- GPX is plain XML → parse/serialize in pure TypeScript, no server.
- Visualization is **own-canvas rendering** (pan/zoom of the polyline) → **zero
  network calls**, which is both the strongest privacy story and removes the map-tile
  licensing/dependency problem entirely.
- All transforms (privacy-zone crop, metadata strip, Douglas–Peucker simplify,
  merge, stats, elevation smoothing) are deterministic client-side algorithms →
  unit-testable, fast, no external/paid APIs.
- Unlike the OPML idea, there is **no CORS asterisk**: every advertised feature is
  genuinely 100% in-browser.

## Market scan & shortlist (scored against §3 rubric)

Weights: Niche ×3, Real-demand ×3, Doable ×3, Demonstrable ×2, Defensible-scope ×2.
Legal/ethical is a pass/fail gate. Scores are 1–10, honest.

| Idea                             | Niche ×3 | Demand ×3 | Doable ×3 | Demo ×2 | Scope ×2 | Legal | **Total /130** |
| -------------------------------- | :------: | :-------: | :-------: | :-----: | :------: | :---: | :------------: |
| **GPX Privacy Cleaner** (chosen) |    9     |     8     |     9     |   10    |    8     | PASS  |    **114**     |
| ICS calendar editor/merger       |    6     |     9     |     8     |    6    |    6     | PASS  |       93       |
| OPML feed-list organizer         |    8     |     6     |     6     |    5    |    7     | PASS  |       84       |
| EPUB metadata editor             |    7     |     6     |     7     |    6    |    5     | PASS  |       82       |

### Why GPX won

- **Most demonstrable (10):** a rendered route map with a red home-cluster and a
  green privacy ring is instantly screenshot-able and self-explanatory — ideal for a
  README and release.
- **Cleanest feasibility (9):** every feature is truly client-side; no proxy, no
  server, no paid API, no CORS limitation (the OPML idea's dead-feed check fails this).
- **Sharpest unique wedge:** it is the **only** shortlisted idea whose headline value
  (one-click anti-doxxing sanitize + automatic home-location detection) is _not_
  already occupied by an in-browser competitor. The others each face a direct
  privacy-first in-browser incumbent (icsfix.com / text2calendar; E-BOOKA; imdj
  opml-editor).
- **Large, motivated audience:** the outdoor/fitness community is huge and privacy-
  primed by repeated, mainstream Strava-leak news.

### Why the others ranked lower

- **ICS** has the broadest raw demand but the most saturation; its real gap (RRULE
  repair) is text-heavy and less demonstrable.
- **OPML** is genuinely underserved but small-audience, and its flagship "find dead
  feeds" feature needs a server/proxy — it can't honestly be 100% in-browser.
- **EPUB** is a convenience play against free, entrenched Calibre plus an existing
  in-browser competitor (E-BOOKA) — the weakest moat.

## Evidence (GPX niche)

1. Strava→home-address inference is a mainstream, documented privacy threat; standard
   mitigation is literally "edit raw GPX to move the first/last coordinates away from
   home." — howtogeek.com/678870, the5krunner.com/2019/02/21/strava-privacy-zone
2. The stakes are real and newsworthy: 2018 Strava heatmap exposed military bases;
   Le Monde's 2024 #StravaLeaks exposed Macron's security detail & US Secret Service.
   — mapulus.com/blog/strava-fitness-tracker-military-secrets-location-data, gijn.org
3. Explicit demand to sanitize GPX before sharing — a developer hand-rolls an
   XMLStarlet/XSLT pipeline to strip timestamps/speed/HDOP/extensions because no easy
   tool fit. — oleb.net/2020/sanitizing-gpx
4. Recurring "remove timestamps from GPX" across Garmin forums, Locus Map, Google
   Earth community, plus DIY scripts (GpsRemoveTimestamps, GPXTimeStripper). — forums.garmin.com, github.com/crdave/GpsRemoveTimestamps
5. "GPX too big / reduce points" is a persistent pain (devices reject oversized
   tracks); decimation scripts abound. — forums.garmin.com .../275526, yacf.co.uk forum
6. Elevation data is frequently wrong; users actively seek smoothing/clean-up. —
   oregonhikers.org/forum, sporttracks.mobi/blog/gps-elevation-correction
7. Trim/crop start-end ("forgot to stop recording / left GPS in the car") is an
   everyday need. — scarletfire.co.uk/crop-edit-ride, singletrackworld.com forum
8. Merge multi-day/segment tracks is common enough that several local-only in-browser
   mergers exist. — therideatlas.com/tools/gpx-editor/merge, dawarich.app/tools/gpx-merger

## Competitive landscape & the gap

- **gpx.studio** — market leader, open-source, in-browser, "files never leave your
  browser," excellent route _planning_. Gap: privacy _cleaning_ is an afterthought;
  no one-click "sanitize for sharing", no automatic home-location detection; struggles
  with very large files.
- **GPS Visualizer** — powerful elevation/simplify, but **server-side upload** →
  privacy non-starter for this user; dated UI.
- **GpsPrune / GPSBabel / RouteConverter** — capable but desktop/CLI, steep learning
  curve, not approachable for an average runner.
- **viewmygpx / Dawarich / The Ride Atlas / TrailSplits** — fragmented single-task
  in-browser tools; not privacy-cleaning-focused, mostly closed-source.

**The white space (most underserved sub-need):** an opinionated, privacy-led workflow
that _leads_ with anti-doxxing — **automatic detection of the home/start-end cluster**,
a one-action privacy-zone crop, and a combined metadata strip + coordinate fuzz — with
a transparent before→after report, all 100% offline. That is GPX Privacy Cleaner.

## Legal / ethical gate — PASS

Editing one's own GPS files is fully lawful. The tool ingests only files the user
supplies, performs all work locally, contacts no network, stores nothing, and is
explicitly defensive/pro-privacy (it _removes_ personal data; it never collects,
deanonymizes, or targets anyone). No scraping, no access-control bypass, no
surveillance. Permissively-licensed dependencies only. Safe to publish publicly.

## Honesty note

Every shortlisted category already has at least one in-browser competitor — none is
greenfield. GPX's defensibility is the _unmet sub-need_ (auto home-detection +
one-click sanitize), its superior demonstrability, and the fact that it is the only
candidate that can keep the 100%-offline promise with no asterisk.
