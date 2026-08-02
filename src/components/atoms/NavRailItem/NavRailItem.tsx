import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface NavRailItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'ref'> {
  icon: LucideIcon
  /**
   * Required. The rail has no visible text, so the accessible name is the only
   * name — and it must match the expanded NavItem's label exactly.
   */
  label: string
  /** @default false */
  active?: boolean
  /** Render as a link. Omit for a button. */
  href?: string | undefined
}

/**
 * Collapsed sidebar item for the 52px icon rail.
 *
 * 36×36 centred, giving 8px either side. Fill and icon colour use the same
 * tokens as the expanded `NavItem`, so the two stay in step.
 */
export const NavRailItem = React.forwardRef<
  HTMLElement,
  NavRailItemProps
>(function NavRailItem(
  { icon: Glyph, label, active = false, href, className, type, ...rest },
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
