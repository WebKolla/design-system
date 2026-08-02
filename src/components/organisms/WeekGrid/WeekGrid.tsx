import * as React from 'react'
import { TableShell } from '@/components/molecules/_tables/TableShell'
import { WEEK_COLUMNS } from '@/components/molecules/_tables/columns'
import {
  WeekGridHeader,
  type WeekDay,
} from '@/components/molecules/WeekGridHeader/WeekGridHeader'
import { WeekGridTotalRow } from '@/components/molecules/WeekGridTotalRow/WeekGridTotalRow'
import { cn } from '@/lib/cn'

export interface WeekGridProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Required caption, e.g. "Week commencing 27 July 2026". */
  caption: string
  /** Exactly seven days, Monday first. */
  days: WeekDay[]
  /** `WeekGridRow` molecules. */
  children?: React.ReactNode
  /** Seven daily totals, Monday first. Empty renders the mid-dot. */
  dayTotals: string[]
  /** The week total. */
  weekTotal: string
  /** Shown in place of the body when there are no project rows. */
  empty?: React.ReactNode
}

/**
 * **Does not exist as a Figma component** — composed from the header, row and
 * total row.
 *
 * Owns the card, the `<table>` and the shared `266px repeat(7,1fr) 84px`
 * column definition, so the three parts cannot drift. The totals row sits in a
 * `<tfoot>` so it is announced as a summary.
 *
 * Below 768 the caller replaces this entirely with the day-picker strip —
 * never render a 7-column grid at 390, the cells become untappable.
 */
export const WeekGrid = React.forwardRef<HTMLDivElement, WeekGridProps>(
  function WeekGrid(
    { caption, days, children, dayTotals, weekTotal, empty, className, ...rest },
    ref,
  ) {
    const hasRows = React.Children.count(children) > 0

    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'bg-surface border-border w-full overflow-hidden rounded-card border',
          className,
        )}
      >
        <div className="w-full overflow-x-auto">
          <TableShell columns={WEEK_COLUMNS} caption={caption}>
            <WeekGridHeader days={days} />
            {hasRows ? <tbody>{children}</tbody> : null}
            {hasRows ? (
              <tfoot>
                <WeekGridTotalRow days={dayTotals} week={weekTotal} />
              </tfoot>
            ) : null}
          </TableShell>
        </div>

        {!hasRows && empty ? <div className="p-4">{empty}</div> : null}
      </div>
    )
  },
)
