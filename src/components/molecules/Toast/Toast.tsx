import * as React from 'react'
import { Check, CircleAlert, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

const barTone = {
  success: 'bg-success-solid',
  warn: 'bg-warn',
  danger: 'bg-danger',
} as const

const glyphTone: Record<ToastTone, LucideIcon> = {
  success: Check,
  warn: TriangleAlert,
  danger: CircleAlert,
}

const iconTone = {
  success: 'text-success',
  warn: 'text-warn',
  danger: 'text-danger',
} as const

export type ToastTone = 'success' | 'warn' | 'danger'

export interface ToastProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string
  detail?: string | undefined
  /** The accent bar carries the status. @default 'success' */
  tone?: ToastTone
}

/**
 * Transient confirmation. 380 max width.
 *
 * The accent bar colour carries the status, with a matching leading icon so
 * the state survives without colour.
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  function Toast({ title, detail, tone = 'success', className, ...rest }, ref) {
    const Glyph = glyphTone[tone]

    return (
      <div
        {...rest}
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          'bg-surface border-border flex w-full max-w-[380px] overflow-hidden rounded-card border shadow-e2',
          className,
        )}
      >
        <span aria-hidden className={cn('w-1 shrink-0', barTone[tone])} />
        <div className="flex items-start gap-2.5 p-3">
          <Glyph
            className={cn('mt-px size-4 shrink-0', iconTone[tone])}
            strokeWidth={1.75}
            aria-hidden
          />
          <div className="min-w-0">
            <p className="text-body-cell text-foreground font-medium">{title}</p>
            {detail ? (
              <p className="text-body-caption text-subtle-foreground">{detail}</p>
            ) : null}
          </div>
        </div>
      </div>
    )
  },
)
