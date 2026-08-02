import * as React from 'react'
import { WeekGridCell } from '@/components/atoms/WeekGridCell/WeekGridCell'
import { Chip } from '@/components/atoms/Chip/Chip'
import { cn } from '@/lib/cn'
import { WEEK_COLUMNS, WEEKEND_KEYS } from '../_tables/columns'

export interface WeekGridRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  project: string
  task: string
  /** Exactly seven values, Monday first. Empty string renders the mid-dot. */
  values: string[]
  /** Row total. Mono SemiBold. */
  total: string
  /** Off by default. */
  nonBillable?: boolean
  onValueChange?: (dayIndex: number, value: string) => void
}

const DAY_KEYS = WEEK_COLUMNS.filter(
  (c) => c.key !== 'project' && c.key !== 'total',
).map((c) => c.key)

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * One project across one week.
 *
 * **No date field**: grid position is the date, and asking for a date inside a
 * period already declared above it is the most redundant input in the product.
 *
 * Seven nested `WeekGridCell`s, Monday to Sunday. Weekend columns keep the
 * recessed treatment from the header down.
 */
export const WeekGridRow = React.forwardRef<HTMLTableRowElement, WeekGridRowProps>(
  function WeekGridRow(
    { project, task, values, total, nonBillable = false, onValueChange, className, ...rest },
    ref,
  ) {
    return (
      <tr
        {...rest}
        ref={ref}
        className={cn('bg-surface border-hairline h-[42px] border-b', className)}
      >
        <td className="px-2.5 align-middle">
          <span className="flex items-center gap-2">
            <span className="min-w-0">
              <span className="text-body-cell text-foreground block truncate">
                {project}
              </span>
              <span className="text-body-micro text-subtle-foreground block truncate">
                {task}
              </span>
            </span>
            {nonBillable ? <Chip tone="neutral">Non-billable</Chip> : null}
          </span>
        </td>

        {DAY_KEYS.map((key, i) => {
          const weekend = (WEEKEND_KEYS as readonly string[]).includes(key)
          return (
            <td key={key} className={cn('p-0 align-middle', weekend && 'bg-control')}>
              <WeekGridCell
                value={values[i] ?? ''}
                {...(weekend ? { state: 'weekend' as const } : {})}
                aria-label={`${project}, ${DAY_LABELS[i]} hours`}
                onChange={(e) => onValueChange?.(i, e.currentTarget.value)}
              />
            </td>
          )
        })}

        <td className="text-foreground px-2.5 text-left align-middle font-mono text-mono-cell font-semibold tabular-nums">
          {total}
        </td>
      </tr>
    )
  },
)
