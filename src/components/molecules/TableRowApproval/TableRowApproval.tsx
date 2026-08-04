import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Slot } from 'radix-ui'
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox'
import { cn } from '@/lib/cn'
import { warnIfNotChildless, type NavElement } from '@/lib/nav-slot'

export interface TableRowApprovalProps
  extends React.ComponentPropsWithoutRef<'tr'> {
  /**
   * The consultant's name. Required even alongside `nameElement`, because it
   * is also the accessible name of the row's checkbox, approve and reject
   * controls: "Select timesheet for ${name}", "Approve timesheet for
   * ${name}" and "Reject timesheet for ${name}".
   */
  name: string
  /**
   * Childless element the consultant name renders as, e.g.
   * `nameElement={<Link href={`/timesheets/${id}`} />}`. Omit for plain text.
   *
   * A `string` href would only ever become a plain `<a>`, which is a full
   * document load in a framework application. That regression has already
   * been shipped once here, so this follows `TableRowInvoice`'s
   * `invoiceElement` and `SidebarDestination.element` instead: pass the
   * router's own link component.
   *
   * **Pass a childless element** — see `NavElement`. The name is supplied
   * through `name` and becomes this element's children under `asChild`, so
   * an element bringing its own children replaces it.
   */
  nameElement?: NavElement | undefined
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
  /**
   * Renders the leading selection cell. Default `true`, which is the shape
   * `APPROVAL_COLUMNS` describes.
   *
   * Set `false` whenever the header above drops the `select` column — which
   * means the generic `TableHeader` over `omitColumns(APPROVAL_COLUMNS,
   * ['select'])`, since `TableHeaderApprovals` always renders all seven. The
   * two go together: dropping the column from the header while the row still
   * renders its cell leaves the body one cell wider than the header, so every
   * value from that point on is announced against the wrong column heading.
   * This is `TableRowInvoice`'s `showActions` at the other end of the row.
   *
   * A consumer with no bulk mutation behind the selection should drop both. A
   * checkbox that selects rows nothing can act on is a dead control, and the
   * product has removed that same control twice.
   */
  showSelect?: boolean | undefined
  /**
   * Renders the approve and reject controls. Default `true`.
   *
   * **The cell stays either way** — unlike `showSelect`, which drops a column
   * the whole table agrees to drop. This one varies per row, so removing the
   * `<td>` would give that row one cell fewer than its neighbours and shift
   * every heading association after it. `false` empties the cell, it does not
   * delete it.
   *
   * Set `false` on a row there is no decision left to take on. An approver's
   * "all timesheets" list holds approved, rejected and draft rows beside the
   * submitted ones, and only the submitted ones can be acted on — the server
   * refuses the rest with "Only submitted timesheets can be approved". A
   * control whose only outcome is a refusal is the dead control this product
   * has removed twice; the honest form is not to offer it.
   */
  showDecisions?: boolean | undefined
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
    nameElement,
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
    showSelect = true,
    showDecisions = true,
    className,
    ...rest
  },
  ref,
) {
  if (nameElement) warnIfNotChildless(nameElement, 'the consultant name')

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
      {showSelect ? (
        <td className={cell}>
          <Checkbox
            checked={selected}
            onCheckedChange={(v) => onSelectedChange?.(v === true)}
            aria-label={`Select timesheet for ${name}`}
          />
        </td>
      ) : null}

      {/*
        `th scope="row"`, not `td`. The consultant's name is the row's name,
        and marking it as the row header is what lets a screen reader
        announce "Callum Byrne, Period, 27 Jul to 2 Aug" as you move across a
        row rather than "Period, 27 Jul to 2 Aug" with no way to tell which
        consultant it belongs to. This mirrors `TableRowInvoice`'s `th` fix.

        `font-normal` and `text-left` cancel the `th` user-agent defaults
        (bold, centred), which is what keeps this visually inert with
        `nameElement` unset. `truncate` matches the other cells in this row
        and `TableRowInvoice`'s row header (PR #6): an identifier that
        wraps mid-token cannot be scanned, and truncation degrades more
        predictably than a wrap.
      */}
      <th
        scope="row"
        title={name}
        className={cn(cell, 'text-left font-normal truncate')}
      >
        <span className="text-body-cell text-foreground block truncate">
          {/*
            The element renders *inside* the name's own line, never as the
            `th`. Replacing the `th` would take the row header with it; the
            `rowheader` and the link have to be the same cell, not the same
            node. `Slot.Slottable` is what makes `{name}` the consumer
            element's children, so this line's text stays exactly the name.
          */}
          {nameElement ? (
            <Slot.Root>
              <Slot.Slottable>{nameElement}</Slot.Slottable>
              {name}
            </Slot.Root>
          ) : (
            name
          )}
        </span>
        {/*
          The email is a second line in the same cell, not a second `td` —
          `APPROVAL_COLUMNS` has one "Consultant" column, and splitting it
          would change the grid every consumer pays for. It is excluded from
          the row header's accessible name with `aria-hidden`, so
          `getByRole('rowheader', { name })` still resolves against the name
          alone rather than "Callum Byrne callum.byrne@meridian.co.uk". See
          the PR body for the two-line accessible-name decision.
        */}
        <span
          aria-hidden="true"
          className="text-body-micro text-subtle-foreground block truncate"
        >
          {email}
        </span>
      </th>

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
        {/*
          Empty rather than absent when there is no decision to take: the cell
          count has to match every other row in the body, or the headings stop
          lining up from here to the end of the row.
        */}
        {showDecisions ? (
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
        ) : null}
      </td>
    </tr>
  )
})
