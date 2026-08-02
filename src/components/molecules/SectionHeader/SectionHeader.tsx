import * as React from 'react'
import { cn } from '@/lib/cn'

export interface SectionHeaderProps
  extends React.ComponentPropsWithoutRef<'div'> {
  heading: string
  /** Optional overline eyebrow. Geist, never mono, uppercased in CSS. */
  eyebrow?: string | undefined
  description?: string | undefined
  /** Centre for home and pricing, Left for pillar pages. @default 'centre' */
  align?: 'centre' | 'left'
  /** Heading level. @default 2 */
  as?: 'h1' | 'h2' | 'h3'
}

/**
 * Marketing section heading block.
 *
 * **Max-width, not fixed width.** Centre is `max-width: 840px`, Left is
 * `max-width: 1000px`, both on `width: 100%`. A fixed width here overflows at
 * 390 — that mistake broke the CTA band and seven Section header instances
 * during the Figma build, which is why this is spelled out rather than
 * inferred from the frame size.
 *
 * Renders a plain `div`, not a `header`: a section heading block is not a page
 * banner, and two of them on one page produce duplicate landmarks. The heading
 * level carries the semantics.
 *
 * The eyebrow is uppercased with `text-transform`. In Figma it is typed as
 * literal capitals only because setting `textCase` there detaches the style —
 * that was a tooling constraint, not a design decision.
 */
export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  SectionHeaderProps
>(function SectionHeader(
  { heading, eyebrow, description, align = 'centre', as: Tag = 'h2', className, ...rest },
  ref,
) {
  const centred = align === 'centre'

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'flex w-full flex-col gap-3',
        centred
          ? 'mx-auto max-w-[840px] items-center text-center'
          : 'max-w-[1000px] items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-ui-overline text-muted-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}

      <Tag className="text-heading-section text-foreground">{heading}</Tag>

      {description ? (
        <p className="text-body-lg text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
})
