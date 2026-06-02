# Design Notes — the contract Phase 4 builds to

This is my own-words summary of the design system in `design-system/MASTER.md`
(plus the per-page overrides under `design-system/pages/`). The build implements to
this. Where a page override differs from MASTER, the override wins for that page;
otherwise MASTER governs.

## The feeling

A calm, precise **operator console** for cleaning location data. It should read as
_serious about privacy_ — dark, technical, no marketing fluff — and visibly local
(an "offline · nothing uploaded" badge is always present). Trust over flash.

## Pattern / layout

Single-page workspace, not a marketing site. Three regions:

- **Left rail (`Controls`)** — the cleaning actions: privacy zone, metadata strip,
  coordinate fuzz, trim, simplify, merge. Fixed `320px`; collapses below 1024px.
- **Center (`Canvas`)** — the track rendered locally on a `<canvas>`: polyline in
  sky `#38BDF8`, start/end markers, the privacy ring, removed segments dimmed.
  Pan/zoom, no base map, no network.
- **Right/stats** — live stats + the before→after **privacy report** in mono.

Every panel must have **empty / loading / populated / error** states.

## Color

Dark slate base — **never pure black** (avoid OLED smear): bg `#0F172A`, surface
`#1B2336`. Foreground `#F8FAFC`, muted `#94A3B8`, border `#334155`. Status drives
meaning: **green `#22C55E` = safe/clean/ready**, **amber `#F59E0B` = review**,
**red `#F43F5E` = personal data exposed (will be removed)**. The track line is sky
`#38BDF8`. Status is never conveyed by color alone — always color **+** icon/label.

## Typography

- **Inter** for all UI text and headings.
- **JetBrains Mono** for every number and geo value — coordinates, distances,
  elevation, byte counts, the privacy report — with `tabular-nums` so values don't
  jiggle as they update.
- Sizes: 12 / 14 / 16 / 20 / 28 px only. Body contrast ≥ 7:1.

## Spacing & responsive

4px scale (`4·8·12·16·24·32·48`). Card padding 16, section gap 24, card radius 8,
input/button radius 6. Verify layout at **375 / 768 / 1024 / 1440 px**; rails stack
above/below the canvas under 768px.

## Effects (restrained)

150–220ms transitions on hover/focus/state only. The primary **"Clean & Export"**
CTA gets a single accent glow. Always-visible 2px focus ring. Skeleton/pulse while
parsing; spinner only when indeterminate. `scale(0.98)` press feedback. Honor
`prefers-reduced-motion`.

## Anti-patterns to avoid (each is a defect)

Light-mode default; pure `#000000`; **emojis as icons** (SVG only); decorative/
infinite animation; low-contrast neon text; frozen UI with no parse/clean feedback;
`z-index:9999` hacks; non-tabular numbers; and — critically for this product — **any
copy implying upload, cloud, or accounts**. It is strictly local.

## Per-page nuances

- **dropzone** (empty state): big, obvious drop target; the privacy promise and a
  "try a sample track" affordance front and centre; explains _what_ gets removed
  before the user commits a real file.
- **workspace**: data-dense but scannable; the canvas is the hero; controls grouped
  by intent with live counts (e.g. "1,204 → 312 points").
- **export-review**: a confirmation/report surface — a clear before→after diff of
  points, file size, bounding box, and exactly which personal fields were stripped,
  with the green "ready to share" affordance.
