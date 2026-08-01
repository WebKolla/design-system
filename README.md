# TimeSubmit Design System

The design system behind the TimeSubmit product and marketing site. One accent,
three surfaces, and semantic colour reserved for state.

**Status:** v0.1, extracted from the August 2026 UX review. Tokens are final;
component specs are ready to build against.

---

## Why this exists

Before this system the product ran **two colour systems side by side**: 40 files
under `src/app/dashboard` on stock `indigo-*`/`zinc-*`, and 7 on the documented
brand purple. The billing screen showed both in one viewport. Six near-identical
dark surfaces were in use. Tokens existed in `globals.css` but almost nothing
consumed them, so editing the token file changed nothing on screen.

This repository fixes the last part first, because it is what makes the rest
cheap: **the tokens are load-bearing.** If editing `globals.css` does not change
the screen, the system does not exist.

---

## The two decisions

**1. Light first, dark second.**
Every product this audience compares TimeSubmit to is light-first. Invoices are
white. Finance leads print. Dark-only was a positioning liability, not a style
choice. Light ships as the default and dark is a real, equal theme with its own
ramp, not an inversion.

**2. One accent, doing less.**
Accent `#16606B` appears in exactly four places: the primary button, the active
nav marker, the focus ring, and the single most important figure on a screen.
Not icons, not headings, not decoration. No gradients. No glows. No particle
fields. The colour that survives is the colour carrying meaning: approved,
pending, overdue.

---

## Files

| File | What it is |
|---|---|
| `globals.css` | The whole token layer. Tailwind v4, CSS-first. Drop in at `src/app/globals.css`. |
| `COMPONENTS.md` | Component specs with real dimensions, states and anti-patterns. |
| `MIGRATION.md` | Old value to new token, for the ~40 file dashboard migration. |

---

## Foundations at a glance

**Surfaces: three, down from six.**
`background` `#F7F7F9` · `surface` `#FFFFFF` · `control` `#F1F1F4`.
Anything that needs a fourth is a layout problem wearing a colour costume.

**Type: Geist and Geist Mono.**
Replaces Plus Jakarta Sans, which is a little rounded for 12px table text.
Geist Mono carries every hour, rate, amount and identifier, always with
`font-variant-numeric: tabular-nums`.

**Radii:** 7px control, 8px button, 10px card, 12px panel.

**Elevation:** one hairline family, `e1` to `e4`. No coloured shadows.

**Motion:** 120ms on controls, 180ms on surfaces, and `prefers-reduced-motion`
handled in the base layer. There are no infinite animations in the product.

---

## Rules

1. **No hex in JSX.** Every colour is a semantic utility. Add a lint rule.
2. **Status colour means status.** If a decorative element is emerald, "approved"
   has stopped meaning anything.
3. **One chart ramp.** `--chart-1` to `--chart-6`, used by every chart. Chart 1
   is the accent.
4. **Every figure is mono and tabular.** Right-aligned in tables.
5. **Money goes through one formatter.** `Intl.NumberFormat`, always, so
   `£11,400.00` and `€14,280.00` line up.
6. **Tables, not card grids,** for any list that can exceed a dozen rows.
7. **No `window.confirm()`.** Destructive actions use the dialog component, so
   the warning copy can be written properly.
8. **Real tables.** No CSS-grid pseudo-tables: they are not announced as tables
   and fixed pixel columns overflow rather than reflow.
9. **Never render a permanently disabled control.** It teaches people the
   product is broken.
10. **Approvers never see money.** No rate, amount, or invoice total may be
    rendered in an approver-scoped view. This is a product guarantee, not a
    styling preference.

---

## Sequence for adoption

1. **Tokens.** Land `globals.css`, delete the unreachable `:root` light block,
   add the no-raw-hex lint rule. Nothing visible ships; everything after gets cheap.
2. **Primitives.** Button, Badge, Table, Input, Card, EmptyState against tokens.
3. **Shells.** The four layouts, including a real mobile navigation for the
   consultant and approver portals, which currently have none below 768px.
4. **Screens.** ~40 pages inherit most of the reskin for free.

Update `docs/design-guidelines.md` and the public `/design-guidelines` page in
the same release, or the site becomes an advertisement for the old design.
