import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'prefix'> {
  /** Marks the control invalid and switches the border to danger. */
  invalid?: boolean | undefined
  /**
   * Currency or unit prefix. Rendered mono, because the value beside it is.
   */
  prefix?: string | undefined
  /** Trailing affordance — a chevron makes this read as a select. */
  trailingIcon?: LucideIcon | undefined
}

/**
 * The bare text control.
 *
 * **This atom does not exist in Figma.** It is extracted from the `Box`
 * sub-frame of `Field` (37:42) so that dependent components have a control to
 * compose with. `Field` adds the label, helper text and error message around
 * it.
 *
 * 38px tall on `radius/button`. Focus carries a 3px `color/ring` spread **plus**
 * a primary border — the ring alone measured 1.25:1 and failed WCAG 1.4.11,
 * which is why the border colour changes too. Mobile should raise the box to a
 * 44px minimum; that is the parent's call, not this component's.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { invalid = false, prefix, trailingIcon: TrailingIcon, className, disabled, ...rest },
    ref,
  ) {
    return (
      <div
        className={cn(
          'flex h-[38px] w-full items-center gap-[7px] rounded-button border px-3 transition-colors',
          'bg-surface border-input',
          'focus-within:border-primary focus-within:ring-ring focus-within:ring-[3px]',
          invalid && 'border-danger',
          disabled && 'bg-control',
          className,
        )}
      >
        {prefix ? (
          <span className="text-subtle-foreground font-mono text-[13px] tabular-nums">
            {prefix}
          </span>
        ) : null}
        <input
          {...rest}
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            'text-body-cell text-foreground placeholder:text-subtle-foreground',
            'min-w-0 flex-1 bg-transparent outline-none',
            // faint-foreground survives here on purpose: WCAG 1.4.3 exempts
            // inactive controls, and looking unavailable is the point.
            'disabled:cursor-not-allowed disabled:text-faint-foreground',
          )}
        />
        {TrailingIcon ? (
          <TrailingIcon
            className="text-subtle-foreground size-4 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null}
      </div>
    )
  },
)
