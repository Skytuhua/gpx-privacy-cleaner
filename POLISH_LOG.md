# Polish Log

This file tracks low-risk usability and accessibility improvements made to GPX
Privacy Cleaner after its initial build. Each entry records what changed, why, and
what was intentionally left for a future pass — so later runs build on this work
instead of repeating it.

Scope for every entry: **usability polish + safe bug-fixes only** — no new
features, no behaviour changes, no rewrites, no new hosting.

---

## 2026-06-02 — Polish run #1 (v1.0.0 → v1.0.1)

The product shipped in excellent shape: clear README first line, friendly empty
state, plain error messages, honest empty/loading/error/success states, and a
strong privacy-first design. The audit (as a non-technical first-time user, with
parallel reviewer + adversarial-verifier subagents across the §3 lenses) found no
bugs and only a handful of genuine, low-risk friction points. Those were fixed:

### Onboarding & clarity (docs / copy)
- **Added "Where do I get my .gpx file?"** collapsible help to the start screen
  (`src/ui/panels/dropzone.ts`). Plain export steps for Strava, Garmin Connect,
  Komoot and phone apps. Rationale: the dropzone names those services but a true
  non-coder may not know how to export a track from them — this closes the biggest
  "I don't know how to start" gap. Pure static help text; no behaviour change.
- **Explained the two privacy-zone modes** in plain words under the Crop ends /
  Cut all choice (`src/ui/panels/controls.ts`): "Crop ends trims only the start &
  finish near home — best for most people. Cut all removes every point inside the
  zone…". Rationale: the bare labels gave a normal user no way to choose.
- **Added a favicon + `theme-color`** (`public/favicon.svg`, `index.html`):
  brand shield mark matching the header, so the browser tab is recognisable. The
  inline SVG keeps the zero-network guarantee intact (`img-src 'self'`).

### Accessibility (a11y)
- `aria-pressed` on the **km/mi** unit toggle and the **"Pick on map"** mode button
  (`src/ui/panels/report.ts`, `src/ui/panels/controls.ts`).
- `aria-expanded` + `aria-controls` on the **"Paste GPX text"** disclosure
  (`src/ui/panels/dropzone.ts`).
- `aria-label` on the icon-only **Add files** / **Reset** header buttons, which had
  no accessible name on small screens (`src/ui/app.ts`).
- Restored a visible **keyboard focus ring** on text inputs — the `.input` class's
  `outline-none` had been suppressing the global `:focus-visible` ring
  (`src/styles/main.css`).

### Microcopy (fix)
- Correct singular/plural in the privacy report banner ("1 action" vs "2 actions")
  and the zone-count line ("1 point" vs "3 points"), replacing the developer-ish
  "action(s)" / "point(s)" form (`src/ui/panels/report.ts`,
  `src/ui/panels/controls.ts`).
- The empty privacy report now says "Use the cleaning controls to choose what to
  remove." — the old "controls at left" was wrong on mobile, where the controls
  stack above the report (`src/ui/panels/report.ts`).

### Verification
- `tsc --noEmit`, `npm test` (113/113), `npm run build` (incl. the zero-network
  guard) all pass. The changed files are Prettier- and ESLint-clean.
- Drove the real app in Chromium (Playwright): empty state with the new help
  expanded, the workspace with the mode explanation and pluralised count, the
  "4 privacy actions applied" report, and the invalid-paste error banner — all
  render correctly with **zero console errors**. `aria-expanded` confirmed toggling.

### Left for a future run
- **Sensible defaults** are deliberately untouched. A new user who loads a file
  sees every removal toggle OFF; turning some on by default (or a one-click "Clean
  everything") would demonstrate the core value faster — but it changes the export
  output, so it is a behaviour change that needs careful thought, not a low-risk
  polish. Skipped on purpose.
- **Pre-existing `npm run lint` Prettier warnings** in generated/docs files
  (`graphify-out/*`, `README.md`, `REVIEW.md`, `CHANGELOG.md`, `CLAUDE.md`). These
  predate this run and are mostly machine-generated; reformatting them is noise and
  was left alone to avoid churn.
- A short, plain "How it works in 3 steps" strip on the start screen could further
  help first-timers, if a future run judges it worth the extra copy.
