import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const bannerVariants = cva(
  'flex w-full items-start gap-3 rounded-card border p-4',
  {
    variants: {
      tone: {
        primary: 'bg-primary-soft border-primary-border',
        info: 'bg-info-bg border-info-border',
        success: 'bg-success-bg border-success-border',
        warn: 'bg-warn-bg border-warn-border',
        danger: 'bg-danger-bg border-danger-border',
      },
    },
    defaultVariants: { tone: 'primary' },
  },
)

const linkTone = {
  primary: 'text-primary',
  info: 'text-info',
  success: 'text-success',
  warn: 'text-warn',
  danger: 'text-danger',
} as const

const iconTone = {
  primary: 'text-primary',
  info: 'text-info',
  success: 'text-success',
  warn: 'text-warn',
  danger: 'text-danger',
} as const

export type BannerTone = keyof typeof linkTone

export interface BannerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string
  body?: string | undefined
  icon?: LucideIcon | undefined
  /** `primary` is the rate-blind panel. @default 'primary' */
  tone?: BannerTone
  link?: { label: string; href: string } | undefined
}

/**
 * A standing statement of fact, not a dismissible alert.
 *
 * **There is no close button on purpose**: the rate-blind banner on the
 * approver queue is the reason that screen is trusted, and an approver who
 * dismisses it loses the one sentence telling them they are not being asked to
 * make a commercial judgement.
 *
 * Tone `primary` is the rate-blind panel. Info, success, warn and danger are
 * for transient system states — if you find yourself wanting a close button,
 * you want a `Toast`.
 */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  function Banner(
    { title, body, icon: Glyph, tone = 'primary', link, className, ...rest },
    ref,
  ) {
    return (
      <div {...rest} ref={ref} className={cn(bannerVariants({ tone }), className)}>
        {Glyph ? (
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-control',
              iconTone[tone],
            )}
          >
            <Glyph className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-cell text-foreground font-medium">{title}</p>
          {body ? (
            <p className="text-body-caption text-muted-foreground">{body}</p>
          ) : null}
        </div>

        {link ? (
          <a
            href={link.href}
            className={cn(
              'text-ui-sm shrink-0 underline-offset-4 hover:underline',
              linkTone[tone],
            )}
          >
            {link.label}
          </a>
        ) : null}
      </div>
    )
  },
)
