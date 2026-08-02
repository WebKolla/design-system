import * as React from 'react'
import { cn } from '@/lib/cn'

export type SkeletonShape = 'text' | 'block' | 'circle'

export interface SkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * `text` is a 12px bar on `radius/pip`; `block` is a 34px slab on
   * `radius/control` — the control height `Input` and `Button md` already use;
   * `circle` is a 34px disc, the middle `Avatar` size.
   *
   * All three are starting points. Override the height with a class when the
   * real element is a different height, because the point of a skeleton is that
   * it is the shape of what is arriving.
   * @default 'text'
   */
  shape?: SkeletonShape
  /**
   * Number of bars. `text` only — the last bar is short, because a paragraph's
   * last line is. @default 1
   */
  lines?: number
  /**
   * What is loading, for screen readers. Announced once, politely.
   *
   * Pass `null` for a skeleton inside a region that already announces its own
   * loading state, so a table of twelve skeleton rows does not say "loading"
   * twelve times.
   * @default 'Loading'
   */
  label?: string | null
}

/**
 * The shape of what is arriving, in `--color-control`.
 *
 * **Never a spinner inside a page.** A spinner says "something is happening";
 * a skeleton says "here is what is arriving", and it holds the layout so
 * nothing jumps when the data lands.
 *
 * Match the real layout's shape and row count. Twelve rows of skeleton for a
 * table that returns twelve rows; three bars for three lines of copy. A single
 * grey rectangle standing in for a whole screen is a spinner with square
 * corners.
 *
 * The pulse is `animate-pulse`, which the token layer's
 * `prefers-reduced-motion` reset already neutralises.
 *
 * **Not reviewed by design.** Derived from `COMPONENTS.md`'s existing Skeleton
 * spec and the `bg-control` surface `EmptyState` already uses for its icon
 * well.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { shape = 'text', lines = 1, label = 'Loading', className, ...rest },
    ref,
  ) {
    const bar = {
      text: 'h-3 w-full rounded-pip',
      block: 'h-[34px] w-full rounded-control',
      circle: 'size-[34px] rounded-full',
    }[shape]

    const count = shape === 'text' ? Math.max(1, lines) : 1

    return (
      <div
        {...rest}
        ref={ref}
        {...(label === null ? { 'aria-hidden': true } : { role: 'status', 'aria-busy': true })}
        className={cn('flex w-full flex-col gap-2', className)}
      >
        {label === null ? null : <span className="sr-only">{label}</span>}
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              'bg-control block animate-pulse',
              bar,
              // A paragraph's last line is short. One bar is a label, not a
              // paragraph, so it stays full width.
              count > 1 && i === count - 1 && 'w-3/5',
            )}
          />
        ))}
      </div>
    )
  },
)
