# Migration

Old value to new token. ~40 files under `src/app/dashboard` carry the legacy
palette; treat every one as a defect.

## Colour

| Old | New |
|---|---|
| `indigo-600`, `indigo-500`, `#5347CE`, `#887CFD` | `primary` |
| `from-indigo-600 to-indigo-500` (gradient) | `bg-primary` — flat, delete the gradient |
| `from-[#5347CE] to-[#887CFD]` (gradient) | `bg-primary` |
| `indigo-400` (link, hover text) | `primary` |
| `#16C8C7` teal accent | `primary`, or drop it — the palette has one accent now |
| `#0D0F1A`, `zinc-950`, `zinc-900` (page) | `background` |
| `#111326`, `#131525`, `zinc-900` (card) | `surface` |
| `#161829`, `#151728` | `surface` — these existed for one screen each |
| `#1E2035`, `zinc-800` (control) | `control` |
| `#282A42` (hover) | `surface-raised` |
| `zinc-800`, `white/[0.06]`, `white/[0.08]` (border) | `border` |
| `zinc-700` (input border) | `input` |
| `#9698AE`, `zinc-400` | `muted-foreground` |
| `#5D5F7A`, `zinc-500` | `subtle-foreground` — the old value was 3.4:1, below AA |
| `rose-*` on Reports | `danger` |
| `shadow-indigo-500/20`, `glow-purple`, `glow-teal` | `shadow-e1` / `e2`, delete the glows |
| Analytics chart palette (`#6366f1 #34d399 …`) | `--chart-1` to `--chart-6` |

## Type

| Old | New |
|---|---|
| Plus Jakarta Sans | Geist |
| `text-3xl font-bold` page H1 (30px) | `text-page` (24px / 600) |
| `text-lg font-semibold` section | `text-block` (15px / 600) |
| `text-sm text-zinc-400` body | `text-body text-muted-foreground` |
| bare `{currency} {n.toFixed(2)}` | `Intl.NumberFormat`, mono, right aligned |

## Structural

| Issue | Fix |
|---|---|
| Approver queue shows `consultantId.slice(-6)` | Join the consultant, render name + email + avatar |
| Search and period select hardcoded `disabled` | Implement, or remove |
| `window.confirm()` in 3 places | Dialog component |
| CSS-grid pseudo-tables in 4 places | Real `<table>` |
| Disabled CTA rendered as `<span>` | `<button aria-disabled>` |
| Flat 17-item sidebar | Five groups |
| Project cards omit the client name | Add it — it is the disambiguator |
| No search, sort or pagination on 3 list screens | The table pattern |
| Currency list is 3 options in one dialog, 7 elsewhere | One shared constant |
| 29-field and 17-field forms, one submit | Sectioned sub-nav, save per section |
| 7 bank fields always rendered | Render what the country and currency need |
| Portal nav absent below 768px | Mobile navigation |
| No `prefers-reduced-motion` | In the base layer, plus delete the 3 infinite loops |
| `:root` light palette unreachable | Light is now the default theme |
| No SVG logo, composed in JSX in 5 places | One asset |
