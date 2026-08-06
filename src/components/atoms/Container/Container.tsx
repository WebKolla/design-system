import * as React from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Pricing widens to 1280. */
  wide?: boolean
  children: React.ReactNode
}

/**
 * The 1160 centred content column. Max-width, never fixed, so it reflows at 390
 * rather than overflowing.
 *
 * One definition of "the column", used by `Section` for page bands and by
 * `SiteHeader` and `SiteFooter` for the chrome. The chrome used to lay its
 * children straight on to its full-width root with a fixed `px-10` gutter, so
 * at any viewport wider than 1160 the logo and the footer columns sat outside
 * the column every section on the page was using.
 *
 * The gutter is part of the column, not part of the band: a caller that wants a
 * different one passes it in `className`, which wins through `cn`.
 *
 * It takes the full `div` prop surface and a ref. A column is a thing callers
 * need to point at — a scroll anchor's `id`, an `aria-describedby` target, a
 * measurement handle — and a primitive that cannot be pointed at gets wrapped
 * in another div, which is the wrapper this component exists to remove.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ wide = false, className, children, ...rest }, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'mx-auto w-full px-10',
          wide ? 'max-w-[1280px]' : 'max-w-[1160px]',
          className,
        )}
      >
        {children}
      </div>
    )
  },
)
