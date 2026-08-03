import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Clock, LayoutDashboard } from 'lucide-react'
import { SidebarExpanded } from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import { SiteHeader } from '@/components/organisms/SiteHeader/SiteHeader'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { PortalShell } from '@/pages/_shells/PortalShell'
import { SignIn } from '@/pages/SignIn/SignIn'

/**
 * The acceptance test for the `Logo` conversion.
 *
 * Each `BEFORE_*` constant below is the lockup markup as it stood on this
 * branch immediately before the conversion, copied verbatim from the call site.
 * Each test renders the real call site and asserts its lockup still serialises
 * to the same thing.
 *
 * Written and run green *against the unconverted call sites first*, so the
 * baselines are known to be transcriptions rather than descriptions of what the
 * new component happens to emit. Without that ordering this file proves nothing.
 *
 * One normalisation: class tokens are sorted before comparison. Composing the
 * lockup through `cva` + `cn` emits the same set of utilities in a different
 * order, and the order of tokens in a `class` attribute has no effect on what
 * Tailwind applies. Everything else — tag names, nesting, text, and every other
 * attribute and its value — is compared exactly.
 */

type Node = { tag: string; attrs: Record<string, string>; children: Node[] } | string

function serialise(el: Element): Node {
  const attrs: Record<string, string> = {}
  for (const attr of Array.from(el.attributes)) {
    attrs[attr.name] =
      attr.name === 'class'
        ? attr.value.split(/\s+/).filter(Boolean).sort().join(' ')
        : attr.value
  }

  const children = Array.from(el.childNodes).flatMap((child): Node[] => {
    if (child.nodeType === 1) return [serialise(child as Element)]
    const text = child.textContent?.trim() ?? ''
    return text ? [text] : []
  })

  return { tag: el.tagName.toLowerCase(), attrs, children }
}

/** The lockup is the parent of the `aria-hidden` element reading `TS`. */
function lockupIn(container: HTMLElement): Element {
  const tile = Array.from(container.querySelectorAll('[aria-hidden]')).find(
    (el) => el.textContent === 'TS',
  )
  if (!tile?.parentElement) throw new Error('No TS tile found in this call site')
  return tile.parentElement
}

function renderBaseline(markup: React.ReactElement): Node {
  const { container } = render(markup)
  return serialise(container.firstElementChild as Element)
}

// --- Baselines, transcribed from the five call sites --------------------------

/** `SidebarExpanded` — 20px tile, 9.5px literal mark, gap 8, `text-foreground`. */
const BEFORE_SIDEBAR = (
  <span className="flex items-center gap-2">
    <span
      aria-hidden
      className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-control font-mono text-[9.5px]"
    >
      TS
    </span>
    <span className="text-heading-block text-foreground">TimeSubmit</span>
  </span>
)

/** `SiteHeader` — 24px tile, `mono-count`, gap 10, `text-foreground`, on an `<a>`. */
const BEFORE_SITE_HEADER = (
  <a href="/" className="flex items-center gap-2.5">
    <span
      aria-hidden
      className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
    >
      TS
    </span>
    <span className="text-heading-block text-foreground">TimeSubmit</span>
  </a>
)

/** `PortalShell` — as `SiteHeader`, plus `shrink-0` on the anchor. */
const BEFORE_PORTAL_SHELL = (
  <a href="/" className="flex shrink-0 items-center gap-2.5">
    <span
      aria-hidden
      className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
    >
      TS
    </span>
    <span className="text-heading-block text-foreground">TimeSubmit</span>
  </a>
)

/** `SiteFooter` — 24px lockup on ink, so `text-ink-foreground`. */
const BEFORE_SITE_FOOTER = (
  <span className="flex items-center gap-2.5">
    <span
      aria-hidden
      className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
    >
      TS
    </span>
    <span className="text-heading-block text-ink-foreground">TimeSubmit</span>
  </span>
)

/** `SignIn` — as `SiteFooter`, on a positioned `<div>` above the panel image. */
const BEFORE_SIGN_IN = (
  <div className="relative flex items-center gap-2.5">
    <span
      aria-hidden
      className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
    >
      TS
    </span>
    <span className="text-heading-block text-ink-foreground">TimeSubmit</span>
  </div>
)

// --- Call-site fixtures -------------------------------------------------------

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

const nav = [{ label: 'Pricing', href: '/pricing' }]
const footerColumns = [
  { heading: 'Product', links: [{ label: 'Pricing', href: '/pricing' }] },
]

describe('Logo call sites render unchanged', () => {
  it('SidebarExpanded', () => {
    const { container } = render(<SidebarExpanded {...sidebar} />)
    expect(serialise(lockupIn(container))).toEqual(renderBaseline(BEFORE_SIDEBAR))
  })

  it('SiteHeader', () => {
    const { container } = render(
      <SiteHeader
        nav={nav}
        signIn={{ label: 'Sign in', href: '/sign-in' }}
        cta={{ label: 'Start free', href: '/sign-up' }}
      />,
    )
    expect(serialise(lockupIn(container))).toEqual(renderBaseline(BEFORE_SITE_HEADER))
  })

  it('PortalShell', () => {
    const { container } = render(
      <PortalShell
        links={[{ label: 'Timesheets', href: '/timesheets', current: true }]}
        user={{ name: 'Diane Rowe', initials: 'DR' }}
        mobileTabs={[{ label: 'Timesheets', icon: Clock, href: '/timesheets', current: true }]}
      >
        <p>Body</p>
      </PortalShell>,
    )
    expect(serialise(lockupIn(container))).toEqual(renderBaseline(BEFORE_PORTAL_SHELL))
  })

  it('SiteFooter', () => {
    const { container } = render(
      <SiteFooter
        blurb="Timesheet management for consultancies."
        columns={footerColumns}
        social={[{ label: 'LinkedIn', href: '/linkedin' }]}
        copyright="© 2026 TimeSubmit Ltd."
      />,
    )
    expect(serialise(lockupIn(container))).toEqual(renderBaseline(BEFORE_SITE_FOOTER))
  })

  it('SignIn', () => {
    const { container } = render(<SignIn />)
    expect(serialise(lockupIn(container))).toEqual(renderBaseline(BEFORE_SIGN_IN))
  })
})
