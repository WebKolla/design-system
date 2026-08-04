import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Clock, LayoutDashboard } from 'lucide-react'
import { AppShell } from './AppShell'
import { PortalShell } from './PortalShell'
import { MobileTabBar } from './MobileTabBar'
import { SidebarExpanded } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import type { SidebarExpandedProps } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import {
  APP_RAIL,
  PORTAL_LOGO,
  PORTAL_NAV,
  SIDEBAR_NAV,
  TAB_BAR,
} from './nav-baseline'

/**
 * **The regression guard for the whole `element` change.**
 *
 * Adding `element` to the shells means every destination now goes through a
 * branch that did not exist before. These five tests assert that the branch not
 * taken — `href` only, which is every existing consumer, all twelve page
 * compositions and every story — still emits the *exact same HTML* it emitted
 * before the change.
 *
 * Byte for byte, `outerHTML` against a baseline captured from the pre-change
 * render. Not a snapshot, not a set of spot assertions: attribute order, class
 * token order, element order and the icon SVGs are all compared, because a
 * silent reordering is precisely the kind of thing a spot assertion misses and
 * a measurement notices.
 *
 * See `nav-baseline.ts` for how the baselines were produced and why the
 * ordering matters.
 */

const sidebar: SidebarExpandedProps = {
  org: 'Meridian Partners',
  orgInitials: 'MP',
  user: 'Diane Rowe',
  role: 'Consultancy admin',
  userInitials: 'DR',
  overview: {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    current: true,
  },
  groups: [
    {
      heading: 'Work',
      items: [
        { label: 'Timesheets', icon: Clock, href: '/timesheets', badge: 4 },
      ],
    },
  ],
}

const mobileTabs = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard', current: true },
  { label: 'Timesheets', icon: Clock, href: '/timesheets' },
]

const portalLinks = [
  { label: 'Timesheets', href: '/timesheets', current: true },
  { label: 'Invoices', href: '/invoices' },
]

const user = { name: 'Diane Rowe', initials: 'DR' }

describe('shell navigation defaults are unchanged', () => {
  it('SidebarExpanded emits the same nav as before', () => {
    const { container } = render(<SidebarExpanded {...sidebar} />)

    expect(container.querySelector('nav[aria-label="Sidebar"]')!.outerHTML).toBe(
      SIDEBAR_NAV,
    )
  })

  it('the AppShell rail emits the same nav as before', () => {
    const { container } = render(
      <AppShell sidebar={sidebar} page="Overview" mobileTabs={mobileTabs}>
        <p>B</p>
      </AppShell>,
    )

    // The rail's wrapper, not its `nav`. The rail's width, border and surface
    // moved onto a wrapping element when the mark was added above the nav, so
    // asserting the `nav` alone would no longer see any of them — the test
    // would keep passing while the thing it was written to protect went
    // unwatched.
    expect(
      container.querySelector('nav[aria-label="Main"]')!.parentElement!
        .outerHTML,
    ).toBe(APP_RAIL)
  })

  it('MobileTabBar emits the same bar as before', () => {
    const { container } = render(<MobileTabBar tabs={mobileTabs} />)

    expect(container.querySelector('nav[aria-label="Primary"]')!.outerHTML).toBe(
      TAB_BAR,
    )
  })

  it('the PortalShell top nav emits the same nav as before', () => {
    const { container } = render(
      <PortalShell links={portalLinks} user={user} mobileTabs={mobileTabs}>
        <p>B</p>
      </PortalShell>,
    )

    expect(container.querySelector('nav[aria-label="Main"]')!.outerHTML).toBe(
      PORTAL_NAV,
    )
  })

  it('the PortalShell logo still links home when no logo prop is passed', () => {
    const { container } = render(
      <PortalShell links={portalLinks} user={user} mobileTabs={mobileTabs}>
        <p>B</p>
      </PortalShell>,
    )

    expect(container.querySelector('header a')!.outerHTML).toBe(PORTAL_LOGO)
  })
})
