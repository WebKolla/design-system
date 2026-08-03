# Components

Real dimensions, taken from the approved screens. Sizes are px unless stated.

**Ten of these have no Figma node yet.** `Card`, `Skeleton`, `Separator`,
`Textarea`, `Dialog`, `Popover`, `TableHeader`, `TableRow`, `TableCell`, and the
`dismissible` Banner and image `Avatar`, were built on 2 August 2026 ahead of
being designed, because 55 undesigned routes could not proceed without them.
Every one is derived from a component that already shipped — `Card` is the
domain cards with the domain removed, `TableRow` is `TableRowInvoice` without
the invoice columns, `Textarea` is `Input` with more than one line — and **not
one new token was introduced.** Where a derived default disagrees with what this
document used to assert, the disagreement is called out in place. Treat all ten
as unreviewed by design.

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
- `approve` — `bg-success-solid text-ink-foreground`. Only for Approve, on the
  approver queue. **Named `approve`, not `positive`** — this document said
  `positive` until 2 August 2026 and the component never did; the code is right
  and this line was wrong. `ink-foreground` rather than `primary-foreground`,
  because the latter flips to ink/950 in dark mode and puts dark text on the
  green fill at 2.98:1.

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
that looks foreign against everything else. **The `Calendar` is still not
built** — the `Popover` it needs now exists, but the picker itself does not, so
keep native `type="date"` until it does rather than improvising one.

**Textarea** shares all of the above and differs in three things only: the
height comes from `rows` rather than the 38px control height, padding is
`12 / 8` instead of vertical centring, and it carries a vertical resize handle.
`resize="none"` for a fixed box in a dense form. Nothing else about it is its
own.

**`Field` is the label, the message and the wiring; the control is a slot.**
It renders an `Input` by default, or clones whatever element is passed as
`control` — a `Textarea` above all. Measured on a `Field` wrapping a `Textarea`
in the browser run: label 12.5 / 500 in `--color-muted-foreground`, `gap: 6px`
to the control, control padding `8px 12px` on `border-radius: 8px` with a 1px
border, message 12.5 below. Identical to the `Input` case, which is the point:
`aria-describedby`, `aria-invalid` and the `htmlFor`/`id` pair are computed in
`Field` and never by the control.

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

**Sortable headers carry `aria-sort`.** This was a claim with nothing behind it
until 2 August 2026; `TableHeader` now implements it and
`Molecules/TableHeader → SortIsAnnounced` asserts it. A sortable heading is a
real `<button>` inside its `<th>`, and the `<th>` carries `ascending`,
`descending`, or `none` when another column holds the sort. Non-sortable columns
carry no `aria-sort` at all — the attribute means "this is sortable and here is
its state", not "this is unsorted". Sort state stays with the caller, as
selection and paging do.

**Generic parts.** `TableHeader`, `TableRow` and `TableCell` take a
`TableColumn[]` and arbitrary cells, for the nine list screens that have no
domain molecule. `TableHeaderInvoices`, `TableHeaderApprovals`,
`TableRowInvoice` and `TableRowApproval` stay as they are: they encode two
screens' worth of decisions a generic row cannot express. `TableCell` carries
the six typography rules the invoice row had inline — `text`, `muted`,
`numeric`, `date`, `link` and `plain`.

---

## Card and KPI

Card: `bg-surface`, `1px --color-border`, radius 10 (app) / 12 (marketing).
`padding` is `compact` 14 · `standard` 16 · `roomy` 24 · `none` — the values the
domain cards already use, not the 16–18 / 22–24 ranges this line used to give,
which nothing in the library matched.

`elevation` defaults to **`none`**, not `e1`: every app card here is flat today
and only `StatCell` and `Toast` carry a shadow. `e1` and `e2` are offered rather
than imposed. Worth a designer settling.

`Card` imposes no layout. Pass `flex flex-col gap-*` for the stack the domain
cards use; a container that forces a layout is not neutral. `padding="none"` with
`clip` for content that paints to the edge — a table, an image.

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

Built on Radix, which supplies the focus trap, focus restoration to the trigger,
and Escape. `Popover` is built on the same vendor deliberately: two focus
implementations in one product is one too many.

---

## Popover

The one floating surface. Radius 10 · `e2` · `bg-surface` · 6px side offset ·
`--z-dropdown`.

`modal` defaults to **`true`**, unlike Radix: modal is what gives the surface its
focus trap, and an overlay that leaves focus loose behind it is reachable by
mouse and invisible to a keyboard.

Every select, menu, notification list and — when it exists — the date picker is
built on this. A second positioning layer is a second design system.

`label` is required. The surface is a `dialog` to assistive technology, so
without one it announces as "dialog" and nothing else.

---

## Separator

1px of `--color-hairline`, horizontal or vertical. Decorative by default.

**Prefer the list component's own divider.** Table rows carry
`border-b border-hairline` and `FaqAccordionRow` suppresses its own on the last
item; a divider that belongs to the list can do that without the parent counting
children. `Separator` is for two unrelated blocks stacked in a panel, which is
what it is actually used for.

---

## Banner

Radius 10 · padding 13 / 16 · 30px icon tile · title 13 / 600 · body 12.5 / muted.
`info` for the rate-blind notice, `warn` for tier limits, `danger` for failures,
`primary-soft` for the subscription gate.

**`dismissible` is opt-in and defaults to `false`.** That default is a product
guarantee, not a convenience: the rate-blind banner on the approver queue must
have no close control, and `BannerIsUndismissable` on
`Pages/1c · Approver queue` asserts it. Opt in for guidance already read — page
instructions, a cookie notice — never for a state the user needs to keep seeing.

**Dismissal state belongs to the consumer.** The component renders the control
and reports the press; it never touches `localStorage`. Whether a dismissal
persists per browser, per account, or not at all is a product decision the
library cannot make. (The product's existing per-browser `localStorage` key is
one answer to that, not the only one.)

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

Shapes: `text` 12px bar on `radius/pip`, `block` 34px on `radius/control`,
`circle` 34px. All three are starting points; override the height when the real
element is a different height, because the point is that it is the shape of what
is arriving.

The first skeleton in a group carries the accessible label and the rest pass
`label={null}`, so a table of twelve skeleton rows announces "loading invoices"
once rather than twelve times.

---

## Avatar

Initials at 20 · 26 · 34 · 44. 44 alone is a rounded square: at that size a
circle reads as a social profile picture, and this is a record, not a person
page.

An optional `src` puts a photograph in the same circle. `initials` stays
required and is the fallback — an expired signed URL, a failed load and a user
who never uploaded one all land back on it, rather than on a broken-image glyph
in a 20px circle. The only real photograph in the product is the account picture
Clerk holds.

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
