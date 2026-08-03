import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Clock, LayoutDashboard } from 'lucide-react'
import { AppShell } from './AppShell'
import { PortalShell } from './PortalShell'
import type { SidebarExpandedProps } from '@/components/organisms/SidebarExpanded/SidebarExpanded'

/**
 * The shells have no story file — they are exercised through the twelve page
 * compositions — so the slot behaviour is proved here instead.
 *
 * Two assertions per slot, and the second one is the important one: that the
 * static element still renders, unchanged, when the slot is absent. That is
 * what protects every existing page composition and every consumer.
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
    { heading: 'Work', items: [{ label: 'Timesheets', icon: Clock, href: '/timesheets' }] },
  ],
}

const mobileTabs = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard', current: true },
]

describe('AppShell headerActions', () => {
  it('renders the static notification button when the slot is absent', () => {
    render(
      <AppShell sidebar={sidebar} page="Overview" notifications={3} mobileTabs={mobileTabs}>
        <p>Body</p>
      </AppShell>,
    )

    const bell = screen.getByRole('button', { name: 'Notifications, 3 unread' })
    expect(bell).toBeInTheDocument()
    expect(bell).toHaveTextContent('3')
  })

  it('renders the static button with no count when notifications is omitted', () => {
    render(
      <AppShell sidebar={sidebar} page="Overview" mobileTabs={mobileTabs}>
        <p>Body</p>
      </AppShell>,
    )

    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('replaces the static notification button rather than wrapping it', () => {
    render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        notifications={3}
        headerActions={<button type="button">Account menu</button>}
        mobileTabs={mobileTabs}
      >
        <p>Body</p>
      </AppShell>,
    )

    expect(screen.getByRole('button', { name: 'Account menu' })).toBeInTheDocument()
    // Replace, not wrap: the dead bell must be gone, not sitting beside it.
    expect(screen.queryByRole('button', { name: /Notifications/ })).toBeNull()
  })

  it('leaves the period control alone, because it is gated by its own prop', () => {
    render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        period="July 2026"
        headerActions={<button type="button">Account menu</button>}
        mobileTabs={mobileTabs}
      >
        <p>Body</p>
      </AppShell>,
    )

    expect(screen.getByRole('button', { name: /July 2026/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Account menu' })).toBeInTheDocument()
  })
})

describe('PortalShell headerActions', () => {
  const links = [{ label: 'Timesheets', href: '/timesheets', current: true }]
  const user = { name: 'Diane Rowe', initials: 'DR' }

  it('renders the static avatar when the slot is absent', () => {
    render(
      <PortalShell links={links} user={user} mobileTabs={mobileTabs}>
        <p>Body</p>
      </PortalShell>,
    )

    expect(screen.getByText('DR')).toBeInTheDocument()
  })

  it('replaces the static avatar rather than wrapping it', () => {
    render(
      <PortalShell
        links={links}
        user={user}
        headerActions={<button type="button">Account menu</button>}
        mobileTabs={mobileTabs}
      >
        <p>Body</p>
      </PortalShell>,
    )

    expect(screen.getByRole('button', { name: 'Account menu' })).toBeInTheDocument()
    expect(screen.queryByText('DR')).toBeNull()
  })
})
