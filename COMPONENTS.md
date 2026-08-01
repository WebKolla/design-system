# Components

Real dimensions, taken from the approved screens. Sizes are px unless stated.

---

## Button

| Size | Height | Padding X | Radius | Text | Weight |
|---|---|---|---|---|---|
| sm | 30 | 11 | 7 | 12.5 | 500 |
| md | 34 | 14 | 8 | 13 | 500 |
| lg | 42 | 20 | 9 | 14.5 | 500 |

**Variants**

- `primary` — `bg-primary text-primary-foreground`, no border. Flat. One per view.
- `secondary` — `bg-surface border border-input text-foreground`.
- `ghost` — no border, no fill, `text-muted-foreground`.
- `destructive` — `bg-surface border border-input text-danger`. Red is the label,
  not the fill: a red button next to a table row is a mis-click waiting to happen.
- `positive` — `bg-[--ts-success-600] text-white`. Only for Approve.

**States** hover darkens to `primary-hover`; `:focus-visible` gets the 3px ring;
disabled is `opacity-45` and **still a `<button`>** with `aria-disabled` — never a
`<span>`, which is not focusable and announces nothing.

Icon + label uses `gap: 7px` and a 14px icon. Icon-only buttons are square at the
row height and require `aria-label`.

---

## Input, Select, Textarea

Height 38 (marketing) / 34 (app dense forms). Radius 8 / 7.
Border `--color-input`. Padding X 12. Text 13.5.
Label: 12.5 / 500 / `--color-muted-foreground`, `gap: 6px` above the field.
Required marker: `*` in `--color-danger`.

**Focus** `border-primary` plus `box-shadow: 0 0 0 3px var(--ring)`.
**Error** `border-danger` plus a 12.5px message below. Validate inline, on blur.
Toast-only validation after submit is not acceptable.

Dates use the `Calendar` popover. Native `type="date"` renders browser chrome
that looks foreign against everything else.

Currency, rate and hour inputs use `--font-mono` with a prefix glyph in
`--color-subtle-foreground`.

---

## Status pill

Height 20 · padding `2px 8px` · radius 6 · text 11.5 / 500 · 5px dot, `gap: 5px`.
Background `--color-{state}-bg`, border `--color-{state}-border`, text `--color-{state}`.

| State | Token | Applies to |
|---|---|---|
| Approved · Paid · Active | success | timesheet approved, invoice paid, project active |
| Submitted · Sent · Planning | info | timesheet submitted, invoice sent |
| Pending · Paused · Past due | warn | awaiting approval, tier limit, admin override |
| Rejected · Overdue | danger | timesheet rejected, invoice overdue |
| Draft · Archived · Completed | neutral | draft states, archived records |

Squared 6px, not fully rounded — a pill and an avatar should not be the same shape.
**Copy:** "Approved by timesheet approvers" is too long and wraps. Use
**"Approver signed off"**. Reports must use `danger`, not `rose`.

---

## Count badge

Height 15–18 · radius 4 · text 10.5 / 500 · mono. Sidebar counts use
`warn` for work waiting and `danger` for work overdue. Notification count is
`primary` on `primary-foreground`.

---

## Table

The default for any list that can exceed a dozen rows.

| Part | Spec |
|---|---|
| Header | h34, `bg-background`, bottom `1px --color-border`, text 11 / 500 / 0.05em caps / `--color-subtle-foreground` |
| Row | 42 comfortable, 30 compact, divider `1px --color-hairline` |
| Cell | 13 / `--color-muted-foreground`; first column `--color-foreground` |
| Numeric cell | right aligned, mono, tabular |
| Row hover | `bg-surface-raised` |
| Selected row | `bg-primary-soft` |

Toolbar above: search, filter chips, status tabs with counts. Pagination below:
"Showing 1 to 6 of 47" plus controls.

**Never** a CSS-grid pseudo-table. **Never** a permanently disabled search box.
Sortable headers carry `aria-sort`.

---

## Card and KPI

Card: `bg-surface`, `1px --color-border`, radius 10 (app) / 12 (marketing), `e1`.
Padding 16–18 compact, 22–24 standard.

KPI card: label 12 / 500 / subtle → figure 27 / 600 mono tabular → context line
11.5 / faint. Optional delta chip in `success` or `danger`.
**No coloured icon tile.** Status colour means status.

---

## Navigation

**Sidebar** 236 expanded / 52 rail. Grouped, with 10 / 500 / 0.09em caps group
labels: Overview · Manage · Work · Insight · Account · Platform. A flat
seventeen-item list is not navigation.

**Nav item** h32 · radius 6 · text 13 · icon 15.
Active: `bg-primary-soft text-primary` plus a 2px left bar in `--color-primary`.
Inactive: `text-muted-foreground`, icon `--color-subtle-foreground`.

**Topbar** h52 (app) / h60 (marketing). App topbar holds the collapse toggle,
breadcrumb, and right-aligned actions.

**Portal nav** (consultant, approver) is horizontal with a 2px underline pill on
the active item. It **must** have a mobile fallback below 768px — today it is
`hidden md:flex` with nothing behind it, so a consultant on a phone has a logo,
a bell, an avatar and no way to navigate.

---

## Dialog

Radius 12 · `e3` · max-width 480 (confirm) / 640 (form) · padding 24.
Title 16 / 600 · body 13.5 / muted · actions right-aligned, secondary then primary.

Destructive confirms name the object and state the consequence. The consultant
deactivation warning about seat release is important copy and belongs here, not
inside `window.confirm()`.

---

## Banner

Radius 10 · padding 13 / 16 · 30px icon tile · title 13 / 600 · body 12.5 / muted.
`info` for the rate-blind notice, `warn` for tier limits, `danger` for failures,
`primary-soft` for the subscription gate. Dismissible banners persist per route.

---

## Empty state

Radius 10 · `1px dashed --color-border-strong` · padding `64px 24px` · centred.
32px icon in a `--color-control` circle · heading 15 / 600 · explanation 13 /
muted / max-width 340 · primary action repeated.

Name the next action, not the absence: "Add your first client", not "No data".

---

## Skeleton

`bg-control`, matching the real layout's shape and row count. Never a spinner
inside a page — a spinner says "something is happening", a skeleton says
"here is what is arriving".

---

## Toast

Bottom right · radius 10 · `e2` · max-width 380 · 13.5 text.
Left accent bar in the state colour. Success 4s, error persists until dismissed.

---

## Chart

Bars and lines use `--chart-1` first. Grid `--chart-grid`, axis text
`--chart-axis` at 11px.

Prefer a **stacked horizontal bar** over a donut for composition: it reads faster
and takes a quarter of the space. Prefer horizontal bars with the label on the
left for ranked categories, so long project names are readable rather than
truncated to 18 characters.

---

## Week grid (timesheet entry)

The load-bearing screen for the largest user group.

Columns `266px repeat(7, 1fr) 84px`: project · Mon–Sun · total.
Cell input h32, radius 6, mono tabular, centred. Weekend columns are recessed
with `bg-background`, not removed. Empty cells show a dashed border and a
mid-dot, never a zero.

Daily totals row and weekly total are always visible.
The date field disappears, because grid position **is** the date.
Steps of 0.25. Tab moves across days, Enter moves down.
"Copy last week" is the highest-value affordance for a retainer.
