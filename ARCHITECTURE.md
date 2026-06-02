# ARCHITECTURE — GPX Privacy Cleaner

## Stack choice & rationale

| Concern              | Choice                                                 | Why                                                                                                                                                     |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language             | **TypeScript**                                         | Type-safe geo/XML logic; catches edge-case bugs at compile time.                                                                                        |
| Bundler / dev server | **Vite**                                               | Fast HMR, first-class TS, trivial static build for GitHub Pages.                                                                                        |
| UI                   | **Vanilla TS + DOM** (no framework)                    | The app is one workspace; a framework adds weight/runtime for no real gain. Keeps the bundle tiny and the privacy story simple (less third-party code). |
| Styling              | **Tailwind CSS v3** mapped to CSS variables            | Matches the design system; utility-first speed; theme tokens = single source of color truth.                                                            |
| Fonts                | **Self-hosted** Inter + JetBrains Mono (`@fontsource`) | Honors the zero-network rule — no Google Fonts fetch at runtime.                                                                                        |
| Visualization        | **HTML Canvas 2D**, hand-rolled projection/pan/zoom    | No map tiles → **no network**, no tile licensing, full control. Equirectangular projection scaled to bbox is accurate enough for local route display.   |
| Unit tests           | **Vitest**                                             | Native to Vite; fast; tests the pure core modules.                                                                                                      |
| E2E / screenshots    | **Playwright**                                         | Drives the real app in Chromium for functional + visual review evidence.                                                                                |
| Lint / format        | **ESLint + Prettier**                                  | Consistency; catches dead code/unused vars.                                                                                                             |
| Icons                | Inline **SVG** (Lucide-style stroke paths)             | Design system forbids emoji icons; inline SVG = no icon-font network fetch.                                                                             |

**Why no network at all:** the product's entire promise is privacy. By rendering the
map ourselves on canvas and self-hosting fonts, the deployed app makes **zero**
runtime requests — auditable in DevTools and provable in tests. This is a feature,
not a limitation.

## Module layout (separation of pure core from UI)

```
src/
  core/                      # pure, framework-free, fully unit-tested
    types.ts                 # GpxDoc, Track, Segment, Point, Waypoint, Bounds...
    parse.ts                 # GPX text -> GpxDoc (DOMParser), tolerant of malformed
    serialize.ts             # GpxDoc -> GPX / GeoJSON / CSV
    geo.ts                   # haversine distance, bounds, projection helpers
    stats.ts                 # distance/elevation/speed/pace/duration aggregation
    privacy.ts               # home-cluster auto-detect, privacy-zone crop, fuzz, strip
    simplify.ts              # Douglas-Peucker (geo-aware) point reduction
    merge.ts                 # combine tracks/segments
    transform.ts             # high-level "apply these edits to a doc" pipeline
  ui/                        # DOM glue, canvas renderer, panels (imperative)
    app.ts                   # bootstraps, wires state -> panels
    state.ts                 # central app state + subscribe/notify (no framework)
    canvas.ts                # projection + pan/zoom + draw track/zone/markers
    panels/                  # controls, stats, privacy report, dropzone, export
    icons.ts                 # inline SVG icon set
  styles/
    main.css                 # Tailwind layers + CSS variables (design tokens)
  main.ts                    # entry
public/
  sample.gpx                 # bundled demo track (synthetic, no real person)
test/                        # Vitest unit tests for every core module
e2e/                         # Playwright functional + screenshot specs
```

## Data flow

1. **Input** → `parse.ts` turns dropped/pasted GPX text into an immutable `GpxDoc`.
   Parse failures produce a structured error + a list of skipped nodes (never a throw
   to the UI).
2. **State** holds the original `GpxDoc`(s) plus an `EditConfig` (privacy zone,
   strip toggles, fuzz precision, trim range, simplify tolerance, merge order).
3. **`transform.ts`** is a pure function `(docs, EditConfig) -> { result, report }`.
   It is re-run (debounced) on every edit; nothing mutates the originals, so toggling
   any option off restores prior state exactly.
4. **Render**: `canvas.ts` draws the current result + an overlay of what will be
   removed; `stats.ts` + the privacy report panel show live before→after numbers.
5. **Export**: `serialize.ts` turns the transformed result into a downloadable Blob.

`EditConfig` being declarative (not imperative mutations) is what makes the preview,
the report, and undo-by-toggling all fall out for free, and makes the core trivially
testable.

## Key algorithms

- **Home auto-detect (`privacy.ts`):** collect every track's first & last point;
  greedily cluster points within a threshold radius (haversine); if the largest
  cluster covers a majority of endpoints, return its centroid + a suggested radius
  (cluster spread + margin). Deterministic, no ML.
- **Privacy crop:** for "crop ends", walk inward from each end dropping points whose
  haversine distance to the zone center ≤ radius; for "cut all", drop every in-zone
  point and split the segment where the gap occurs.
- **Simplify:** Douglas–Peucker using perpendicular distance in projected meters so
  tolerance is in real-world meters, not degrees; endpoints and (optionally) elevation
  extrema preserved.
- **Stats:** haversine cumulative distance; elevation gain/loss with a small
  smoothing threshold to avoid GPS jitter inflation; speed from distance/Δtime.

## Dependencies & licenses (all permissive)

| Package                                       | Use                        | License                    |
| --------------------------------------------- | -------------------------- | -------------------------- |
| vite                                          | build/dev                  | MIT                        |
| typescript                                    | language                   | Apache-2.0                 |
| tailwindcss, postcss, autoprefixer            | styling                    | MIT                        |
| @fontsource/inter, @fontsource/jetbrains-mono | self-hosted fonts          | OFL-1.1 (fonts), MIT (pkg) |
| vitest                                        | unit tests                 | MIT                        |
| @playwright/test                              | e2e/screenshots (dev only) | Apache-2.0                 |
| eslint, prettier, typescript-eslint           | lint/format (dev only)     | MIT                        |

No runtime third-party code ships beyond the self-hosted fonts and our own bundle.
No GPL/copyleft. No paid or networked APIs.

## Security & privacy posture

- No `eval`, no `innerHTML` with untrusted strings (GPX text rendered as text/DOM
  nodes, never as HTML); parsing via `DOMParser('text/xml')`.
- No `fetch`/`XMLHttpRequest`/`navigator.sendBeacon` anywhere in app code (enforced by
  a lint rule + an automated test that greps the built bundle).
- A strict `Content-Security-Policy` meta tag (`default-src 'self'`; no connect-src)
  so the page _cannot_ phone home even if a dependency tried to.
- All file handling is in-memory; nothing is written to storage unless the user opts
  into remembering UI preferences (localStorage, no track data).
