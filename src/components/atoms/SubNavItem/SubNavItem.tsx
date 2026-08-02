import * as React from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/cn'

export type SubNavBadgeTone = 'faint' | 'warn'

export interface SubNavItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string
  /**
   * The badge is the whole point: "3/7" against Bank details tells you what is
   * outstanding without opening it. Use the word "Empty" rather than "0/4"
   * when nothing has been entered at all.
   */
  badge?: string
  /**
   * `warn` for incomplete counts, `faint` for plain ones.
   * @default 'faint'
   */
  badgeTone?: SubNavBadgeTone
  /** @default false */
  active?: boolean
  asChild?: boolean
}

/**
 * Section navigation for long records.
 *
 * A long form is not intimidating because it is long — it is intimidating
 * because you cannot see the end. Sectioning with per-section state turns an
 * unbounded scroll into a checklist, and checklists get finished.
 *
 * Becomes a scrollable chip row below 768.
 */
export const SubNavItem = React.forwardRef<HTMLButtonElement, SubNavItemProps>(
  function SubNavItem(
    {
      label,
      badge,
      badgeTone = 'faint',
      active = false,
      asChild = false,
      className,
      type,
      ...rest
    },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
      <Comp
        {...rest}
        ref={ref}
        {...(asChild ? {} : { type: type ?? 'button' })}
        aria-current={active ? 'true' : undefined}
        className={cn(
          'flex h-[38px] w-full items-center gap-2 rounded-control px-[11px] text-ui-sm transition-colors',
          active
            ? 'bg-primary-soft text-primary'
            : 'text-muted-foreground hover:bg-control',
          className,
        )}
      >
        <span className="flex-1 truncate text-left">{label}</span>
        {badge ? (
          <span
            className={cn(
              'shrink-0 text-[11px] tabular-nums',
              badgeTone === 'warn' ? 'text-warn' : 'text-faint-foreground',
            )}
          >
            {badge}
          </span>
        ) : null}
      </Comp>
    )
  },
)
