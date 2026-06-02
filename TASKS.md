# TASKS — GPX Privacy Cleaner

Living checklist, updated as the build proceeds.

## Phase 0–2 — setup & docs

- [x] Toolchain inventory; install `gh`; auth as Skytuhua; set git identity
- [x] Audit existing repos (no duplicate)
- [x] Research + `RESEARCH.md` (Gate 1)
- [x] Project folder + git init + signing off
- [x] `SPEC.md`, `ARCHITECTURE.md`
- [x] Design system (Gate 3.5): MASTER + pages + domains/stack + `DESIGN_NOTES.md`

## Phase 3 — tooling (Gate 3)

- [x] package.json + deps pinned
- [x] Vite + tsconfig + Tailwind + PostCSS
- [x] Vitest config + sample passing test
- [x] ESLint + Prettier
- [x] Playwright config
- [x] hello-world build/run/lint/test all green

## Phase 4 — build core (pure, tested)

- [x] types.ts
- [x] geo.ts (haversine, bounds, projection) + tests
- [x] parse.ts (GPX 1.0/1.1, extensions, tolerant) + tests
- [x] serialize.ts (GPX/GeoJSON/CSV) + tests
- [x] stats.ts + tests
- [x] simplify.ts (Douglas–Peucker, meters) + tests
- [x] privacy.ts (home detect, zone crop, fuzz, strip) + tests
- [x] merge.ts + tests
- [x] transform.ts (declarative pipeline + report) + tests

## Phase 4 — build UI

- [x] state.ts (store + subscribe)
- [x] canvas.ts (projection, pan/zoom, draw track/zone/markers, removed overlay)
- [x] icons.ts (inline SVG)
- [x] dropzone panel (empty state, sample, paste)
- [x] controls panel (privacy zone, strip, fuzz, trim, simplify, merge)
- [x] stats panel
- [x] privacy report + export panel
- [x] app.ts wiring + responsive layout + a11y + offline badge
- [x] CSP meta, no-network guarantee

## Phase 5 — review (Gate 5)

- [x] Functional pass (Playwright, screenshots of every state)
- [x] Visual/UX pass graded vs MASTER + pre-delivery checklist
- [x] Edge-case/robustness pass (empty/malformed/huge/unicode/single-point)
- [x] Code-quality + security pass (no fetch, no innerHTML, CSP, deps)
- [x] a11y + perf pass
- [x] "would a user keep this" pass
- [x] `REVIEW.md` with evidence

## Phase 6 — docs & packaging (Gate 6)

- [x] README with screenshots, install, usage, limitations
- [x] CHANGELOG.md
- [x] Build static bundle + zip artifact; verify from clean state

## Phase 7 — ship (Gate 7)

- [x] Create public repo, push
- [x] Tagged release v1.0.0 with notes + artifacts
- [x] GitHub Pages deploy + link
- [x] Verify live

## Phase 8 — final report

- [x] Summary with links + demo
