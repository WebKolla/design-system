# TimeSubmit · screen specification for Figma

Twelve screens, each a standalone HTML file you can import, plus the intent,
the reasoning, and the frame sizes for desktop and mobile.

Variables are already in your Figma file. Every value below maps to a token —
use the token, not the literal.

---

## How to use this with Figma MCP

1. Create a page per group: **Dashboard**, **Marketing**, **Components**.
2. Build desktop first at the widths given, then the mobile frame beside it.
3. Bind every fill, stroke and text colour to the imported variables.
4. Text styles: create the twelve styles in section "Type scale" below before
   building screens — otherwise you will hand-set sizes twelve times.
5. Auto layout everywhere. Gaps below are real; do not eyeball them.

---

## Frame sizes

| Breakpoint | Frame width | Content width | Gutter | Notes |
|---|---|---|---|---|
| Desktop, app | 1440 | 1440 minus sidebar | 28 | Sidebar 236 expanded, 52 rail |
| Desktop, marketing | 1440 | 1160 centred | 40 | Max content 1280 on pricing |
| Tablet | 834 | fluid | 24 | Sidebar collapses to rail |
| Mobile | 390 | fluid | 16 | iPhone 14/15 baseline |

Mobile minimum touch target is **44px**. Table rows become cards below 768.

---

## Type scale

| Style | Size / weight / tracking | Mobile size | Use |
|---|---|---|---|
| Display | 54 / 600 / -0.035em | 34 | Marketing hero only |
| Hero | 44 / 600 / -0.032em | 30 | Feature and pricing hero |
| Section | 32 / 600 / -0.028em | 24 | Marketing section heads |
| Page | 24 / 600 / -0.02em | 20 | Every app page H1 |
| Card | 18 / 600 / -0.015em | 17 | Card titles |
| Block | 15 / 600 | 15 | Sub-heads |
| Body large | 16 / 400 / 1.62 | 15 | Marketing paragraphs |
| Body | 14 / 400 / 1.55 | 14 | Default |
| Cell | 13 / 400 | 13 | Table rows |
| Caption | 12.5 / 400 | 12.5 | Helper text |
| Label | 12 / 500 | 12 | Field labels |
| Overline | 11 / 500 / 0.07em caps | 11 | Column heads, eyebrows |

Mono (Geist Mono, tabular) for **every** hour, rate, amount, date and identifier.

---

# Dashboard

## 1a · Admin overview

**Route** `/dashboard` · **File** `screens/dashboard/1a-admin-overview.html`
**Desktop** 1440 × 980 · **Mobile** 390 × 1680

An operations lead opens this to find out what is stuck. Not to admire charts.

**Psychology.** The old dashboard answered "how are we doing?" This one answers
"what do I do next?" Those are different questions and only the second one gets
acted on. The attention queue sits above the charts because a queue with buttons
on it converts; a summary requires the reader to do the interpretation and then
go and find the screen where the action lives. Four KPIs, not six, because the
eye can hold four and a sixth just dilutes the first.

The single most important number is **Approved, not yet invoiced**. It is money
earned and not yet asked for. Nothing else on the page is as actionable.

**Structure**
1. Sidebar 236, grouped nav, plan card pinned bottom
2. Topbar 52, breadcrumb left, period selector and bell right
3. Page header, title 24, context line, two actions
4. KPI row, 4 across, gap 16
5. Needs your attention, 4 rows, action button on each
6. Charts, 1.5fr / 1fr

**Mobile.** Sidebar becomes a bottom tab bar with five destinations plus More.
KPIs stack 2×2, figures drop to 22. The attention queue is the hero — full width,
each row becomes a card with the action as a full-width button beneath the text.
Charts move below and the horizontal bar chart keeps its labels; the stacked bar
becomes a legend list.

---

## 1b · Consultant weekly timesheet

**Route** `/dashboard/consultant/timesheets/new-timesheet`
**File** `screens/dashboard/1b-consultant-weekly-timesheet.html`
**Desktop** 1440 × 900 · **Mobile** 390 × 1400

The highest-frequency screen in the product, used by the largest group, every week.

**Psychology.** Weekly time entry is a memory task, not a data-entry task. The
grid works because it shows the whole week at once, so the consultant reconstructs
Tuesday by looking at Monday and Wednesday. A form that asks for one entry at a
time destroys that context and produces worse data.

**The per-row date field is deleted.** Grid position is the date. Asking for a
date inside a period already declared above it is the most redundant input in the
product.

Empty cells show a mid-dot, never a zero, because zero is a claim ("I worked no
hours") and blank is an absence ("I have not said yet"). Weekends are recessed,
not removed, because consultants do work weekends and hiding the column makes
that unrecordable.

**Structure**
1. Consultant top nav, 52
2. Header: draft state, week title with prev/next, three actions
3. Grid `266px repeat(7, 1fr) 84px`, cells 32 tall
4. Daily total row, then add-row and keyboard hint
5. Three cards: This week · Goes to · Before you submit

**Mobile.** The grid becomes **one day per screen** with a horizontal day-picker
strip at the top showing all seven days and their totals, so the week context
survives. Each project is a row with a single input. Swipe between days. Weekly
total pinned to a bottom bar with the Submit action. Never render a 7-column grid
at 390 — the cells become untappable.

---

## 1c · Approver queue

**Route** `/dashboard/timesheet-approver` · **File** `screens/dashboard/1c-approver-queue.html`
**Desktop** 1440 × 820 · **Mobile** 390 × 1200

The approver is the reluctant user. They did not choose this tool, they are busy,
and approving is not their job — it is an interruption to their job.

**Psychology.** Everything here reduces time-to-decision. The rate-blind banner
is not decoration: it tells the approver they are not being asked to make a
commercial judgement, which is the thing that makes people hesitate. Bulk approve
exists because approvers are usually signing off five identical weekly retainers
and five round trips is why timesheets sit for six days.

Row-level approve and reject sit **in the row**, so the common case never opens a
detail page. Rejection asks for a reason, because a rejection without one just
produces a resubmission of the same thing.

**Structure**
1. Approver top nav, four items
2. Header, then the rate-blind banner full width
3. Toolbar: search, project filter, period filter, active filter chip; right side
   selection count and bulk actions
4. Table `38px 1.5fr 1.05fr 1.15fr 92px 118px 96px`
5. Footnote on rejection and bulk rules

**Mobile.** Rows become cards: consultant name and avatar top, project and period
beneath, hours as a large mono figure right. Two full-width buttons at the card
foot — Approve in green, Reject as a red label. Bulk selection via long-press.
The banner stays; it is the reason they trust the screen.

---

## 1d · Invoices list

**Route** `/dashboard/invoices` · **File** `screens/dashboard/1d-invoices-list.html`
**Desktop** 1440 × 860 · **Mobile** 390 × 1100

**This is the template every list screen copies.** Get it right once.

**Psychology.** Money screens are scanned, not read. That is why every figure is
mono and tabular and right-aligned — a column where the decimal points align can
be compared at a glance, and one where they do not cannot be. Status tabs carry
counts because the count is the answer to most visits ("how many are overdue?")
and often means the person never has to open the table at all.

The primary action reads **"Invoice approved hours"**, not "New invoice", because
the label states the promise: the invoice comes from hours somebody already
signed off.

**Structure**
1. Collapsed 52 icon rail, preserving icon order and group dividers
2. Header with context line, Export CSV and primary action
3. Four KPI cards
4. Card: tab row with counts, search, filter
5. Table, 42px rows
6. Pagination

**Mobile.** Rows become cards: invoice number and status pill on the top line,
client beneath, amount as a large mono figure right-aligned. Tabs become a
horizontally scrollable chip row. Search collapses to an icon that expands to
full width. Pagination becomes infinite scroll with a count header.

---

## 1e · Consultant record

**Route** `/dashboard/consultants/[id]/edit` · **File** `screens/dashboard/1e-consultant-record.html`
**Desktop** 1440 × 820 · **Mobile** 390 × 1300

29 fields on one scroll became 7 sections with per-section state.

**Psychology.** A long form is not intimidating because it is long — it is
intimidating because you cannot see the end. Sectioning with completeness
indicators converts an unbounded scroll into a checklist, and a checklist gets
finished. "3/7" against Bank details tells you exactly what is outstanding
without opening it.

**Bank details render only the fields the country and currency require.** Seven
always-on fields, four permanently empty, teaches the user the form is not paying
attention to them.

The rates card states precedence in plain words, because "which rate actually
applies?" is the question this screen exists to answer and the answer was
previously invisible.

**Structure**
1. Topbar with unsaved-changes guard: dot, Discard, Save changes
2. Record header: 44 avatar, name, status pill, linked-account pill, meta line
3. Left sub-nav 224 with seven sections and state indicators
4. Completeness card beneath the nav
5. Right pane: Rates and billing, then Bank details

**Mobile.** Sub-nav becomes a horizontally scrollable chip row pinned under the
header, each chip carrying its state dot. One section per screen. The save bar
pins to the bottom and shows the unsaved state there. Never render a 3-column
field grid below 768 — one column, full width.

---

# Marketing

All copy is verbatim from the live site. Do not rewrite it.

## 2a · Home

**Route** `/` · **File** `screens/marketing/2a-home.html`
**Desktop** 1440 × 5200 · **Mobile** 390 × 6400

**Psychology.** The hero makes one claim and proves it 800px later with two real
product views side by side, both showing the same 40 hours, one with a Value
column and one without. Claim and proof are the same object, which is far harder
to disbelieve than an adjective.

The dark band is the only place the site raises its voice, and it earns it by
carrying the one claim no competitor makes. One dark band per page, maximum.

**"What TimeSubmit does not do"** sits on the home page deliberately. Six noes,
verbatim from the FAQ. Candour is a positioning asset for a small vendor selling
to procurement-minded buyers: the vendor who tells you the limits before you buy
is the one you believe about everything else.

**Structure**
1. Header 60
2. Hero: eyebrow, H1 54, sub, two CTAs, three proof points, product shot bleeding
   off the section bottom
3. Three feature cards with photography
4. Three capability cells
5. **Dark band**: rate-blind, two product tables, five trust points
6. How it works, 3 steps
7. Split photo and copy
8. Pricing preview, 4 cards
9. What we do not do, 6 items
10. CTA, then footer

**Mobile.** Hero H1 drops to 34, CTAs stack full width, proof points become a
vertical list. The product shot becomes a horizontally scrollable card. The two
comparison tables stack with the approver's on top. Feature cards stack. Pricing
preview becomes a horizontal snap carousel.

---

## 2b · Approval workflows

**Route** `/features/approval-workflows` · **File** `screens/marketing/2b-approval-workflows.html`
**Desktop** 1440 × 3400 · **Mobile** 390 × 4200

The pillar-page template. Time tracking and Invoicing follow the same skeleton.

**Psychology.** Structured as problem, mechanism, differentiation, audience, FAQ.
That is the order a sceptical buyer asks questions in. The FAQ at the foot is
doing SEO work and objection-handling at once, and the dealbreaker answers are
summarised on the closed row so they can be scanned.

**Structure**
1. Header, then a feature sub-nav bar
2. Split hero: copy left, photography right with a floating stat card
3. Problem, single column, 1000 wide
4. How it works, 4 steps
5. What makes it different, 6 cells
6. Who benefits, 3 cards, then the rate-blind panel on dark
7. FAQ, 5 items
8. Dark CTA with a next-page link

**Mobile.** Sub-nav becomes a scrollable chip row. Hero stacks with the photo
first at 240 tall. Step and cell grids become single column. FAQ rows keep their
summary answer on the closed state.

---

## 2c · Pricing

**Route** `/pricing` · **File** `screens/marketing/2c-pricing.html`
**Desktop** 1440 × 4600 · **Mobile** 390 × 5800

**Psychology.** The seat calculator exists because the pricing model is unusual —
a base fee covering a block, plus a rate above it — and an unusual model creates
anxiety until the buyer can see their own number. Letting them produce that number
themselves converts far better than a table they have to do arithmetic against.

Four tiers with one marked Recommended. The comparison table repeats what the
cards say because different buyers read different things, and a finance lead will
scroll straight past four cards to find a grid.

Note the honesty: **"Prices exclude VAT"** is stated, not buried.

**Structure**
1. Split hero with the free-months badge, photography right
2. Billing toggle, monthly and annual
3. Four tier cards, 1280 wide, Recommended has a primary border and a badge
4. Seat calculator: slider left, computed table right
5. Comparison table, 11 rows
6. Moving from another tool, copy plus a trust list
7. FAQ, 8 items
8. CTA

**Mobile.** Tier cards become a snap carousel with the Recommended card first.
The comparison table becomes one table per plan in an accordion, or a horizontally
scrollable grid with the capability column frozen. The calculator stacks: slider
above, result card below. The slider needs a 44px thumb.

---

## 2d · About

**Route** `/about` · **File** `screens/marketing/2d-about.html`
**Desktop** 1440 × 2600 · **Mobile** 390 × 3200

**Psychology.** A small vendor's About page is a trust document, not a history.
The alternating photo-and-copy rhythm keeps a long read moving. The six values
include **"Say what is there"**, which is the page telling you its own editorial
policy — and the FAQ then proves it.

**Structure**
1. Split hero
2. Four-stat strip, hairline dividers
3. Our story, copy left, photo right
4. Our mission, photo left, copy right
5. What we stand for, 6 cells
6. CTA

**Mobile.** Stats become 2×2. Split sections stack photo-first. Value cells single
column.

---

## 2e · FAQ

**Route** `/faq` · **File** `screens/marketing/2e-faq.html`
**Desktop** 1440 × 2400 · **Mobile** 390 × 3000

**Psychology.** The design decision here is that **the answer is summarised on the
closed row** — No · Not in bulk · Yes · Read-only. Somebody scanning for a
dealbreaker finds it without opening five accordions. Hiding a "no" inside an
accordion is a dark pattern; stating it on the closed row is the opposite, and
for this brand it is on-message.

The category rail is sticky rather than a row of anchor chips, so it stays usable
through a long page on a laptop.

**Structure**
1. Split hero, photography right
2. Two columns: sticky category rail 212, content
3. Five categories, each a bordered accordion group

**Mobile.** The rail becomes a scrollable chip row pinned below the header.
Accordions full width, 44px minimum row height. Summary answers stay visible.

---

## 2f · Contact

**Route** `/contact` · **File** `screens/marketing/2f-contact.html`
**Desktop** 1440 × 900 · **Mobile** 390 × 1500

**Psychology.** Two columns: the form and the reasons to trust sending it. Office
hours and a stated response time reduce the "will anyone actually reply?"
hesitation that kills B2B contact forms. The Enterprise card sits here because
Enterprise is the one plan you cannot buy online, so this page is its checkout.

**Structure**
1. Left: eyebrow, H1, sub, form — name and email side by side, subject select,
   message, submit
2. Right: photography 236 tall, then contact info, office hours, two cards

**Mobile.** Single column, form first. Name and email stack. Keep the honeypot.

---

## 2g · Sign in

**Route** `/sign-in` · **File** `screens/marketing/2g-sign-in.html`
**Desktop** 1440 × 680 · **Mobile** 390 × 780

**Psychology.** The auth screen is the seam between site and app, so it must carry
both. The reassurance panel speaks to the **approver** — the role most likely to
be signing in for the first time on somebody else's invitation, and least likely
to have chosen the tool.

"No account? Choose a plan to get started" matches how signup actually works:
plan first, then account. Not "start a free trial", because nothing is free
without a card.

**Structure**
1. Split 1.15fr / 0.85fr. Left dark panel: logo top, copy centre, legal bottom
2. Right: form, max-width 344, centred

**Mobile.** The dark panel becomes a 180-tall header band with the logo and one
line of copy. Form below, full width, 16px gutters.

---

# Rules that apply to every screen

1. **One accent**, in four places only: primary button, active nav marker, focus
   ring, the single most important figure on a screen.
2. **Status colour means status.** Never decorative.
3. **Every figure mono and tabular**, right-aligned in tables.
4. **No gradients, no glows, no coloured shadows.** One hairline elevation family.
5. **Photography full bleed and unfiltered**, type on a solid panel beside it —
   never over a darkened image.
6. **Light mode only.**
7. Mobile touch targets never below 44px.
8. British English, "TimeSubmit" one word, no em dashes, `·` as separator.
9. **Approvers never see money.** No rate, amount or invoice total in an
   approver-scoped view.
