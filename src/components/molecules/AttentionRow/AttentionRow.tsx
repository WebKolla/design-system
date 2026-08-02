import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

const tileTone = {
  warn: 'bg-warn-bg text-warn',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  neutral: 'bg-neutral-bg text-neutral',
} as const

export type AttentionTone = keyof typeof tileTone

export interface AttentionRowProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string
  subtitle?: string | undefined
  icon: LucideIcon
  /** Tone selects the icon and its background together. @default 'warn' */
  tone?: AttentionTone
  /** The action is the point of the row — a row without one is a statement. */
  action?: React.ReactNode | undefined
}

/**
 * Attention queue row on the admin overview — the things needing action.
 *
 * Tone selects the icon and its background together: danger for overdue, warn
 * for pending, info for informational.
 *
 * `AttentionCardMobile` is the stacked equivalent below 768.
 */
export const AttentionRow = React.forwardRef<HTMLDivElement, AttentionRowProps>(
  function AttentionRow(
    { title, subtitle, icon: Glyph, tone = 'warn', action, className, ...rest },
    ref,
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'border-hairline flex w-full items-center gap-3 border-b px-4 py-3.5',
          className,
        )}
      >
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-control',
            tileTone[tone],
          )}
        >
          <Glyph className="size-4" strokeWidth={1.75} aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-body-cell text-foreground truncate font-medium">
            {title}
          </p>
          {subtitle ? (
            <p className="text-body-micro text-subtle-foreground truncate">
              {subtitle}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    )
  },
)
