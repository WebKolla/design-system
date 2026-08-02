import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ToolbarSearchProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'size' | 'type'
>

/**
 * 30px toolbar search.
 *
 * Recessed onto `color/background` so it reads as a control inside a white
 * card rather than another card.
 *
 * **Width is set by the parent** — 190 on invoices, 250 on the approver queue.
 * Mobile collapses this to a 44px icon button that expands to full width on
 * tap; that behaviour belongs to the toolbar, not here.
 */
export const ToolbarSearch = React.forwardRef<
  HTMLInputElement,
  ToolbarSearchProps
>(function ToolbarSearch({ className, placeholder = 'Search', ...rest }, ref) {
  return (
    <div
      className={cn(
        'bg-background border-border flex h-[30px] w-full items-center gap-[7px] rounded-control border px-2.5 transition-colors',
        'focus-within:border-primary focus-within:ring-ring focus-within:ring-[3px]',
        className,
      )}
    >
      <Search
        className="text-subtle-foreground size-3.5 shrink-0"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        {...rest}
        ref={ref}
        type="search"
        placeholder={placeholder}
        className="text-ui-sm text-foreground placeholder:text-subtle-foreground min-w-0 flex-1 bg-transparent outline-none"
      />
    </div>
  )
})
