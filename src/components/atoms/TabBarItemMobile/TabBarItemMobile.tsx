import * as React from 'react'
import { Slot } from 'radix-ui'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface TabBarItemMobileProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'ref'> {
  label: string
  icon: LucideIcon
  /** @default false */
  active?: boolean
  /** Render as a link. Omit for a button. */
  href?: string | undefined
  /**
   * Render as the child element instead of an `<a>` or `<button>` — the same
   * escape hatch `Button` has, and for the same reason: a framework's router
   * link needs the styling without the element.
   *
   * In a Next.js app this is the difference between a client-side transition
   * and a full document load on every tab tap.
   *
   * The child owns its own `href`; `href` and `type` are not injected. The
   * icon and label are still composed by this component and become the child's
   * children, so pass a childless element.
   *
   * @default false
   */
  asChild?: boolean
  /** The element to render into when `asChild` is set. Ignored otherwise. */
  children?: React.ReactNode
}

/**
 * Bottom tab bar destination.
 *
 * Five plus More — the sidebar has thirteen entries and a phone cannot carry
 * thirteen, so the five that survive are the ones a role opens daily.
 *
 * 52px tall inside a 64px bar with safe-area padding beneath, which the bar
 * supplies. **The label is always present**: an icon-only tab bar makes people
 * tap to find out what things are.
 */
export const TabBarItemMobile = React.forwardRef<
  HTMLElement,
  TabBarItemMobileProps
>(function TabBarItemMobile(
  {
    label,
    icon: Glyph,
    active = false,
    href,
    asChild = false,
    className,
    type,
    children,
    ...rest
  },
  ref,
) {
  /*
   * Renders the consumer's element under asChild, an <a> when href is given,
   * a <button> otherwise.
   *
   * TypeScript cannot union the elements' prop and ref types without a
   * full polymorphic-component generic, which is a lot of machinery for a
   * two-case switch. One cast here, at the boundary, keeps the public props
   * fully typed for consumers.
   */
  const Comp = (asChild ? Slot.Root : href ? 'a' : 'button') as React.ElementType

  return (
    <Comp
      {...rest}
      ref={ref as never}
      {...(asChild ? {} : href ? { href } : { type: type ?? 'button' })}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-[52px] flex-1 flex-col items-center justify-center gap-1 transition-colors',
        active ? 'text-primary' : 'text-subtle-foreground',
        className,
      )}
    >
      {/* Slottable is what lets the composed icon and label become the
          consumer element's children rather than being discarded. */}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : null}
      <Glyph className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="text-ui-micro">{label}</span>
    </Comp>
  )
})
