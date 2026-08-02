import * as React from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { cn } from '@/lib/cn'

export interface NavLink {
  label: string
  href: string
  current?: boolean
}

export interface SiteHeaderProps
  extends React.ComponentPropsWithoutRef<'header'> {
  /** @default 'TimeSubmit' */
  brand?: string
  /** Seven items on the marketing site. */
  nav: NavLink[]
  signIn: { label: string; href: string }
  cta: { label: string; href: string }
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
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={cn(
                      'text-ui-md transition-colors',
                      item.current
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={signIn.href}
            className="text-ui-md text-muted-foreground hover:text-foreground transition-colors"
          >
            {signIn.label}
          </a>
          <Button size="md" asChild>
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </div>
      </header>
    )
  },
)
