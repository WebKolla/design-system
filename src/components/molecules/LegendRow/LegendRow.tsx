import * as React from 'react'
import { cn } from '@/lib/cn'

export type ChartSeries = 1 | 2 | 3 | 4 | 5 | 6

const swatchTone: Record<ChartSeries, string> = {
  1: 'bg-chart-1',
  2: 'bg-chart-2',
  3: 'bg-chart-3',
  4: 'bg-chart-4',
  5: 'bg-chart-5',
  6: 'bg-chart-6',
}

export interface LegendRowProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
  /** Mono and tabular, so counts line up down the column. */
  count: string | number
  /**
   * Which chart series this entry belongs to. Bound to `color/chart-*` rather
   * than a literal, so a ramp change reaches the legend too.
   */
  series: ChartSeries
}

/**
 * Chart legend entry: swatch, label and mono count.
 *
 * Sits under the donut and bar charts on the admin overview. The swatch is
 * bound to the matching `color/chart-*` token rather than set literally.
 */
export const LegendRow = React.forwardRef<HTMLDivElement, LegendRowProps>(
  function LegendRow({ label, count, series, className, ...rest }, ref) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn('flex h-6 w-full items-center gap-2.5', className)}
      >
        <span
          aria-hidden
          className={cn('size-2.5 shrink-0 rounded-[3px]', swatchTone[series])}
        />
        <span className="text-body text-muted-foreground min-w-0 flex-1 truncate">
          {label}
        </span>
        <span className="text-foreground shrink-0 font-mono text-body tabular-nums">
          {count}
        </span>
      </div>
    )
  },
)
