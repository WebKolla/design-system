import * as React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { cn } from '@/lib/cn'

export interface PricingTierCardProps
  extends React.ComponentPropsWithoutRef<'article'> {
  name: string
  blurb: string
  /** Headline price, e.g. "$33". Rendered `mono/price` — the one ramp exception. */
  amount: string
  /** e.g. "per month". */
  period: string
  /** e.g. "First 2 months free". Shown above the price in success. */
  promo?: string | undefined
  /**
   * Allowance and overage lines. An array, not numbered props: tiers carry a
   * different number of these and Figma deliberately does not model them as
   * component properties.
   */
  meta: string[]
  /** Feature list. Between four and seven per tier. */
  features: string[]
  cta: { label: string; href?: string }
  /** Adds the primary border and the overhanging badge. */
  recommended?: boolean
  /** @default 'Recommended' */
  badgeLabel?: string
}

/**
 * Marketing pricing tier. 308 wide on the 1280 four-up grid.
 *
 * Base-fee model: headline price, member allowance, overage note.
 *
 * **The Recommended badge overhangs the card at `top: -10px`.** Any ancestor
 * with `overflow: hidden` eats it — and grid wrappers routinely get
 * `overflow: hidden` for rounded corners. If you need clipping for radius,
 * clip the *card*, not the grid. This component therefore sets no `overflow`
 * of its own, and the `Clipping` story shows what goes wrong when a parent
 * does.
 */
export const PricingTierCard = React.forwardRef<
  HTMLElement,
  PricingTierCardProps
>(function PricingTierCard(
  {
    name,
    blurb,
    amount,
    period,
    promo,
    meta,
    features,
    cta,
    recommended = false,
    badgeLabel = 'Recommended',
    className,
    ...rest
  },
  ref,
) {
  return (
    <article
      {...rest}
      ref={ref}
      className={cn(
        'bg-surface relative flex w-full flex-col gap-4 rounded-panel border p-6',
        recommended ? 'border-primary' : 'border-border',
        className,
      )}
    >
      {recommended ? (
        <span className="bg-primary text-primary-foreground absolute -top-2.5 left-6 rounded-control text-ui-nav-section px-2.5 py-0.5 uppercase">
          {badgeLabel}
        </span>
      ) : null}

      <div className="flex flex-col gap-1">
        <h3 className="text-heading-block text-foreground">{name}</h3>
        <p className="text-body-caption text-subtle-foreground">{blurb}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {promo ? (
          <span className="text-body-micro text-success">{promo}</span>
        ) : null}
        <div className="flex items-baseline gap-2">
          <span className="text-foreground font-mono text-mono-price tabular-nums">
            {amount}
          </span>
          <span className="text-body-caption text-subtle-foreground">{period}</span>
        </div>
      </div>

      <ul className="border-hairline flex flex-col gap-0.5 border-y py-3">
        {meta.map((line, i) => (
          <li
            key={line}
            className={cn(
              'text-body-caption',
              i === 0 ? 'text-foreground' : 'text-subtle-foreground',
            )}
          >
            {line}
          </li>
        ))}
      </ul>

      <ul className="flex flex-1 flex-col gap-1.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="text-body-caption text-muted-foreground flex items-start gap-2"
          >
            <span className="flex h-[19px] shrink-0 items-center">
              <Check className="text-primary size-3.5" strokeWidth={2} aria-hidden />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {cta.href ? (
        <Button
          size="md"
          variant={recommended ? 'primary' : 'secondary'}
          asChild
        >
          <a href={cta.href}>{cta.label}</a>
        </Button>
      ) : (
        <Button size="md" variant={recommended ? 'primary' : 'secondary'}>
          {cta.label}
        </Button>
      )}
    </article>
  )
})
