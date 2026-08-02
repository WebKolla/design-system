import * as React from 'react'
import { cn } from '@/lib/cn'

export interface StepCardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Two-digit step number, e.g. "01". Mono, because it is an identifier. */
  number: string
  title: string
  body: string
}

/**
 * Numbered step cell for "How it works".
 *
 * **Square corners by design** — the cell sits in a 3-up hairline grid (1px
 * gaps over `color/border`) and the parent grid clips the corners. Do not add
 * a radius here: the container owns radius, border and clipping, and a rounded
 * cell inside a clipped grid produces a visible notch.
 */
export const StepCard = React.forwardRef<HTMLDivElement, StepCardProps>(
  function StepCard({ number, title, body, className, ...rest }, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn('bg-surface flex w-full flex-col gap-2.5 p-6', className)}
      >
        <span className="text-subtle-foreground font-mono text-mono-count tabular-nums">
          {number}
        </span>
        <h3 className="text-heading-card-title text-foreground">{title}</h3>
        <p className="text-body-cell text-muted-foreground">{body}</p>
      </div>
    )
  },
)
