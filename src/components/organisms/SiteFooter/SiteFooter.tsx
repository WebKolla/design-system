import * as React from 'react'
import { Logo } from '@/components/atoms/Logo/Logo'
import { cn } from '@/lib/cn'
import type { NavLink } from '../SiteHeader/SiteHeader'
import { NavAnchor, navKey } from '../SiteHeader/NavAnchor'

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
            {/* `tone="ink"`: the wordmark sits on the ink surface, so it takes
                the mode-invariant `ink-foreground` rather than `foreground`. */}
            <Logo brand={brand} tone="ink" />
            <p className="text-body-cell text-ink-subtle max-w-[36ch]">{blurb}</p>
            <ul className="flex items-center gap-4">
              {social.map((s) => (
                <li key={navKey(s)}>
                  <NavAnchor
                    link={s}
                    className="text-ui-xs text-ink-subtle hover:text-ink-foreground transition-colors"
                  />
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="min-w-[150px]">
              <h2 className="text-ui-overline text-ink-subtle uppercase">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-2 pt-3">
                {col.links.map((link) => (
                  <li key={navKey(link)}>
                    <NavAnchor
                      link={link}
                      className="text-body-cell text-ink-muted hover:text-ink-foreground transition-colors"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-ink-border flex flex-wrap items-center justify-between gap-3 border-t pt-4.5">
          <span className="text-body-caption text-ink-subtle">{copyright}</span>
          {strapline ? (
            <span className="text-body-caption text-ink-subtle">{strapline}</span>
          ) : null}
        </div>
      </footer>
    )
  },
)
