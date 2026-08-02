import * as React from 'react'
import { cn } from '@/lib/cn'

export interface SeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /**
   * A decorative rule is announced to nobody. Set this to `false` only when the
   * line genuinely divides two groups that a screen reader user needs told
   * apart — which is rarer than it sounds, because a heading usually says it
   * better.
   * @default true
   */
  decorative?: boolean
}

/**
 * One hairline. Nothing else.
 *
 * `--color-hairline` is the divider weight every list in this library already
 * uses: table rows carry `border-b border-hairline`, `FaqAccordionRow` carries
 * its own. **That remains the preferred pattern** — a divider belongs to the
 * component that owns the list, where it can be suppressed on the last item
 * without the parent counting children.
 *
 * This exists for the case that pattern does not cover: two unrelated blocks
 * stacked in a panel, which is what the thirteen `ui/separator` call sites in
 * the product are. Reach for the list component's own divider first.
 *
 * **Not reviewed by design.** It introduces no value of its own — it is
 * `--color-hairline` at 1px, which the tables already ship.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { orientation = 'horizontal', decorative = true, className, ...rest },
    ref,
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        {...(decorative
          ? { role: 'presentation' }
          : { role: 'separator', 'aria-orientation': orientation })}
        className={cn(
          'bg-hairline shrink-0',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
      />
    )
  },
)
