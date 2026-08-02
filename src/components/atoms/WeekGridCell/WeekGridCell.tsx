import * as React from 'react'
import { cn } from '@/lib/cn'

export type WeekGridCellState = 'filled' | 'empty' | 'weekend'

export interface WeekGridCellProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'value' | 'size'> {
  /** Hours as entered, e.g. "7.5". Leave undefined for an empty cell. */
  value?: string
  /**
   * `weekend` is recessed and dashed. `empty` and `filled` are derived from
   * `value` unless you set this explicitly.
   */
  state?: WeekGridCellState
}

/**
 * One day, one project. A 32px box inside a 42px cell.
 *
 * **Empty shows a mid-dot, never a zero.** Zero is a claim — "I worked no
 * hours" — and blank is an absence — "I have not said yet". A grid full of
 * zeros looks submitted when it is not, and that difference is the whole
 * reason this rule exists.
 *
 * Weekend is dashed on a recessed cell: recessed, not removed. Consultants do
 * work weekends and hiding the column makes that unrecordable.
 *
 * Focus carries the primary border plus the 3px `color/ring`, matching `Input`.
 */
export const WeekGridCell = React.forwardRef<HTMLInputElement, WeekGridCellProps>(
  function WeekGridCell({ value, state, className, disabled, ...rest }, ref) {
    const resolved: WeekGridCellState =
      state ?? (value ? 'filled' : 'empty')
    const isWeekend = resolved === 'weekend'
    const isEmpty = !value

    return (
      <div
        className={cn(
          'flex h-[42px] items-center px-1 py-[5px]',
          isWeekend && 'bg-surface-raised',
          className,
        )}
      >
        <div
          className={cn(
            'flex h-8 w-full items-center justify-center rounded-control border transition-colors',
            'focus-within:border-primary focus-within:ring-ring focus-within:ring-[3px]',
            isWeekend ? 'border-border border-dashed bg-transparent' : 'border-border bg-surface',
          )}
        >
          <input
            {...rest}
            ref={ref}
            disabled={disabled}
            value={value ?? ''}
            inputMode="decimal"
            placeholder="·"
            className={cn(
              'w-full bg-transparent text-center font-mono text-mono-cell tabular-nums outline-none',
              // The mid-dot placeholder must read as an absence, not a value.
              'placeholder:text-faint-foreground',
              isEmpty || isWeekend ? 'text-faint-foreground' : 'text-foreground',
            )}
          />
        </div>
      </div>
    )
  },
)
