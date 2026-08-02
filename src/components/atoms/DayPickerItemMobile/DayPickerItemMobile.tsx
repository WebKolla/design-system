import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const dayVariants = cva(
  'inline-flex h-[62px] w-[46px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-control border py-2 transition-colors',
  {
    variants: {
      state: {
        selected: 'bg-primary border-primary',
        default: 'bg-surface border-border',
        // Recessed, not removed — consultants do work weekends.
        weekend: 'bg-control border-border',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export type DayPickerState = 'selected' | 'default' | 'weekend'

export interface DayPickerItemMobileProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  /** Short day name, e.g. "Wed". */
  day: string
  /** Date of month, e.g. "29". */
  date: string | number
  /** Running total for that day, e.g. "8.0". Mono, because it is hours. */
  total: string
  /** @default 'default' */
  state?: DayPickerState
}

/**
 * The seven-day strip that replaces the grid on mobile.
 *
 * Never render a 7-column grid at 390 — the cells become untappable.
 *
 * This is how week context survives one-day-per-screen entry: every day shows
 * its running total, so the consultant can still reconstruct Tuesday by seeing
 * that Monday and Wednesday were 8. Losing that context is what makes
 * single-entry forms produce worse data.
 *
 * 46×62, above the 44px minimum.
 */
export const DayPickerItemMobile = React.forwardRef<
  HTMLButtonElement,
  DayPickerItemMobileProps
>(function DayPickerItemMobile(
  { day, date, total, state = 'default', className, type, ...rest },
  ref,
) {
  const selected = state === 'selected'

  return (
    <button
      {...rest}
      ref={ref}
      type={type ?? 'button'}
      aria-pressed={selected}
      className={cn(dayVariants({ state }), className)}
    >
      <span
        className={cn(
          'text-[10.5px] font-medium',
          selected
            ? 'text-primary-foreground'
            : state === 'weekend'
              ? 'text-subtle-foreground'
              : 'text-subtle-foreground',
        )}
      >
        {day}
      </span>
      <span
        className={cn(
          'text-body-cell font-medium',
          selected
            ? 'text-primary-foreground'
            : state === 'weekend'
              ? 'text-subtle-foreground'
              : 'text-foreground',
        )}
      >
        {date}
      </span>
      <span
        className={cn(
          'font-mono text-[10px] tabular-nums',
          selected
            ? 'text-primary-foreground'
            : state === 'weekend'
              ? 'text-subtle-foreground'
              : 'text-subtle-foreground',
        )}
      >
        {total}
      </span>
    </button>
  )
})
