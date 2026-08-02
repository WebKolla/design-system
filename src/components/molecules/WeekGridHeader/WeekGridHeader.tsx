import * as React from 'react'
import { cn } from '@/lib/cn'
import { WEEK_COLUMNS, WEEKEND_KEYS } from '../_tables/columns'

export interface WeekDay {
  /** Short day name, e.g. "Mon". Rendered as an overline cap. */
  day: string
  /** Date of month, e.g. "27". Mono. */
  date: string
}

export interface WeekGridHeaderProps
  extends React.ComponentPropsWithoutRef<'thead'> {
  /** Exactly seven, Monday first. */
  days: WeekDay[]
}

const isWeekend = (key: string) =>
  (WEEKEND_KEYS as readonly string[]).includes(key)

/**
 * Week grid column headings.
 *
 * Column grid `266px repeat(7,1fr) 84px`. **Weekend columns are recessed onto
 * `color/control` from the header down**, so the eye reads Sat and Sun as
 * different without them being missing.
 *
 * The date sits under the day name in mono, so the grid position itself
 * carries the date — which is why `WeekGridRow` has no date field.
 */
export const WeekGridHeader = React.forwardRef<
  HTMLTableSectionElement,
  WeekGridHeaderProps
>(function WeekGridHeader({ days, className, ...rest }, ref) {
  const dayColumns = WEEK_COLUMNS.filter(
    (c) => c.key !== 'project' && c.key !== 'total',
  )

  return (
    <thead {...rest} ref={ref} className={cn('bg-background', className)}>
      <tr className="border-border border-b">
        <th
          scope="col"
          className="text-ui-overline text-subtle-foreground h-10 px-2.5 text-left align-middle font-medium uppercase"
        >
          Project
        </th>

        {dayColumns.map((col, i) => {
          const d = days[i]
          const weekend = isWeekend(col.key)
          return (
            <th
              key={col.key}
              scope="col"
              className={cn(
                'h-10 px-2.5 text-left align-middle',
                weekend && 'bg-control',
              )}
            >
              <span
                className={cn(
                  'text-ui-overline block font-medium uppercase',
                  weekend ? 'text-faint-foreground' : 'text-subtle-foreground',
                )}
              >
                {d?.day ?? col.label}
              </span>
              <span
                className={cn(
                  'block font-mono text-[10.5px] tabular-nums',
                  weekend ? 'text-chart-6' : 'text-faint-foreground',
                )}
              >
                {d?.date ?? ''}
              </span>
            </th>
          )
        })}

        <th
          scope="col"
          className="text-ui-overline text-subtle-foreground h-10 px-2.5 text-left align-middle font-medium uppercase"
        >
          Total
        </th>
      </tr>
    </thead>
  )
})
