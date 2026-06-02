# Design System — GPX Privacy Cleaner (CANONICAL, binding source of truth)

> A privacy-first, 100%-in-browser tool that strips home locations and personal
> metadata out of GPS (`.gpx`) tracks before you share them. The interface must
> feel like a precise, trustworthy operator console — dark, data-dense, calm,
> and obviously *offline*.

## Pattern
- **Name:** Real-Time / Operations console (single-page workspace tool, not a marketing site)
- **Layout:** Left = controls/inspector rail · Center = local track canvas · Right/bottom = stats & privacy report
- **Color Strategy:** Dark neutral base with **status colors** (green = safe/clean, amber = warning/needs review, red = danger/exposed). Data-dense but scannable.
- **Trust signals (lead with these):** "Nothing leaves your browser", an offline/no-network badge, and a live before→after privacy report.
- **States to design for every panel:** empty, loading/parsing, populated, error, success.

## Style
- **Name:** Dark Mode (slate, *not* pure-OLED black — avoid `#000000` smear)
- **Mode Support:** Dark only (no light mode; documented intentional choice)
- **Keywords:** technical, precise, calm, high-contrast, operator console, eye-friendly
- **Performance:** Excellent · **Accessibility target:** WCAG AA minimum, AAA on body text
- **Radius:** `8px` cards / `6px` inputs/buttons · **Hairline borders** `rgba(148,163,184,0.18)`

## Colors (hex + CSS variables) — Developer-Tool dark palette
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background (app) | `#0F172A` | `--color-bg` |
| Surface / card | `#1B2336` | `--color-surface` |
| Surface elevated | `#222C42` | `--color-surface-2` |
| Primary (rail/header) | `#1E293B` | `--color-primary` |
| Foreground | `#F8FAFC` | `--color-fg` |
| Muted foreground | `#94A3B8` | `--color-fg-muted` |
| Border | `#334155` | `--color-border` |
| Border hairline | `rgba(148,163,184,0.18)` | `--color-border-soft` |
| **Accent / safe (clean)** | `#22C55E` | `--color-accent` |
| On accent | `#04130A` | `--color-on-accent` |
| **Warning** | `#F59E0B` | `--color-warn` |
| **Danger / exposed** | `#F43F5E` | `--color-danger` |
| Info / track line | `#38BDF8` | `--color-track` |
| Ring (focus) | `#22C55E` | `--color-ring` |

Semantic mapping for this product:
- **Green** = data is clean / point is safe / export ready.
- **Amber** = potential exposure detected, review recommended.
- **Red** = personal data present (home cluster, timestamps, device id) that will be removed.
- **Sky `#38BDF8`** = the track polyline on the canvas; markers reuse status colors.

## Typography (Google Fonts) — "Dashboard Data" pairing
- **UI / Sans:** **Inter** — weights 300;400;500;600;700 (labels, headings, prose)
- **Data / Mono:** **JetBrains Mono** — weights 400;500 (coordinates, stats, file sizes, byte counts, the privacy report)
- Import:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```
- Rules: numeric/geo data is **always** mono with `font-variant-numeric: tabular-nums`. Body text contrast ≥ 7:1 on `--color-bg`. Type scale: 12 / 14 / 16 / 20 / 28 px only.

## Spacing & layout
- 4px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48`. Card padding `16px`, section gap `24px`.
- Max content focus column on the canvas; rails fixed width (`320px` desktop), collapse below 1024px.
- Responsive breakpoints to verify: **375 / 768 / 1024 / 1440 px**. Below 768px the rails stack above/below the canvas.

## Key Effects (restrained)
- Transitions `150–220ms ease` on hover/focus/state changes only.
- Accent **minimal glow** for the primary "Clean & Export" CTA: `box-shadow: 0 0 0 1px var(--color-accent), 0 0 18px -6px var(--color-accent)`.
- Focus ring: `2px` solid `--color-ring` + 2px offset, always visible for keyboard nav.
- Loading: skeleton/`animate-pulse` while parsing; spinner only for indeterminate work.
- Press feedback: `scale(0.98)` on `:active` for buttons.
- Respect `prefers-reduced-motion: reduce` → disable all non-essential transitions/animation.

## Avoid (Anti-patterns) — treat each as a defect
- Light-mode default; pure `#000000` backgrounds (OLED smear) — use slate `#0F172A`.
- **Emojis as icons** — use inline SVG (Lucide-style stroke icons) only.
- Continuous/decorative animation (bounce, infinite spin on non-loaders, glitch, scanlines).
- Neon-on-near-black low-contrast text; accent text below 4.5:1.
- Frozen UI with no feedback during parse/clean/export.
- `z-index: 9999` hacks — manage stacking contexts deliberately (modal/overlay layer only).
- Non-tabular numbers that shift width as values change.
- Any UI copy implying upload / cloud / accounts — this tool is strictly local.

## Stack guidelines (html-tailwind + vanilla TS)
- Tailwind utilities; use `size-*` for squares, arbitrary `[]` values sparingly for one-offs.
- `animate-*` used only for loaders/CTA, never on icons.
- Keep CSS variables as the single source of color truth; Tailwind theme maps to them.

## Pre-Delivery Checklist (run before ship)
- [ ] No emojis as icons (inline SVG only)
- [ ] `cursor-pointer` on every clickable element; `:active` press feedback present
- [ ] Hover **and** focus **and** disabled states on all interactive controls
- [ ] Text contrast ≥ 4.5:1 (≥ 7:1 body); status colors distinguishable for color-blind users (icon + color, never color alone)
- [ ] Visible keyboard focus ring throughout; full keyboard operability
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive verified at 375 / 768 / 1024 / 1440 px
- [ ] Every panel has empty / loading / populated / error states
- [ ] Numeric/geo data uses JetBrains Mono + tabular-nums
- [ ] No "upload"/"cloud" language anywhere; offline badge present
