import * as React from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { NavAnchor, navKey } from './NavAnchor'
import { cn } from '@/lib/cn'

export interface NavLink {
  label: string
  /**
   * Optional only because an entry may instead supply `element` — a
   * cookie-settings control is a `<button>` with no href. Supply one or the
   * other.
   */
  href?: string | undefined
  current?: boolean
  /**
   * Render this element instead of the generated `<a>`, using the same
   * `asChild` mechanism as `Button` and the nav atoms.
   *
   * It receives the chrome's className and `aria-current`, and `label` becomes
   * its children, so pass a childless element. This is what lets an entry be a
   * framework router link, an analytics-instrumented CTA, or a real `<button>`
   * such as a cookie-settings control — none of which a string href can
   * express.
   *
   * Omit it and the output is exactly the `<a href>` this has always rendered.
   */
  element?: React.ReactElement | undefined
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
}

/**
 * Marketing site chrome. Brand, nav, Sign In, primary CTA.
 *
 * A real `<header>` landmark with a `<nav>` inside it — this one *is* the page
 * banner, unlike `SectionHeader`, which is only a heading block.
 *
 * The mobile form is a separate concern: below 834 the caller swaps the nav
 * for a menu trigger.
 */
export const SiteHeader = React.forwardRef<HTMLElement, SiteHeaderProps>(
  function SiteHeader(
    { brand = 'TimeSubmit', nav, signIn, cta, className, ...rest },
    ref,
  ) {
    return (
      <header
        {...rest}
        ref={ref}
        className={cn(
          'bg-surface border-hairline flex h-15 w-full items-center justify-between border-b px-10',
          className,
        )}
      >
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
            >
              TS
            </span>
            <span className="text-heading-block text-foreground">{brand}</span>
          </a>

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
      </header>
    )
  },
)
