import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Clock, LayoutDashboard } from 'lucide-react'
import { AppShell } from './AppShell'
import { PortalShell } from './PortalShell'
import { MobileTabBar } from './MobileTabBar'
import { SidebarExpanded } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import type { SidebarExpandedProps } from '@/components/organisms/SidebarExpanded/SidebarExpanded'

/**
 * `element` reaching the atoms' `asChild`, through every shell.
 *
 * Three assertions per shell, and the third is the one that matters most:
 *
 * 1. the consumer's own element is what renders (`data-router-link` survives),
 * 2. it carries the atom's styling, which is only true if it reached `asChild`
 *    rather than being rendered beside or inside the generated element,
 * 3. **the composed icon and label are still there.** That is the silent
 *    failure mode of this whole mechanism: `Slot` merges props onto the child,
 *    and without `Slot.Slottable` the icon and label are discarded with no
 *    error and no warning. A test that only checks the href would pass against
 *    a nav of invisible, unlabelled links.
 */

/** A stand-in for a framework router link: childless, as the contract requires. */
const routerLink = <a href="/routed" data-router-link />

const sidebar: SidebarExpandedProps = {
  org: 'Meridian Partners',
  orgInitials: 'MP',
  user: 'Diane Rowe',
  role: 'Consultancy admin',
  userInitials: 'DR',
  overview: {
    label: 'Overview',
    icon: LayoutDashboard,
    element: routerLink,
    current: true,
  },
  groups: [
    {
      heading: 'Work',
      items: [{ label: 'Timesheets', icon: Clock, element: routerLink, badge: 4 }],
    },
  ],
}

const user = { name: 'Diane Rowe', initials: 'DR' }

/** Every entry must still be reachable, named and iconed. */
function expectComposedContent(el: HTMLElement, label: string) {
  expect(within(el).getByText(label)).toBeInTheDocument()
  expect(el.querySelector('svg')).not.toBeNull()
}

describe('SidebarDestination.element', () => {
  it('renders the consumer element and reaches NavItem asChild', () => {
    const { container } = render(<SidebarExpanded {...sidebar} />)

    const nav = container.querySelector('nav[aria-label="Sidebar"]')!
    const overview = within(nav as HTMLElement).getByRole('link', {
      name: /Overview/,
    })

    expect(overview).toHaveAttribute('data-router-link')
    expect(overview).toHaveAttribute('href', '/routed')
    // Reached asChild: the atom's className was merged onto the consumer element.
    expect(overview).toHaveClass('rounded-pip', 'bg-primary-soft')
    expect(overview).toHaveAttribute('aria-current', 'page')
  })

  it('keeps the composed icon, label and badge on an element destination', () => {
    const { container } = render(<SidebarExpanded {...sidebar} />)

    const nav = container.querySelector('nav[aria-label="Sidebar"]')!
    const timesheets = within(nav as HTMLElement).getByRole('link', {
      name: /Timesheets/,
    })

    expectComposedContent(timesheets, 'Timesheets')
    expect(timesheets).toHaveTextContent('4')
  })

  it('takes a mix of href and element destinations', () => {
    const { container } = render(
      <SidebarExpanded
        {...sidebar}
        overview={{
          label: 'Overview',
          icon: LayoutDashboard,
          href: '/dashboard',
        }}
      />,
    )

    const nav = container.querySelector('nav[aria-label="Sidebar"]')!
    expect(
      within(nav as HTMLElement).getByRole('link', { name: /Overview/ }),
    ).toHaveAttribute('href', '/dashboard')
    expect(
      within(nav as HTMLElement).getByRole('link', { name: /Timesheets/ }),
    ).toHaveAttribute('data-router-link')
  })
})

describe('AppShell rail element', () => {
  it('renders the consumer element and reaches NavRailItem asChild', () => {
    const { container } = render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        mobileTabs={[
          { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        ]}
      >
        <p>B</p>
      </AppShell>,
    )

    const rail = container.querySelector('nav[aria-label="Main"]')!
    const overview = within(rail as HTMLElement).getByRole('link', {
      name: 'Overview',
    })

    expect(overview).toHaveAttribute('data-router-link')
    expect(overview).toHaveAttribute('href', '/routed')
    expect(overview).toHaveClass('rounded-button', 'bg-primary-soft')
    // The rail has no visible text, so the accessible name is the only name.
    expect(overview).toHaveAttribute('aria-label', 'Overview')
    expect(overview.querySelector('svg')).not.toBeNull()
  })
})

describe('AppShell logoElement', () => {
  it('renders the consumer element and keeps the lockup as its children', () => {
    const { container } = render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        logoElement={routerLink}
        mobileTabs={[
          { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        ]}
      >
        <p>B</p>
      </AppShell>,
    )

    // The mark sits above the nav and outside it: a link home is not a
    // navigation destination.
    const rail = container.querySelector('nav[aria-label="Main"]')!
    const mark = screen.getByRole('link', { name: 'TimeSubmit' })

    expect(mark).toHaveAttribute('data-router-link')
    expect(mark).toHaveAttribute('href', '/routed')
    expect(rail.contains(mark)).toBe(false)
    // The composed lockup survived `asChild` — the silent failure this whole
    // suite exists to catch. The wordmark is the accessible name, so losing it
    // would leave a link named nothing at all.
    expect(mark).toHaveTextContent('TimeSubmit')
  })

  it('prefers the element over href, as navTarget does everywhere else', () => {
    render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        logoHref="/plain"
        logoElement={routerLink}
        mobileTabs={[
          { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        ]}
      >
        <p>B</p>
      </AppShell>,
    )

    expect(screen.getByRole('link', { name: 'TimeSubmit' })).toHaveAttribute(
      'href',
      '/routed',
    )
  })

  it('falls back to a plain anchor when only href is given', () => {
    render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        logoHref="/plain"
        mobileTabs={[
          { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
        ]}
      >
        <p>B</p>
      </AppShell>,
    )

    const mark = screen.getByRole('link', { name: 'TimeSubmit' })
    expect(mark).toHaveAttribute('href', '/plain')
    expect(mark).not.toHaveAttribute('data-router-link')
  })
})

describe('MobileTab.element', () => {
  it('renders the consumer element and reaches TabBarItemMobile asChild', () => {
    const { container } = render(
      <MobileTabBar
        tabs={[
          {
            label: 'Overview',
            icon: LayoutDashboard,
            element: routerLink,
            current: true,
          },
        ]}
      />,
    )

    const tab = within(container).getByRole('link', { name: /Overview/ })

    expect(tab).toHaveAttribute('data-router-link')
    expect(tab).toHaveAttribute('href', '/routed')
    expect(tab).toHaveClass('text-primary')
    expectComposedContent(tab, 'Overview')
  })

  it('takes a mix of href and element tabs', () => {
    const { container } = render(
      <MobileTabBar
        tabs={[
          { label: 'Overview', icon: LayoutDashboard, element: routerLink },
          { label: 'Timesheets', icon: Clock, href: '/timesheets' },
        ]}
      />,
    )

    expect(
      within(container).getByRole('link', { name: /Overview/ }),
    ).toHaveAttribute('data-router-link')
    expect(
      within(container).getByRole('link', { name: /Timesheets/ }),
    ).toHaveAttribute('href', '/timesheets')
  })
})

describe('PortalShell links element', () => {
  it('renders the consumer element in the top nav', () => {
    const { container } = render(
      <PortalShell
        links={[{ label: 'Timesheets', element: routerLink, current: true }]}
        user={user}
        mobileTabs={[{ label: 'Overview', icon: LayoutDashboard, href: '/d' }]}
      >
        <p>B</p>
      </PortalShell>,
    )

    const nav = container.querySelector('nav[aria-label="Main"]')!
    const link = within(nav as HTMLElement).getByRole('link', {
      name: 'Timesheets',
    })

    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', '/routed')
    expect(link).toHaveClass('text-ui-md', 'text-foreground')
    expect(link).toHaveAttribute('aria-current', 'page')
    // The label is composed by the shell, not carried by the consumer element.
    expect(link).toHaveTextContent('Timesheets')
  })
})

describe('PortalShell logo', () => {
  const base = {
    links: [{ label: 'Timesheets', href: '/timesheets' }],
    user,
    mobileTabs: [{ label: 'Overview', icon: LayoutDashboard, href: '/d' }],
  }

  it('takes an href, so the portal logo can point at the portal root', () => {
    const { container } = render(
      <PortalShell {...base} logo={{ href: '/dashboard/consultant' }}>
        <p>B</p>
      </PortalShell>,
    )

    // The defect this closes: hardcoded to `/`, which leaves the product.
    expect(container.querySelector('header a')).toHaveAttribute(
      'href',
      '/dashboard/consultant',
    )
  })

  it('takes an element, and keeps the composed lockup', () => {
    const { container } = render(
      <PortalShell {...base} logo={{ element: routerLink }}>
        <p>B</p>
      </PortalShell>,
    )

    const logo = container.querySelector('header a')!
    expect(logo).toHaveAttribute('data-router-link')
    expect(logo).toHaveAttribute('href', '/routed')
    // Reached asChild: the shell's own className is on the consumer element.
    expect(logo).toHaveClass('shrink-0')
    // The tile and wordmark are composed by Logo and must survive.
    expect(logo).toHaveTextContent('TS')
    expect(logo).toHaveTextContent('TimeSubmit')
  })

  it('takes a brand, without disturbing the destination', () => {
    const { container } = render(
      <PortalShell {...base} logo={{ href: '/portal', brand: 'Meridian' }}>
        <p>B</p>
      </PortalShell>,
    )

    const logo = container.querySelector('header a')!
    expect(logo).toHaveAttribute('href', '/portal')
    expect(logo).toHaveTextContent('Meridian')
  })

  it('still renders the lockup when the tab bar and nav use elements too', () => {
    render(
      <PortalShell
        links={[{ label: 'Timesheets', element: routerLink }]}
        user={user}
        mobileTabs={[
          { label: 'Overview', icon: LayoutDashboard, element: routerLink },
        ]}
        logo={{ element: routerLink }}
      >
        <p>B</p>
      </PortalShell>,
    )

    // Three separate call sites, one shared element: keys must not collide.
    expect(screen.getAllByRole('link', { name: /Timesheets|Overview|TimeSubmit/ }).length)
      .toBeGreaterThanOrEqual(3)
  })
})
