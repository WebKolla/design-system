import * as React from 'react'
import { ButtonInk } from '@/components/atoms/ButtonInk/ButtonInk'
import { Container } from '@/components/atoms/Container/Container'
import { cn } from '@/lib/cn'

export interface DarkCtaBandProps
  extends React.ComponentPropsWithoutRef<'section'> {
  heading: string
  /**
   * Rendered in `ink-muted`, never `muted-foreground` — the latter measures
   * about 2:1 on ink and shipped once as an invisible line.
   */
  sub?: string | undefined
  primary: { label: string; href?: string }
  /** Doubles as the next-page link on pillar pages. */
  secondary?: { label: string; href?: string } | undefined
  /** Widens the content column to 1280, matching a `wide` `Section`. */
  wide?: boolean
}

/**
 * Closing CTA on ink. **One per page maximum.**
 *
 * Uses `ButtonInk`, not `Button` — the ink surface needs the ink-bound
 * variants.
 *
 * The ink block is full-bleed and its contents sit on `Container`, the same
 * centred column `Section`, `SiteHeader` and `SiteFooter` use. The band used to
 * lay its children straight on to its full-width root with a fixed `px-10`
 * gutter, so above 1160 the heading started at the window edge while the footer
 * directly beneath it was on the column.
 *
 * Both text blocks are `max-width`, not fixed width: heading 600, sub 540, on
 * `width: 100%`. Those caps set line length, which is a different concern from
 * where the block starts — without them the heading would take the column's
 * full 1160 measure. A fixed width here overflows at 390, which is exactly what
 * broke this band during the Figma build.
 *
 * Everything on this surface uses `ink-*` colours. `muted-foreground` on ink
 * fails contrast at roughly 2:1 and must never appear here.
 */
export const DarkCtaBand = React.forwardRef<HTMLElement, DarkCtaBandProps>(
  function DarkCtaBand(
    { heading, sub, primary, secondary, wide = false, className, ...rest },
    ref,
  ) {
    return (
      <section
        {...rest}
        ref={ref}
        className={cn('bg-ink w-full py-16', className)}
      >
        <Container wide={wide} className="flex flex-col items-start gap-4.5">
          <h2 className="text-heading-section text-ink-foreground w-full max-w-[600px]">
            {heading}
          </h2>

          {sub ? (
            <p className="text-body-lg text-ink-muted w-full max-w-[540px]">
              {sub}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2.5">
            {primary.href ? (
              <ButtonInk asChild>
                <a href={primary.href}>{primary.label}</a>
              </ButtonInk>
            ) : (
              <ButtonInk>{primary.label}</ButtonInk>
            )}

            {secondary ? (
              secondary.href ? (
                <ButtonInk variant="secondary" asChild>
                  <a href={secondary.href}>{secondary.label}</a>
                </ButtonInk>
              ) : (
                <ButtonInk variant="secondary">{secondary.label}</ButtonInk>
              )
            ) : null}
          </div>
        </Container>
      </section>
    )
  },
)
