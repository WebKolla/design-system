import * as React from 'react'
import { cn } from '@/lib/cn'

export interface StatCellProps extends React.ComponentPropsWithoutRef<'div'> {
  /** The headline word or figure, in primary. */
  value: string
  /** One short line of qualification. */
  label: string
}

/**
 * Floating stat card that overlays pillar-page hero photography.
 *
 * Hugs its content. Position it absolutely over the image with a 20px inset —
 * that positioning belongs to the page, not to this component, which sets no
 * external offset of its own.
 */
export const StatCell = React.forwardRef<HTMLDivElement, StatCellProps>(
  function StatCell({ value, label, className, ...rest }, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'bg-surface border-border inline-flex flex-col gap-0.5 rounded-card border px-4 py-3.5 shadow-e2',
          className,
        )}
      >
        <span className="text-heading-card-title text-primary">{value}</span>
        <span className="text-body-caption text-muted-foreground">{label}</span>
      </div>
    )
  },
)
