import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Our type tokens live in Tailwind's `text-*` namespace, the same namespace as
 * text colour.
 *
 * tailwind-merge only knows Tailwind's built-in font sizes, so it classifies
 * `text-ui-lg` as a *text colour* and then drops any real colour class from the
 * same group. In practice that silently turned every Button label the inherited
 * foreground: `text-primary-foreground` was emitted before `text-ui-lg`, so the
 * "later" class won and resolved to nothing.
 *
 * Registering the ramp as font sizes keeps the two groups distinct, so size and
 * colour can coexist on one element.
 *
 * **Every `--text-*` token in `globals.css` must appear here.** Forgetting one
 * reintroduces the bug for that token only, which is the hardest version of it
 * to spot. `cn.test.ts` reads the token file and fails if the two drift.
 */
export const TYPE_RAMP = [
  'heading-display',
  'heading-hero',
  'heading-section',
  'heading-page-title',
  'heading-card-title',
  'heading-block',
  'body-lg',
  'body',
  'body-cell',
  'body-caption',
  'body-micro',
  'ui-lg',
  'ui-md',
  'ui-sm',
  'ui-xs',
  'ui-label',
  'ui-overline',
  'ui-nav-section',
  'mono-price',
  'mono-kpi',
  'mono-metric',
  'mono-amount',
  'mono-cell',
  'mono-count',
  'mono-md',
  'mono-sm',
  'mono-xs',
  'mono-2xs',
  'ui-micro',
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TYPE_RAMP] }],
    },
  },
})

/** Merge class names, with later Tailwind utilities winning over earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
