import * as React from 'react'
import { Slot } from 'radix-ui'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface NavItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'ref'> {
  label: string
  icon: LucideIcon
  /** @default false */
  active?: boolean
  /** Count badge. Omit to hide it. */
  badge?: string | number
  /** Render as a link. Omit for a button. */
  href?: string | undefined
  /**
   * Render as the child element instead of an `<a>` or `<button>` — the same
   * escape hatch `Button` has, and for the same reason: a framework's router
   * link needs the styling without the element.
   *
   * In a Next.js app this is the difference between a client-side transition
   * and a full document load on every sidebar click.
   *
   * The child owns its own `href`; `href` and `type` are not injected. The
   * icon, label and badge are still composed by this component and become the
   * child's children, so pass a childless element:
   * `<NavItem asChild label="Clients" icon={Building2}><Link href="/clients" /></NavItem>`
   *
   * @default false
   */
  asChild?: boolean
  /** The element to render into when `asChild` is set. Ignored otherwise. */
  children?: React.ReactNode
}

/**
 * Expanded sidebar navigation item, 236 wide.
 *
 * Pairs with `NavRailItem`, the 52px collapsed equivalent — keep icon order and
 * grouping identical across the two, or the sidebar appears to reorder itself
 * when it collapses.
 *
 * Active uses `primary-soft` with a primary icon and label, plus a 2px active
 * bar at the leading edge.
 */
export const NavItem = React.forwardRef<HTMLElement, NavItemProps>(
  function NavItem(
    {
      label,
      icon: Glyph,
      active = false,
      badge,
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
          'flex h-8 w-full items-center gap-[9px] rounded-pip pr-[9px] text-ui-sm transition-colors',
          active
            ? 'bg-primary-soft text-primary pl-[5px]'
            : 'text-muted-foreground hover:bg-control pl-[9px]',
          className,
        )}
      >
        {/* Slottable is what lets the composed icon/label/badge become the
            consumer element's children rather than being discarded. */}
        {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : null}
        {active ? (
          <span aria-hidden className="bg-primary h-4 w-0.5 shrink-0 rounded-full" />
        ) : null}
        <Glyph className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="flex-1 truncate text-left">{label}</span>
        {badge !== undefined ? (
          <span className="text-muted-foreground font-mono text-mono-count tabular-nums">
            {badge}
          </span>
        ) : null}
      </Comp>
    )
  },
)
