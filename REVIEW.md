# REVIEW — Phase 5 Self-Review & QA

Multi-angle review run as a fan-out of parallel sub-agents (security/code-quality,
adversarial robustness testing) plus the author's own functional, visual,
accessibility and zero-network passes — then every finding fixed and re-verified
with fresh evidence. Final state: **all passes clean**.

## Evidence index (in `assets/screenshots/`)
| File | What it shows |
|---|---|
| `01-empty.png` | Empty-state dropzone (privacy promise, sample, paste, what-it-removes) |
| `02-workspace.png` | Loaded sample: local canvas map, controls, stats, report |
| `03-privacy-zone.png` | Auto-detected home ring + red removed-points + cropped gap |
| `04-cleaned.png` | Zone + timestamps + sensor + device stripped; report shows 4 actions |
| `05-simplify.png` | Douglas–Peucker simplification reducing points |
| `06-report.png` | Privacy report close-up (checklist, 93% size reduction) |
| `07-mobile.png` | Responsive layout at 390px (canvas → controls → report) |

## 1. Functional review — PASS
Drove the real app in headless Chromium (`scratch/serve-and-shot.mjs`,
`scratch/audit.mjs`). Verified against `SPEC.md`:
- Load sample, drag/drop, file-pick, paste — all work; bad paste shows a clear
  error (`badPasteError: true`).
- Privacy zone auto-detect proposes the home centroid; crop-ends and cut-all both
  work; live "points inside zone will be removed" count updates.
- Metadata strip toggles + live inventory badges; coordinate fuzz; trim; simplify;
  merge (appears only with >1 track).
- Export **GPX/GeoJSON/CSV** download with correct filenames; exported GPX is
  valid and re-parses (`exportGpxValid: true`). Copy-to-clipboard works.
- Stats recompute on every edit; Duration correctly shows "—" once timestamps are
  stripped (honest — the cleaned output genuinely has no time).

## 2. Visual / UX review vs design system — PASS
Graded the rendered UI against `design-system/MASTER.md` + `DESIGN_NOTES.md`:
- **Colors:** slate base `#0F172A`, surface `#1B2336`, green accent `#22C55E`,
  amber warnings, red danger/removed, sky `#38BDF8` track line — all as specified.
- **Typography:** Inter for UI, JetBrains Mono with tabular-nums for every number
  (coordinates, stats, report) — confirmed in screenshots.
- **Effects:** restrained 150–220ms transitions; single accent glow on the primary
  "GPX" export CTA; visible focus rings; press feedback.
- **Pre-Delivery Checklist:** no emoji icons (inline SVG only); `cursor-pointer`
  on interactive elements; hover/focus/disabled states; status conveyed by color
  **and** icon/label; responsive at 375/768/1024/1440px.

## 3. Edge-case & robustness review — PASS (0 hard defects)
A robustness sub-agent wrote **45 adversarial tests** (`test/edge.test.ts`) and
found **zero** crashes/NaN/Infinity/hangs across: empty/only-waypoint/only-route/
single-point docs; malformed/truncated/garbage/wrong-namespace XML; 100k-char
attributes; a privacy zone swallowing the whole track (crop + cut); poles and the
antimeridian; simplify with tol 0/negative/huge and all-identical points; fuzz at
0–10 dp; out-of-order/identical timestamps (no div-by-zero); unicode + emoji names
round-tripping; 100k-point performance (stats 60ms, simplify 337ms); and
out-of-bounds/inverted/NaN trim ranges. Two behavioral inconsistencies it surfaced
were **fixed** (see §7).

## 4. Code-quality & security review — PASS (after fixes)
A security sub-agent audited every `innerHTML` sink and all network surfaces:
- **XSS:** attacker-controllable GPX data (track/waypoint/route names, comments,
  descriptions, metadata) never reaches an unescaped DOM sink — it flows only
  through the XML/CSV serializers, which escape. The one place a filename reaches
  `innerHTML` (file chips) is escaped. Verified live: a `<img onerror>` payload in
  a track name does **not** execute (`xssAlertFired: false`). The report-row helper
  was hardened to escape defensively regardless.
- **Network:** confirmed there is no `fetch`/XHR/WebSocket/sendBeacon/geolocation in
  source; fonts self-hosted; sample inlined via `?raw`; map drawn on canvas;
  downloads via in-memory Blob. **A real HIGH finding was fixed** (see §7).
- **CSP:** `default-src 'self'; connect-src 'none'; script-src 'self'; style-src
  'self'; object-src 'none'; base-uri 'none'; form-action 'none'` — tightened to
  drop `'unsafe-inline'` from `style-src`. The CSP demonstrably blocks inline script
  injection (it refused an injected axe `<script>` during the audit).
- **Licenses:** no runtime dependencies ship; all dev/build deps are permissive
  (MIT/ISC/Apache-2.0/BSD/OFL); no GPL/AGPL/LGPL. One dev-only MPL-2.0 transitive
  (lightningcss) is never bundled.

## 5. Accessibility & performance — PASS
- **axe-core:** **0 violations** on both the empty state and the workspace (after
  fixes). All buttons have accessible names; keyboard Tab reaches every control;
  visible focus throughout; `prefers-reduced-motion` honored.
- **Performance:** bundle 121 KB JS (24 KB gzip) + 34 KB CSS; core handles 100k
  points in well under a second; canvas pan/zoom is smooth.

## 6. "Would a real user keep this?" — YES
It does exactly what the `RESEARCH.md` target user needs: in under a minute, fully
offline, a runner can drop a Strava export, accept the auto-detected home zone,
strip timestamps + sensor data, see a transparent before→after report, and export a
clean GPX that's 90%+ smaller and safe to share. The flagship anti-doxxing workflow
is front-and-centre, which is the unmet need incumbents bury.

## 7. Findings fixed, with re-verification
| # | Sev | Finding | Fix | Re-verified |
|---|---|---|---|---|
| 1 | HIGH | A `fetch()` shipped in the bundle (Vite preload helper, triggered by a needless dynamic `import()` in the report panel) — broke the zero-network claim | Static import + `build.modulePreload.polyfill=false` + a `check-no-network` build guard | Guard prints "OK — no network primitives"; live capture shows `NON_APP_REQUESTS: []` |
| 2 | MED | Serializer emitted scalar GPX 1.1 child elements (`magvar`, `hdop`, …) out of schema order | Emit them in canonical schema slots | Round-trip test + serialize tests pass |
| 3 | MED | `detectHomeZone` proposed a zone for a single lone point (contradicted its own contract) | Only count a segment's end when distinct from its start → returns null | edge test updated + passes |
| 4 | MED | `cut-all` bridged the redacted centre for **routes** (flattened) while splitting **tracks** | Routes now split into separate routes at the gap | edge test asserts 2 routes, gap preserved |
| 5 | LOW | Report-row builder was an unescaped HTML sink (safe today, latent) | Escape label+value via shared `escapeHtml` | live XSS probe does not fire |
| 6 | LOW | `fmtCoord` could emit `"NaN"` into a coord attribute | Guard `Number.isFinite` | serialize tests pass |
| 7 | MED(a11y) | Missing `<h1>`; unlabeled `<aside>` landmarks; heading-order jump; content outside landmarks | Added sr-only h1 in header, labeled asides, panel headers→h2, moved alert into `<main>` | axe: 0 violations |
| 8 | LOW | `style-src 'unsafe-inline'` needed only for 3 legend swatches | Moved swatches to Tailwind classes; dropped `'unsafe-inline'` | build clean; UI unchanged in screenshots |

## Final gate status
- `npm run build` ✓ (incl. zero-network guard) · `npm test` → **113 passing** ✓ ·
  `npm run lint` ✓ · axe **0 violations** ✓ · live capture **0 non-same-origin
  requests, 0 console errors** ✓.
