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

- [ ] package.json + deps pinned
- [ ] Vite + tsconfig + Tailwind + PostCSS
- [ ] Vitest config + sample passing test
- [ ] ESLint + Prettier
- [ ] Playwright config
- [ ] hello-world build/run/lint/test all green

## Phase 4 — build core (pure, tested)

- [ ] types.ts
- [ ] geo.ts (haversine, bounds, projection) + tests
- [ ] parse.ts (GPX 1.0/1.1, extensions, tolerant) + tests
- [ ] serialize.ts (GPX/GeoJSON/CSV) + tests
- [ ] stats.ts + tests
- [ ] simplify.ts (Douglas–Peucker, meters) + tests
- [ ] privacy.ts (home detect, zone crop, fuzz, strip) + tests
- [ ] merge.ts + tests
- [ ] transform.ts (declarative pipeline + report) + tests

## Phase 4 — build UI

- [ ] state.ts (store + subscribe)
- [ ] canvas.ts (projection, pan/zoom, draw track/zone/markers, removed overlay)
- [ ] icons.ts (inline SVG)
- [ ] dropzone panel (empty state, sample, paste)
- [ ] controls panel (privacy zone, strip, fuzz, trim, simplify, merge)
- [ ] stats panel
- [ ] privacy report + export panel
- [ ] app.ts wiring + responsive layout + a11y + offline badge
- [ ] CSP meta, no-network guarantee

## Phase 5 — review (Gate 5)

- [ ] Functional pass (Playwright, screenshots of every state)
- [ ] Visual/UX pass graded vs MASTER + pre-delivery checklist
- [ ] Edge-case/robustness pass (empty/malformed/huge/unicode/single-point)
- [ ] Code-quality + security pass (no fetch, no innerHTML, CSP, deps)
- [ ] a11y + perf pass
- [ ] "would a user keep this" pass
- [ ] `REVIEW.md` with evidence

## Phase 6 — docs & packaging (Gate 6)

- [ ] README with screenshots, install, usage, limitations
- [ ] CHANGELOG.md
- [ ] Build static bundle + zip artifact; verify from clean state

## Phase 7 — ship (Gate 7)

- [ ] Create public repo, push
- [ ] Tagged release v1.0.0 with notes + artifacts
- [ ] GitHub Pages deploy + link
- [ ] Verify live

## Phase 8 — final report

- [ ] Summary with links + demo
