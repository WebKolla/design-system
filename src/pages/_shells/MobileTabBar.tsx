import { TabBarItemMobile } from '@/components/atoms/TabBarItemMobile/TabBarItemMobile'
import type { SidebarExpandedProps } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import { cn } from '@/lib/cn'

export interface MobileTab {
  label: string
  icon: SidebarExpandedProps['overview']['icon']
  href: string
  current?: boolean
}

export interface MobileTabBarProps {
  tabs: MobileTab[]
  className?: string
}

/**
 * The bottom tab bar, below 834.
 *
 * **The bar owns its height, not the item.** `TabBarItemMobile` is 52px by
 * design; the bar is 64px, so the 12px difference is `pt-3` here — a component
 * must not carry external spacing (§7.5). Safe-area padding goes beneath, and
 * resolves to 0 on devices without a home indicator.
 *
 * Both `AppShell` and `PortalShell` use this rather than each rendering their
 * own `<nav>`. They previously did the latter, and both omitted the bar height
 * — see BUG-002. One definition means they cannot drift again.
 */
export function MobileTabBar({ tabs, className }: MobileTabBarProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        'border-border bg-surface fixed inset-x-0 bottom-0 flex items-stretch border-t md:hidden',
        'pt-3 pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      {tabs.map((tab) => (
        <TabBarItemMobile
          key={tab.href}
          label={tab.label}
          icon={tab.icon}
          href={tab.href}
          {...(tab.current ? { active: true } : {})}
        />
      ))}
    </nav>
  )
}
