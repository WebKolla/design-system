import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MarketingShell } from './MarketingShell'
import { MARKETING_NAV, FOOTER } from './marketing-data'

/**
 * `MarketingShell` has no story file — it is exercised through the seven
 * marketing page compositions — so its props are proved here.
 *
 * The first test is the important one. It asserts the shell still renders the
 * library's own constants when nothing is passed, which is what keeps all seven
 * page compositions and their stories rendering exactly as before.
 */

describe('MarketingShell defaults', () => {
  it('falls back to MARKETING_NAV and FOOTER when nothing is passed', () => {
    render(
      <MarketingShell>
        <p>Body</p>
      </MarketingShell>,
    )

    // Scoped to the header: several labels also appear in the footer columns.
    const header = within(screen.getByRole('banner')).getByRole('navigation', {
      name: 'Main',
    })
    for (const entry of MARKETING_NAV) {
      const link = within(header).getByRole('link', { name: entry.label })
      expect(link).toHaveAttribute('href', entry.href)
    }

    expect(screen.getByText(FOOTER.blurb)).toBeInTheDocument()
    expect(screen.getByText(FOOTER.copyright)).toBeInTheDocument()
    for (const column of FOOTER.columns) {
      expect(screen.getByRole('navigation', { name: column.heading })).toBeInTheDocument()
    }
  })

  it('falls back to the library sign-in and CTA', () => {
    render(
      <MarketingShell>
        <p>Body</p>
      </MarketingShell>,
    )

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/sign-in',
    )
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/sign-up',
    )
  })

  it('still marks the current nav entry', () => {
    render(
      <MarketingShell current="/pricing">
        <p>Body</p>
      </MarketingShell>,
    )

    const header = within(screen.getByRole('banner')).getByRole('navigation', {
      name: 'Main',
    })
    expect(within(header).getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})

describe('MarketingShell overrides', () => {
  it('takes a nav the constants do not contain', () => {
    render(
      <MarketingShell nav={[{ label: 'Blog', href: '/blog' }]}>
        <p>Body</p>
      </MarketingShell>,
    )

    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
    expect(screen.queryByRole('link', { name: 'Approvals' })).toBeNull()
  })

  it('renders a nav entry that carries an element rather than an href', () => {
    render(
      <MarketingShell
        nav={[{ label: 'Pricing', element: <a href="/pricing" data-router-link /> }]}
      >
        <p>Body</p>
      </MarketingShell>,
    )

    const header = within(screen.getByRole('banner')).getByRole('navigation', {
      name: 'Main',
    })
    const link = within(header).getByRole('link', { name: 'Pricing' })
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('href', '/pricing')
  })

  it('renders a footer entry that is a button, which is what a cookie control needs', () => {
    render(
      <MarketingShell
        footer={{
          ...FOOTER,
          columns: [
            {
              heading: 'Legal',
              links: [
                { label: 'Terms', href: '/terms' },
                { label: 'Cookie settings', element: <button type="button" /> },
              ],
            },
          ],
        }}
      >
        <p>Body</p>
      </MarketingShell>,
    )

    const legal = screen.getByRole('navigation', { name: 'Legal' })
    const cookies = within(legal).getByRole('button', { name: 'Cookie settings' })
    expect(cookies.tagName).toBe('BUTTON')
    // Same class the generated anchor gets, so it does not look like a stray control.
    const terms = within(legal).getByRole('link', { name: 'Terms' })
    expect(cookies.getAttribute('class')).toBe(terms.getAttribute('class'))
  })

  it('takes an instrumented CTA element', () => {
    render(
      <MarketingShell cta={{ label: 'Get Started', element: <a href="/pricing" data-cta /> }}>
        <p>Body</p>
      </MarketingShell>,
    )

    const cta = screen.getByRole('link', { name: 'Get Started' })
    expect(cta).toHaveAttribute('data-cta')
    expect(cta).toHaveAttribute('href', '/pricing')
  })
})
