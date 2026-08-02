import * as React from 'react'
import { cn } from '@/lib/cn'
import type { ChartSeries } from '../LegendRow/LegendRow'

const barTone: Record<ChartSeries, string> = {
  1: 'bg-chart-1',
  2: 'bg-chart-2',
  3: 'bg-chart-3',
  4: 'bg-chart-4',
  5: 'bg-chart-5',
  6: 'bg-chart-6',
}

export interface ProjectBarRowProps
  extends React.ComponentPropsWithoutRef<'div'> {
  project: string
  /** Mono and tabular so rows align down the column. */
  hours: string
  /** 0–1. The bar length is data-driven. */
  fraction: number
  /** @default 1 */
  series?: ChartSeries
}

/**
 * Horizontal bar row for the project hours chart.
 *
 * The bar length is data-driven; the hours figure is mono and tabular so rows
 * align down the column.
 */
export const ProjectBarRow = React.forwardRef<HTMLDivElement, ProjectBarRowProps>(
  function ProjectBarRow(
    { project, hours, fraction, series = 1, className, ...rest },
    ref,
  ) {
    const pct = Math.max(0, Math.min(1, fraction)) * 100

    return (
      <div
        {...rest}
        ref={ref}
        className={cn('flex h-6 w-full items-center gap-3.5', className)}
      >
        <span className="text-body text-muted-foreground w-[180px] shrink-0 truncate">
          {project}
        </span>

        <span className="bg-control h-2 min-w-0 flex-1 overflow-hidden rounded-pip">
          <span
            className={cn('block h-full rounded-pip', barTone[series])}
            style={{ width: `${pct}%` }}
          />
        </span>

        <span className="text-foreground w-[72px] shrink-0 text-right font-mono text-mono-cell tabular-nums">
          {hours}
        </span>
      </div>
    )
  },
)
