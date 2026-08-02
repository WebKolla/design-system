/**
 * Shared column grids for the list tables.
 *
 * The handoff's validation standard requires "column grids aligned between
 * header and row components". The only way to guarantee that is for both to
 * read the *same* definition, which is what this file is.
 *
 * These are real tables, not CSS-grid pseudo-tables: a grid is not announced
 * as a table by assistive technology, and fixed pixel columns overflow rather
 * than reflow. The header component renders `<thead><tr>`, the row component
 * renders `<tr>`, and the enclosing `<table>` plus `<colgroup>` comes from the
 * DataTable organism — which is why the widths live here rather than on either.
 *
 * `.ts` deliberately — see BUG-001.
 */

export interface TableColumn {
  key: string
  /** Column heading. Empty for select and action columns. */
  label: string
  /**
   * CSS width for the `<col>`. Fixed columns are px; flexible columns are a
   * percentage encoding the fr ratio from Figma, because `fr` has no meaning
   * inside a colgroup.
   */
  width: string
  /** Figures are right-aligned so decimal points line up down the column. */
  align?: 'left' | 'right'
  /** Hidden heading text for columns with no visible label. */
  srLabel?: string
}

/**
 * Invoices — Figma: `34 select · 108 identifier · 1.15fr · 1fr · 96 · 96 ·
 * 122 amount · 108 status · 40 actions`, summing to 1332 inside a 1440 frame
 * with the 52px rail.
 *
 * The two `fr` columns resolve to 389 and 339 at 1332, which is the 1.15:1
 * split expressed as percentages of the full table width.
 */
export const INVOICE_COLUMNS: TableColumn[] = [
  { key: 'select', label: '', width: '34px', srLabel: 'Select' },
  { key: 'invoice', label: 'Invoice', width: '108px' },
  { key: 'client', label: 'Client', width: '29.2%' },
  { key: 'consultant', label: 'Consultant', width: '25.45%' },
  { key: 'issued', label: 'Issued', width: '96px' },
  { key: 'due', label: 'Due', width: '96px' },
  { key: 'amount', label: 'Amount', width: '122px', align: 'right' },
  { key: 'status', label: 'Status', width: '108px' },
  { key: 'actions', label: '', width: '40px', srLabel: 'Actions' },
]

/**
 * Approver queue — Figma: `38 select · 1.5fr consultant · 1.05fr period ·
 * 1.15fr project · 92 hours · 118 submitted · 96 review`, summing to 1384
 * inside a 1440 frame with 28 gutters and no sidebar.
 *
 * Review is right-aligned and last, because the decision is the end of the
 * scan, not the start of it.
 */
export const APPROVAL_COLUMNS: TableColumn[] = [
  { key: 'select', label: '', width: '38px', srLabel: 'Select' },
  { key: 'consultant', label: 'Consultant', width: '30.5%' },
  { key: 'period', label: 'Period', width: '21.3%' },
  { key: 'project', label: 'Project', width: '23.3%' },
  { key: 'hours', label: 'Hours', width: '92px', align: 'right' },
  { key: 'submitted', label: 'Submitted', width: '118px' },
  { key: 'review', label: 'Review', width: '96px', align: 'right' },
]

/**
 * Week grid — Figma: `266px repeat(7,1fr) 84px`.
 *
 * Weekend columns are recessed from the header down, so the eye reads Sat and
 * Sun as different without them being missing.
 */
export const WEEK_COLUMNS: TableColumn[] = [
  { key: 'project', label: 'Project', width: '266px' },
  { key: 'mon', label: 'Mon', width: '10.7%' },
  { key: 'tue', label: 'Tue', width: '10.7%' },
  { key: 'wed', label: 'Wed', width: '10.7%' },
  { key: 'thu', label: 'Thu', width: '10.7%' },
  { key: 'fri', label: 'Fri', width: '10.7%' },
  { key: 'sat', label: 'Sat', width: '10.7%' },
  { key: 'sun', label: 'Sun', width: '10.7%' },
  { key: 'total', label: 'Total', width: '84px' },
]

/** Indices of the weekend columns in `WEEK_COLUMNS`. */
export const WEEKEND_KEYS = ['sat', 'sun'] as const

/** Shared `<colgroup>` for a table built from these columns. */
export function columnGroup(columns: TableColumn[]) {
  return columns.map((c) => ({ key: c.key, width: c.width }))
}
