import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

/**
 * Derived, not designed.
 *
 * Every class here was lifted from a card that already ships:
 *
 * - surface, border and `rounded-card` — `KpiCard`, `CompletenessCard`,
 *   `ListCardInvoiceMobile`, `AttentionCardMobile`, `DataTable`, `WeekGrid`
 * - `rounded-panel` for the marketing context — `FeatureCardPhoto`,
 *   `PricingTierCard`
 * - `p-3.5` compact — `CompletenessCard`, both mobile list cards,
 *   `AttentionCardMobile`
 * - `p-4` standard — `KpiCard`, `ConsultantTimesheet`
 * - `p-6` roomy — `PricingTierCard`, the Home and Approval-workflows feature
 *   cards
 *
 * No new value was introduced and no token was added.
 */
const cardVariants = cva('bg-surface border-border w-full border', {
  variants: {
    /** Radius. App is `radius/card` (10); marketing is `radius/panel` (12). */
    context: {
      app: 'rounded-card',
      marketing: 'rounded-panel',
    },
    padding: {
      none: '',
      compact: 'p-3.5',
      standard: 'p-4',
      roomy: 'p-6',
    },
    /**
     * Flat by default, because every app card in this library is flat today.
     * `COMPONENTS.md` specifies `e1` for the generic surface; `e1` and `e2` are
     * offered rather than imposed, and the divergence is recorded there.
     */
    elevation: {
      none: '',
      e1: 'shadow-e1',
      e2: 'shadow-e2',
    },
  },
  defaultVariants: {
    context: 'app',
    padding: 'standard',
    elevation: 'none',
  },
})

export type CardContext = 'app' | 'marketing'
export type CardPadding = 'none' | 'compact' | 'standard' | 'roomy'
export type CardElevation = 'none' | 'e1' | 'e2'

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  /** @default 'app' */
  context?: CardContext
  /**
   * `none` is for a card that owns its own edge-to-edge content — a table or a
   * media panel — which is how `DataTable` and `FeatureCardPhoto` are built.
   * @default 'standard'
   */
  padding?: CardPadding
  /** @default 'none' */
  elevation?: CardElevation
  /**
   * Clip children to the radius. Required whenever the first or last child
   * paints to the card's edge, or the corners square off.
   * @default false
   */
  clip?: boolean
}

/**
 * The neutral container the domain cards are all special cases of.
 *
 * `KpiCard`, `CompletenessCard`, `StepCard`, `PricingTierCard` and the two
 * mobile list cards each re-declare this surface with their own content on top.
 * This is that surface with the content removed, so a screen with nothing
 * domain-specific to say does not have to inline
 * `bg-surface border border-border rounded-card p-4` for the twenty-second
 * time.
 *
 * It imposes no layout. Pass `flex flex-col gap-*` if you want the stack the
 * domain cards use; a container that forces a layout is not neutral.
 *
 * **Not reviewed by design.** Built ahead of its Figma node, derived entirely
 * from the cards above.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { context = 'app', padding = 'standard', elevation = 'none', clip = false, className, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        cardVariants({ context, padding, elevation }),
        clip && 'overflow-hidden',
        className,
      )}
    />
  )
})
