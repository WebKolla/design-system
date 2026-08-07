# NOTES

Running log of decisions, Figma defects, and deviations from the brief.

---

## Source material — discrepancies found at kickoff (2026-08-02)

### `timesubmit-storybook-spec.md` does not exist

The brief lists it as "in repo". It is not in the repo, and no file of that name
exists anywhere on this machine. The closest match — and the file the handoff
JSON itself names as source of truth — is:

- `~/Downloads/screens/SPEC.md` (433 lines, "TimeSubmit · screen specification for Figma")

I have copied it to `docs/SPEC.md` and am treating it as the `SPEC.md` referenced
in the precedence rule (Figma variables > SPEC.md > marketing HTML).

**Needs confirmation:** it is a *screen* specification (frame sizes, type scale,
per-screen intent), not the "hierarchy, token model, layout rules, drift table"
the brief describes. Most of that content is in the brief itself. If a separate
storybook spec exists, it has not reached this machine.

### `timesubmit-figma-handoff.json` found, and it is stale

Found at `~/Downloads/timesubmit-figma-handoff.json`, copied to `docs/`.

Its `status` reads *"Foundations + 34 components complete"* and lists 12
components under `remainingComponents` — including Toast, Empty state, Site
header, Site footer, Section header, Pricing tier card, Dark CTA band and
Button · Ink.

The brief gives concrete Figma node IDs for all of those (Toast `90:12`,
SiteHeader `76:115`, PricingTierCard `85:106`, ButtonInk `89:62`, …), all in a
node range (`76:` – `92:`) above anything the handoff knows about (max `70:9`).

**Conclusion:** the components were built *after* the handoff JSON was written.
The brief is newer and wins. The handoff remains useful for collection IDs,
mode IDs, effect style IDs and the API gotchas. Its `status`,
`remainingComponents` and `remainingScreens` fields are out of date — do not
plan from them.

Verified directly: `ButtonInk` at `89:62` resolves and returns bound variables
(`--color-ink`, `--color-ink-border`, `--color-ink-foreground`), so those late
components genuinely exist in the file.

### Component count is 48, not 47

The brief's three tables list 52 components. Four are explicitly marked as not
existing in Figma (Input, DataTable, WeekGrid, AccordionGroup), leaving **48**
with Figma nodes, against a stated 47. Off by one somewhere; not blocking.
Flagging so the discrepancy isn't discovered as a "missing" component later.

### The marketing HTML zip

`~/Downloads/TimeSubmit UX positioning-claude.zip` exists (spaces in the
filename, not underscores as the brief writes it). Not opened — per §2 it is a
rendering artifact with known drift and must never be a source of token values.

---

## Figma MCP behaviour

**Page listing is incomplete.** `get_metadata` with no `nodeId` returns exactly
one top-level page — `33:284 Cover` — and that page reports `width=0 height=0`.
The handoff lists ten `keyPages`. Reading those pages *by ID* works correctly
(`33:293` returns the full Button page with all 15 variants plus Button · Ink).

**Consequence:** never enumerate the document, always navigate by node ID from
`docs/timesubmit-figma-handoff.json` and the brief's tables. This matches §10's
instruction to read nodes by ID, and is unrelated to the `starter` plan.

**Chrome DevTools MCP conflicts with a running Chrome.** `new_page` fails with
*"browser is already running for .../chrome-profile"*, including with
`isolatedContext`. Visual comparison against Figma nodes is a definition-of-done
requirement from Phase 2 onward, so this needs resolving before then — either
close the running Chrome, or drive Storybook through the `agent-browser` skill
instead.

---

## Phase 0 — decisions

### Storybook 10.5.5, not 8

The brief says "Storybook 8+". Installed **10.5.5** (current latest), which
satisfies that. Chosen deliberately over 8 because `@storybook/addon-mcp`
requires Storybook 10.3+, and the `@storybook/claude-code-plugin` requires 10.5+.
Both are now in use, giving the agent a feedback loop against the real rendered
component rather than against its own assumptions.

`eslint-plugin-storybook` was pinned to `^10` — the `^9` range resolves to
9.1.20, whose peer range excludes Storybook 10 and fails install.

### The trivial Phase 0 component is `Icon`

Phase 0 asks for "one trivial component" to prove the scaffold. I used the real
`Icon` atom rather than a throwaway, because it is genuinely trivial *and*
because it is the one atom immune to Phase 1 token churn — it sets no colour at
all, inheriting `currentColor` per §4. Nothing about it needs revisiting once
the real tokens land.

Its 5 stories are registered and the Storybook production build succeeds.

### `src/tokens/globals.css` is a marked placeholder

Phase 1 replaces this file wholesale. Until then it defines only the handful of
tokens needed to prove the scaffold renders. Every value carries a provenance
comment: `[figma]` for values already read from the file via `get_variable_defs`
(these are authoritative), `[stub]` for placeholders that are **not** design
decisions.

**Do not build components against the current file.**

### The old `globals.css` has been archived, not read

Per §2, the product's existing `globals.css` is an output, not an input. The
tracked v0.1 copy has been moved to `.archive/globals.v0.1.css` so it cannot be
imported or referenced by accident. It has not been read.

Note: the four v0.1 files (`COMPONENTS.md`, `MIGRATION.md`, `README.md`,
`globals.css`) were **deleted from the working tree** but still present in commit
`4e281ff` when I picked this up. I restored them before archiving.

### Lint rules

Two `no-restricted-syntax` rules, both verified to fire against a probe file:

1. **No raw hex outside `src/tokens/`** (§5.1) — covers string literals,
   template literals and JSX attribute values. Regex is word-boundary anchored
   so it does not false-positive on Figma node IDs or `href="#pricing"`.
2. **No external margin on components** (§7.5) — bans `m-*`/`mt-*`/`-mx-*` etc.
   in `src/components/**`, excluding stories (a story legitimately spaces its
   own demo layout).

**Gap:** ESLint does not lint CSS, so the no-hex rule cannot cover a `.css`
file. Currently the only stylesheet is `src/tokens/globals.css`, which is
exempt by design. If component-level CSS ever appears, add stylelint.

### Theme switching

A `theme` toolbar global with `light` / `dark` / **`both`**. `both` renders the
story twice side by side, which §5's definition of done requires for the
Foundations story and which makes every other component reviewable in one pass.
Implemented as a `.dark` class on a wrapper — never two sets of Tailwind
classes, per §5.2.

`a11y` is configured with `test: 'error'`, so a violation fails the story rather
than reporting quietly.

---

## Phase 1 — token layer

### Read from Figma (authoritative)

One `use_figma` read-only call returned the whole set. Counts match the brief
exactly: **Primitives 59, Color 50 (Light + Dark), Radius 6, Spacing 9**, plus
**24 text styles** and **4 effect styles**.

### Open question §13.3 — RESOLVED, not guessed

`color/chart-grid` and `color/chart-axis` "do not resolve to plain colour
values" because they are the **only second-order aliases in the Color
collection**. Every other Color variable aliases a *Primitive*; these two alias
another *semantic Color token*:

- `color/chart-grid` → `color/hairline`
- `color/chart-axis` → `color/faint-foreground`

Both are therefore correct in both modes for free, following whatever their
target resolves to. Emitted as `--color-chart-grid: var(--color-hairline)` and
`--color-chart-axis: var(--color-faint-foreground)`. No value invented.

### `ink/*` mode-invariance — verified

All eight `ink/*` tokens alias the same primitive in Light and Dark in Figma,
and read back byte-identical from the browser in both modes
(`inkInvariant: true`, zero diffs). They are emitted once and never overridden
in `.dark`.

### The `mix/*` primitives — 14, not 3

§5 notes three tokens were `color-mix()` and were resolved to static hex.
Figma actually holds **14** resolved `mix/*` primitives — the three named
(`primary-soft`, `primary-border`, `ring`, each × Light/Dark) plus the eight
dark-mode status bg/border pairs. The two hex values the brief calls out are
confirmed exactly: `#ECF2F2` and `#C5D5D8`. No `color-mix()` is reintroduced.

### `@theme static` vs `@theme inline` — a real trap

First cut used `@theme static` for everything so all tokens are emitted (the
default tree-shakes unused ones, which would break portability back to the
product app). Verification then showed `--color-card` was `#ffffff` in **both**
modes and `--color-chart-grid` was frozen at its Light value.

Cause: under `static`, Tailwind resolves intra-theme `var()` references at
build time, so any *second-order* alias freezes at Light.

Resolution: two blocks.
- `@theme static` — primitives and first-order semantic tokens. Always emitted.
- `@theme inline` — second-order aliases only (`chart-grid`, `chart-axis`, and
  the whole shadcn block). `inline` keeps the `var()` inside the generated
  utility so it resolves per element and follows the mode.

### Figma defect found (not fixed — read-only per §2)

`ink/850` and `ink/900` hold the **same value, `#131e20`**. One of them is
likely wrong: `color/ink-raised` → `ink/850` and `color/surface` (Dark) →
`ink/900` are meant to be distinguishable surfaces but currently render
identically. Flagged for the Figma file; the generated CSS reproduces Figma
faithfully rather than inventing a difference.

### Tokens defined in code rather than derived from Figma

Each is marked `[code]` in `globals.css`.

| Token group | Values | Why it is not in Figma |
|---|---|---|
| `--font-sans`, `--font-mono` | Geist / Geist Mono + system fallbacks | Figma stores only a family name; it has no concept of a fallback stack |
| `--breakpoint-mobile/tablet/desktop` | 390 / 834 / 1440 | From SPEC §Frame sizes. Figma frames are fixed widths, not breakpoints |
| `--ease-standard`, `--ease-out-soft` | two cubic-beziers | Figma has no motion tokens |
| `--duration-control`, `--duration-surface` | 120ms / 180ms | ditto. Values from the v0.1 README's stated motion rule |
| `prefers-reduced-motion` reset | base layer | Not expressible in Figma |
| `--focus-ring-width`, `--focus-ring-offset` | 2px / 2px | The *colour* (`color/ring`) exists in Figma; width and offset do not |
| `--z-sticky … --z-toast` | 100–500 | Figma has z-order, not a named scale |
| shadcn mapping block | aliases only | Exists purely to satisfy shadcn/Radix internals; no new values |

Deliberately **not** invented: no extra spacing steps, no extra radii, no
additional colour ramps. Every unused token is a maintenance cost.

### Contrast findings from the Foundations story

Measured live from the rendered DOM, Light mode, against each token's intended
background. Several are expected; three are not.

---

## Figma write-back — 2026-08-02

§2 made Figma access read-only **for the library build**. That was lifted by an
explicit instruction to fix the defects and push the token changes back. All
writes below were made through `use_figma`, each verified by reading the file
back and by screenshot.

### The black-rendering defect — root cause found and fixed

`Button` Primary and Secondary rendered black at Medium and Small. The audit
found **11 paints across the file** whose bound variable disagreed with the
paint's own colour:

| Where | Variable | Painted | Should be |
|---|---|---|---|
| Button Primary Medium, Small | `color/primary` | `#000000` | `#16606b` |
| Button Secondary Medium, Small (fill + stroke) | `color/surface`, `color/input` | `#000000` | `#ffffff`, `#dedee4` |
| Button Secondary Medium, Small labels | `color/foreground` | `#000000` | `#16161c` |
| SiteFooter column headings ×3 | `color/ink-faint` | `#ffffff` | `#5e7274` |

The three footer headings were a defect nobody had reported — they rendered
white instead of faint grey.

Cause is the gotcha the handoff already records: **`setBoundVariableForPaint`
returns a new paint and must be reassigned.** During the original build the
binding was written but the paint's own colour never was, leaving a dangling
binding over a default colour.

**My first repair attempt did nothing.** Calling `setBoundVariableForPaint` on
the existing paint re-attaches a binding that was already there and leaves the
stale literal untouched — it reported eight nodes "mutated" while changing
nothing. The working fix rebuilds the paint with the resolved colour *and* then
binds it. Re-audited afterwards: **0 mismatches file-wide.**

### Variable changes propagate correctly

Worth recording, because the above could suggest otherwise: after re-aliasing
`color/input`, a bound stroke updated from `#dedee4` to `#74747f` on its own.
Figma propagation works. The 11 were genuinely broken bindings, not evidence
that literals always win.

### What changed in Figma

| Change | Detail |
|---|---|
| `color/input` re-aliased | Light `neutral/250` → `neutral/500`, Dark `ink/600` → `ink/500`. Now 4.32:1 and 3.58:1, clearing WCAG 1.4.11 |
| `color/focus-ring` added | New variable aliasing `color/primary` in both modes, scoped to stroke and effect only |
| `color/ring` description | Rewritten to say it is the soft halo and never the sole indicator |
| Button icon side | Moved from leading to trailing in **all 15 variants**; description updated |
| 11 paints repaired | Listed above |

Every changed variable and the Button set carry a dated description explaining
the reason, so the next person reading the file does not have to find this
document.

### Code and Figma now agree

Two entries below are no longer deviations — Figma has been brought in line:

- **`color/input`** — pushed. Code and Figma both `neutral/500` / `ink/500`.
- **Icon side (§13.1)** — pushed. Figma is now trailing, matching the code, the
  component sheet and all seven marketing pages.

### Focus ring is now a generated token, not a code-invented one

`--color-focus-ring` is retagged from `[deviation]` to `[figma]
color/focus-ring → color/primary`. The emitted value is unchanged, because the
Figma token aliases primary — what changed is provenance: re-point the alias in
Figma and regeneration follows, instead of the decision living only here.

It stays a plain per-mode custom property rather than moving into `@theme`,
and the reason is worth keeping: it is a **second-order alias**. Under
`@theme static` that resolves at build time and freezes at the Light value;
`@theme inline` fixes the utilities but emits no variable, and the base layer
consumes this through `var()`. A plain property declared in both `:root` and
`.dark` is the only form that satisfies both. Verified: `#16606b` Light,
`#35a5b2` Dark.

`color/input`'s comment is likewise no longer a deviation note — Figma matches.

### RESOLVED — `ink/900` set to `#111a1c`

Both `ink/850` and `ink/900` held `#131e20`, making `color/ink-raised` and
dark-mode `color/surface` indistinguishable. Value supplied by the user and
pushed on 2026-08-02; the variable carries a dated description explaining it.

Only one token depends on it: `color/surface` in Dark. The dark elevation stack
is now three distinct, correctly-ordered levels:

| Token | Before | After |
|---|---|---|
| `background` | `#0e1719` | `#0e1719` |
| `surface` | `#131e20` | **`#111a1c`** |
| `surface-raised` | `#1a272a` | `#1a272a` |
| `ink-raised` | `#131e20` | `#131e20` |

Dark `surface` still measures 17.67:1 against foreground, and it is no longer
the same colour as `ink-raised`. `globals.css` updated to match.

**All four Figma defects are now closed.**

---

### RESOLVED 2026-08-02 — two token deviations, on instruction

Both are deliberate departures from Figma and **must be pushed back to the
Figma file**, or code and design will drift.

| | Figma | Code now | Light | Dark |
|---|---|---|---|---|
| Focus indicator | `color/ring` `#dfe7e9` | `--color-focus-ring` → `color/primary` | **6.72:1 pass** | **6.21:1 pass** |
| `color/input` | `neutral/250` `#dedee4` | `neutral/500` / `ink/500` | **4.32:1 pass** | **3.58:1 pass** |

`color/ring` itself is **unchanged**, and still measures 1.17:1. That is
correct: it is retained for its shadcn role as the soft `ring-ring/50` halo
behind a border, where it is not the indicator. The Foundations story labels it
as such so the sub-threshold reading is not mistaken for a defect.

`color/input` was re-aliased to the nearest **existing** primitive that clears
3:1 in each mode. No new value was invented. The only alternative would have
been a new `neutral/450` around `#8f8f9a` to land nearer exactly 3:1 —
available if `neutral/500` reads too heavy on a resting input border.

**A CSS trap worth recording.** The first attempt declared
`--color-focus-ring: var(--color-primary)` once, at `:root`, and it stayed
`#16606b` in dark mode (2.53:1 — still failing). A custom property's `var()` is
substituted on the element that *declares* it, so `:root` bakes in the Light
value and descendants inherit that already-resolved result instead of
re-resolving. It must be declared in `.dark` as well, like every other semantic
token. Putting it in `@theme inline` does not work either — `inline` only
inlines into generated utilities, and this token is consumed through `var()` in
the base layer, not through a utility.

### Not changed — reported only

The Foundations story also flags these. None were in scope; all are current
Figma values.

- **Status borders**, Light 1.12–1.19:1 (`success-border`, `warn-border`,
  `danger-border`, `info-border`, `neutral-border`). Tint edges on tinted
  fills, directly analogous to `primary-border` — probably fine, same category.
- **Dark-mode status text below 4.5:1**: `success` 3.94, `info` 3.43,
  `danger` 3.17, and `success-solid` 2.98 (white on the solid fill). These are
  text colours, so unlike the borders they are a genuine AA question.
- `subtle-foreground` 4.32:1, `chart-3` 2.58:1, `chart-6` 1.73:1 — as before.

### Superseded — original finding

**`color/ring` at 1.17:1.**
`#dfe7e9` on `#f7f7f9`. §5 says the focus-ring colour token exists in Figma and
should be used, so the base layer currently does exactly that:
`:focus-visible { outline: 2px solid var(--color-ring) }`. At 1.17:1 that
indicator is effectively invisible, and WCAG 2.4.11 / 1.4.11 require 3:1.

Two readings, and this is not mine to pick:
- `color/ring` is meant as a *soft halo* behind a `border-ring` edge — which is
  how shadcn uses it (`focus-visible:border-ring focus-visible:ring-ring/50`).
  If so, the token is fine and **my base-layer rule is wrong**.
- `color/ring` is meant as the visible indicator, in which case the Figma value
  is too light and needs changing.

`color/primary` measures 7.19:1 and would pass comfortably. Not changed
pending a decision — flagged rather than silently swapped.

**Needs a decision — `color/input` at 1.25:1.** Form control borders are
non-text UI and want 3:1 under WCAG 1.4.11. `#dedee4` on `#f7f7f9` is well
under. Affects every Field, Input, Checkbox and Toggle in Phase 2/3.

**Marginal — `color/subtle-foreground` at 4.32:1.** Just below the 4.5:1 AA
threshold for body text. Fine for incidental text, not for anything a user has
to read. Worth knowing before it lands in table captions and helper text.

**Charts below the 3:1 graphical threshold:** `chart-6` 1.73:1 and `chart-3`
2.58:1 against surface. A six-series chart currently has two series that are
hard to separate from the background. `chart-1` 7.19, `chart-2` 4.87,
`chart-4` 4.48, `chart-5` 3.46 all pass.

**Expected and correct, not defects:**
- `faint-foreground` 2.26:1 and `ink-faint` 3.58:1 — decorative by definition
- `border` 1.18, `border-strong` 1.39, `hairline` 1.07, `ink-border` 1.26 —
  separators, not affordances; the story labels them as such
- `primary-border` 1.41 — a tint edge, paired with a filled surface

**The §8.5 trap is now demonstrated, not described.** The Foundations story
renders the same CTA line twice on ink: `muted-foreground` measures **1.92:1**
and is visibly unreadable; `ink-muted` measures **11.56:1**. This is the bug
that shipped as an invisible arrow icon on the dark CTA band, and it now fails
loudly in the story rather than living in a comment.

### Phase 1 — remaining

- [x] **Foundations story** — all 45 semantic entries in 7 groups, each with
      resolved value, the background it is measured against, contrast ratio and
      a pass/below verdict. Values are read from the live DOM via a probe
      element, not transcribed, so a token change updates the story with no
      edit. 48 rows render, zero unresolved.
- [x] **Type story** — all 24 Figma text styles in 4 groups. Desktop from
      Figma; the mobile step from SPEC, shown only for styles that actually
      change size (Display 54→34, Hero 44→30, Section 32→24, Page 24→20,
      Card 18→17, Body large 16→15). Plus a tabular-figures column proving
      `£11,400.00` and `€14,280.00` share a column edge.
- [x] **shadcn mapping proof** — `Foundations/shadcn mapping` mounts the
      unmodified shadcn Button. All six mapped names differ across modes
      (`identical: []`): `bg-card` `#ffffff`→`#131e20`, `bg-secondary`
      `#f1f1f4`→`#1a272a`, `bg-accent` `#ecf2f2`→`#192f32`, `bg-destructive`
      `#a81f26`→`#c0555b`. Button resolves `#16606b`/white in Light and
      `#35a5b2`/`#0e1719` in Dark at 8px radius. This is what caught the
      `@theme static` freezing bug.
- [x] **Webfonts** — `@fontsource-variable/geist` and `geist-mono`, imported in
      `.storybook/preview.tsx` rather than `globals.css` so the token file stays
      portable to the product app. Note the packages register the families as
      **"Geist Variable"** / **"Geist Mono Variable"**, so both those names and
      the plain `"Geist"` / `"Geist Mono"` the product app uses are listed in
      the stacks. Verified: body computes to `"Geist Variable", Geist, …`.

The stock shadcn Button lives at `src/components/ui/button.tsx`. The
`components.json` `ui` alias was moved from `@/components/atoms` to
`@/components/ui` so shadcn primitives never collide with our own components —
`button.tsx` and `Button.tsx` are the same path on a case-insensitive
filesystem, which would have silently overwritten the Phase 2 Button.

---

## Phase 2 — Atoms

### a11y is now a real gate

`@storybook/addon-vitest` (not `@storybook/test-runner` — the
`parameters.a11y.test: 'error'` flag is specifically the addon-vitest
integration, and test-runner would have left it inert). Every story mounts in
headless Chromium and axe runs against it.

Proven, not assumed: a probe story with a nameless `<button>` and an `<img>`
with no `alt` **failed** the run on `button-name` and `image-alt` while the
real stories passed. Probe then removed. `npm test` → 16 tests, 5 files.

Two Vite issues had to be solved to get there, both recorded in
`vitest.config.ts`: CJS deps in the axe pipeline (`aria-query`, `lz-string`,
`radix-ui` and friends) need explicit `optimizeDeps.include` or their named
exports are missing, and `resolve.dedupe: ['react','react-dom']` is required or
`radix-ui` pre-bundles its own React and every hook inside `Slot` reads null.

### `cn()` had to be taught the type ramp — systemic bug

Our 24 type tokens live in Tailwind's `text-*` namespace, which is also text
colour. tailwind-merge only knows Tailwind's built-in sizes, so it classified
`text-ui-lg` as a *colour* and dropped `text-primary-foreground` from the same
group.

Symptom: every Button variant rendered its label in the inherited foreground —
primary was `#16161c` instead of white, destructive was not red. Caught by
reading computed styles; it is invisible in a quick glance at the matrix.

Fixed in `src/lib/cn.ts` by registering the ramp under the `font-size` group.
**Any new text token must be added to that list**, or the same silent failure
returns for whichever component uses it.

### Button (node 15:53) — built

Geometry verified against the component set, exactly: Large 42 / px20 / gap8 /
`radius/button-lg` / `ui/lg`, Medium 34 / px14 / gap8 / `radius/button` /
`ui/md`, Small 30 / px11 / **gap7** / `radius/control` / `ui/sm`.

Two constraints came from the Figma component **description**, and would have
been got wrong from the pixels alone:

> "Approve is reserved for the approver queue sign-off action and nowhere else.
> Destructive is a secondary shell with danger text, never a filled red
> button — a filled red button reads as the primary action on the screen, which
> it never is."

Both are encoded in the variant table and repeated in the story docs.

### §13.1 icon side — built trailing, Figma still leading

`iconPosition` defaults to `'trailing'`, per the brief's own recommendation:
it matches the component sheet and all seven marketing pages. The Figma
variant set places the icon leading — `childOrder` is `["INSTANCE:Icon",
"TEXT:Label"]` and the description says "Icon (instance swap, leading)".

**Figma needs bringing in line**, or the next person reading the file will
reintroduce leading. `'leading'` remains available as a prop.

### Figma defect — Primary and Secondary render black at Medium and Small

`get_screenshot` on node 15:53 renders the Large row correctly (teal primary,
white secondary) but **Primary and Secondary at Medium and Small render solid
black**. Approve, Ghost and Destructive are fine at every size.

The bound variables on those same nodes are correct — `fills → color/primary`
and `fills → color/surface, strokes → color/input`. So this is a rendering or
binding-resolution fault in the file, not a design intent.

Built from the **variables**, per the §2 precedence (Figma variables > SPEC >
HTML), so the code shows teal and white at all three sizes. Not fixed in Figma —
read-only. Needs fixing there before anyone treats that frame as reference.

### Interaction states are code-defined

Figma has no hover, focus or loading variants for Button, so these are code
decisions using existing tokens:

| State | Treatment |
|---|---|
| primary hover | `primary-hover` (the token exists for this) |
| secondary / ghost hover | `control` |
| approve hover | `success` (darker than `success-solid` in Light) |
| destructive hover | `danger-bg` fill + `danger-border` |
| disabled | `opacity-50` + `pointer-events-none` |
| loading | `LoaderCircle` spinner, `aria-busy`, control disabled |

`success` as the approve hover is a *lighten* in Dark mode rather than a
darken, because no `success-hover` token exists. Worth a Figma token if the
approve button ever gets a designed hover.

### Touch target — Large is 42px, spec floor is 44px

§8.4 sets a 44px minimum touch target for mobile; the Large button is 42.
Not silently changed — the height is explicit in both Figma and SPEC. If the
44 floor is meant to bind on mobile, either Large grows to 44 there or the rule
needs an exception recorded.

### All 17 atoms built

`npm test` → **74 tests, 20 files, all passing**, every story axe-clean in both
modes. Icon · Button · ButtonInk · Chip · StatusPill · Avatar · Input ·
Checkbox · Toggle · Tab · NavItem · NavRailItem · SubNavItem · TabChipMobile ·
TabBarItemMobile · DayPickerItemMobile · WeekGridCell.

Radix underpins Checkbox (`Checkbox`) and Toggle (`Switch`); Button, ButtonInk,
NavItem, NavRailItem, SubNavItem and TabBarItemMobile use `Slot` for `asChild`.
The rest are presentational and correctly have no primitive underneath.

### The a11y gate caught a real ARIA bug

`Tab` and `TabChipMobile` set `role="tab"`, which is invalid without a
`role="tablist"` parent — axe failed 5 stories on `aria-required-parent`.

Fixed at the story level rather than by dropping the role: the atom genuinely
is only valid inside a tablist, so every story now supplies one via a meta
decorator. The constraint is documented in the story rather than worked around.
This is exactly the class of defect the gate was added for.

### Type-ramp gaps — eight sizes used by atoms are not in the ramp

Several atoms specify font sizes that have no matching Figma text style, so
they are written as arbitrary values and are **not** token-backed:

| Size | Used by |
|---|---|
| 8.5 | Avatar 20 |
| 10 | Avatar 26, DayPicker total |
| 10.5 | TabBarItemMobile label, DayPicker day |
| 11 | Chip, SubNavItem badge |
| 12 | Tab count, TabChipMobile count |
| 16 | Avatar 44 |

Not invented — every one is read from Figma. But they sit outside the 24-style
ramp, so a ramp change will not reach them. Either the ramp gains these steps
or the components move onto the nearest existing step; that is a design call,
not one I should make silently.

Note `mono/count` (10.5) exists but is Geist Mono, so it cannot serve the
TabBarItemMobile label, which is Geist.

### Small drift corrected during the build

Button Small gap was written as `gap-1.5` (6px); Figma specifies **7px**. Now
`gap-[7px]`. Caught by reading computed styles rather than by eye.

## Phase 3 — molecules

### Tables are real tables, and the columns cannot drift

§8 rule 8 forbids CSS-grid pseudo-tables — they are not announced as tables and
fixed pixel columns overflow rather than reflow. But Figma specifies the layout
as column templates, and the handoff's validation standard requires "column
grids aligned between header and row components".

Both are satisfied by splitting ownership:

- `_tables/columns.ts` holds the single column definition per table. The `fr`
  ratios from Figma are expressed as percentages, because `fr` has no meaning
  in a `<colgroup>`.
- Header molecules render `<thead><tr>` with `<th scope="col">`; row molecules
  render `<tr>` with `<td>`.
- `_tables/TableShell.tsx` supplies the `<table>`, the required `<caption>` and
  the `<colgroup>`. Stories use it to render a header or row in isolation; the
  DataTable organism will use it for real in Phase 4.

Because both components read the same definition, they cannot drift. There is
an assertion for it: `TableHeaderInvoices › AlignsWithRows` compares the right
edge of the Amount heading with the right edge of the first amount cell and
requires them to be identical.

Column grids, verbatim from Figma:
- Invoices `34 · 108 · 1.15fr · 1fr · 96 · 96 · 122 · 108 · 40` = 1332
- Approvals `38 · 1.5fr · 1.05fr · 1.15fr · 92 · 118 · 96` = 1384
- Week grid `266px repeat(7,1fr) 84px`

### The approver money guarantee is now enforced by a test

README rule 10 — "Approvers never see money" — is asserted rather than trusted:
`TableHeaderApprovals › NoMoneyColumn` fails if any column heading contains
amount, rate, total or value.

### Dual signalling on overdue rows

Per the Figma description, an overdue invoice recolours the **due date** to
danger as well as showing a danger status pill, "so the status pill is not the
only signal". Both are wired to the same `overdue` prop so they cannot
disagree.

### Harness limitation — no absolute pixel assertions in play functions

Hit three times, so recording it as a rule rather than rediscovering it.

Inside a play function under `@storybook/addon-vitest`, `getBoundingClientRect`
returns **pre-layout** values: a 42px Button measured 24, a 358px card measured
1200 (the viewport). The components were correct each time — verified in the
browser — the measurement was not.

**Rule:** play functions assert *behaviour* (clicks, focus, ARIA, text,
attributes). Layout and sizing are verified visually.

**Extended by BUG-002 — this also covers hidden elements.** The harness runs at
desktop width, so anything behind a `md:hidden` (the mobile tab bar, the mobile
list cards) is `display: none` during the test. `getComputedStyle` then reports
`0px` for padding and margin regardless of what is declared.

That produced a test that *looked* correct: removing the fix made it fail, so it
seemed to bite. It did not — it failed for the wrong reason and could never have
passed. **A test that fails for the wrong reason is worse than no test**, because
the red-then-green cycle reads as proof. For responsive-hidden elements, assert
the declared classes and verify the resolved value in the browser.

**Exception that does work:** *relative* comparison between two elements in the
same layout pass. `TableHeaderInvoices › AlignsWithRows` compares the right
edge of the Amount heading with the right edge of the first amount cell and is
reliable, because both readings come from the same (equally pre-layout) pass.
Absolute values are wrong; the relationship between them is not.

### All 27 molecules built

`npm test` → **186 tests, 47 files**, every story axe-clean in both modes.

### §8 layout rules, each proved by a story

- **Max-width, not fixed** — `SectionHeader` is `width:100%` with
  `max-width: 840px` (centre) / `1000px` (left). `AtMobileWidth` renders it in
  a 390px box and asserts `scrollWidth <= parent.clientWidth`, so the
  regression that broke the CTA band and seven instances cannot come back.
- **Hairline grids** — `StepCard` is square-cornered and borderless; the
  container owns radius, border and clipping, with 1px gaps showing the border
  through. `HasSquareCorners` asserts the cell's own radius is `0px`.
- **Don't clip overhanging children** — still to prove, on
  `PricingTierCard` in Phase 4.

### Two a11y and lint catches on the marketing four

**Duplicate landmarks.** `SectionHeader` originally rendered a `<header>`,
which is a `banner` landmark at top level — two on a page failed axe's
`landmark-unique`. It now renders a plain `div`; a section heading block is not
a page banner and the heading level carries the semantics.

**The no-raw-hex rule fired on my own story fixture.** The placeholder
photography is an inline SVG data URI, which cannot reference a CSS custom
property. Rather than weaken the rule, placeholder imagery moved to
`*.fixtures.ts` with a narrow, documented exemption in `eslint.config.js`.
**Do not widen that exemption to `*.stories.tsx`** — stories must still be
token-only.

### The missing chevron-up is a non-issue in code

§4 flags that Figma has no `chevron-up` and the FAQ open state is a rotated
`chevron-down`. In CSS that is exactly what `FaqAccordionRow` does — one glyph
with `group-data-[state=open]:rotate-180` — so nothing is missing and no icon
needed importing.

---

## Phase 4 — organisms

All 8 built. `npm test` → **220 tests, 55 files**, every story axe-clean.
Story counts: Foundations 3 · Atoms 71 · Molecules 112 · Organisms 34.

### §13.4 — the three composed APIs, for review

None of these exist as Figma components; they appear in the file only as
assemblies inside screens.

```tsx
<DataTable columns caption header pagination? empty?>{rows}</DataTable>
<WeekGrid caption days dayTotals weekTotal empty?>{rows}</WeekGrid>
<AccordionGroup type? defaultValue?>{rows}</AccordionGroup>
```

Each owns exactly what the molecules deliberately do not:

- **DataTable** — the card, the `<table>`/`<caption>`/`<colgroup>`, and
  horizontal overflow so a wide table scrolls inside its card instead of
  pushing the page sideways. Presentational only: sorting, selection and
  paging state stay with the caller. Works for both invoices and approvals by
  taking `columns` — one organism, two tables.
- **WeekGrid** — the same, plus it renders the header and total row itself
  since they are fixed for this table.
- **AccordionGroup** — the bordered 12-radius shell and the Radix
  `Accordion.Root`. The last row's divider is suppressed by the caller passing
  `last`, **not** by `:last-child`: a row may be conditionally rendered, and
  `:last-child` would then underline whichever row happened to be last in the
  DOM.

### §8.2 clipping — now demonstrated

`PricingTierCard › ClippingTrap` renders the same card twice: once in an
`overflow-hidden` wrapper where the badge is visibly sliced, once without where
it survives. The card sets no `overflow` of its own.

First attempt at this story did **not** work — I had given the clipping wrapper
top padding, so the badge sat inside the clip box and both sides looked
identical. A demonstration that does not demonstrate is worse than none.

### Latent bug found: `asChild` on the nav atoms never worked

`NavItem`, `NavRailItem`, `SubNavItem` and `TabBarItemMobile` all exposed
`asChild`, but each renders its own icon + label + badge. Radix `Slot` requires
a **single** element child, so passing `asChild` would have thrown or silently
misbehaved. No story exercised it, so 186 tests passed over a broken API — it
only surfaced when `SidebarExpanded` became the first real consumer.

Replaced with an `href` prop on all four: `<a>` when given, `<button>`
otherwise. `Button` and `ButtonInk` keep `asChild` and are correct, because
they pass `children` straight through when it is set.

One documented cast each (`ref as never`) — TypeScript cannot union the two
elements' prop and ref types without a full polymorphic generic, which is a lot
of machinery for a two-case switch. The public props stay fully typed.

### Side-by-side stories removed for landmark components

`SiteHeader` renders a `banner` and `SiteFooter` a `contentinfo`. Rendering
either twice for a mode comparison creates duplicate landmarks and fails axe's
`landmark-unique` — a defect in the comparison, not the component. Those two
`BothModes` stories are gone; the Theme toolbar still switches modes on every
other story, and ink invariance is already proved in Foundations.

---

## Page phase — started

§1 scoped pages out **of the library phase** and said they exist so a later
phase can assemble them from the library. This is that phase.

**Assumption, stated rather than asked:** pages are built as `Pages/*` stories
in this repo, composed purely from the library. That is what §1 said they were
for, and it proves the library actually assembles into the screens. If they
should instead be emitted into the product app, that is a different target and
worth saying before the remaining eleven are built.

### The Figma file has moved on since the handoff

All **24 screen frames now exist** — 12 screens × desktop + mobile. The handoff
lists 2a–2g as `remainingScreens`; they are built. The 16 photographs are also
now uploaded to the `Photography · staging` page (`70:9`), which the handoff
records as "NOT YET IN FIGMA".

### Shells

`AppShell` and `MarketingShell` are layout only — they compose library
components and introduce no new visual decisions.

`AppShell` has the three responsive states from SPEC: 236px sidebar at ≥1280,
52px rail at 834–1279, bottom tab bar below 834. **The rail is generated from
the same destination list as the sidebar**, so icon order and grouping cannot
drift between the two — the pairing note on `NavItem`/`NavRailItem` is enforced
by construction rather than by discipline.

### Three app chromes, not one

Checking the frames rather than extrapolating from 1a was worth it:

- **Admin sidebar/rail** — 1a, 1e
- **Portal top nav** — 1b consultant, 1c approver. Three to five destinations,
  not thirteen, and both screens want the full width.
- **1d sits on the 52px rail even at 1440** — a nine-column table wants the
  horizontal space more than the sidebar wants to be legible. `AppShell` takes
  `collapsed` for this.

The rail is generated from the same destination list as the sidebar, so the
"keep icon order identical" pairing note on `NavItem`/`NavRailItem` is enforced
by construction rather than by discipline.

### Photography

The 16 originals were copied from `screens/uploads/*.webp` in the UX
positioning bundle, **not** re-exported from Figma — Figma holds the same
images, so exporting from there would only add a generation of loss. 1.1 MB
total, in `src/assets/photography/`.

Alt text lives in `src/assets/photography/index.ts` beside each import rather
than at the call site, so one photograph cannot acquire two different
descriptions on two pages. It describes what the image shows, not what the
section argues — the copy already carries the message.

### All 12 screens built

| | Screen | Chrome |
|---|---|---|
| 1a | Admin overview | sidebar |
| 1b | Consultant weekly timesheet | portal |
| 1c | Approver queue | portal |
| 1d | Invoices list | rail |
| 1e | Consultant record | sidebar |
| 2a–2f | Home, Approval workflows, Pricing, About, FAQ, Contact | marketing |
| 2g | Sign in | none — two panels |

Product rules asserted at **page** level, not just component level:

- 1b — no cell in the week grid renders a zero
- 1c — no currency symbol anywhere in the approver-scoped view, and the
  rate-blind banner has no dismiss control
- 1e — the completeness bar is announced and the cost-rate error is
  programmatically associated

### a11y caught a heading-order break on Pricing

The hero is `h1` and the tier cards are `h3`, with nothing between — the Plans
section had no heading at all. Fixed with a visually-hidden `<h2>Plans</h2>`
rather than by demoting the cards: the section genuinely needs a name, it just
does not need a visible one above four cards that are self-evidently the plans.

### Still open

- [ ] a11y addon is configured with `test: 'error'` but has not been asserted
      in CI — there is no Storybook test-runner in the project yet, so "no
      violations" is currently unproven for these stories.

---

## Open questions outstanding

Carried from §13, none yet decided:

1. **Button icon side** — recommendation is trailing default. Not yet built.
2. **Input atom** — must be extracted from `Field` (`37:42`); API not yet confirmed.
3. **`color/chart-grid` / `color/chart-axis`** — do not resolve to plain colours
   via the API. To be inspected in Phase 1.
4. **DataTable / WeekGrid / AccordionGroup** — composed APIs need review before
   the page phase depends on them.

---

## Contrast remediation pass — 2026-08-02

Closes every item left open under "Contrast findings from the Foundations
story". After this pass the Foundations/Colour table has **zero FAIL rows in
either mode**, verified by reading the rendered page rather than by
recalculating. Every value below was pushed back to Figma as well as to
`globals.css`.

The `*-border` tokens still read `BELOW`. That is the expected category, not a
failure — they are tint edges on tinted fills, the same case as
`primary-border`, and the story labels them as such.

### Dark-mode status text — 500 step → 400 step

`success`, `info` and `danger` measured 3.94, 3.43 and 3.17 on their own tinted
backgrounds, against 4.5 for text. Each new step keeps the hue and saturation
of the 500 and raises lightness to match what `warn/500` already measured
(5.05:1), so the four status colours now sit at the same perceived weight.

| Token | Value | Measured on its tint |
|---|---|---|
| `success/400` | `#47b083` | 5.06:1 |
| `info/400` | `#799ed2` | 5.08:1 |
| `danger/400` | `#d2868a` | 5.08:1 |

### `success-solid` — the label, not the fill

White on the solid fill measured 2.98:1 in dark. The fill is correct; the
label was wrong. The Approve button variant now uses `text-ink-foreground`
rather than `text-primary-foreground`, because the latter flips to `ink/950` in
dark mode and puts dark text on a green fill. Now 6.11:1.

This one is worth remembering: a `*-foreground` token is only safe on the
surface it is named for. On a *solid status* fill, use an ink token.

### Light-mode charts — below the 3:1 graphical threshold

Two of six series were hard to separate from the surface. Both moved down one
ramp step; no new primitives.

| Series | Was | Now | Light on surface |
|---|---|---|---|
| `chart-3` | `warn/500` 2.58:1 | `warn/600` `#aa8230` | 3.53:1 |
| `chart-6` | `muted/500` 1.73:1 | `muted/600` `#878798` | 3.53:1 |

`chart-grid` and `chart-axis` are second-order aliases (`color/hairline` and
`color/subtle-foreground`), so they cannot live in `@theme static` — they are
plain custom properties declared in **both** `:root` and `.dark`. Same trap as
`--color-focus-ring`.

### `subtle-foreground` — the ramp step, not the alias

Light measured 4.32:1 against background, just under AA for body text. The
alias points at `neutral/500`, so the choice was to re-point it at a new step
or to darken the step in place.

A consumer audit in Figma found `neutral/500` has exactly two dependents:
`color/subtle-foreground (Light)` and `color/input (Light)`. Input needs 3:1
for a non-text border and only gains from a darker value, so darkening in place
was safe and avoided adding a ramp step nobody else would use.

`#74747f` → `#6d6d78`. Now 4.78:1 on background and 5.11:1 on surface.
`#71717c` would have cleared it at 4.51:1, but a two-hundredths margin is not a
margin.

Dark mode was never affected — `subtle-foreground` there is `ink/400`, which
measures 6.23:1.

---

## Button Large touch target — 2026-08-02

Large is 42px because Figma and SPEC both state 42px, and 44px is the floor
Apple's HIG and WCAG 2.5.5 use. Rather than change a height the design owns,
the hit area is widened with a transparent `::after` sitting 1px proud top and
bottom. The button measures **44 to a finger and 42 to the eye**, so nothing
in Figma has to change and nothing on screen moves.

Deliberately **not** applied to Medium or Small. Taking 30px to 44px puts 7px
of invisible target on each side, which overlaps the next control in any
toolbar tighter than `gap-4` — a worse bug than the one being fixed. Those are
desktop-density controls; anything meant for a thumb uses Large.

The `TouchTarget` story asserts it with a real hit test: `elementFromPoint` one
half-pixel above the visible top edge has to return the button. Asserting the
height would return 42 and prove nothing.

### The reason that test could not pass at first — no CSS in the test run

The first version of the assertion failed with `position: static`, and the same
code was demonstrably correct in the browser. Dumping every loaded rule from
inside the play function showed the cause: **the utility CSS was not there at
all.** Total stylesheet content was 18kB, and `.h-[42px]` — which every Button
story had supposedly been passing with for weeks — was absent.

`vitest.config.ts` declares its own plugin list, and Vitest reads it *instead
of* `vite.config.ts`. `@tailwindcss/vite` lived only in the latter. So
`@import "tailwindcss"` at the top of `globals.css` resolved to nothing: the
`@theme` custom properties loaded, and not one utility class did.

The Storybook dev server never had the problem, because react-vite merges
`vite.config.ts`. That is precisely why it survived so long — every story looked
right in the browser and passed in CI.

**What this invalidates.** Behaviour, ARIA, role, text and attribute assertions
are all unaffected; they never depended on styling. But axe's `color-contrast`
rule was measuring unstyled browser defaults, so **every green contrast result
in this project before today proved nothing.** The Foundations/Colour page was
never affected — it measures the real rendered DOM in a real browser.

With the plugin added, the suite goes from 252 passing to **189 passing and 64
failing across 26 files**, all colour-contrast:

| Foreground | On | Ratio | What it is |
|---|---|---|---|
| `#a6a6b0` | various light | 2.13–2.41 | `faint-foreground` used as real text — the bulk of it |
| `#5e7274` | `#0e1719` | 3.57 | `ink-faint` as text on ink |
| `#878798` | `#f1f1f4` | 3.13 | `muted/600` as bold 10.5px |
| `#87878b` | `#f7f7f9` | 3.34 | 12.5px label |
| `#45454f` | `#0e1719` | 1.91 | a light-mode token inside a dark region — the "contrast on ink is not automatic" trap, shipped again |

18 usages of `text-faint-foreground` across 12 files and 4 of `text-ink-faint`
account for nearly all of it. Both tokens are documented as decorative, so
either they are being misused and the call sites move to `subtle-foreground`,
or Figma's design genuinely specifies faint text at 11px and the tokens have to
darken. **That is a design decision and is not being made unilaterally.**

### Resolved — the 64 contrast failures

Direction taken: **move the call sites, keep the ramp.** `faint-foreground` and
`ink-faint` stay exactly where Figma has them and remain decorative; the code
stops using them for text. 22 call sites moved.

| Was | Now | Where |
|---|---|---|
| `text-faint-foreground` | `text-subtle-foreground` | StepCard, WeekGridTotalRow, WeekGridCell, ToolbarSearch, DayPickerItemMobile, Tab, SubNavItem, TabChipMobile, SidebarExpanded, Input placeholder |
| `text-ink-faint` | `text-ink-subtle` | SiteFooter ×3, SignIn |

**Three deliberate survivors of `faint-foreground`:**

1. A disabled input's value. WCAG 1.4.3 exempts inactive controls, and looking
   unavailable is the entire point.
2. The `aria-hidden` breadcrumb slash. Punctuation, no content.
3. The Foundations ink-trap rows, which render the failure on purpose.

**WeekGridHeader needed a decision rather than a swap.** Weekend was signalled
three times over: `bg-control` on the cell, `faint-foreground` on the day name,
and `chart-6` on the date. Two of the three failed, and `chart-6` is a chart
series colour with no business being text at 10.5px. The background already
says "weekend", so the text hierarchy is now day name (`muted-foreground`) over
date (`subtle-foreground`) and nothing else. Checked in the browser — the
weekend column still reads as recessed.

**Two `link-in-text-block` failures**, separate from contrast. The terms and
privacy links in SignIn were distinguished from the sentence around them by
colour alone, underlining only on hover. Now underlined at rest.

**Two story artefacts, not component defects.** The Checkbox and Toggle
`States` stories fade a label with `opacity-50` to depict a disabled row. That
label belongs to a disabled control and is exempt, but axe cannot see the
relationship. Marked `data-a11y-exempt` and excluded by selector, not by
switching the rule off for the file.

**One test broke for a good reason.** `BarSuppliesItsOwnHeight` could no longer
find its `<nav>`: with CSS finally loading, `md:hidden` genuinely resolves to
`display: none` at desktop width, which removes the element's role. It now
queries with `hidden: true`. Accessible-name computation returns `''` for a
`display: none` element, so the label is asserted separately rather than used
as the query filter.

**253 passing, 68 files, zero violations — and this time the contrast half of
that means something.**

---

## Both remaining open questions closed — 2026-08-02

### Medium and Small touch targets

Extended the mechanism Large already used rather than inventing a second one.
Each size widens its hit area with a transparent `::after`; the heights Figma
states are untouched and nothing on screen moves.

| Size | Height | `::after` | Target |
|---|---|---|---|
| Large | 42 | 1px proud | 44 |
| Medium | 34 | 5px proud | 44 |
| Small | 30 | 7px proud | 44 |

**`pointer: coarse` was the obvious alternative and is worse.** It reports the
*primary* pointer, so a touchscreen laptop with a trackpad reads as `fine` and
would have kept the 30px target — the exact device where a mis-tap is likely.
`any-pointer: coarse` overcorrects and inflates every desktop that happens to
have a touchscreen. An unconditional invisible expansion costs nothing.

Earlier I argued against doing this for Small on overlap grounds. That was
overstated: the expansion is vertical only, and two Small buttons stacked
closer than `gap-4` overlap by a pixel or two, which shifts the boundary
between them very slightly. That is a much smaller problem than a 30px target.
Horizontally these buttons clear 44 easily once they have a label.

The `TouchTarget` story now covers all three sizes and asserts both directions:
`elementFromPoint` at the outer edge of the target must return the button, and
a pixel beyond it must not — so the test fails if the expansion is removed
*and* if it is unbounded.

### The font sizes outside the ramp

The original note was wrong in its framing. It said eight sizes sat outside a
24-style ramp; in fact most were sizes the ramp already had, written as raw
pixel literals. Splitting them three ways:

**Six collapsed onto styles that already existed** — a real de-duplication, not
a new token:

| Site | Was | Now |
|---|---|---|
| WeekGridHeader date | `text-[10.5px]` | `mono-count` |
| Input prefix | `text-[13px]` | `mono-cell` |
| PricingTierCard badge | `text-[10px] tracking-[0.07em]` | `ui-nav-section` (same size *and* same 0.7px tracking) |
| FaqAccordionRow summary | `text-[12px]` | `ui-label` |
| Pagination cell | `text-[12px]` | `ui-label` |
| Avatar 44 initials | `text-[16px]` | `body-lg` |

**Five new tokens for a genuine gap.** The mono ramp jumped 10.5 → 13, and four
component sizes were sitting in that hole: 10, 11, 12 and 12.5, every one of
them a small tabular figure in a dense row. Added `mono/2xs`, `mono/xs`,
`mono/sm`, `mono/md`, plus `ui/micro` 10.5 for the two mobile atoms' labels
(`ui/nav-section` is 10 and `ui/overline` is 11, and both are tracked
uppercase, so neither fits). Values are unchanged from Figma's component nodes.

**Five stay literal, and should.** Avatar 20 and 26 initials, the notification
pip count, the sidebar logo mark, and the Chip label are sized to their
container — a 20px circle, a 16px pip, an 18px chip — not to the type ramp. A
ramp change should not move them, so token-backing them would be wrong. Each
now carries a comment saying so.

`SubNavItem`'s count also gained `font-mono`. Every other numeral in the system
is mono and the mono rule is documented as load-bearing, so its absence read as
an oversight rather than a decision. Flagged for a designer to confirm.

**Still outstanding:** the five new tokens exist in code but not as Figma text
styles. Figma holds these values as node properties, so a designer editing the
mono ramp will not see the four new steps.

### A guard, because this class of bug has bitten twice

`src/lib/cn.test.ts` reads `globals.css` and fails if any `--text-*` token is
missing from `TYPE_RAMP` in `cn.ts`, or if `TYPE_RAMP` names one that no longer
exists. An unregistered token is classified by tailwind-merge as a text
*colour* and silently eats the colour class beside it — the bug that once made
every Button label render the inherited foreground. Verified it fails by
removing `ui-micro` and watching it go red.

It reads the file with `node:fs` rather than `import ... from '...css?raw'`:
**Vitest stubs CSS imports by default**, so the `?raw` form resolves to an empty
string and every assertion passes against nothing. That cost a round trip, and
is exactly the sort of test that looks green and checks air.

---

## Vercel — 2026-08-02

Project `timesubmit-design-system` on team `webkollas-projects`, connected to
the GitHub repo, so a push to `main` deploys. Live at
`https://timesubmit-design-system.vercel.app`.

**Build command is `npm run typecheck && npm run lint && npm run
build-storybook`.** Storybook's build transpiles without typechecking, so
without the first two a type error deploys perfectly happily. Tests are not in
the build: they need a Playwright browser, which belongs in CI, not in the path
of every deploy.

**`engines.node` is `24.x`, deliberately unlike `.nvmrc`'s `26.5.0`.** Node 26
is not a Vercel build runtime. `engines.node` overrides both `.nvmrc` and the
project setting, and local development stays on 26.

**The MCP could not do the upload.** `deploy_to_vercel` takes a file tree
inline, and this repo is 17MB including 1.1MB of photography — base64 in a tool
call would have been several hundred thousand tokens of context for no benefit.
The CLI did the upload; the MCP did project discovery, deployment status, build
logs and the protection settings.

### `vercel.json` has no comment syntax

A `"//"` key inside a `headers` entry failed the deployment at config
validation — **no build logs at all**, which is the signature of a schema
rejection rather than a build failure. Worth recognising: an ERROR state with
zero log events means the build never started.

### Deployment protection — what is actually possible here

The production alias is **public**. Not for want of trying:

| Attempt | Result |
|---|---|
| `ssoProtection: {deploymentType: 'all'}` | 428 `Vercel Authentication is not available on your plan for production deployments` |
| Same, direct to the REST API with a Pro team token | Identical 428, so not an MCP artefact |
| `passwordProtection` | 428 **`Advanced Deployment Protection is not enabled on your team`** |

That second message is the real one. The team **is** on Pro — confirmed via
`/v2/teams`, `billing.plan: pro`. Pro gives Standard Deployment Protection,
which covers preview and deployment URLs only. Protecting a *production* alias,
by SSO or by password, needs the **Advanced Deployment Protection** add-on.

Current state, verified with unauthenticated `curl` rather than a browser that
had a Vercel session cookie:

- `timesubmit-design-system.vercel.app` → **200**, serves the Storybook
- the hashed deployment URL → **302** to SSO

`ssoProtection` reads `all_except_custom_domains`, which sounds like it should
cover the alias and does not: the project's own `.vercel.app` production domain
counts as an assigned domain and is excluded.

`X-Robots-Tag: noindex, nofollow, noarchive` is set on every path. **That is not
access control** and is not a substitute for it — it only keeps an unreleased
product's screens out of search results.

No password was set. The `passwordProtection` call failed, so the generated
value was never applied to anything.

---

## BUG-003 — stale tabs after a redeploy — 2026-08-02

Every story showed "Failed to fetch dynamically imported module" on the
deployed Storybook, across all four tiers.

**Not a broken build.** Storybook code-splits one chunk per story file with a
content hash in the filename, so every build renames them. A tab holds the
shell it loaded and only fetches a story's chunk when you navigate to it. Four
production deployments went out while the reporter had the tab open, so every
lazy import was asking for filenames that no longer existed.

| Check | Result |
|---|---|
| The requested chunk `...stories-CwSiebno.js` | 404 |
| Same story in the current build | `...stories-cP94VblL.js` |
| `index.json` live | story present, index fine |
| Fresh load of the same story URL | renders, 34 nodes, no error |

That last row is what makes it skew rather than breakage.

**Fix:** `vite:preloadError` handlers in `preview-head.html` and
`manager-head.html`, reloading once with a 15s cooldown.

Vercel Skew Protection would solve it at the platform level and was rejected
for now: it only applies automatically to frameworks Vercel supports, and a
plain static build needs the deployment ID threaded onto every asset URL at
build time via Vite's `experimental.renderBuiltUrl`. That is the better answer
eventually — no reload at all — but it means owning asset-URL rewriting inside
the Storybook build. **It was also not switched on in project settings**, on the
grounds that a setting which changes nothing here reads as protection that is
not actually in place.

### Two reproductions that proved nothing first

Same trap as BUG-002's false-positive test, caught the same way — by asserting a
marker rather than "did it render".

1. `pushState` + `popstate` in the manager: story rendered, no error, but the
   preview never changed story so no chunk was ever lazily fetched.
2. `setCurrentStory` via the manager: the manager reloaded the iframe, which
   fetched a fresh document from the new build. No skew left to test.

Both showed `recoveredAt: null`, which is the only reason they were caught.

The reproduction that works removes the manager: serve build A, open
`iframe.html` **directly**, swap the served directory to build B, then emit
`setCurrentStory` on the preview channel for a story file that document has
never imported. Vite fired the event, the handler reloaded, the story rendered
from build B with its id intact.

The cooldown was verified separately: a second event 12.1s after a recovery did
not reload and left the marker untouched. An earlier attempt at 20s did reload —
correct, the cooldown had expired, though it briefly looked like a failure.

## Upstream primitives batch — 2026-08-02

Ten primitives, built as one batch. Eight were the set `docs/design-gaps.md`
identified as blocking Phase 3; two more (`Textarea`, image `Avatar`) arrived
mid-task from route triage and were folded in rather than left for a second PR.

They were built **before being designed in Figma**, which is a deliberate,
accepted trade and the single biggest risk in this task. The mitigation was to
derive every one of them from something that already shipped, and to add no
token at all. What each came from:

| Primitive | Derived from |
|---|---|
| `Card` (atom) | `KpiCard`, `CompletenessCard`, `ListCardInvoiceMobile`, `AttentionCardMobile`, `DataTable`, `WeekGrid` surfaces; `FeatureCardPhoto`/`PricingTierCard` for the marketing radius |
| `Skeleton` (atom) | `COMPONENTS.md`'s existing spec plus `EmptyState`'s `bg-control` well; sizes are the existing 34px control height and `radius/pip` |
| `Separator` (atom) | The `border-hairline` divider `TableRowInvoice` and `FaqAccordionRow` already carry |
| `Textarea` (atom) | `Input`, class for class |
| `Avatar` image slot | `Avatar` itself — same circle, same four sizes, same radius |
| `Banner` `dismissible` | `TableRowInvoice`'s icon-button treatment, in the banner's own tone colour |
| `Dialog` (molecule) | `Card`/`Toast` surface, `radius/panel`, `e3`, `--color-ink` at 60% for the overlay |
| `Popover` (molecule) | `Toast`'s `e2` surface; `--z-dropdown` |
| `TableHeader` (molecule) | `TableHeaderInvoices`, minus invoices |
| `TableRow` (molecule) | `TableRowInvoice`, minus the invoice columns |
| `TableCell` (molecule) | The six cell treatments `TableRowInvoice` had inline |

**No new token.** Nothing needed one — the z-index scale, `e3`, `radius/panel`,
`--color-ink` and the mono micro-scale were all already there and unused by
anything that floats, which is itself evidence that the token layer was designed
ahead of the components.

### The Banner constraint, and how it stayed intact

`dismissible` defaults to `false`, the component holds no dismissal state, and
it never reads or writes `localStorage`. `BannerIsUndismissable` on
`Pages/1c · Approver queue` and `HasNoCloseButton` on the Banner itself are both
**unmodified** and both still pass, because the default they assert did not move.
The guarantee is now per-instance rather than per-component, which is what
`design-gaps.md` §2.1 recommended: the approver-queue banner is undismissable
because *it* is, not because the component cannot.

### Focus, on one implementation rather than two

`Dialog` and `Popover` are both Radix, deliberately. Focus trap, restoration to
the trigger and Escape are the vendor's, and four stories assert each of the
three behaviours rather than trusting them. `Popover` defaults `modal` to `true`
where Radix defaults it to `false`: modal is what supplies the trap, and a
non-modal surface is mouse-reachable and keyboard-invisible.

### `aria-sort` is no longer a claim

`COMPONENTS.md:96` asserted sortable headers carry `aria-sort` and a grep over
`src/` returned zero matches. `TableHeader` now implements it and
`SortIsAnnounced` asserts all three states plus the transition between columns.
Non-sortable columns carry no `aria-sort`, which is correct and easy to get
wrong: the attribute means "sortable, and here is its state", not "unsorted".

A column marked `sortable` with no `onSortChange` renders as a plain heading, so
a screen that has not wired sorting yet cannot ship a dead control.

### The contrast trap, closed from inside the run

The Tailwind plugin was confirmed present in `vitest.config.ts` before any
contrast result was believed, and `Atoms/Card → IsActuallyStyled` now asserts it
from inside the browser run: computed background, border width, radius and
padding are read off a rendered `Card` and checked against the real values
(16px padding, 10px radius, 1px border, non-transparent background). If the
plugin ever falls out again that story fails, rather than every colour-contrast
check quietly passing against browser defaults.

### `COMPONENTS.md` corrections

- Button's fifth variant is **`approve`**, not `positive`. The document had been
  wrong since it was written; the component was always right and was not
  touched.
- Card padding is 14 / 16 / 24, the values the domain cards use, not the
  16–18 / 22–24 ranges the document gave, which nothing matched.
- Card elevation defaults to `none`, not `e1`: every app card in the library is
  flat. Flagged for a designer rather than silently changed.

### Not built, deliberately

- **`Calendar`.** Still absent. It depends on `Popover`, which now exists, but a
  date picker is a substantial component and inventing one here would be exactly
  the failure this batch was structured to avoid. Keep native `type="date"`.
- **`Select` and `Menu`.** `Popover` is the layer they belong on; building them
  without a design would be inventing a listbox.
- **A `Field` that wraps a `Textarea`.** `Field` is typed to `Input` and has no
  control slot, so the Dialog form story hand-rolls its label. Small, and a
  change to a shipped component's API, so it was left alone and recorded here.
  **Done in FEAT-DSR2-015 — see below.**

---

## Shell slots, nav `asChild`, marketing content props — 2026-08-03

Four additive changes so the application's layouts can be rebuilt on the
library. Three landed. The fourth stopped, and the reason is the most useful
thing in this section.

The governing constraint for all four: **every change is additive and defaults
to exactly today's rendering.** Nothing in this batch may move a story, a page
composition or a measurement. Derive from what exists; nothing gets a new
token. Test baseline before: **305 tests across 77 story files**, plus 5 unit
tests in 1 file. After: **313 across 77**, plus 20 unit tests in 3 files. No
existing test changed.

`src/docs/ForDesigners.mdx` says Figma leads and code follows. The consuming
project has deliberately suspended that for the duration of the rebuild, which
is why props are being added here ahead of a Figma review. It is a suspension,
not a repeal.

### Slots replace, they never wrap

`AppShell.headerActions`, `PortalShell.headerActions`,
`SidebarExpanded.orgSlot`, `SidebarExpanded.accountSlot`.

Each renders the static element when the slot is absent and the slot's content
when present, and **each replaces the static element rather than wrapping it.**
The statics are substitutes with nothing behind them: an org button with no
handler, an avatar with no menu, a bell with no notifications. Wrapping would
put a dead control beside a live one, and the user has no way to tell which is
which.

That matters more than it sounds. In the consuming app the Clerk `<UserButton>`
these slots carry is **the only sign-out affordance in the entire product** —
there is no `SignOutButton` and no `signOut()` call anywhere in it. Wrap rather
than replace and you ship two things that look like the account control, one of
which signs you out.

The props feeding the statics — `org`, `orgInitials`, `user`, `role`,
`userInitials` — stay required. `org` also feeds the `AppShell` breadcrumb, and
making the set optional is a wider type change than this needs. They are simply
not rendered when the slot is set, which is documented on each prop.

`AppShell`'s period control is deliberately outside `headerActions`. It is
gated by its own `period` prop and driven entirely by library state, so a
caller who wants it gone can already say so.

### `notifications` stays a number

It was offered a node form (`number | React.ReactNode`) and refused, because
`headerActions` already covers that case and two ways to say one thing is how
a prop surface rots. The specific tell: `notifications` drives the button's
`aria-label` — "Notifications, 3 unread" — which is meaningless for a node. The
union would have carried a prop that is only ever correct on one of its two
branches.

### `asChild` on the nav atoms

`NavItem`, `NavRailItem` and `TabBarItemMobile` all computed
`Comp = href ? 'a' : 'button'`, forcing a real anchor. In a Next.js app that
makes every sidebar, rail and tab-bar click a full document load, re-running
Clerk bootstrapping and the app's sync effects on each navigation. Not
incorrect; uniformly regressive.

They now follow `Button`: same `Slot.Root` from `radix-ui`, same prop name,
same default, same rule that the child owns its own `href` and `type`.

**One forced difference from `Button`, worth knowing before copying the
pattern again.** `Button`'s content under `asChild` is the consumer's own
subtree, so it renders `children` and is done. These three compose their
content from `label`, `icon` and `badge` props, so doing the same would
silently discard the icon and the label — the component would still render, the
test would still pass, and the sidebar would be blank. `Slot.Slottable` is what
makes the composed content become the consumer element's children, so the
caller passes a **childless** element:

    <NavItem asChild label="Clients" icon={Building2}>
      <Link href="/clients" />
    </NavItem>

### Marketing chrome takes its content as props

`MarketingShell` imported `MARKETING_NAV` and `FOOTER` and accepted only
`current`, so the app could not use it at all. It now takes `nav`, `footer`,
`signIn` and `cta`, each defaulting to exactly what was hardcoded.

`signIn` and `cta` were not in the brief and were added anyway: the app's
"Get started" is an analytics-instrumented client component, and without those
two props it cannot be reached. A prop that cannot be reached is the same
blocker as a slot that does not exist.

A string href could not express what the app has, so `NavLink` gains an
optional `element` and `href` becomes optional in its place. Checked against
the app before fixing the shape, the three cases are: framework router links
(everywhere), an instrumented CTA, and a cookie-settings control that is a real
`<button>` with no href at all. The last one is why `{label, href}` was not
enough.

The mechanism is the library's existing one — `Slot.Root` merges the computed
className and `aria-current` onto the caller's element, `Slot.Slottable` makes
the label its children. `SiteHeader` and `SiteFooter` share one internal
`NavAnchor` so the two cannot drift on it. It is deliberately not in the
organisms barrel, so it is not public API.

Without `element`, `NavAnchor` emits the identical `<a href>` both components
always rendered, **including emitting no `aria-current` attribute at all** when
the entry is not current, which is what the footer relied on.

### The `Logo` component — shipped, as two lockups behind one import

This entry previously read "stopped, and why". The blocker was a design decision
nobody had taken; it has now been taken, and the ruling was the second of the two
options this entry asked for: **20px and 24px are two separate sizes of one mark,
with different optical corrections.** So `Logo` ships with `size="sm"` and
`size="md"`, each reproducing its call sites exactly as they rendered before, and
all five call sites now consume it.

The original finding stands and is kept below, because it is the reason the
component looks the way it does.

The task had been to derive one SVG asset from what the three inline lockups
already render. **The instruction was also to stop and report if the three do not
agree. They did not agree, and there were five of them, not three.**

| Call site | Tile | Mark type | Gap | Wordmark colour | Wrapper |
|---|---|---|---|---|---|
| `SidebarExpanded` | `size-5` · 20px | `text-[9.5px]` literal | `gap-2` · 8 | `text-foreground` | `<span>` |
| `PortalShell` | `size-6` · 24px | `text-mono-count` · 10.5px | `gap-2.5` · 10 | `text-foreground` | `<a href="/">` |
| `SiteHeader` | `size-6` · 24px | `text-mono-count` · 10.5px | `gap-2.5` · 10 | `text-foreground` | `<a href="/">` |
| `SiteFooter` | `size-6` · 24px | `text-mono-count` · 10.5px | `gap-2.5` · 10 | `text-ink-foreground` | `<span>` |
| `SignIn` page | `size-6` · 24px | `text-mono-count` · 10.5px | `gap-2.5` · 10 | `text-ink-foreground` | `<div>` |

All five share the tile fill (`bg-primary`), the mark colour
(`text-primary-foreground`), the radius (`rounded-control`, 7px), the mono
family, the literal glyphs `TS`, and `text-heading-block` on the wordmark.

The blocker is arithmetic, not taste. **The 20px lockup is not a uniform
scaling of the 24px one**, so no single scalable asset reproduces both at
today's rendering:

- mark-to-tile ratio — 9.5 / 20 = **0.475**, against 10.5 / 24 = **0.4375**
- gap-to-tile ratio — 8 / 20 = **0.400**, against 10 / 24 = **0.4167**

An SVG scales uniformly. Shipping one means choosing a ratio, and choosing a
ratio moves at least one of the five call sites. That is a design decision, and
`ForDesigners.mdx` already records the 20px sidebar mark as a deliberate
literal — one of five sizes held outside the type ramp precisely because it is a
function of its container. Overriding that from a refactor would be exactly the
wrong direction.

There is a second, softer blocker: the wordmark colour is `text-foreground` on
three surfaces and `text-ink-foreground` on two. That one is correct as it
stands — the footer and the sign-in panel sit on ink — but it does mean the
asset cannot own its own colour and must inherit, which constrains the shape of
whatever gets built.

**No SVG asset was shipped, and that has not changed.** An SVG scales uniformly,
so one file still cannot be both lockups. What shipped is a React component that
composes the same two lockups from the same utilities.

#### What was decided, and why two geometries behind one component is right

The point of the change is **one source for the mark, not one geometry.** Before
it, a change to the tile meant finding five inline copies and getting all five
right. That was the actual cost. The ratio disagreement was never the cost; it
was a fact about the mark that the refactor kept tripping over.

Holding both sizes is therefore not a compromise, it is the correct reading:
optical correction at small sizes is ordinary for a wordmark, `ForDesigners.mdx`
already records the 20px sidebar mark as one of five deliberate literals held
outside the type ramp, and unifying the ratio would have moved a rendered screen
to make a component tidier. The two sizes are drawn, not computed. `Logo.tsx`
says so above `logoVariants`, and `SmGeometry` / `MdGeometry` in the story file
assert both numbers so that the next person to "fix" the ratio fails a test
rather than shipping it.

#### The API, and why

- **`size: 'sm' | 'md'`** — named for the lockup, not for a pixel value, because
  the pixel value is two numbers (tile and mark) that do not scale together.
- **`tone: 'default' | 'ink'`** — the wordmark colour difference. This is a
  *surface* question, not a palette one: `ink/*` is the mode-invariant set, and
  on the ink footer and sign-in panel `foreground` flips with the theme and lands
  near 2:1. A closed two-value `tone` matches `Avatar` and `Chip`; an open
  `color` prop, or leaving it to `className`, would invite a third answer for a
  surface the design system has not defined. **No new token was introduced.** The
  tile keeps `bg-primary` in both tones, which is what all five call sites
  already rendered.
- **`href`** for the two anchor call sites, **`asChild`** for everything else —
  the same escape hatch `Button` and `NavItem` already have, mirroring `NavItem`
  down to the `Slot.Slottable`. `SignIn` needs it for a positioned `<div>` it
  cannot otherwise keep; an application needs it for a router link.
- **`brand`** defaults to `TimeSubmit`. The tile stays the literal `TS` and does
  *not* follow it — that is existing behaviour of `SiteHeader` and `SiteFooter`,
  preserved rather than improved.

#### How "identical to before" was proved

`src/components/atoms/Logo/logo-call-sites.test.tsx` holds the pre-change markup
of all five call sites, transcribed verbatim, and asserts each converted call
site still serialises to it. **It was written and run green against the
unconverted call sites first**, so the baselines are transcriptions rather than
descriptions of whatever the new component happens to emit. Without that ordering
the file proves nothing, which is the trap it exists to avoid.

One normalisation: class tokens are sorted before comparison, because `cva` plus
`cn` emits the same set of utilities in a different order and attribute order has
no effect on what Tailwind applies. Tag names, nesting, text and every other
attribute are compared exactly. All five behaved exactly as the table above
predicted — no sixth call site, and no pair that was expected to match and did
not.

### Verification

Before: `vitest run` 333 passed in 80 files.

After: `vitest run` **347 passed in 82 files** (+9 stories, +5 call-site parity
tests) · `tsc --noEmit` clean · `eslint .` clean · `storybook build` clean.

---

## The `Field` control slot (FEAT-DSR2-015, 2026-08-03)

`Field` now takes a `control` element and clones it with the wiring. Nine routes
in the product need a labelled textarea, and the Dialog form story's hand-rolled
label was the first instance of the drift.

### The API, and the four things it is not

`control?: React.ReactElement`, cloned with `id`, `aria-describedby`,
`aria-invalid` and `invalid`. Omit it and `Field` renders its own `Input` from
the remaining props, exactly as before.

- **Not a render prop.** `control={(wiring) => <Textarea {...wiring} />}` hands
  the a11y wiring back to the caller, and one forgotten spread on one screen
  silently stops the error being announced — across nine routes, with nothing to
  catch it. A slot the caller has to wire up has not solved the problem the task
  set out to solve.
- **Not `asChild` + `children`, despite that being the in-house idiom.** On
  `Button`, `asChild` means "replace the element I render". `Field` renders a
  wrapper, a label, a control and a message, so "replace which one?" has no
  obvious answer, and reusing the word would make it mean two different things
  in one library. `control` names the slot it fills.
- **Not Radix `Slot`, even though the mechanism fits.** `Slot` lets the *child's*
  props win. A caller-supplied `id` would then override `Field`'s and break the
  `htmlFor` association the component exists to create — a hole in exactly the
  place this change was meant to close. `cloneElement` puts `Field` last, so it
  wins, and `Field.test.tsx` asserts it for both `id` and `aria-describedby`.
- **Not a polymorphic `as`, and not a sibling `TextareaField`.** The first drags
  every control's props through `Field`'s own type; the second is two components
  to keep in step forever.

`invalid` is a prop of this library's controls rather than an attribute, so a
host element (`control={<textarea />}`) gets `aria-invalid` only and no React
unknown-prop warning. The ARIA half is what is announced either way.

### Ref typing, without `any`

`forwardRef` is gone. The ref's element type depends on a sibling prop —
`HTMLInputElement` when `Field` renders the input, and nothing at all when the
caller owns the control and can put a ref on it directly — and `forwardRef`
fixes one element type for the whole component. The props are a discriminated
union instead (`FieldWithInputProps` | `FieldWithControlProps`), `ref` is a
plain prop as React 19 allows, and `<Field control={…} ref={…} />` is a type
error rather than a ref that silently goes nowhere.

**Nothing existing broke.** Every current call site — `Contact`, `SignIn`,
`ConsultantRecord`, and all five original stories — is the input variant and
compiles unchanged; `control?: never` on that variant is what keeps it exact.
The one cost is Storybook: `Meta<typeof Field>` collapses a union to `never`, so
`Field.stories.tsx` types its meta as `Meta<FieldWithInputProps>`. That is a
story-file annotation, not a consumer-facing break.

### Proving the contrast run was real, not merely configured

`Molecules/Field → IsActuallyStyled` reads computed styles off a rendered
`Field`+`Textarea` inside the browser run: `--radius-button` resolves to `8px`,
control padding is `8px 12px`, radius `8px`, border 1px, background not
transparent, and the errored field's border colour differs from the healthy
one's — which can only be true if `border-danger` and `border-input` were both
generated.

Then the negative control, which is the part that actually proves it:
`tailwindcss()` was removed from `vitest.config.ts` and the Field stories rerun.
`IsActuallyStyled` failed on the first assertion (`expected '' to be '8px'`) and
**the other six Field stories, axe colour-contrast included, still passed**.
That is the trap, reproduced on demand: without the plugin the a11y checks are
green and meaningless. The plugin was restored and the full suite rerun.

### The accessibility audit, and the five things it found

The control-slot design survived review — label association, `aria-invalid` on
the control, `Field` winning over a caller's `id`, and the `cloneElement`-beats-
`Slot` reasoning were all verified by execution. Five defects around it did not.

**1. The error message had no live region (WCAG 4.1.3).** Swapping `helper` for
`error` changed exactly one attribute on the control — `aria-invalid` — while
`aria-describedby` kept pointing at the *same id*, because the error reuses the
helper's id and only the text underneath changes. Nothing an AT watches changed.
A screen reader user submitting with focus on the submit button heard silence,
and `COMPONENTS.md:57` bans the usual fallback, so inline was the only channel
and it was mute.

`role="alert"` when `error` is set, and only then: an always-on alert announces
helper text on mount. The `key` on that paragraph is load-bearing rather than a
list key — an alert fires on *insertion*, and helper→error would otherwise
update the existing node in place and announce nothing (Safari/VoiceOver in
particular). Keying on the state forces the remount. A permanently-mounted
`aria-live` wrapper was the alternative and would announce twice here, once for
the region's contents and once for the alert inside it; `Toast` uses that form
because it has no second channel to collide with.

**2. A caller's `aria-describedby` was destroyed, on both paths.** Worst with no
helper and no error, where a caller's value was overwritten with `undefined` —
which made a `Field` with no helper text strictly worse than a bare `<input>`.
It is merged now, caller first. "Field wins" is right for `id`, where there is
one element and `htmlFor` depends on it, and wrong for a space-separated list
that exists precisely so it can accumulate: a character counter, a password
rules block, a shared date-format note.

The test that claimed to cover this pointed at an id that did not exist in the
DOM, so `toHaveAccessibleDescription` returned the helper text whether the
implementation merged or overwrote. It proved nothing. The referenced element
now exists and the assertion is the merged string.

**3. The required marker, restored — a regression this branch introduced.** The
gap was **symmetric**, which the first pass missed: `<Field label="A" required />`
on the built-in `Input` path passed `required` through `...rest` and drew no
marker either. So it was a missing `Field` prop, not a control-slot limitation.
`required` now does both halves from one prop. Screen reader users were always
fine; **sighted** users had lost the only pre-submission signal and fell back to
the native validation bubble, which is transient and at 400% zoom can render
outside the viewport — the after-the-fact validation `COMPONENTS.md:57` rules
out. No existing screen passed `required` to a `Field`, so nothing changed
visually outside the Dialog story, which is back to the specified `*`.

**4. The slot no-opped silently for a Fragment.** `control={<><Textarea /></>}`
produced `textarea id=""`, a label pointing at nothing and a control with no
accessible name — and the type accepted it. `Children.only` plus a dev-only
Fragment check now throw. The Fragment check has to be separate: a Fragment *is*
a single valid child and swallows every prop cloned onto it. A composite that
spreads onto a wrapper `<div>` has the same failure mode and cannot be detected
from outside, so `FieldWithControlProps` documents the contract — forward `id`,
`aria-describedby`, `aria-invalid` and `required` to the focusable element. The
library's own `Input` is wrapper-plus-input and satisfies it only because it
spreads onto the inner element. A regression net asserts the label's target
matches `input, textarea, select, [tabindex]` for both controls.

**5. `invalid` leaked to the DOM.** The guard tested `typeof control.type ===
'string'`, which is the element's *type* rather than whether it supports the
prop, so a composite forwarding unknown props triggered React's "Received
`false` for a non-boolean attribute" warning.

Of the two offered routes, `Field` now sends **no `invalid` at all** and
`Input`/`Textarea` read `aria-invalid` for the danger border. The alternative —
passing `invalid` only to this library's own controls — needs either a
hard-coded allowlist or an opt-in static flag, and both make `Field` know which
components are family. Driving from the standard attribute means `Field` emits
only things any control can accept, there is no type sniffing left, and the
border and the announced state come from one value. Both atoms keep their
`invalid` prop for direct callers; it is now one of two inputs to the same
boolean.

**Also found while fixing.** `message = error ?? helper` meant `error=""` — what
a form library hands back for "no error" — suppressed the helper text, since
`??` only falls back on nullish. It is `||` now, which is how `invalid` already
read the same value.

**What is still not proven.** The live region has tests for the role and for the
remount. Neither proves the *announcement*. That needs a real screen reader
pass — VoiceOver/Safari and NVDA/Firefox — and has not been done.

## Making the nav atoms' `asChild` reachable (BUG-DSR2-009, 2026-08-03)

`asChild` landed on `NavItem`, `NavRailItem` and `TabBarItemMobile` in the
earlier shell-slots work and **closed nothing**, because no shell exposed a way
to reach it. Each took a `string` href and built the element itself, so a
consumer holding a `next/link` had nowhere to put it. The measured consequence
in the consuming app: every sidebar, rail, tab-bar and portal-nav click became a
full document load, re-running Clerk bootstrapping and four sync effects on
every navigation, where those had been client-side transitions before the shells
landed. A prop that cannot be reached is the same blocker as a prop that does
not exist — which is the lesson from `MarketingShell.signIn`, recorded above,
arrived at twice now.

**One mechanism, not four.** `src/lib/nav-slot.ts` holds `NavTarget` (the
`href`-or-`element` pair), `navTarget()` (the branch), `navKey()` (the React key,
since an element destination hides its href inside the consumer's element) and
the childless guard. `SidebarDestination`, `MobileTab` and `NavLink` all extend
`NavTarget`, and `SiteHeader`'s local `navKey` is now a re-export, so marketing
chrome and application chrome cannot drift on what identifies a destination.

**`PortalShell`'s top nav uses `NavAnchor`, not `NavItem`** — the brief asked
for the atom "unless there is a reason". There is. `NavItem` is the 236px
sidebar row: it *requires* an `icon` and draws a 32px full-width pill with an
active bar and a badge slot. The portal nav is a horizontal text link with no
icon, and its className was already character-for-character the one `SiteHeader`
gives its entries. Routing it through `NavItem` would change every portal header
in the product and demand an invented icon per link; routing it through
`NavAnchor` — the renderer `SiteHeader` and `SiteFooter` already share — changes
nothing and gains `element`. That is also the brief's "reuse `NavAnchor` where it
fits" satisfied by the same edit.

**Two structural copies removed.** `AppShell.mobileTabs` and
`PortalShell.mobileTabs` each declared their own inline copy of `MobileTab`.
They were identical and fed straight into `MobileTabBar`, and they drifted the
instant `MobileTab` gained `element`, leaving the tab bar's escape hatch
unreachable through both shells that render it. Both now reference `MobileTab`.

**The childless contract cannot be typed, so it is enforced at runtime.**
`asChild` on these atoms takes a childless element: they compose from
`label`/`icon`/`badge`, and under `Slot.Slottable` that content becomes *the
consumer's element's* children, so an element bringing its own children discards
the icon and label with no error at all. `ReactElement<{children?: never}>` looks
like the answer and was tried and rejected against this repo's TypeScript: a JSX
literal is `JSX.Element` = `ReactElement<any, any>`, so `<a href="/x">Text</a>`
satisfies it, while a correctly childless element held in a `React.ReactElement`
variable widens to `ReactElement<unknown>` and is *rejected*. It accepts the
mistake and rejects the correct code — exactly backwards. So `warnIfNotChildless`
logs a development warning at the one chokepoint every path already goes
through. A warning and not a throw: the mistake costs an icon, and taking the
application down over it would be the larger fault.

**How "unchanged" was proved.** Not by spot assertions. `nav-baseline.ts` holds
the `outerHTML` of the sidebar nav, the rail, the tab bar, the portal nav and
the portal logo, **captured by rendering the shells before the change** and
frozen; `nav-defaults.test.tsx` asserts byte equality after it. Attribute order,
class token order, element order and the icon SVGs are all in scope, which is
what a spot assertion misses and a measurement notices. Same ordering discipline
as `logo-call-sites.test.tsx`, and for the same reason: a baseline written after
the change proves nothing.

384 tests in 83 files before, 410 in 86 after. `tsc --noEmit` and `eslint .`
both clean, `storybook build` succeeds. No story, page composition or
measurement moved.

**Not done.** No story was added for `element`. The shells have no story files —
they are exercised through the twelve page compositions — and adding one for a
prop whose correct render is *identical to the default* would be a story that
looks like a duplicate. It is documented in `COMPONENTS.md` under Navigation
instead.

---

## BUG-019 — the marketing chrome ignored the content column (2026-08-06)

`SiteHeader` and `SiteFooter` laid their children directly on their full-width
roots behind a fixed `px-10` gutter. `Section` puts its children on `Container`,
the 1160 centred column. So at any viewport wider than 1160 the header logo sat
40px from the window edge while the hero heading below it sat 180px in at 1440,
and the footer's first column did the same. Reported against the consuming app,
but visible on any page built from `MarketingShell` — including this repo's own
page compositions.

**The bars stay full-bleed; only their contents are constrained.** Constraining
the roots was the other reading and was rejected with the reporter: it would
stop the header's bottom border at 1160 and turn the footer's ink block into a
centred panel rather than the base of the page. So each root keeps its
background and border and loses `px-10`, and an inner `Container` carries the
column and the gutter. The gutter moved rather than being added, so it is not
applied twice.

**`SiteFooter`'s root also lost `flex flex-col gap-9`, which moved on to the
column with the gutter.** Worth stating because it is more than the `px-10` the
summary above describes: a consumer whose `className` assumed a flex-column root
now gets block layout. Nothing does today, and `SiteFooterProps` extends
`HTMLAttributes`, so it is a supported surface and a real change.

**`Container` moved to `src/components/atoms/Container/Container.tsx`.** It
lived in `MarketingShell.tsx`, which composes `SiteHeader` and `SiteFooter`; an
organism importing it from there is a cycle. `MarketingShell` re-exports it, so
`@timesubmit/design-system/shells` offers it exactly as before, and the atoms
barrel now exports it from the root entry too — the consuming app hand-builds a
mobile header below `lg` because this one cannot wrap seven destinations, and
that header needs the same column.

**`wide` is forwarded.** `SiteHeader`, `SiteFooter` and `MarketingShell` all
take it now. Without that, a pricing page of `wide` sections would sit at 1280
under chrome at 1160 — the same misalignment one breakpoint further out.

**The gutter is overridable through `className`.** `Container` puts `px-10`
before `className` in `cn`, so a caller passing `px-5` wins. That is what the
app's mobile header needs: it is 20px today and moving it to 40px would be a
visible change at 390 in a fix that is meant to change nothing below 1160.

**`Container` takes the full `div` prop surface and a ref**, added on review
before the second pin. It was a private helper inside `MarketingShell` with
`{wide, className, children}` and nothing else; as a root export that is too
thin, because a caller wanting an `id` on the column — a scroll anchor, an
`aria-describedby` target — has to wrap it in another div, which is the wrapper
this change exists to remove.

**Measured, not eyeballed.** Four story files assert with
`getBoundingClientRect`: the bar is as wide as its parent, the inner column is
`min(parent, cap)` and evenly inset, and in `MarketingShell.stories.tsx` the
header logo, the page heading and the footer's first column report the same
`left`. They render inside a fixed 1440 stage — Storybook's canvas is ~1152,
below both caps, so a story measured in it proves the column is full-width and
nothing else. `MarketingShell` had no story file before this; its props stay
proved in jsdom, where no CSS applies and every rect is zero-width, which is
exactly why the alignment could not be asserted there.

`vitest --project=unit` 88/88. `vitest --project=storybook` 355/356, the one
failure being the pre-existing `TableHeaderInvoices > Aligns With Rows`, which
fails on `main` independent of this change and is noted in the two commits
before it. `tsc --noEmit` and `eslint .` clean, `npm run build` clean.

## BUG-022 — `DarkCtaBand` ignored the content column too (2026-08-07)

The third component with the shape BUG-019 fixed, found from a screenshot of the
consuming app's homepage rather than by anyone checking. The CTA heading started
at x=48 while the footer's logo directly beneath it started at x=358.

`DarkCtaBand`'s root was `bg-ink flex w-full flex-col items-start gap-4.5 px-10
py-16` — `w-full` plus a fixed gutter and no inner container, exactly as
`SiteHeader` and `SiteFooter` were before PR #17. Fixed the same way: the root
keeps `bg-ink` and full width, the existing `px-10` **moves** on to an inner
`Container` rather than being added alongside it, and `wide` is forwarded so a
`wide` page closes on the width it was laid out on.

**The `max-w-[600px]` and `max-w-[540px]` caps stay.** They set line length,
which is a different concern from where the block starts. Removing them once the
column exists would give the heading the column's full 1160 measure, which is
roughly twice a readable one. `ContentsSitOnTheCentredColumn` asserts the
heading is still exactly 600 wide, so this cannot be quietly dropped later.

**The agreement is asserted in `MarketingShell`, not in the band's own story.**
`DarkCtaBand` is the page's last child rather than part of the shell, so its own
story can only prove its column is centred and evenly inset. Whether it lines up
with the footer needs both blocks stacked, which only the shell story has.
`CtaBandAgreesWithTheFooter` measures CTA heading `left`, footer blurb `left` and
the hero `left` as one number.

### The audit, which was the actual ask

Every organism, shell and page root was read for the signature — `w-full` (or
`fixed inset-x-0`) plus a fixed `px-*` and no inner `Container`. **Nothing else
has it.** `SiteHeader`, `SiteFooter` and `Section` already carry `Container`.
`MobileTabBar` is edge-anchored on purpose and is `md:hidden`, so it never
renders above 1160. `SignIn` is a deliberate full-viewport split with no shared
column. `AppShell`, `PortalShell` and `SidebarExpanded` are fluid dashboard
chrome with no 1160 column anywhere in the portal — putting `Container` there
would narrow the dashboard to the marketing measure. Everything else that is
`w-full` with padding (`Pagination`, `KpiCard`, `EmptyState`, `Input`,
`DataTable`, `WeekGrid`, `PricingTierCard`, `Dialog`, …) is `w-full` meaning
"fill my parent", inside something already on the column.

Two near-misses were tidied in the same commit. `Home`'s rate-blind ink band and
`ApprovalWorkflows`' feature sub-nav each hand-rolled `mx-auto max-w-[1160px]
px-10` inline. Both rendered correctly, so neither was a defect; they were copies
of `Container` that would not have followed it if the measure or the gutter ever
moved, which makes `Container`'s "one definition of the column" docstring untrue.
They now use it.

`vitest --project=unit` 88/88. `vitest --project=storybook` 358/359, the one
failure being the same pre-existing `TableHeaderInvoices > Aligns With Rows` that
BUG-019 recorded. `tsc --noEmit` and `eslint .` clean, `npm run build` clean and
package verified.
