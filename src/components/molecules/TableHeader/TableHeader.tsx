import * as React from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { cn } from '@/lib/cn'
import type { SortDirection, TableColumn, TableSort } from '../_tables/columns'

export interface TableHeaderProps
  extends React.ComponentPropsWithoutRef<'thead'> {
  /** The shared column definition. The rows below must read the same one. */
  columns: TableColumn[]
  /** `'indeterminate'` when only some rows on the page are selected. */
  allSelected?: boolean | 'indeterminate'
  /** Omit to render no select-all control, even if a `select` column exists. */
  onSelectAll?: ((checked: boolean) => void) | undefined
  /**
   * Name the rows: "Select all invoices", not "Select all".
   * @default 'Select all rows'
   */
  selectAllLabel?: string
  /** The current sort, or `undefined` for the natural order. */
  sort?: TableSort | undefined
  /**
   * Called with the column and the direction it should move to. Ascending
   * first, then descending, then ascending again — this component does not
   * offer "unsorted" as a third press, because a list with no order is not a
   * state anyone asks for.
   *
   * Omit it and sortable columns render as plain headings.
   */
  onSortChange?: ((key: string, direction: SortDirection) => void) | undefined
}

const HEAD_CELL =
  'text-ui-overline text-subtle-foreground h-[34px] px-2.5 align-middle font-medium uppercase'

/**
 * Column headings for any table, driven by a `TableColumn[]`.
 *
 * This is `TableHeaderInvoices` with the invoices removed. The domain headers
 * stay exactly as they are — they encode two screens' worth of decisions about
 * ordering and alignment — but the nine other list screens in the product
 * (clients, projects, consultants, timesheets, approvers, documents, audit log,
 * and the two system-admin lists) had a `TableShell` to sit in and nothing to
 * put in it.
 *
 * **Sorting.** A sortable heading is a real `<button>` inside its `<th>`, and
 * the `<th>` carries `aria-sort` — `ascending`, `descending`, or `none` when
 * some other column holds the sort. Non-sortable columns carry no `aria-sort`
 * at all, which is correct: the attribute means "this is sortable and here is
 * its state", not "this is unsorted".
 *
 * State stays with the caller, like selection and paging, so `DataTable`
 * remains presentational.
 *
 * **Not reviewed by design.** Heading typography, height and alignment are
 * `TableHeaderInvoices`'s, unchanged. The sort glyph is a lucide arrow at the
 * icon size the rest of the table already uses.
 */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader(
  {
    columns,
    allSelected = false,
    onSelectAll,
    selectAllLabel = 'Select all rows',
    sort,
    onSortChange,
    className,
    ...rest
  },
  ref,
) {
  return (
    <thead {...rest} ref={ref} className={cn('bg-background', className)}>
      <tr className="border-border border-b">
        {columns.map((col) => {
          const sortable = col.sortable === true && onSortChange !== undefined
          const active = sortable && sort?.key === col.key
          const direction = active ? sort.direction : undefined

          return (
            <th
              key={col.key}
              scope="col"
              aria-sort={sortable ? (direction ?? 'none') : undefined}
              className={cn(HEAD_CELL, col.align === 'right' ? 'text-right' : 'text-left')}
            >
              {col.key === 'select' && onSelectAll ? (
                <>
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => onSelectAll(v === true)}
                    aria-label={selectAllLabel}
                  />
                  {col.srLabel ? <span className="sr-only">{col.srLabel}</span> : null}
                </>
              ) : sortable ? (
                <button
                  type="button"
                  onClick={() =>
                    onSortChange(col.key, direction === 'ascending' ? 'descending' : 'ascending')
                  }
                  className={cn(
                    'rounded-pip inline-flex items-center gap-1.5 uppercase transition-colors',
                    active ? 'text-foreground' : 'hover:text-foreground',
                    col.align === 'right' && 'flex-row-reverse',
                  )}
                >
                  {col.label}
                  {direction === 'ascending' ? (
                    <ArrowUp className="size-3" strokeWidth={2} aria-hidden />
                  ) : direction === 'descending' ? (
                    <ArrowDown className="size-3" strokeWidth={2} aria-hidden />
                  ) : (
                    // Shown at all times, not on hover: a sort affordance that
                    // only appears under a pointer is invisible to everyone
                    // else.
                    <ChevronsUpDown
                      // Not faint-foreground: it is 2.41:1 and this glyph is
                      // the only thing saying the column can be sorted.
                      className="text-subtle-foreground size-3"
                      strokeWidth={2}
                      aria-hidden
                    />
                  )}
                </button>
              ) : col.label ? (
                col.label
              ) : col.srLabel ? (
                <span className="sr-only">{col.srLabel}</span>
              ) : null}
            </th>
          )
        })}
      </tr>
    </thead>
  )
})
