/**
 * Icon constants.
 *
 * This file is deliberately `.ts`, not `.tsx`.
 *
 * Storybook's react-docgen-typescript Vite plugin processes `**\/*.tsx` and
 * annotates *every exported binding* in those files with `displayName` and
 * `__docgenInfo` — not just components. An exported plain object therefore
 * gains two extra enumerable keys, which silently corrupts any
 * `Object.keys()` / `Object.entries()` iteration over it. See BUG-001.
 *
 * Rule for this repo: shared constant maps live in `.ts` files.
 */

/** Icon sizes in px. `sm` pairs with 13px text, `md` is the default, `lg` with headings. */
export const ICON_SIZE_PX = { sm: 14, md: 16, lg: 20 } as const

export type IconSize = keyof typeof ICON_SIZE_PX

/**
 * Explicit iteration order for stories and docs.
 * Prefer this over `Object.keys(ICON_SIZE_PX)` so ordering is intentional.
 */
export const ICON_SIZES = ['sm', 'md', 'lg'] as const satisfies readonly IconSize[]

/** Default stroke width across the system is 1.75, not lucide's 2 (§4). */
export const ICON_STROKE_WIDTH = 1.75
