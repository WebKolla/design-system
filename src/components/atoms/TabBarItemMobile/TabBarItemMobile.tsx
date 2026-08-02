import * as React from 'react'
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
  { label, icon: Glyph, active = false, href, className, type, ...rest },
  ref,
) {
  /*
   * Renders an <a> when href is given, a <button> otherwise.
   *
   * TypeScript cannot union the two elements' prop and ref types without a
   * full polymorphic-component generic, which is a lot of machinery for a
   * two-case switch. One cast here, at the boundary, keeps the public props
   * fully typed for consumers.
   */
  const Comp = (href ? 'a' : 'button') as React.ElementType

  return (
    <Comp
      {...rest}
      ref={ref as never}
      {...(href ? { href } : { type: type ?? 'button' })}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-[52px] flex-1 flex-col items-center justify-center gap-1 transition-colors',
        active ? 'text-primary' : 'text-subtle-foreground',
        className,
      )}
    >
      <Glyph className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="text-ui-micro">{label}</span>
    </Comp>
  )
})
