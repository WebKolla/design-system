import * as React from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Container } from '@/components/atoms/Container/Container'
import { Logo } from '@/components/atoms/Logo/Logo'
import { NavAnchor } from './NavAnchor'
import { navKey, type NavTarget } from '@/lib/nav-slot'
import { cn } from '@/lib/cn'

/**
 * One marketing chrome entry.
 *
 * Extends `NavTarget`, the same `href`-or-`element` pair the shells' navigation
 * destinations use, so the library has one answer to "how do I hand this a
 * router link" rather than two that drift.
 *
 * `element` receives the chrome's className and `aria-current`, and `label`
 * becomes its children, so **pass a childless element** — see `NavElement`.
 * This is what lets an entry be a framework router link, an
 * analytics-instrumented CTA, or a real `<button>` such as a cookie-settings
 * control, none of which a string href can express.
 *
 * Omit it and the output is exactly the `<a href>` this has always rendered.
 */
export interface NavLink extends NavTarget {
  label: string
  current?: boolean
}

export interface SiteHeaderProps
  extends React.ComponentPropsWithoutRef<'header'> {
  /** @default 'TimeSubmit' */
  brand?: string
  /** Seven items on the marketing site. */
  nav: NavLink[]
  /** Widened to `NavLink` so it can carry an `element`. `{label, href}` still fits. */
  signIn: NavLink
  /** Widened to `NavLink` so an analytics-instrumented CTA can be passed. */
  cta: NavLink
  /** Widens the content column to 1280, matching a `wide` `Section`. */
  wide?: boolean
}

/**
 * Marketing site chrome. Brand, nav, Sign In, primary CTA.
 *
 * A real `<header>` landmark with a `<nav>` inside it — this one *is* the page
 * banner, unlike `SectionHeader`, which is only a heading block.
 *
 * The bar is full-bleed and its contents sit on `Container`, the same centred
 * column `Section` uses, so the background and the bottom border reach the
 * viewport edge while the logo lines up with the page beneath it. Laying the
 * children straight on the root with a fixed `px-10` gutter, which is what this
 * did before, put them outside that column at any viewport wider than 1160.
 *
 * The root's `flex items-center` is what centres the column inside the fixed
 * `h-15`; the horizontal centring is `mx-auto` and does not depend on it. A
 * `className` that replaces `display` at every width therefore loses the
 * vertical centring — `hidden lg:flex`, which is what a caller swapping in its
 * own mobile banner passes, keeps it at the widths the bar is visible.
 *
 * The mobile form is a separate concern: below 834 the caller swaps the nav
 * for a menu trigger.
 */
export const SiteHeader = React.forwardRef<HTMLElement, SiteHeaderProps>(
  function SiteHeader(
    { brand = 'TimeSubmit', nav, signIn, cta, wide = false, className, ...rest },
    ref,
  ) {
    return (
      <header
        {...rest}
        ref={ref}
        className={cn(
          'bg-surface border-hairline flex h-15 w-full items-center border-b',
          className,
        )}
      >
        <Container wide={wide} className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo href="/" brand={brand} />

            <nav aria-label="Main">
              <ul className="flex items-center gap-6">
                {nav.map((item) => (
                  <li key={navKey(item)}>
                    <NavAnchor
                      link={item}
                      className={cn(
                        'text-ui-md transition-colors',
                        item.current
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <NavAnchor
              link={signIn}
              className="text-ui-md text-muted-foreground hover:text-foreground transition-colors"
            />
            <Button size="md" asChild>
              {cta.element ? (
                React.cloneElement(cta.element, undefined, cta.label)
              ) : (
                <a href={cta.href}>{cta.label}</a>
              )}
            </Button>
          </div>
        </Container>
      </header>
    )
  },
)
