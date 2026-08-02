import * as React from 'react'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { cn } from '@/lib/cn'
import { APPROVAL_COLUMNS } from '../_tables/columns'

export interface TableHeaderApprovalsProps
  extends React.ComponentPropsWithoutRef<'thead'> {
  allSelected?: boolean | 'indeterminate'
  onSelectAll?: (checked: boolean) => void
}

/**
 * Column headings for the approver queue.
 *
 * `38 select · 1.5fr consultant · 1.05fr period · 1.15fr project · 92 hours ·
 * 118 submitted · 96 review`, summing to 1384 inside a 1440 frame with 28
 * gutters and no sidebar.
 *
 * Review is right-aligned and last, because the decision is the end of the
 * scan, not the start of it.
 */
export const TableHeaderApprovals = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderApprovalsProps
>(function TableHeaderApprovals(
  { allSelected = false, onSelectAll, className, ...rest },
  ref,
) {
  return (
    <thead {...rest} ref={ref} className={cn('bg-background', className)}>
      <tr className="border-border border-b">
        {APPROVAL_COLUMNS.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={cn(
              'text-ui-overline text-subtle-foreground h-[34px] px-2.5 align-middle font-medium uppercase',
              col.align === 'right' ? 'text-right' : 'text-left',
            )}
          >
            {col.key === 'select' ? (
              <>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(v) => onSelectAll?.(v === true)}
                  aria-label="Select all timesheets"
                />
                <span className="sr-only">{col.srLabel}</span>
              </>
            ) : (
              col.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
})
