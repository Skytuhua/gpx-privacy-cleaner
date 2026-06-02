# BUILD LOG — GPX Privacy Cleaner

A running, honest record of decisions, dead ends, fixes, and review findings.

## Phase 0 — Environment & capability setup

- Inventoried toolchain: Linux, Node v22.22.2, npm 10.9.7, Python 3.11.15, Go 1.24.7,
  Playwright 1.56.1 (browser binaries installed via `npx playwright install chromium`).
- `gh` CLI was **not** installed → installed `gh` v2.62.0 to `/usr/local/bin`.
- GitHub auth: no `GH_TOKEN`/`GITHUB_TOKEN` env var present; a token was supplied in
  the task prompt. Authenticated `gh` via `--with-token` over stdin (token never
  echoed/logged/committed). `gh auth status` → logged in as **Skytuhua** with `repo`
  scope. Ran `gh auth setup-git`. Confirmed publishing path works early.
- Set global git identity: `Skytuhua <Skytuhua@users.noreply.github.com>`.
- **Dynamic-workflow runtime:** the dedicated JS workflow runtime was not separately
  invokable in this session; used the supported fallback — parallel **sub-agents**
  (the `Agent` tool) for fan-out research and review, plus multi-pass self-review.
  Recorded here per Directive 9's fallback clause. Underlying work not skipped.
- Audited existing GitHub repos to ensure no duplicate. Portfolio theme is
  "privacy-first, in-browser, single-purpose utilities" (subtitle tools, vCard,
  bank-statement, image-metadata, cron, id-lens, cross-stitch, etc.). A GPX privacy
  cleaner does **not** exist there → clear to build.

## Phase 1 — Discovery & research

- Ran two parallel research sub-agents: (1) deep GPX/GPS-cleaning demand pass,
  (2) comparative pass over ICS / EPUB / OPML alternatives.
- Scored shortlist in `RESEARCH.md`. **GPX Privacy Cleaner** won (114/130): most
  demonstrable, cleanest 100%-offline feasibility, and the only candidate whose
  flagship value (auto home-detection + one-click anti-doxxing sanitize) is not
  already occupied by an in-browser competitor.
- Gate 1 ✓.

## Phase 2 — Scaffolding

- Project folder `gpx-privacy-cleaner` (plain noun-verb name: acts on GPX, cleans for
  privacy). `git init`; `commit.gpgsign false` (avoids missing-source signing error in
  a fresh non-source repo) — unsigned commits under owner identity.
- Wrote `SPEC.md`, `ARCHITECTURE.md`, `DESIGN_NOTES.md`, `RESEARCH.md`, this log.

## Phase 3.5 — UI/UX design system (ran the full ui-ux-pro-max workflow)

- Cloned the design-intelligence skill into scratch (outside the project); smoke-test
  passed. Brief: privacy/developer utility, GPS data cleaner, dark, technical,
  data-dense, trustworthy; stack `html-tailwind` (vanilla TS).
- Step 2: generated `design-system/MASTER.md`. Step 2b: per-page overrides for
  `dropzone`, `workspace`, `export-review`. Step 3: domain deep-dives (style/color/
  typography/ux) + Step 4 stack (html-tailwind) → folded into an enriched MASTER.
- Final system: Dark slate (not pure black), Developer-Tool palette (bg #0F172A,
  accent green #22C55E, status amber/red, track sky #38BDF8), Inter + JetBrains Mono,
  4px spacing scale, restrained effects, explicit anti-patterns + pre-delivery
  checklist. Summarized in my own words in `DESIGN_NOTES.md`. Gate 3.5 target met.

## Phase 3 — Tooling

- (in progress) Vite + TS + Tailwind + Vitest + Playwright + ESLint/Prettier.
