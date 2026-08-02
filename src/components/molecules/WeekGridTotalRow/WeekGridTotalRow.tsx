import * as React from 'react'
import { cn } from '@/lib/cn'
import { WEEK_COLUMNS, WEEKEND_KEYS } from '../_tables/columns'

export interface WeekGridTotalRowProps
  extends React.ComponentPropsWithoutRef<'tr'> {
  /** Exactly seven daily totals, Monday first. Empty renders the mid-dot. */
  days: string[]
  /** The week total. */
  week: string
  /** @default 'Daily total' */
  label?: string
}

const DAY_KEYS = WEEK_COLUMNS.filter(
  (c) => c.key !== 'project' && c.key !== 'total',
).map((c) => c.key)

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * Column totals under the grid.
 *
 * On `surface-raised` so it reads as a summary rather than another editable
 * row. Weekend columns stay recessed and show a mid-dot when nothing was
 * worked — the same rule as `WeekGridCell`: zero is a claim, blank is an
 * absence.
 *
 * Rendered in a `<tfoot>` so assistive technology announces it as a summary.
 */
export const WeekGridTotalRow = React.forwardRef<
  HTMLTableRowElement,
  WeekGridTotalRowProps
>(function WeekGridTotalRow(
  { days, week, label = 'Daily total', className, ...rest },
  ref,
) {
  return (
    <tr
      {...rest}
      ref={ref}
      className={cn('bg-surface-raised border-border border-t', className)}
    >
      <th
        scope="row"
        className="text-ui-sm text-muted-foreground h-10 px-2.5 text-left align-middle font-medium"
      >
        {label}
      </th>

      {DAY_KEYS.map((key, i) => {
        const weekend = (WEEKEND_KEYS as readonly string[]).includes(key)
        const value = days[i]
        const empty = !value
        return (
          <td
            key={key}
            aria-label={`${DAY_LABELS[i]} total`}
            className={cn(
              'h-10 px-2.5 text-left align-middle font-mono text-mono-cell tabular-nums',
              weekend && 'bg-control',
              empty || weekend ? 'text-subtle-foreground' : 'text-foreground',
            )}
          >
            {empty ? '·' : value}
          </td>
        )
      })}

      <td className="text-foreground h-10 px-2.5 text-left align-middle font-mono text-mono-cell font-semibold tabular-nums">
        {week}
      </td>
    </tr>
  )
})
