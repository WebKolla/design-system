import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Clock, LayoutDashboard } from 'lucide-react'
import { Logo } from './Logo'
import { SiteHeader } from '@/components/organisms/SiteHeader/SiteHeader'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { SidebarExpanded } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import { AppShell } from '@/pages/_shells/AppShell'
import { PortalShell } from '@/pages/_shells/PortalShell'

/**
 * The artwork slot, and the four shells that forward it.
 *
 * `logo-call-sites.test.tsx` next door already holds the harder half of the
 * requirement — that the rendering with no artwork is byte-for-byte what it
 * was — by comparing each call site against markup transcribed before the
 * component existed. This file covers the new behaviour, and adds one direct
 * assertion that the tile is still the default so a reader of this file alone
 * can see the fallback is tested.
 *
 * The accessible name is asserted in every case on purpose. Artwork carries
 * none, so a slot that quietly dropped the `brand` span would leave a link
 * home named nothing at all, and nothing else here would catch it: the page
 * would still look right.
 */

const MARK = <svg data-testid="mark" width="24" height="24" aria-hidden />
const LOCKUP = <svg data-testid="lockup" width="120" height="24" aria-hidden />

/** The lockup's own root, whatever element it rendered as. */
function lockupRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

describe('Logo artwork resolution', () => {
  it('renders the TS tile when no artwork is passed', () => {
    const { container } = render(<Logo />)

    expect(screen.getByText('TS')).toHaveAttribute('aria-hidden')
    expect(screen.getByText('TimeSubmit')).toBeInTheDocument()
    expect(lockupRoot(container).querySelector('svg')).toBeNull()
  })

  it('adding the props changes nothing when neither is supplied', () => {
    const { container: withoutProps } = render(<Logo />)
    const { container: withUndefined } = render(
      <Logo mark={undefined} lockup={undefined} />,
    )

    expect(withUndefined.innerHTML).toBe(withoutProps.innerHTML)
  })

  it('mark replaces the tile and keeps the visible wordmark', () => {
    render(<Logo mark={MARK} />)

    expect(screen.queryByText('TS')).not.toBeInTheDocument()
    expect(screen.getByTestId('mark')).toBeInTheDocument()

    const wordmark = screen.getByText('TimeSubmit')
    expect(wordmark).toBeInTheDocument()
    expect(wordmark).not.toHaveClass('sr-only')
  })

  it('lockup replaces the tile and the wordmark, keeping the accessible name', () => {
    render(<Logo lockup={LOCKUP} href="/" />)

    expect(screen.queryByText('TS')).not.toBeInTheDocument()
    expect(screen.getByTestId('lockup')).toBeInTheDocument()

    // Hidden, not removed: it is the link's only accessible name.
    expect(screen.getByText('TimeSubmit')).toHaveClass('sr-only')
    expect(screen.getByRole('link', { name: 'TimeSubmit' })).toBeInTheDocument()
  })

  it('prefers the lockup over the mark when the wordmark is shown', () => {
    render(<Logo mark={MARK} lockup={LOCKUP} />)

    expect(screen.getByTestId('lockup')).toBeInTheDocument()
    expect(screen.queryByTestId('mark')).not.toBeInTheDocument()
  })

  it('prefers the mark over the lockup on the collapsed rail', () => {
    render(<Logo wordmark={false} mark={MARK} lockup={LOCKUP} />)

    expect(screen.getByTestId('mark')).toBeInTheDocument()
    expect(screen.queryByTestId('lockup')).not.toBeInTheDocument()
    expect(screen.getByText('TimeSubmit')).toHaveClass('sr-only')
  })

  it('falls back to the lockup on the rail when only a lockup is given', () => {
    render(<Logo wordmark={false} lockup={LOCKUP} />)

    expect(screen.getByTestId('lockup')).toBeInTheDocument()
    expect(screen.queryByText('TS')).not.toBeInTheDocument()
  })

  it('falls back to the tile on the rail when no artwork is given', () => {
    render(<Logo wordmark={false} />)

    expect(screen.getByText('TS')).toBeInTheDocument()
    expect(screen.getByText('TimeSubmit')).toHaveClass('sr-only')
  })

  it('keeps size, tone and asChild working with artwork present', () => {
    render(
      <Logo asChild size="sm" tone="ink" mark={MARK}>
        <a href="/dashboard" data-testid="router-link" />
      </Logo>,
    )

    const link = screen.getByTestId('router-link')
    expect(link).toHaveClass('gap-2')
    expect(within(link).getByTestId('mark')).toBeInTheDocument()
    // `tone` governs the text wordmark only; the artwork colours itself.
    expect(screen.getByText('TimeSubmit')).toHaveClass('text-ink-foreground')
  })

  it('does not let a flex row squash artwork wider than the tile', () => {
    render(<Logo lockup={LOCKUP} />)

    expect(screen.getByTestId('lockup').parentElement).toHaveClass('shrink-0')
  })
})

// --- The shells forward it ----------------------------------------------------

const sidebar = {
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

describe('the shells forward artwork to the mark', () => {
  it('SiteHeader', () => {
    render(
      <SiteHeader
        logo={{ lockup: LOCKUP }}
        nav={[{ label: 'Pricing', href: '/pricing' }]}
        signIn={{ label: 'Sign in', href: '/sign-in' }}
        cta={{ label: 'Start free', href: '/sign-up' }}
      />,
    )

    expect(screen.getByTestId('lockup')).toBeInTheDocument()
    expect(screen.queryByText('TS')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'TimeSubmit' })).toHaveAttribute('href', '/')
  })

  it('SiteFooter', () => {
    render(
      <SiteFooter
        logo={{ lockup: LOCKUP }}
        blurb="Timesheet management for consultancies."
        columns={[{ heading: 'Product', links: [{ label: 'Pricing', href: '/pricing' }] }]}
        social={[{ label: 'LinkedIn', href: '/linkedin' }]}
        copyright="© 2026 TimeSubmit Ltd."
      />,
    )

    expect(screen.getByTestId('lockup')).toBeInTheDocument()
    expect(screen.queryByText('TS')).not.toBeInTheDocument()
  })

  it('SidebarExpanded', () => {
    render(<SidebarExpanded {...sidebar} logo={{ lockup: LOCKUP }} />)

    expect(screen.getByTestId('lockup')).toBeInTheDocument()
  })

  it('AppShell reaches both the rail and the expanded sidebar from one object', () => {
    render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        mobileTabs={mobileTabs}
        logoHref="/dashboard"
        logo={{ mark: MARK, lockup: LOCKUP }}
      >
        <p>Body</p>
      </AppShell>,
    )

    // The rail renders with `wordmark={false}`, so it takes the mark; the
    // 236px sidebar takes the lockup. Both are in the document at once —
    // which of them is visible is a media query, not a render.
    expect(screen.getByTestId('mark')).toBeInTheDocument()
    expect(screen.getByTestId('lockup')).toBeInTheDocument()
    expect(screen.queryByText('TS')).not.toBeInTheDocument()
  })

  it('AppShell artwork composes with logoHref rather than replacing it', () => {
    render(
      <AppShell
        sidebar={sidebar}
        page="Overview"
        mobileTabs={mobileTabs}
        logoHref="/dashboard"
        logo={{ mark: MARK }}
      >
        <p>Body</p>
      </AppShell>,
    )

    const railLink = screen.getByRole('link', { name: 'TimeSubmit' })
    expect(railLink).toHaveAttribute('href', '/dashboard')
    expect(within(railLink).getByTestId('mark')).toBeInTheDocument()
  })

  it('PortalShell carries artwork alongside href, element and brand', () => {
    render(
      <PortalShell
        logo={{ element: <a href="/portal" data-testid="router-link" />, lockup: LOCKUP }}
        links={[{ label: 'Timesheets', href: '/timesheets', current: true }]}
        user={{ name: 'Diane Rowe', initials: 'DR' }}
        mobileTabs={[{ label: 'Timesheets', icon: Clock, href: '/timesheets', current: true }]}
      >
        <p>Body</p>
      </PortalShell>,
    )

    const link = screen.getByTestId('router-link')
    expect(link).toHaveAttribute('href', '/portal')
    expect(within(link).getByTestId('lockup')).toBeInTheDocument()
    // The element slot still names the link, through the sr-only wordmark.
    expect(screen.getByRole('link', { name: 'TimeSubmit' })).toBe(link)
  })

  it('PortalShell falls back to the tile when only a destination is given', () => {
    render(
      <PortalShell
        logo={{ href: '/portal' }}
        links={[{ label: 'Timesheets', href: '/timesheets', current: true }]}
        user={{ name: 'Diane Rowe', initials: 'DR' }}
        mobileTabs={[{ label: 'Timesheets', icon: Clock, href: '/timesheets', current: true }]}
      >
        <p>Body</p>
      </PortalShell>,
    )

    expect(screen.getByText('TS')).toBeInTheDocument()
  })
})
