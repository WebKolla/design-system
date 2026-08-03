import * as React from 'react'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { MobileTabBar } from './MobileTabBar'
import type { SidebarExpandedProps } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import { cn } from '@/lib/cn'

export interface PortalShellProps
  extends React.ComponentPropsWithoutRef<'div'> {
  links: Array<{ label: string; href: string; current?: boolean }>
  /**
   * Still required. It is the fallback avatar, and it is ignored when
   * `headerActions` is set.
   */
  user: { name: string; initials: string }
  /**
   * Replaces the account avatar at the right of the header.
   *
   * **Replaces, does not wrap.** The avatar is a static substitute with no
   * menu behind it. Wrapping would put a dead avatar next to a live account
   * control and leave two things that look like the same affordance.
   *
   * In the consuming app this carries Clerk's `<UserButton>`, which is the
   * only sign-out affordance in the product — without this prop these two
   * portals are a place the user cannot leave.
   */
  headerActions?: React.ReactNode | undefined
  /** Bottom tab bar below 834 — these portals otherwise have no mobile nav. */
  mobileTabs: Array<{
    label: string
    icon: SidebarExpandedProps['overview']['icon']
    href: string
    current?: boolean
  }>
  children: React.ReactNode
}

/**
 * Chrome for the consultant and approver portals.
 *
 * **Not the admin shell.** These two roles get a top nav rather than a
 * sidebar: they have four or five destinations, not thirteen, and a 236px
 * sidebar spends a seventh of the viewport saying almost nothing. The week
 * grid and the approver queue both want the full width.
 *
 * Below 834 the links move into a bottom tab bar, because these portals
 * otherwise have no navigation at all on a phone.
 */
export function PortalShell({
  links,
  user,
  headerActions,
  mobileTabs,
  children,
  className,
  ...rest
}: PortalShellProps) {
  return (
    <div
      {...rest}
      className={cn('bg-background flex min-h-screen flex-col', className)}
    >
      <header className="border-hairline bg-surface flex h-13 shrink-0 items-center justify-between gap-6 border-b px-7">
        <div className="flex min-w-0 items-center gap-8">
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <span
              aria-hidden
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
            >
              TS
            </span>
            <span className="text-heading-block text-foreground">TimeSubmit</span>
          </a>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={l.current ? 'page' : undefined}
                    className={cn(
                      'text-ui-md transition-colors',
                      l.current
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {headerActions ?? (
          <Avatar initials={user.initials} size={26} tone="primary" label={user.name} />
        )}
      </header>

      <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>

      <MobileTabBar tabs={mobileTabs} />
    </div>
  )
}
