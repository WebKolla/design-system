import * as React from 'react'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { Button } from '@/components/atoms/Button/Button'
import { cn } from '@/lib/cn'

export interface ListCardApprovalMobileProps
  extends React.ComponentPropsWithoutRef<'div'> {
  name: string
  initials: string
  /** e.g. "27 Jul to 2 Aug · Weekly". */
  period: string
  /** e.g. "Northgate Rail · Phase 2". */
  project: string
  /** Mono, right-aligned. No money ever appears here. */
  hours: string
  onApprove?: () => void
  onReject?: () => void
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
  { name, initials, period, project, hours, onApprove, onReject, className, ...rest },
  ref,
) {
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
            <span className="text-body-cell text-foreground truncate">{name}</span>
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

      <div className="grid grid-cols-2 gap-2">
        <Button variant="approve" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="destructive" onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  )
})
