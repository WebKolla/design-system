import * as React from 'react'
import { Slot } from 'radix-ui'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface TabBarItemMobileProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string
  icon: LucideIcon
  /** @default false */
  active?: boolean
  asChild?: boolean
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
  HTMLButtonElement,
  TabBarItemMobileProps
>(function TabBarItemMobile(
  { label, icon: Glyph, active = false, asChild = false, className, type, ...rest },
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
        'inline-flex h-[52px] flex-1 flex-col items-center justify-center gap-1 transition-colors',
        active ? 'text-primary' : 'text-subtle-foreground',
        className,
      )}
    >
      <Glyph className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="text-[10.5px] font-medium">{label}</span>
    </Comp>
  )
})
