import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface PaginationProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  page: number
  pageCount: number
  /** e.g. "Showing 1–10 of 47". Left-aligned, because it is asked more often. */
  range: string
  onPageChange?: (page: number) => void
}

const cell =
  'inline-flex size-7 items-center justify-center rounded-control text-ui-label tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40'

/**
 * Desktop pagination for list screens.
 *
 * The range text is on the left because "how many are there" is asked more
 * often than "take me to page 3".
 *
 * **Mobile replaces this entirely** with infinite scroll under a count header —
 * do not shrink these 28px targets to fit a phone.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    { page, pageCount, range, onPageChange, className, ...rest },
    ref,
  ) {
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

    return (
      <nav
        {...rest}
        ref={ref}
        aria-label="Pagination"
        className={cn(
          'border-hairline flex h-[46px] w-full items-center justify-between border-t px-4',
          className,
        )}
      >
        <span className="text-ui-sm text-subtle-foreground">{range}</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={cn(cell, 'text-muted-foreground hover:bg-control')}
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                cell,
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-control',
              )}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            className={cn(cell, 'text-muted-foreground hover:bg-control')}
            disabled={page >= pageCount}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </nav>
    )
  },
)
