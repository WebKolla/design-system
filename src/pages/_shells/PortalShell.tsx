import * as React from 'react'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { Logo } from '@/components/atoms/Logo/Logo'
import { MobileTabBar, type MobileTab } from './MobileTabBar'
import { NavAnchor } from '@/components/organisms/SiteHeader/NavAnchor'
import type { NavLink } from '@/components/organisms/SiteHeader/SiteHeader'
import { navKey, warnIfNotChildless, type NavElement } from '@/lib/nav-slot'
import { cn } from '@/lib/cn'

/** The lockup at the left of the portal header. */
export interface PortalLogo {
  /**
   * Where the lockup points.
   *
   * @default '/'
   *
   * **The default is usually wrong for a portal**, and that is the defect this
   * prop exists to close: `/` is the marketing home, so a consultant or
   * approver clicking the logo left the product entirely. It stays the default
   * only because changing it would move every existing composition. Pass the
   * portal root.
   */
  href?: string | undefined
  /**
   * Render this element instead of the generated `<a>`, via `Logo`'s `asChild`.
   *
   * **Pass a childless element** — `Logo` composes the tile and the wordmark.
   * See `NavElement`.
   */
  element?: NavElement | undefined
  /**
   * The wordmark. The `TS` tile is the mark and does not change with it.
   * @default 'TimeSubmit'
   */
  brand?: string | undefined
}

export interface PortalShellProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Top-nav destinations.
   *
   * `NavLink`, so an entry may carry `element` instead of `href` and reach the
   * router link a `string` cannot express. **Pass a childless element** — the
   * shell composes the label. See `NavElement`.
   */
  links: NavLink[]
  /**
   * The header lockup.
   *
   * @default { href: '/' }
   */
  logo?: PortalLogo | undefined
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
  /**
   * Bottom tab bar below 834 — these portals otherwise have no mobile nav.
   *
   * `MobileTab` rather than the structural copy this used to declare inline,
   * for the reason given on `AppShell.mobileTabs`: the copy could not express
   * `element`, so the tab bar's escape hatch was unreachable through the shell
   * that renders it.
   */
  mobileTabs: MobileTab[]
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
  logo,
  user,
  headerActions,
  mobileTabs,
  children,
  className,
  ...rest
}: PortalShellProps) {
  if (logo?.element) warnIfNotChildless(logo.element, 'the PortalShell logo')

  return (
    <div
      {...rest}
      className={cn('bg-background flex min-h-screen flex-col', className)}
    >
      <header className="border-hairline bg-surface flex h-13 shrink-0 items-center justify-between gap-6 border-b px-7">
        <div className="flex min-w-0 items-center gap-8">
          {logo?.element ? (
            <Logo
              asChild
              className="shrink-0"
              {...(logo.brand !== undefined ? { brand: logo.brand } : {})}
            >
              {logo.element}
            </Logo>
          ) : (
            <Logo
              href={logo?.href ?? '/'}
              className="shrink-0"
              {...(logo?.brand !== undefined ? { brand: logo.brand } : {})}
            />
          )}

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {links.map((l) => (
                <li key={navKey(l)}>
                  {/*
                   * `NavAnchor`, the same renderer `SiteHeader` and
                   * `SiteFooter` use — not the `NavItem` atom.
                   *
                   * `NavItem` is the 236px sidebar row: it requires an `icon`,
                   * and it draws a 32px full-width pill with an active bar and
                   * a badge slot. This is a horizontal text link with no icon,
                   * and its className is already character-for-character the
                   * one `SiteHeader` gives its entries. Feeding it through
                   * `NavItem` would change every portal header in the product
                   * and demand an invented icon per link; feeding it through
                   * `NavAnchor` changes nothing and gains `element`.
                   */}
                  <NavAnchor
                    link={l}
                    className={cn(
                      'text-ui-md transition-colors',
                      l.current
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  />
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
