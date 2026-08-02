import * as React from 'react'
import { cn } from '@/lib/cn'

export type TableCellVariant = 'text' | 'muted' | 'numeric' | 'date' | 'link' | 'plain'

export interface TableCellProps extends React.ComponentPropsWithoutRef<'td'> {
  /**
   * - `text` — the first column, `--color-foreground`. What the row is.
   * - `muted` — every other prose column.
   * - `numeric` — mono, tabular, right-aligned. Hours, rates, amounts.
   * - `date` — mono at the smaller step, left-aligned. Issued, due, submitted.
   * - `link` — mono in `--color-primary`. Identifiers that are the link.
   * - `plain` — no typography at all. For a cell holding a control, a
   *   `StatusPill` or an `Avatar`, which bring their own.
   * @default 'muted'
   */
  variant?: TableCellVariant
  /** Overrides the variant's own alignment. */
  align?: 'left' | 'right'
  /**
   * Truncate rather than wrap. On by default for prose, because a wrapping cell
   * silently changes the row height and breaks the 42px rhythm.
   */
  truncate?: boolean
}

const VARIANT: Record<TableCellVariant, string> = {
  text: 'text-body-cell text-foreground',
  muted: 'text-body-cell text-muted-foreground',
  numeric: 'text-mono-cell text-foreground font-mono tabular-nums',
  date: 'text-mono-md text-muted-foreground font-mono tabular-nums',
  link: 'text-mono-cell text-primary font-mono tabular-nums',
  plain: '',
}

/** Figures right-align so decimal points line up down the column. */
const DEFAULT_ALIGN: Record<TableCellVariant, 'left' | 'right'> = {
  text: 'left',
  muted: 'left',
  numeric: 'right',
  date: 'left',
  link: 'left',
  plain: 'left',
}

/**
 * One cell, carrying the typography rule its column implies.
 *
 * The rules are not new. `TableRowInvoice` already applies all six: the invoice
 * number is mono in `primary` because it is the link, the client is
 * `foreground` because it is what the row is about, the consultant is `muted`,
 * the dates are mono at the smaller step, the amount is mono and right-aligned,
 * and the status and actions cells carry nothing because the pill and the
 * button bring their own. They were spelt out inline in that one component.
 * Here they have names.
 *
 * Alignment must match the column definition the header reads, or the heading
 * and its figures part company. Pass `align` only to override.
 *
 * **Not reviewed by design.** Every class is `TableRowInvoice`'s.
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    { variant = 'muted', align, truncate, className, ...rest },
    ref,
  ) {
    const resolvedAlign = align ?? DEFAULT_ALIGN[variant]
    const shouldTruncate = truncate ?? (variant === 'text' || variant === 'muted')

    return (
      <td
        {...rest}
        ref={ref}
        className={cn(
          'px-2.5 align-middle',
          VARIANT[variant],
          resolvedAlign === 'right' ? 'text-right' : 'text-left',
          shouldTruncate && 'truncate',
          className,
        )}
      />
    )
  },
)
