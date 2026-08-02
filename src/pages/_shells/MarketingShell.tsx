import * as React from 'react'
import { SiteHeader } from '@/components/organisms/SiteHeader/SiteHeader'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { MARKETING_NAV, FOOTER } from './marketing-data'
import { cn } from '@/lib/cn'

export interface MarketingShellProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /** Marks the current nav item. */
  current?: string
  children: React.ReactNode
}

/**
 * Marketing chrome: `SiteHeader`, the page, `SiteFooter`.
 *
 * Layout only. Content sits on the 1160 centred grid with 40px gutters, as a
 * `max-width` so it reflows at 390 rather than overflowing.
 */
export function MarketingShell({
  current,
  children,
  className,
  ...rest
}: MarketingShellProps) {
  return (
    <div {...rest} className={cn('bg-background flex min-h-screen flex-col', className)}>
      <SiteHeader
        nav={MARKETING_NAV.map((n) => ({ ...n, current: n.href === current }))}
        signIn={{ label: 'Sign in', href: '/sign-in' }}
        cta={{ label: 'Get started', href: '/sign-up' }}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter {...FOOTER} />
    </div>
  )
}

/** The 1160 centred content column. Max-width, never fixed. */
export function Container({
  wide = false,
  className,
  children,
}: {
  /** Pricing widens to 1280. */
  wide?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-10',
        wide ? 'max-w-[1280px]' : 'max-w-[1160px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
