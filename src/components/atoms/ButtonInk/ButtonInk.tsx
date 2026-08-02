import * as React from 'react'
import { Slot } from 'radix-ui'
import { ArrowRight } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Not exported: an exported binding in a .tsx is mutated by docgen (BUG-001).
const buttonInkVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'h-[42px] px-5 rounded-button-lg text-ui-lg font-medium select-none',
    'transition-colors',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary:
          'bg-transparent text-ink-foreground border border-ink-border hover:bg-ink-raised',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export interface ButtonInkProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> {
  /** @default 'primary' */
  variant?: 'primary' | 'secondary'
  /** The arrow is fixed and trailing. Turn it off for a label-only button. */
  showIcon?: boolean
  asChild?: boolean
}

/**
 * Button for `color/ink` surfaces — the dark CTA band, the sign-in panel and
 * the rate-blind band.
 *
 * Deliberately narrow: Large only, and the icon is a fixed trailing
 * arrow-right with no swap. Figma's description is explicit that exposing a
 * swap would discard the icon's ink colour bindings; the React equivalent is
 * that a caller-supplied icon would not inherit ink colours reliably. If a
 * different icon is ever needed on ink, add a variant rather than a prop.
 */
export const ButtonInk = React.forwardRef<HTMLButtonElement, ButtonInkProps>(
  function ButtonInk(
    {
      variant = 'primary',
      showIcon = true,
      asChild = false,
      className,
      children,
      type,
      disabled,
      ...rest
    },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
      <Comp
        {...rest}
        ref={ref}
        className={cn(buttonInkVariants({ variant }), className)}
        {...(asChild ? {} : { type: type ?? 'button', disabled })}
        {...(asChild && disabled ? { 'aria-disabled': true } : {})}
      >
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {showIcon ? <ArrowRight strokeWidth={1.75} aria-hidden /> : null}
          </>
        )}
      </Comp>
    )
  },
)
