import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface EmptyStateProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string
  /** One sentence of orientation. Not a paragraph. */
  body: string
  icon: LucideIcon
  /** A single primary action. More than one is a sign the state is not empty. */
  action?: React.ReactNode | undefined
}

/**
 * Dashed-border zero state for any list surface.
 *
 * Icon, title, one sentence of orientation, and a single primary action. The
 * dashed border is what distinguishes an empty surface from a populated card.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState({ title, body, icon: Glyph, action, className, ...rest }, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'bg-surface border-border-strong flex w-full flex-col items-center gap-3 rounded-card border border-dashed px-6 py-8 text-center',
          className,
        )}
      >
        <span className="bg-control text-subtle-foreground flex size-11 items-center justify-center rounded-full">
          <Glyph className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="text-heading-block text-foreground">{title}</p>
        <p className="text-body-cell text-muted-foreground max-w-[46ch]">{body}</p>
        {action ? <div>{action}</div> : null}
      </div>
    )
  },
)
