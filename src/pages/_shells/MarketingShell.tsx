import * as React from 'react'
import { SiteHeader, type NavLink } from '@/components/organisms/SiteHeader/SiteHeader'
import {
  SiteFooter,
  type SiteFooterProps,
} from '@/components/organisms/SiteFooter/SiteFooter'
import { MARKETING_NAV, FOOTER } from './marketing-data'
import { cn } from '@/lib/cn'

/** Everything `SiteFooter` needs that is content rather than DOM. */
export type MarketingFooter = Pick<
  SiteFooterProps,
  'brand' | 'blurb' | 'columns' | 'social' | 'copyright' | 'strapline'
>

export interface MarketingShellProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** Marks the current nav item. */
  current?: string
  /**
   * Header navigation.
   *
   * Defaults to the library's own `MARKETING_NAV`, so every existing usage and
   * story renders exactly as before. Pass your own when the application's
   * public chrome differs — it does: the app carries a Blog entry these
   * constants do not, and its entries are framework router links rather than
   * bare anchors.
   *
   * An entry may carry `element` instead of `href`, which is how an
   * instrumented or non-anchor item gets expressed. See `NavLink`.
   */
  nav?: NavLink[]
  /**
   * Footer content. Defaults to the library's own `FOOTER`.
   *
   * Column links are `NavLink`s, so a footer entry can be a real `<button>` —
   * which is what a cookie-settings control has to be, and the reason a plain
   * `{label, href}` shape was not enough here.
   */
  footer?: MarketingFooter
  /**
   * Defaults to the library's own sign-in link.
   *
   * Not in the original brief for this change, and added anyway: without it
   * the header's two right-hand controls stay hardcoded, and the app's
   * "Get started" is an analytics-instrumented client component. A prop that
   * cannot be reached is the same blocker as a slot that does not exist.
   */
  signIn?: NavLink
  /** Defaults to the library's own CTA. See `signIn`. */
  cta?: NavLink
  /**
   * Widens the whole page, chrome included, to 1280.
   *
   * Forwarded to `SiteHeader` and `SiteFooter` as well as being the caller's
   * cue for its `Section`s, because a page of `wide` sections under 1160-wide
   * chrome is the same misalignment this prop exists to avoid.
   */
  wide?: boolean
  children: React.ReactNode
}

const DEFAULT_SIGN_IN: NavLink = { label: 'Sign in', href: '/sign-in' }
const DEFAULT_CTA: NavLink = { label: 'Get started', href: '/sign-up' }

/**
 * Marketing chrome: `SiteHeader`, the page, `SiteFooter`.
 *
 * Layout only. Content sits on the 1160 centred grid with 40px gutters, as a
 * `max-width` so it reflows at 390 rather than overflowing.
 *
 * All four content props default to the library's own constants, so the seven
 * marketing page compositions and their stories are unaffected.
 */
export function MarketingShell({
  current,
  nav = MARKETING_NAV,
  footer = FOOTER,
  signIn = DEFAULT_SIGN_IN,
  cta = DEFAULT_CTA,
  wide = false,
  children,
  className,
  ...rest
}: MarketingShellProps) {
  return (
    <div {...rest} className={cn('bg-background flex min-h-screen flex-col', className)}>
      <SiteHeader
        nav={nav.map((n) => ({ ...n, current: n.href === current }))}
        signIn={signIn}
        cta={cta}
        wide={wide}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter {...footer} wide={wide} />
    </div>
  )
}

/**
 * The 1160 centred content column.
 *
 * It moved to `@/components/atoms/Container/Container` so that `SiteHeader` and
 * `SiteFooter` can use it without importing this module, which composes them —
 * that would have been a cycle. Re-exported here so `./shells` keeps offering
 * it exactly as before.
 */
export { Container, type ContainerProps } from '@/components/atoms/Container/Container'
