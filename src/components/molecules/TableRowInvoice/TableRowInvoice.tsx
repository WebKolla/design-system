import * as React from 'react'
import { Ellipsis } from 'lucide-react'
import { Slot } from 'radix-ui'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { StatusPill, type StatusTone } from '@/components/atoms/StatusPill/StatusPill'
import { cn } from '@/lib/cn'
import { warnIfNotChildless, type NavElement } from '@/lib/nav-slot'

export interface TableRowInvoiceProps
  extends React.ComponentPropsWithoutRef<'tr'> {
  /**
   * The invoice number. Required even alongside `invoiceElement`, because it
   * is also the accessible name of the row's checkbox and overflow control.
   */
  invoice: string
  /**
   * Childless element the invoice number renders as, e.g.
   * `element={<Link href={`/invoices/${id}`} />}`. Omit for plain text.
   *
   * A `string` href would only ever become a plain `<a>`, which is a full
   * document load in a framework application. That regression has already been
   * shipped once here, so this follows `SidebarDestination.element` and
   * `MobileTab.element` instead: pass the router's own link component.
   *
   * **Pass a childless element** — see `NavElement`. The invoice number is
   * supplied through `invoice` and becomes this element's children under
   * `asChild`, so an element bringing its own children replaces it. That
   * failure is silent and it also breaks the row header's accessible name,
   * which is what `rowheader` queries match on.
   */
  invoiceElement?: NavElement | undefined
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
  /**
   * Renders the trailing overflow cell. Default `true`, which is the shape
   * `INVOICE_COLUMNS` describes.
   *
   * Set `false` whenever the header drops the `actions` column. The two
   * go together: dropping the column from the header while the row still
   * renders its cell leaves the body one cell wider than the header, so every
   * value from that point on is announced against the wrong column heading.
   * A consumer that has nothing to put behind the menu should drop both.
   */
  showActions?: boolean | undefined
}

const cell = 'px-2.5 align-middle'

/**
 * 42px invoice row on the shared column grid.
 *
 * Every figure is mono and tabular; the amount is right-aligned. The invoice
 * number is primary because it is the link — pass `invoiceElement` to make it
 * one. Without it the number is plain text and the row has no route to the
 * invoice, which is a regression against any table this replaces.
 *
 * Below 768 this row becomes `ListCardInvoiceMobile`.
 */
export const TableRowInvoice = React.forwardRef<
  HTMLTableRowElement,
  TableRowInvoiceProps
>(function TableRowInvoice(
  {
    invoice,
    invoiceElement,
    showActions = true,
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
  if (invoiceElement) warnIfNotChildless(invoiceElement, 'the invoice number')

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
        {/*
          The element renders *inside* the `th`, never as it. Replacing the
          `th` would take the row header with it and undo the fix above; the
          `rowheader` and the link have to be the same cell, not the same node.

          `Slot.Slottable` is what makes `{invoice}` the consumer element's
          children, so the accessible name of the header stays exactly the
          invoice number. All styling stays on the `th` and none is put on the
          slotted element, which keeps this visually identical to plain text.
        */}
        {invoiceElement ? (
          <Slot.Root>
            <Slot.Slottable>{invoiceElement}</Slot.Slottable>
            {invoice}
          </Slot.Root>
        ) : (
          invoice
        )}
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
      {showActions ? (
        <td className={cell}>
          <button
            type="button"
            aria-label={`Actions for invoice ${invoice}`}
            className="text-subtle-foreground hover:bg-control rounded-control p-1"
          >
            <Ellipsis className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </td>
      ) : null}
    </tr>
  )
})
