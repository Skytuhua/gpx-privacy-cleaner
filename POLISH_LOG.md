# Polish Log

This file tracks low-risk usability and accessibility improvements made to GPX
Privacy Cleaner after its initial build. Each entry records what changed, why, and
what was intentionally left for a future pass — so later runs build on this work
instead of repeating it.

Scope for every entry: **usability polish + safe bug-fixes only** — no new
features, no behaviour changes, no rewrites, no new hosting.

---

## 2026-06-03 — Polish run #2 (v1.0.1 → v1.0.2)

A delta-only pass (per the "audit only what's left" rule): the start screen and
report were already polished in run #1, so this run started from run #1's
"Left for a future run" list and a fresh first-timer audit of the **cleaning
controls** — the one place a normal person still meets developer jargon. Parallel
reviewer subagents (start-screen lens + workspace-copy lens) converged, and the
diff (display strings only) was adversarially checked for behaviour change. Found
two genuine jargon snags and one inconsistency; fixed all three.

### Plain-language for the controls (docs / copy)
- **Coordinate precision** now adds "Fewer decimal places blur more." to its help
  line (`src/ui/panels/controls.ts`). The slider is labelled "Decimal places" and a
  non-coder had no way to know which direction means *more* privacy. Pure static
  copy; the live "4 dp · ≈ 11 m" readout is unchanged.
- **Simplify** now adds "A bigger tolerance removes more points."
  (`src/ui/panels/controls.ts`). "Tolerance" is geometry jargon; this explains its
  effect in plain words right where it's used — the same explain-in-place pattern
  run #1 used for "Crop ends / Cut all". No behaviour change.
- **Statistics** label spelled out: "Min / max elev." → **"Min / max elevation"**
  (`src/ui/panels/report.ts`), matching the "Elevation gain" / "Elevation loss"
  rows directly above it. Verified it still fits on one line in the right rail.

### Deliberately NOT done this run
- **The "How it works in 3 steps" strip** (a run #1 idea) was evaluated and
  **skipped**: the start screen already has a headline, a one-line subhead, the
  "Where do I get my .gpx file?" help, and the "100% offline" / "What it removes"
  cards. A reviewer pass judged a step strip redundant clutter rather than help.
- **Sensible defaults** remain untouched — still a behaviour change, out of scope
  (see run #1's note).

### Verification
- `tsc --noEmit`, `npm test` (113/113), `npm run build` (incl. the zero-network
  guard) all pass; the two changed files are Prettier- and ESLint-clean.
- Drove the real app in Chromium (Playwright): loaded the sample, expanded the
  Coordinate precision and Simplify sections (new help text renders correctly), and
  confirmed the stats panel shows "Min / max elevation" on a single line — **zero
  console errors** across empty, workspace and report states.

### Left for a future run
- The **Trim** sliders ("Start point" / "End point") are clear once you drag them
  (the live "Keeping points 0–100 (100 of 500)" line explains it), but a non-coder
  doesn't know up front that the numbers are point positions. A tiny hint could
  help — left as a low-priority, judgement-call item rather than churn now.
- The dropzone's "you can load several at once" doesn't say whether multiple files
  merge or stay separate (they stay separate unless you turn on Merge). A one-line
  clarifier is possible but risks cluttering the start screen — deferred.
- Pre-existing `npm run lint` Prettier warnings in generated/docs files
  (`graphify-out/*`, etc.) are still left alone as machine-generated noise.

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
