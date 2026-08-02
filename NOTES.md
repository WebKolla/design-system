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
