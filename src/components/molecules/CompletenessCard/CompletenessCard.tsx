import * as React from 'react'
import { cn } from '@/lib/cn'

export interface CompletenessCardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** @default 'Record completeness' */
  title?: string
  /** Sections done. */
  done: number
  /** Sections in total. */
  total: number
  /**
   * **The note is the important part.** It must say what the remaining gap
   * costs — "Enough to invoice. Company block is optional." tells someone they
   * can leave, which a bare 5/7 does not.
   */
  note: string
}

/**
 * Sits under the section nav and answers "can I stop now?".
 *
 * **Never phrase this as a completion score.** It is not a game and the user is
 * not being marked; some sections are genuinely optional and the copy should
 * say so.
 */
export const CompletenessCard = React.forwardRef<
  HTMLDivElement,
  CompletenessCardProps
>(function CompletenessCard(
  { title = 'Record completeness', done, total, note, className, ...rest },
  ref,
) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'bg-surface border-border flex w-full flex-col gap-2.5 rounded-card border p-3.5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-ui-label text-subtle-foreground">{title}</span>
        <span className="text-foreground text-mono-xs font-mono tabular-nums">
          {done}/{total}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        // Not "sections": the sidebar reuses this card for plan seats.
        aria-label={`${title}: ${done} of ${total}`}
        className="bg-control h-1.5 w-full overflow-hidden rounded-pip"
      >
        <div className="bg-primary h-full rounded-pip" style={{ width: `${pct}%` }} />
      </div>

      <p className="text-body-micro text-subtle-foreground">{note}</p>
    </div>
  )
})
