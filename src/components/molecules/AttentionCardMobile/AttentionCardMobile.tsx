import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { AttentionTone } from '../AttentionRow/AttentionRow'

const tileTone = {
  warn: 'bg-warn-bg text-warn',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  neutral: 'bg-neutral-bg text-neutral',
} as const

export interface AttentionCardMobileProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string
  /**
   * Shortened for mobile: the desktop row names every consultant, this one
   * gives the project and the cost.
   */
  subtitle?: string | undefined
  icon: LucideIcon
  /** @default 'warn' */
  tone?: AttentionTone
  /** A full-width 42px button. Never reduce this card to a statement. */
  action?: React.ReactNode | undefined
}

/**
 * The attention row on a phone, and the hero of the mobile overview.
 *
 * The desktop row puts its action to the right of the text; at 390 there is no
 * right, so the action becomes a full-width 42px button beneath.
 *
 * **That is the whole reason this queue exists**: a row with a button on it
 * converts, a summary makes the reader go and find the screen where the action
 * lives. Keep the button — never reduce these to a list of statements.
 */
export const AttentionCardMobile = React.forwardRef<
  HTMLDivElement,
  AttentionCardMobileProps
>(function AttentionCardMobile(
  { title, subtitle, icon: Glyph, tone = 'warn', action, className, ...rest },
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
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-control',
            tileTone[tone],
          )}
        >
          <Glyph className="size-4" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-cell text-foreground font-medium">{title}</p>
          {subtitle ? (
            <p className="text-body-micro text-subtle-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {/* grid stretches its child to the full card width without an arbitrary variant */
      }
      {action ? <div className="grid">{action}</div> : null}
    </div>
  )
})
