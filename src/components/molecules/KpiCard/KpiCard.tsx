import * as React from 'react'
import { Chip, type ChipTone } from '@/components/atoms/Chip/Chip'
import { cn } from '@/lib/cn'

export interface KpiCardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string
  /**
   * Always a figure. Rendered `mono/kpi`, because every value this tile shows
   * is an amount or a count.
   */
  value: string
  /** Delta chip, e.g. `{ label: '+8.2%', tone: 'success' }`. */
  delta?: { label: string; tone: ChipTone } | undefined
  footnote?: string | undefined
  /** Optional sparkline. Pass a rendered chart; this tile only reserves space. */
  sparkline?: React.ReactNode | undefined
}

/**
 * Dashboard KPI tile.
 *
 * Mono value, optional delta chip, optional sparkline and footnote. Every
 * figure it displays is an amount or a count, so the value always uses a
 * `mono/*` style, per the rule that hours, rates, amounts, dates and
 * identifiers are Geist Mono.
 */
export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  function KpiCard(
    { title, value, delta, footnote, sparkline, className, ...rest },
    ref,
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'bg-surface border-border flex w-full flex-col gap-2.5 rounded-card border px-4 pt-4 pb-4',
          className,
        )}
      >
        <p className="text-ui-label text-subtle-foreground">{title}</p>

        <div className="flex items-baseline gap-2.5">
          <span className="text-foreground font-mono text-mono-kpi tabular-nums">
            {value}
          </span>
          {delta ? <Chip tone={delta.tone}>{delta.label}</Chip> : null}
        </div>

        {footnote ? (
          <p className="text-body-micro text-subtle-foreground">{footnote}</p>
        ) : null}

        {sparkline ? <div className="h-8">{sparkline}</div> : null}
      </div>
    )
  },
)
