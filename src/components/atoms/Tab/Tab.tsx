import * as React from 'react'
import { cn } from '@/lib/cn'

export interface TabProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string
  /** Rendered mono. Omit to hide the count entirely. */
  count?: string | number
  /** @default false */
  active?: boolean
  /**
   * Recolour the count to danger when the number *is* the problem — Overdue on
   * invoices, Rejected on timesheets. Never recolour the label itself.
   * @default false
   */
  countIsProblem?: boolean
}

/**
 * Status tab for a list screen.
 *
 * The count is the point: for most visits the count is the whole answer
 * ("how many are overdue?") and the person never opens the table.
 *
 * Active carries a 2px primary underline and a primary label. The underline is
 * drawn as a bottom border on the tab itself, so a row of tabs forms a
 * continuous hairline with the active segment picked out.
 */
export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  {
    label,
    count,
    active = false,
    countIsProblem = false,
    className,
    type,
    ...rest
  },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type ?? 'button'}
      role="tab"
      aria-selected={active}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 px-2.5 text-ui-sm transition-colors',
        active
          ? 'border-primary text-primary border-b-2'
          : 'border-hairline text-muted-foreground hover:text-foreground border-b',
        className,
      )}
    >
      {label}
      {count !== undefined ? (
        <span
          className={cn(
            'font-mono text-[12px] tabular-nums',
            countIsProblem ? 'text-danger' : 'text-faint-foreground',
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
})
