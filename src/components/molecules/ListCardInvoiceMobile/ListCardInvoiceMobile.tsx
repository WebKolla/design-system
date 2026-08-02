import * as React from 'react'
import { StatusPill, type StatusTone } from '@/components/atoms/StatusPill/StatusPill'
import { cn } from '@/lib/cn'

export interface ListCardInvoiceMobileProps
  extends React.ComponentPropsWithoutRef<'div'> {
  invoice: string
  client: string
  /** Consultant and due date, e.g. "Priya Nair · due 15 Jul 26". */
  meta: string
  /** Pre-formatted through one `Intl.NumberFormat`. */
  amount: string
  status: { label: string; tone: StatusTone }
  /** Recolours the meta line to danger, matching the desktop row. */
  overdue?: boolean
}

/**
 * The desktop invoice row below 768.
 *
 * Nine columns will not fit on a phone, and shrinking them produces a row
 * nobody can read, so the row becomes a card and the columns become a
 * hierarchy.
 *
 * **What survives:** invoice number, status, client, amount.
 * **What moves into the meta line:** consultant and the due date.
 * **What disappears:** issued date and the row checkbox — bulk selection is a
 * desktop task.
 *
 * The amount stays mono and right-aligned so a scrolled column of cards still
 * lines up its decimal points.
 */
export const ListCardInvoiceMobile = React.forwardRef<
  HTMLDivElement,
  ListCardInvoiceMobileProps
>(function ListCardInvoiceMobile(
  { invoice, client, meta, amount, status, overdue = false, className, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'bg-surface border-border flex w-full flex-col gap-2.5 rounded-card border p-3.5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-primary font-mono text-mono-cell tabular-nums">
          {invoice}
        </span>
        <StatusPill tone={status.tone}>{status.label}</StatusPill>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-body-cell text-foreground truncate">{client}</span>
          <span
            className={cn(
              'text-body-caption truncate',
              overdue ? 'text-danger' : 'text-subtle-foreground',
            )}
          >
            {meta}
          </span>
        </div>
        <span className="text-foreground shrink-0 font-mono text-mono-amount tabular-nums">
          {amount}
        </span>
      </div>
    </div>
  )
})
