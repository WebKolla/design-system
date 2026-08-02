import * as React from 'react'
import { cn } from '@/lib/cn'

export interface TabChipMobileProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string
  count?: string | number
  /** @default false */
  active?: boolean
}

/**
 * Mobile equivalent of `Tab`.
 *
 * The desktop underline does not survive a horizontally scrollable row — an
 * underline on a chip that is half off-screen reads as a rendering fault. So
 * mobile uses a filled chip instead, on `radius/button` rather than a pill,
 * because a full pill is softer than anything else in this product.
 *
 * 36px tall. The parent row supplies 4px padding each side, which is what
 * reaches the 44px minimum touch target without a 44px chip.
 */
export const TabChipMobile = React.forwardRef<
  HTMLButtonElement,
  TabChipMobileProps
>(function TabChipMobile(
  { label, count, active = false, className, type, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type ?? 'button'}
      role="tab"
      aria-selected={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-button border px-3 text-ui-sm transition-colors',
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-surface border-border text-muted-foreground',
        className,
      )}
    >
      {label}
      {count !== undefined ? (
        <span
          className={cn(
            'text-mono-sm font-mono tabular-nums',
            active ? 'text-primary-foreground' : 'text-subtle-foreground',
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
})
