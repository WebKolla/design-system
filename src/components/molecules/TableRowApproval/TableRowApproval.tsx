import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { cn } from '@/lib/cn'

export interface TableRowApprovalProps
  extends React.ComponentPropsWithoutRef<'tr'> {
  name: string
  email: string
  dates: string
  cadence: string
  project: string
  phase: string
  /** Mono, right-aligned. */
  hours: string
  submitted: string
  /** e.g. "Reminder sent". Shown in warn beneath the submitted date. */
  reminder?: string | undefined
  selected?: boolean
  onSelectedChange?: (checked: boolean) => void
  onApprove?: () => void
  onReject?: () => void
}

const cell = 'px-2.5 align-middle'

/**
 * Approver queue row.
 *
 * **Approve and reject live in the row.** The common case — five identical
 * weekly retainers — never opens a detail page, which is the difference
 * between a queue cleared in a minute and one that sits for six days.
 *
 * Approve is a filled success square; Reject is an outlined square with a
 * danger glyph. Reject is deliberately quieter: it is the rarer action and it
 * opens a reason prompt, because a rejection without a reason just produces a
 * resubmission of the same timesheet.
 *
 * **No rate, day rate or invoice value appears in any cell** — the approver
 * role cannot see them. That is a product guarantee, not a styling preference.
 */
export const TableRowApproval = React.forwardRef<
  HTMLTableRowElement,
  TableRowApprovalProps
>(function TableRowApproval(
  {
    name,
    email,
    dates,
    cadence,
    project,
    phase,
    hours,
    submitted,
    reminder,
    selected = false,
    onSelectedChange,
    onApprove,
    onReject,
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
        'border-hairline h-[62px] border-b transition-colors',
        selected ? 'bg-primary-soft' : 'bg-surface',
        className,
      )}
    >
      <td className={cell}>
        <Checkbox
          checked={selected}
          onCheckedChange={(v) => onSelectedChange?.(v === true)}
          aria-label={`Select timesheet for ${name}`}
        />
      </td>

      <td className={cell}>
        <span className="text-body-cell text-foreground block truncate">{name}</span>
        <span className="text-body-micro text-subtle-foreground block truncate">
          {email}
        </span>
      </td>

      <td className={cell}>
        <span className="text-body-cell text-muted-foreground block truncate">
          {dates}
        </span>
        <span className="text-body-micro text-subtle-foreground block">{cadence}</span>
      </td>

      <td className={cell}>
        <span className="text-body-cell text-muted-foreground block truncate">
          {project}
        </span>
        <span className="text-body-micro text-subtle-foreground block truncate">
          {phase}
        </span>
      </td>

      <td
        className={cn(cell, 'text-foreground text-right font-mono text-mono-cell tabular-nums')}
      >
        {hours}
      </td>

      <td className={cell}>
        <span className="text-muted-foreground text-mono-md block font-mono tabular-nums">
          {submitted}
        </span>
        {reminder ? (
          <span className="text-body-micro text-warn block">{reminder}</span>
        ) : null}
      </td>

      <td className={cn(cell, 'text-right')}>
        <span className="inline-flex gap-1.5">
          <button
            type="button"
            onClick={onApprove}
            aria-label={`Approve timesheet for ${name}`}
            className="bg-success-solid text-primary-foreground inline-flex size-7 items-center justify-center rounded-control transition-colors hover:bg-success"
          >
            <Check className="size-4" strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onReject}
            aria-label={`Reject timesheet for ${name}`}
            className="border-input text-danger hover:bg-danger-bg inline-flex size-7 items-center justify-center rounded-control border transition-colors"
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </span>
      </td>
    </tr>
  )
})
