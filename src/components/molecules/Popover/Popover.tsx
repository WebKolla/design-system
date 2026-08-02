import * as React from 'react'
import { Popover as RadixPopover } from 'radix-ui'
import { cn } from '@/lib/cn'

export interface PopoverProps
  extends React.ComponentPropsWithoutRef<typeof RadixPopover.Root> {
  /**
   * **Defaults to `true` here, unlike Radix.**
   *
   * Modal is what gives the surface a focus trap. An overlay that leaves focus
   * loose behind it is reachable by mouse and invisible to a keyboard, which is
   * the failure this component exists to stop repeating in nine screens.
   *
   * Set it `false` only for a surface that is genuinely non-interactive
   * decoration, and then say why in the call site.
   * @default true
   */
  modal?: boolean
}

/**
 * The positioning root. Everything that floats in this library floats on this.
 */
export function Popover({ modal = true, ...rest }: PopoverProps) {
  return <RadixPopover.Root modal={modal} {...rest} />
}

/** Wraps your own trigger. Pass `asChild` and give it a `Button` or `FilterSelect`. */
export const PopoverTrigger = RadixPopover.Trigger

/** Position against something other than the trigger. */
export const PopoverAnchor = RadixPopover.Anchor

/** Closes the surface. Wrap the option or action that should dismiss it. */
export const PopoverClose = RadixPopover.Close

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixPopover.Content> {
  /**
   * Required. The surface is a `dialog` to assistive technology, so without a
   * name it is announced as "dialog" and nothing else. Name what is inside it:
   * "Filter by project", "Notifications".
   */
  label: string
  /** `none` for a listbox whose options paint to the edge. @default 'standard' */
  padding?: 'none' | 'compact' | 'standard'
}

/**
 * A floating surface, positioned, focus-trapped and dismissible.
 *
 * Nothing in this library floated before it. `Input` with a trailing chevron
 * renders the *closed* appearance of a select and `FilterSelect` renders a
 * toolbar chip, but neither opened anything, so every select, menu, date picker
 * and notification list in the product had nowhere to open into.
 *
 * **Focus trap, focus restoration and Escape are Radix's.** Focus moves into
 * the surface, cannot leave it while open, returns to the trigger on close, and
 * Escape closes — the same guarantees as `Dialog`, from the same implementation
 * deliberately.
 *
 * Build `Select` and `Menu` on this rather than beside it. A second positioning
 * layer is a second design system.
 *
 * **Not reviewed by design.** Surface derived from `Toast` and `Card`:
 * `bg-surface`, `border-border`, `rounded-card`, `e2`.
 */
export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(function PopoverContent(
  { label, padding = 'standard', sideOffset = 6, className, ...rest },
  ref,
) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        {...rest}
        ref={ref}
        aria-label={label}
        sideOffset={sideOffset}
        // The z scale lives outside @theme (it is not a Tailwind namespace), so
        // it is read through var() rather than a utility.
        style={{ zIndex: 'var(--z-dropdown)', ...rest.style }}
        className={cn(
          'bg-surface border-border rounded-card min-w-[180px] border shadow-e2',
          { none: '', compact: 'p-1.5', standard: 'p-2' }[padding],
          className,
        )}
      />
    </RadixPopover.Portal>
  )
})
