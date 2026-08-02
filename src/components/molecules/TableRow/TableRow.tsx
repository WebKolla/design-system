import * as React from 'react'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { cn } from '@/lib/cn'

export interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  /**
   * 42 comfortable, 30 compact. Compact is for a table someone scans rather
   * than reads — an audit log, not an invoice list.
   * @default 'comfortable'
   */
  density?: 'comfortable' | 'compact'
  /** Zebra striping for long tables. */
  alt?: boolean
  selected?: boolean
  /**
   * Pass this to get the leading checkbox cell. Omit it and the row renders
   * only the cells you give it, for a table with no selection.
   */
  onSelectedChange?: ((checked: boolean) => void) | undefined
  /**
   * Names the row for the checkbox: "Select invoice TS-1042". Required
   * whenever `onSelectedChange` is set, because "Select" repeated forty times
   * is not a set of distinguishable controls.
   */
  selectLabel?: string
}

/**
 * A table row on the shared column grid, with nothing domain-specific in it.
 *
 * This is `TableRowInvoice` with the invoice columns removed: same height, same
 * hairline divider, same selected and zebra treatments. Cells come from
 * `TableCell`, which carries the typography rules the invoice row hardcoded.
 *
 * `TableRowInvoice` and `TableRowApproval` are untouched. They encode two
 * screens' worth of decisions that a generic row cannot express, and rewriting
 * them on top of this one would put those decisions at risk for no benefit.
 *
 * **Not reviewed by design.** Every class is `TableRowInvoice`'s.
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    {
      density = 'comfortable',
      alt = false,
      selected = false,
      onSelectedChange,
      selectLabel,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <tr
        {...rest}
        ref={ref}
        data-state={selected ? 'selected' : undefined}
        className={cn(
          'border-hairline border-b transition-colors',
          density === 'comfortable' ? 'h-[42px]' : 'h-[30px]',
          selected ? 'bg-primary-soft' : alt ? 'bg-surface-raised' : 'bg-surface',
          className,
        )}
      >
        {onSelectedChange ? (
          <td className="px-2.5 align-middle">
            <Checkbox
              checked={selected}
              onCheckedChange={(v) => onSelectedChange(v === true)}
              aria-label={selectLabel ?? 'Select row'}
            />
          </td>
        ) : null}
        {children}
      </tr>
    )
  },
)
