import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { INVOICE_COLUMNS } from '../_tables/columns'
import { TableRowInvoice } from '../TableRowInvoice/TableRowInvoice'
import { TableHeaderInvoices } from './TableHeaderInvoices'

const meta = {
  title: 'Molecules/TableHeaderInvoices',
  component: TableHeaderInvoices,
  parameters: {
    docs: {
      description: {
        component:
          'Column grid for every list screen: `34 select · 108 identifier · 1.15fr · 1fr · 96 · 96 · ' +
          '122 amount · 108 status · 40 actions`, summing to 1332 inside a 1440 frame with the 52px rail.' +
          '\n\nHeadings are overline caps. **The amount column is right-aligned here and in every row**, ' +
          'because a column of figures whose decimal points align can be compared at a glance and one ' +
          'that does not cannot.\n\nRenders `<thead><tr>` only — the `<table>` and `<colgroup>` come ' +
          'from the DataTable organism, which is how header and row are guaranteed to share widths.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={INVOICE_COLUMNS} caption="Invoices">
          <Story />
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof TableHeaderInvoices>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SelectAllStates: Story = {
  render: () => (
    <>
      <TableHeaderInvoices allSelected={false} />
      <TableHeaderInvoices allSelected="indeterminate" />
      <TableHeaderInvoices allSelected />
    </>
  ),
}

/** Header and row must line up — they read the same column definition. */
export const AlignsWithRows: Story = {
  render: () => (
    <>
      <TableHeaderInvoices />
      <tbody>
        <TableRowInvoice
          invoice="INV-0231"
          client="Halbrook Energy"
          consultant="Priya Nair"
          issued="01 Jul 26"
          due="15 Jul 26"
          amount="£11,400.00"
          status={{ label: 'Overdue', tone: 'danger' }}
          overdue
        />
        <TableRowInvoice
          alt
          invoice="INV-0232"
          client="Northgate Rail"
          consultant="Callum Byrne"
          issued="02 Jul 26"
          due="16 Jul 26"
          amount="£8,120.50"
          status={{ label: 'Sent', tone: 'info' }}
        />
      </tbody>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const amountHeader = canvas.getByRole('columnheader', { name: 'Amount' })
    const table = canvasElement.querySelector('table') as HTMLTableElement
    const firstAmount = table.querySelectorAll('tbody tr td')[6] as HTMLElement
    // Same right edge means the decimal points line up down the column.
    await expect(
      Math.round(amountHeader.getBoundingClientRect().right),
    ).toBe(Math.round(firstAmount.getBoundingClientRect().right))
  },
}

/** Every column needs a heading, including the ones with no visible text. */
export const AllColumnsAreNamed: Story = {
  play: async ({ canvasElement }) => {
    const headers = within(canvasElement).getAllByRole('columnheader')
    await expect(headers).toHaveLength(9)
  },
}
