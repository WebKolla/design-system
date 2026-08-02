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

### Phase 1 is NOT complete

Still outstanding before this phase is reviewable:

- [ ] Foundations story — every colour with name, resolved value, contrast
      ratio against its intended background, light/dark side by side
- [ ] Type story — full ramp at desktop and mobile sizes
- [ ] **shadcn mapping proof** — the brief requires mounting one wrapped
      primitive (Button) in both modes. Attempted to verify by injecting
      utility classes at runtime; that is invalid, because Tailwind JIT only
      generates utilities it finds in source, so the injected classes had no
      rules and the readings were meaningless. This can only be proven by the
      real Button in Phase 2.
- [ ] Geist / Geist Mono webfonts are not yet loaded, so Storybook currently
      renders the fallback stack

---

## Open questions outstanding

Carried from §13, none yet decided:

1. **Button icon side** — recommendation is trailing default. Not yet built.
2. **Input atom** — must be extracted from `Field` (`37:42`); API not yet confirmed.
3. **`color/chart-grid` / `color/chart-axis`** — do not resolve to plain colours
   via the API. To be inspected in Phase 1.
4. **DataTable / WeekGrid / AccordionGroup** — composed APIs need review before
   the page phase depends on them.
