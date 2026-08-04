import * as React from 'react'
import { Ellipsis } from 'lucide-react'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { StatusPill, type StatusTone } from '@/components/atoms/StatusPill/StatusPill'
import { cn } from '@/lib/cn'

export interface TableRowInvoiceProps
  extends React.ComponentPropsWithoutRef<'tr'> {
  invoice: string
  client: string
  consultant: string
  issued: string
  due: string
  /** Pre-formatted through one `Intl.NumberFormat`, so currencies line up. */
  amount: string
  status: { label: string; tone: StatusTone }
  /**
   * Recolours the due date to danger. The date carries the warning so the
   * status pill is not the only signal.
   */
  overdue?: boolean
  /** Zebra striping for long tables. */
  alt?: boolean
  selected?: boolean
  onSelectedChange?: (checked: boolean) => void
}

const cell = 'px-2.5 align-middle'

/**
 * 42px invoice row on the shared column grid.
 *
 * Every figure is mono and tabular; the amount is right-aligned. The invoice
 * number is primary because it is the link.
 *
 * Below 768 this row becomes `ListCardInvoiceMobile`.
 */
export const TableRowInvoice = React.forwardRef<
  HTMLTableRowElement,
  TableRowInvoiceProps
>(function TableRowInvoice(
  {
    invoice,
    client,
    consultant,
    issued,
    due,
    amount,
    status,
    overdue = false,
    alt = false,
    selected = false,
    onSelectedChange,
    className,
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
        'border-hairline h-[42px] border-b transition-colors',
        selected ? 'bg-primary-soft' : alt ? 'bg-surface-raised' : 'bg-surface',
        className,
      )}
    >
      <td className={cell}>
        <Checkbox
          checked={selected}
          onCheckedChange={(v) => onSelectedChange?.(v === true)}
          aria-label={`Select invoice ${invoice}`}
        />
      </td>
      {/*
        `th scope="row"`, not `td`. The invoice number is the row's name, and
        marking it as the row header is what lets a screen reader announce
        "INV-0231, Amount, £11,400.00" as you move across rather than
        "Amount, £11,400.00" with no way to tell which invoice you are on.

        Consuming applications were already doing this by hand — TimeSubmit's
        own invoice table carried a `th scope="row"` with a comment saying why,
        which is the tell that adopting this component was a regression.
      */}
      <th
        scope="row"
        className={cn(
          cell,
          'text-primary text-left font-mono text-mono-cell font-normal tabular-nums',
        )}
      >
        {invoice}
      </th>
      <td className={cn(cell, 'text-body-cell text-foreground truncate')}>{client}</td>
      <td className={cn(cell, 'text-body-cell text-muted-foreground truncate')}>
        {consultant}
      </td>
      <td className={cn(cell, 'text-muted-foreground text-mono-md font-mono tabular-nums')}>
        {issued}
      </td>
      <td
        className={cn(
          cell,
          'text-mono-md font-mono tabular-nums',
          overdue ? 'text-danger' : 'text-muted-foreground',
        )}
      >
        {due}
      </td>
      <td
        className={cn(
          cell,
          'text-foreground text-right font-mono text-mono-cell tabular-nums',
        )}
      >
        {amount}
      </td>
      <td className={cell}>
        <StatusPill tone={status.tone}>{status.label}</StatusPill>
      </td>
      <td className={cell}>
        <button
          type="button"
          aria-label={`Actions for invoice ${invoice}`}
          className="text-subtle-foreground hover:bg-control rounded-control p-1"
        >
          <Ellipsis className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </td>
    </tr>
  )
})
