import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Clock } from 'lucide-react'
import { NavItem } from '@/components/atoms/NavItem/NavItem'
import { navKey, navTarget, warnIfNotChildless } from './nav-slot'

/**
 * The one place `href`-or-`element` is turned into atom props.
 *
 * Every shell routes through `navTarget`, so the branch is decided once rather
 * than four times. The childless guard lives here for the same reason.
 */

afterEach(() => {
  vi.restoreAllMocks()
})

describe('navTarget', () => {
  it('passes href straight through when there is no element', () => {
    expect(navTarget({ href: '/clients' })).toEqual({ href: '/clients' })
  })

  it('yields undefined href when a destination has neither', () => {
    // The atom then renders a <button>, which is its documented behaviour.
    expect(navTarget({})).toEqual({ href: undefined })
  })

  it('switches to asChild when an element is present', () => {
    const element = <a href="/x" />
    expect(navTarget({ element })).toEqual({ asChild: true, children: element })
  })

  it('prefers element over href, rather than emitting both', () => {
    const element = <a href="/routed" />
    // Both set is a consumer mistake; silently injecting href onto someone
    // else's element would be worse than ignoring it.
    expect(navTarget({ href: '/ignored', element })).toEqual({
      asChild: true,
      children: element,
    })
  })
})

describe('navKey', () => {
  it('keys on href when there is one', () => {
    expect(navKey({ label: 'Clients', href: '/clients' })).toBe('/clients')
  })

  it('falls back to the label when the destination has no href', () => {
    // An element destination carries its href inside the consumer's element,
    // where the shell cannot see it, so the label is the only stable key.
    expect(navKey({ label: 'Clients', element: <a href="/clients" /> })).toBe(
      'Clients',
    )
  })
})

describe('the childless-element contract', () => {
  it('says nothing about a childless element', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warnIfNotChildless(<a href="/x" />, 'NavItem')
    expect(warn).not.toHaveBeenCalled()
  })

  it('warns when the element carries children', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warnIfNotChildless(<a href="/x">Clients</a>, 'NavItem')

    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]![0]).toMatch(/childless/i)
    expect(warn.mock.calls[0]![0]).toMatch(/NavItem/)
  })

  it('fires through a shell, which is where a consumer actually hits it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <NavItem
        label="Clients"
        icon={Clock}
        {...navTarget({ element: <a href="/clients">Clients</a> })}
      />,
    )

    expect(warn).toHaveBeenCalledOnce()
  })

  it('is a warning and not a throw, so a mistake degrades rather than breaks', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Children win over the composed content under Slot, so the icon is lost —
    // which is exactly what the warning is for. It must still render.
    const { container } = render(
      <NavItem
        label="Clients"
        icon={Clock}
        {...navTarget({ element: <a href="/clients">Mine</a> })}
      />,
    )

    expect(container.querySelector('a')).toHaveAttribute('href', '/clients')
  })
})
