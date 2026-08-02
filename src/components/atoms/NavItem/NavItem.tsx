import * as React from 'react'
import { Slot } from 'radix-ui'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface NavItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string
  icon: LucideIcon
  /** @default false */
  active?: boolean
  /** Count badge. Omit to hide it. */
  badge?: string | number
  /** Render as a link without duplicating the styling. */
  asChild?: boolean
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
export const NavItem = React.forwardRef<HTMLButtonElement, NavItemProps>(
  function NavItem(
    { label, icon: Glyph, active = false, badge, asChild = false, className, type, ...rest },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
      <Comp
        {...rest}
        ref={ref}
        {...(asChild ? {} : { type: type ?? 'button' })}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-8 w-full items-center gap-[9px] rounded-pip pr-[9px] text-ui-sm transition-colors',
          active
            ? 'bg-primary-soft text-primary pl-[5px]'
            : 'text-muted-foreground hover:bg-control pl-[9px]',
          className,
        )}
      >
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
