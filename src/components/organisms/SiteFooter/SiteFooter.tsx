import * as React from 'react'
import { cn } from '@/lib/cn'
import type { NavLink } from '../SiteHeader/SiteHeader'

export interface FooterColumn {
  heading: string
  links: NavLink[]
}

export interface SiteFooterProps
  extends React.ComponentPropsWithoutRef<'footer'> {
  /** @default 'TimeSubmit' */
  brand?: string
  blurb: string
  /** Three columns on the marketing site. */
  columns: FooterColumn[]
  social: NavLink[]
  copyright: string
  strapline?: string | undefined
}

/**
 * Marketing site footer on ink.
 *
 * Brand blurb, three link columns, social links, legal bar.
 *
 * Every colour here is `ink-*`: the footer is an ink surface, so the ordinary
 * `muted-foreground` / `subtle-foreground` pair would fail contrast against it.
 */
export const SiteFooter = React.forwardRef<HTMLElement, SiteFooterProps>(
  function SiteFooter(
    { brand = 'TimeSubmit', blurb, columns, social, copyright, strapline, className, ...rest },
    ref,
  ) {
    return (
      <footer
        {...rest}
        ref={ref}
        className={cn('bg-ink flex w-full flex-col gap-9 px-10 pt-12 pb-6', className)}
      >
        <div className="flex flex-wrap gap-10">
          <div className="flex min-w-[260px] flex-1 flex-col gap-3">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-control font-mono text-mono-count"
              >
                TS
              </span>
              <span className="text-heading-block text-ink-foreground">{brand}</span>
            </span>
            <p className="text-body-cell text-ink-subtle max-w-[36ch]">{blurb}</p>
            <ul className="flex items-center gap-4">
              {social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="text-ui-xs text-ink-subtle hover:text-ink-foreground transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="min-w-[150px]">
              <h2 className="text-ui-overline text-ink-faint uppercase">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-2 pt-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-body-cell text-ink-muted hover:text-ink-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-ink-border flex flex-wrap items-center justify-between gap-3 border-t pt-4.5">
          <span className="text-body-caption text-ink-faint">{copyright}</span>
          {strapline ? (
            <span className="text-body-caption text-ink-faint">{strapline}</span>
          ) : null}
        </div>
      </footer>
    )
  },
)
