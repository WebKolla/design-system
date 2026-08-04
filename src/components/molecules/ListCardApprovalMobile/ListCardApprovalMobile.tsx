import * as React from 'react'
import { Slot } from 'radix-ui'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { Button } from '@/components/atoms/Button/Button'
import { cn } from '@/lib/cn'
import { warnIfNotChildless, type NavElement } from '@/lib/nav-slot'

export interface ListCardApprovalMobileProps
  extends React.ComponentPropsWithoutRef<'div'> {
  name: string
  /**
   * Childless element the consultant name renders as, e.g.
   * `nameElement={<Link href={`/timesheets/${id}`} />}`. Omit for plain text.
   *
   * Mirrors `TableRowApproval`'s `nameElement` exactly — same childless-element
   * contract via `NavElement`, same `Slot.Root`/`Slot.Slottable` mechanics, so
   * the link's accessible name stays the consultant's name alone. A `string`
   * href would only ever become a plain `<a>`, a full document load in a
   * framework application; that regression has already shipped twice here.
   *
   * **Pass a childless element** — see `NavElement`.
   */
  nameElement?: NavElement | undefined
  initials: string
  /** e.g. "27 Jul to 2 Aug · Weekly". */
  period: string
  /** e.g. "Northgate Rail · Phase 2". */
  project: string
  /** Mono, right-aligned. No money ever appears here. */
  hours: string
  onApprove?: () => void
  onReject?: () => void
  /**
   * Renders the approve and reject buttons. Default `true`.
   *
   * Set `false` on a card there is no decision left to take on — an approved,
   * rejected or draft timesheet in an approver's full list. The server refuses
   * those with "Only submitted timesheets can be approved", and a control whose
   * only outcome is a refusal is a dead control. `TableRowApproval` carries the
   * same prop for the same rows.
   */
  showDecisions?: boolean | undefined
}

/**
 * The approval row on a phone.
 *
 * Approve and Reject become full-width 42px buttons at the card foot, because
 * in-row 28px icon buttons are unhittable on a phone and because the decision
 * is the whole reason the approver opened the screen.
 *
 * Approve is filled success, Reject is an outlined shell with danger text —
 * the same asymmetry as desktop. Reject still opens a reason prompt.
 *
 * The checkbox is gone: bulk selection on mobile is long-press, not a visible
 * control.
 */
export const ListCardApprovalMobile = React.forwardRef<
  HTMLDivElement,
  ListCardApprovalMobileProps
>(function ListCardApprovalMobile(
  {
    name,
    nameElement,
    initials,
    period,
    project,
    hours,
    onApprove,
    onReject,
    showDecisions = true,
    className,
    ...rest
  },
  ref,
) {
  if (nameElement) warnIfNotChildless(nameElement, 'the consultant name')

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'bg-surface border-border flex w-full flex-col gap-3 rounded-card border p-3.5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar initials={initials} size={26} label={name} />
          <div className="flex min-w-0 flex-col gap-0.5">
            {/*
              Mirrors `TableRowApproval`'s row header: the element renders
              *inside* the name's own line, never as the wrapping `span`, so
              `Slot.Slottable` keeps `{name}` as the consumer element's
              children and the link's accessible name stays exactly the
              consultant's name.
            */}
            <span className="text-body-cell text-foreground truncate">
              {nameElement ? (
                <Slot.Root>
                  <Slot.Slottable>{nameElement}</Slot.Slottable>
                  {name}
                </Slot.Root>
              ) : (
                name
              )}
            </span>
            <span className="text-body-micro text-subtle-foreground truncate">
              {period}
            </span>
          </div>
        </div>
        <span className="text-foreground shrink-0 font-mono text-mono-amount tabular-nums">
          {hours}
        </span>
      </div>

      <p className="text-body-cell text-muted-foreground truncate">{project}</p>

      {/*
        The visible labels stay "Approve" and "Reject" — two words, at the size
        a thumb needs. The accessible names name the consultant, because a queue
        of five cards is otherwise ten buttons called "Approve" and "Reject"
        with nothing to tell them apart, and a screen reader user moving by
        control has no card boundary to orient against. Same names
        `TableRowApproval` gives its icon buttons, deliberately.
      */}
      {showDecisions ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="approve"
            onClick={onApprove}
            aria-label={`Approve timesheet for ${name}`}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            aria-label={`Reject timesheet for ${name}`}
          >
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  )
})
