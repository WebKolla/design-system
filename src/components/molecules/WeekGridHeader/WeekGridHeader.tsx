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
              {/*
                Weekend used to be signalled a second time in the text colour,
                with faint-foreground and chart-6 — both of which fail contrast,
                and chart-6 is a chart series colour with no business being
                text. The `bg-control` on the cell already says "weekend", so
                the two-level hierarchy here is day name over date and nothing
                else.
              */}
              <span className="text-ui-overline text-muted-foreground block font-medium uppercase">
                {d?.day ?? col.label}
              </span>
              <span className="text-subtle-foreground text-mono-count block font-mono tabular-nums">
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
