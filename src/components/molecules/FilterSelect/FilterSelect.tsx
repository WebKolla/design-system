import * as React from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface FilterSelectProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'onSelect'> {
  /**
   * Set this to the **chosen value** when active — "Northgate Rail", not
   * "Project". A filter that still reads "Project" once applied is how people
   * conclude the list is broken.
   */
  label: string
  /** @default false */
  active?: boolean
  /** Called when the x is pressed. Only rendered when active. */
  onClear?: () => void
}

/**
 * Toolbar filter.
 *
 * Default shows a chevron and opens a menu; Active shows the chosen value with
 * an x that clears it, on `primary-soft`.
 *
 * That swap matters: an applied filter that looks identical to an unapplied one
 * is how people conclude the list is broken. The clear affordance sits on the
 * chip itself, not in a separate "reset filters" link.
 */
export const FilterSelect = React.forwardRef<
  HTMLButtonElement,
  FilterSelectProps
>(function FilterSelect(
  { label, active = false, onClear, className, type, ...rest },
  ref,
) {
  return (
    <span
      className={cn(
        'inline-flex h-[30px] items-center gap-1.5 rounded-control border px-2.5 text-ui-sm transition-colors',
        active
          ? 'bg-primary-soft border-primary-border text-primary'
          : 'bg-surface border-border text-muted-foreground',
        className,
      )}
    >
      <button
        {...rest}
        ref={ref}
        type={type ?? 'button'}
        className="outline-none focus-visible:underline"
      >
        {label}
      </button>

      {active ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${label} filter`}
          className="text-primary rounded-pip outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X className="size-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      ) : (
        <ChevronDown
          className="text-subtle-foreground size-3.5 shrink-0"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </span>
  )
})
