import * as React from 'react'
import { cn } from '@/lib/cn'
import type { TableColumn } from './columns'

export interface TableShellProps extends React.ComponentPropsWithoutRef<'table'> {
  columns: TableColumn[]
  /** Required. A table without a caption is unnavigable by screen reader. */
  caption: string
  /** Hide the caption visually while keeping it announced. */
  hideCaption?: boolean
}

/**
 * The `<table>` element and its `<colgroup>`.
 *
 * Header and row molecules render `<thead><tr>` and `<tr>` only, so they can be
 * composed without either owning the table. This shell supplies the column
 * widths both of them align to, and is what the stories use to render a header
 * or row in isolation. The DataTable organism uses it for real.
 */
export const TableShell = React.forwardRef<HTMLTableElement, TableShellProps>(
  function TableShell(
    { columns, caption, hideCaption = true, className, children, ...rest },
    ref,
  ) {
    return (
      <table
        {...rest}
        ref={ref}
        className={cn('w-full table-fixed border-collapse', className)}
      >
        <caption className={cn('text-left', hideCaption && 'sr-only')}>
          {caption}
        </caption>
        <colgroup>
          {columns.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        {children}
      </table>
    )
  },
)
