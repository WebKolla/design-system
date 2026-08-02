import * as React from 'react'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { cn } from '@/lib/cn'
import { INVOICE_COLUMNS } from '../_tables/columns'

export interface TableHeaderInvoicesProps
  extends React.ComponentPropsWithoutRef<'thead'> {
  /** `'indeterminate'` when only some rows on the page are selected. */
  allSelected?: boolean | 'indeterminate'
  onSelectAll?: (checked: boolean) => void
}

/**
 * Column headings for the invoices table.
 *
 * Headings are overline caps. The amount column is right-aligned here and in
 * every row, because a column of figures whose decimal points align can be
 * compared at a glance and one that does not cannot.
 *
 * Widths come from the shared column definition, so this and `TableRowInvoice`
 * cannot drift apart.
 */
export const TableHeaderInvoices = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderInvoicesProps
>(function TableHeaderInvoices(
  { allSelected = false, onSelectAll, className, ...rest },
  ref,
) {
  return (
    <thead {...rest} ref={ref} className={cn('bg-background', className)}>
      <tr className="border-border border-b">
        {INVOICE_COLUMNS.map((col) => (
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
                  aria-label="Select all invoices"
                />
                <span className="sr-only">{col.srLabel}</span>
              </>
            ) : col.label ? (
              col.label
            ) : (
              <span className="sr-only">{col.srLabel}</span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
})
