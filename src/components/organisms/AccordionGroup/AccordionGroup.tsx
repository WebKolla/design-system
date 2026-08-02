import * as React from 'react'
import { Accordion } from 'radix-ui'
import { cn } from '@/lib/cn'

export interface AccordionGroupProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** `FaqAccordionRow` items. Mark the last one `last` to drop its divider. */
  children: React.ReactNode
  /**
   * `single` closes the previous row when another opens; `multiple` allows
   * several open at once. FAQ pages use `single`.
   * @default 'single'
   */
  type?: 'single' | 'multiple'
  /** Row open on first render, for `type="single"`. */
  defaultValue?: string | undefined
}

/**
 * **Does not exist as a Figma component** — composed from `FaqAccordionRow`.
 *
 * The bordered 12-radius container plus the Radix `Accordion.Root` that the
 * rows are items of. Keyboard handling, roving focus and ARIA all come from
 * Radix; this only supplies the shell.
 *
 * The last row's divider is suppressed by the caller passing `last`, rather
 * than by a `:last-child` selector here — a row may be conditionally rendered,
 * and `:last-child` would then draw a divider under whichever row happened to
 * come last in the DOM.
 */
export const AccordionGroup = React.forwardRef<
  HTMLDivElement,
  AccordionGroupProps
>(function AccordionGroup(
  { children, type = 'single', defaultValue, className, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'border-border w-full overflow-hidden rounded-panel border',
        className,
      )}
    >
      {type === 'single' ? (
        <Accordion.Root
          type="single"
          collapsible
          {...(defaultValue ? { defaultValue } : {})}
        >
          {children}
        </Accordion.Root>
      ) : (
        <Accordion.Root type="multiple">{children}</Accordion.Root>
      )}
    </div>
  )
})
