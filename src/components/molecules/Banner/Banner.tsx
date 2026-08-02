import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
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
  /**
   * Opt in to a close control. **Defaults to `false`, and that default is the
   * product guarantee** — see the note on the component below.
   *
   * The component holds no dismissal state and never touches `localStorage`.
   * It renders the affordance and tells you it was pressed; whether the banner
   * comes back tomorrow, on another device, or for another user is a decision
   * only the consumer can make.
   * @default false
   */
  dismissible?: boolean
  /** Called when the close control is pressed. Only rendered when `dismissible`. */
  onDismiss?: (() => void) | undefined
  /**
   * Accessible name for the close control. Name the thing being dismissed when
   * more than one banner can be on screen — "Dismiss guidance", not "Dismiss".
   * @default 'Dismiss'
   */
  dismissLabel?: string
}

/**
 * A standing statement of fact.
 *
 * **`dismissible` defaults to `false` and must stay that way.** The rate-blind
 * banner on the approver queue is the reason that screen is trusted, and an
 * approver who dismisses it loses the one sentence telling them they are not
 * being asked to make a commercial judgement. That instance is undismissable
 * because *it* is undismissable, not because the component cannot dismiss —
 * which is why `BannerIsUndismissable` on `Pages/1c · Approver queue` asserts
 * the absence of a close control on the rendered page, and still passes.
 *
 * Opt in for guidance a user has already read: page instructions, a cookie
 * notice. Never for a state they need to keep seeing.
 *
 * Tone `primary` is the rate-blind panel. Info, success, warn and danger are
 * for transient system states — if the message is momentary rather than
 * standing, you want a `Toast`.
 */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  function Banner(
    {
      title,
      body,
      icon: Glyph,
      tone = 'primary',
      link,
      dismissible = false,
      onDismiss,
      dismissLabel = 'Dismiss',
      className,
      ...rest
    },
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

        {dismissible ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className={cn(
              'rounded-control shrink-0 p-1 transition-colors',
              // The tone colour, matching the leading glyph: each one is
              // already carried as text on this tint, so it is legible on it.
              iconTone[tone],
              'hover:bg-surface',
            )}
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        ) : null}
      </div>
    )
  },
)
