import * as React from 'react'
import { Slot } from 'radix-ui'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface NavRailItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  icon: LucideIcon
  /**
   * Required. The rail has no visible text, so the accessible name is the only
   * name — and it must match the expanded NavItem's label exactly.
   */
  label: string
  /** @default false */
  active?: boolean
  asChild?: boolean
}

/**
 * Collapsed sidebar item for the 52px icon rail.
 *
 * 36×36 centred, giving 8px either side. Fill and icon colour use the same
 * tokens as the expanded `NavItem`, so the two stay in step.
 */
export const NavRailItem = React.forwardRef<
  HTMLButtonElement,
  NavRailItemProps
>(function NavRailItem(
  { icon: Glyph, label, active = false, asChild = false, className, type, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      {...rest}
      ref={ref}
      {...(asChild ? {} : { type: type ?? 'button' })}
      aria-label={label}
      title={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-button transition-colors',
        active
          ? 'bg-primary-soft text-primary'
          : 'text-muted-foreground hover:bg-control',
        className,
      )}
    >
      <Glyph className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
    </Comp>
  )
})
