import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const pillVariants = cva(
  'inline-flex h-[23px] items-center gap-1.5 rounded-pip border px-2.5 text-ui-xs whitespace-nowrap',
  {
    variants: {
      tone: {
        success: 'bg-success-bg border-success-border text-success',
        info: 'bg-info-bg border-info-border text-info',
        warn: 'bg-warn-bg border-warn-border text-warn',
        danger: 'bg-danger-bg border-danger-border text-danger',
        neutral: 'bg-neutral-bg border-neutral-border text-neutral',
      },
    },
    defaultVariants: { tone: 'success' },
  },
)

export type StatusTone = 'success' | 'info' | 'warn' | 'danger' | 'neutral'

export interface StatusPillProps
  extends React.ComponentPropsWithoutRef<'span'> {
  /**
   * Tone maps to meaning, not preference.
   *
   * `success` Approved · Paid · Approver signed off ·
   * `info` Submitted · Sent ·
   * `warn` Pending ·
   * `danger` Rejected · Overdue ·
   * `neutral` Draft
   *
   * @default 'success'
   */
  tone?: StatusTone
}

/**
 * Status, never decoration.
 *
 * The dot is not optional: colour alone fails a monochrome print and fails
 * colour vision deficiency, so state must survive without it. For a bare count
 * use `Chip` instead.
 */
export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  function StatusPill({ tone = 'success', className, children, ...rest }, ref) {
    return (
      <span
        {...rest}
        ref={ref}
        className={cn(pillVariants({ tone }), className)}
      >
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
        {children}
      </span>
    )
  },
)
