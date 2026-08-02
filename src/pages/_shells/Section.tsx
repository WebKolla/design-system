import * as React from 'react'
import { cn } from '@/lib/cn'
import { Container } from './MarketingShell'

export interface SectionProps {
  /** `raised` for the alternating band, `ink` for the dark ones. */
  tone?: 'default' | 'raised' | 'ink'
  /** Pricing widens to 1280. */
  wide?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * A marketing page band.
 *
 * The band is full-bleed and the content sits on the centred `max-width`
 * container, so background colour reaches the viewport edge while copy never
 * exceeds its measure. Vertical rhythm lives here rather than on the sections'
 * children, so no component carries external margin.
 */
export function Section({
  tone = 'default',
  wide = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      className={cn(
        'w-full py-16 md:py-20',
        tone === 'raised' && 'bg-surface-raised',
        tone === 'ink' && 'bg-ink',
        className,
      )}
    >
      <Container wide={wide}>{children}</Container>
    </section>
  )
}
