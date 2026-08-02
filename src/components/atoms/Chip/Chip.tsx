import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// 11px is a literal: the label is sized to the 18px chip. ui/overline is also
// 11 but is tracked and uppercase, so it is the wrong style, not a match.
const chipVariants = cva(
  'inline-flex h-[18px] items-center rounded-pip px-[7px] text-[11px] font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        success: 'bg-success-bg text-success',
        warn: 'bg-warn-bg text-warn',
        danger: 'bg-danger-bg text-danger',
        neutral: 'bg-control text-muted-foreground',
      },
    },
    defaultVariants: { tone: 'success' },
  },
)

export type ChipTone = 'success' | 'warn' | 'danger' | 'neutral'

export interface ChipProps extends React.ComponentPropsWithoutRef<'span'> {
  /**
   * Tone drives fill and text together. Do not recolour a chip by overriding
   * the fill — pick the tone.
   * @default 'success'
   */
  tone?: ChipTone
}

/**
 * Small tonal label for inline metadata.
 *
 * Distinct from `StatusPill`, which carries workflow state and a leading dot.
 * A chip is a bare value; a pill is a state.
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone = 'success', className, ...rest },
  ref,
) {
  return (
    <span {...rest} ref={ref} className={cn(chipVariants({ tone }), className)} />
  )
})
