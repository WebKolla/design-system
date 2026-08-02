import * as React from 'react'
import { TableShell } from '@/components/molecules/_tables/TableShell'
import type { TableColumn } from '@/components/molecules/_tables/columns'
import { cn } from '@/lib/cn'

export interface DataTableProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The shared column definition — `INVOICE_COLUMNS` or `APPROVAL_COLUMNS`.
   * Header and rows must be built from the same one.
   */
  columns: TableColumn[]
  /** Required: a table without a caption is unnavigable by screen reader. */
  caption: string
  /** A `TableHeader*` molecule. */
  header: React.ReactNode
  /** `TableRow*` molecules. Pass nothing and `empty` renders instead. */
  children?: React.ReactNode
  /** An `EmptyState`, shown when there are no rows. */
  empty?: React.ReactNode
  /** A `Pagination`, rendered beneath the table inside the same card. */
  pagination?: React.ReactNode
}

/**
 * **Does not exist as a Figma component.** It exists in the file only as
 * assemblies inside screens, so it is composed here from the header, row and
 * pagination molecules.
 *
 * This organism owns three things the molecules deliberately do not:
 *
 * 1. the enclosing card — border, radius and clipping;
 * 2. the `<table>`, `<caption>` and `<colgroup>`, so header and rows share one
 *    column definition and cannot drift;
 * 3. horizontal overflow, so a wide table scrolls inside its card rather than
 *    pushing the page sideways.
 *
 * It is deliberately presentational: sorting, selection and paging state live
 * with the caller. Below 768 the caller should render list cards instead.
 */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  function DataTable(
    { columns, caption, header, children, empty, pagination, className, ...rest },
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
          <TableShell columns={columns} caption={caption}>
            {header}
            {hasRows ? <tbody>{children}</tbody> : null}
          </TableShell>
        </div>

        {!hasRows && empty ? <div className="p-4">{empty}</div> : null}
        {hasRows && pagination ? pagination : null}
      </div>
    )
  },
)
