---
id: BUG-001
title: Icon story fails to render — react-docgen-typescript floods args with inherited SVG props
priority: P0
status: DONE
feature: FEAT-design-system-storybook
found-in: Phase 0 scaffold verification
references:
  - src/components/atoms/Icon/Icon.tsx
  - .storybook/main.ts
---

## Symptom

Every `Atoms/Icon` story renders a Storybook error overlay instead of the component:

```
Objects are not valid as a React child
(found: object with keys {description, displayName, filePath, methods, props, tags}).
```

Console additionally reports:

```
Error: <svg> attribute width: Expected length, "ICON_SIZES".
Error: <svg> attribute height: Expected length, "ICON_SIZES".
Error: <svg> attribute width: Expected length, "[object Object]".
```

## Why it was missed

Phase 0 was signed off on `tsc --noEmit`, `eslint`, a successful production
`build-storybook`, and the presence of all five stories in `index.json`. **None
of those execute the component.** A green build is not evidence of a green
render. Visual confirmation is now mandatory before any component is called
done (§14 already required this — the process gap was applying it from Phase 2
rather than Phase 0).

## Investigation — first hypothesis was wrong

Initial diagnosis blamed `IconProps extends Omit<LucideProps, …>` flooding
docgen with the inherited SVG prop surface, causing Storybook to synthesise a
`children` arg. A `propFilter` was added and the story **still failed**.

Evidence that killed it: after the filter, `story.argTypes` contained exactly
`['icon', 'size', 'label']` and `initialArgs.children` was `undefined`. The args
were clean and the story still crashed. A control smoke story
(`Debug/Smoke`, plain `<div>`) rendered fine, which cleared the preview
decorator and Tailwind, isolating the fault to `Icon` itself.

## Root cause (confirmed)

Reading the Vite-transformed module Storybook actually serves
(`curl http://localhost:6006/src/components/atoms/Icon/Icon.tsx`):

```js
export const ICON_SIZES = { sm: 14, md: 16, lg: 20 };
...
ICON_SIZES.displayName = "ICON_SIZES";
ICON_SIZES.__docgenInfo = { description: …, displayName: …, filePath: …, methods: …, props: …, tags: … };
ICON_STROKE_WIDTH.__docgenInfo = { … };
```

The react-docgen-typescript Vite plugin annotates **every exported binding in a
`.tsx` file**, not just components. `ICON_SIZES` — a plain object — therefore
gained two extra enumerable keys at runtime.

The `Sizes` story iterated `Object.keys(ICON_SIZES)`, which returned five
entries instead of three:

| key | `ICON_SIZES[key]` | resulting symptom |
|---|---|---|
| `sm` / `md` / `lg` | `14` / `16` / `20` | correct |
| `displayName` | `"ICON_SIZES"` | `<svg width="ICON_SIZES">` — "Expected length" |
| `__docgenInfo` | the docgen object | `<svg width="[object Object]">`, **and** rendered as a React child → the overlay |

Every observed symptom is explained, including the exact key list in the error
message. The overlay text and the console warnings were two faces of one defect.

## Fix

1. **`src/components/atoms/Icon/Icon.constants.ts` (new, `.ts` not `.tsx`)** —
   holds `ICON_SIZE_PX`, `ICON_SIZES`, `ICON_STROKE_WIDTH`, `IconSize`. The
   docgen plugin only processes `.tsx`, so nothing in this file is mutated.
   **This is the systemic fix**: it generalises to all 48 components.
2. **`Icon.stories.tsx`** — iterate the explicit `ICON_SIZES` tuple rather than
   `Object.keys()` of an object, so iteration order is intentional and immune
   to any future mutation.
3. **`Icon.tsx`** — no re-export of the constants through the `.tsx` barrel,
   which would risk re-triggering annotation. Consumers import from
   `./Icon.constants`.
4. **`Icon.tsx`** — `{...rest}` spread first so computed size always wins.
   Retained as defensive ordering, though it was not the cause.
5. **`.storybook/main.ts`** — the `propFilter` is retained. It did not fix this
   bug, but it is independently correct: it stops Storybook generating controls
   for several hundred inherited `node_modules` props on every Radix/lucide
   wrapper, which would make every prop table unreadable.

## Repo rule established

**Shared constant maps live in `.ts` files, never `.tsx`.** Any exported
non-component binding in a `.tsx` file will be mutated at runtime by docgen.

## Verification

- [x] `Atoms/Icon` renders in the browser, light and dark
- [x] No console errors on the story iframe
- [x] `tsc --noEmit` clean
- [x] `eslint .` clean
- [x] Sizes story shows 14 / 16 / 20px, visually distinct
