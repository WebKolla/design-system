import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { INVOICE_COLUMNS } from '../_tables/columns'
import { TableHeaderInvoices } from '../TableHeaderInvoices/TableHeaderInvoices'
import { TableRowInvoice } from './TableRowInvoice'

const meta = {
  title: 'Molecules/TableRowInvoice',
  component: TableRowInvoice,
  parameters: {
    docs: {
      description: {
        component:
          '42px row on the shared column grid. Every figure is mono and tabular; the amount is ' +
          'right-aligned.\n\n**Due date is recoloured to danger when the invoice is overdue** — the date ' +
          'carries the warning so the status pill is not the only signal. Invoice number is primary ' +
          'because it is the link.\n\nAlt is zebra striping for long tables; Selected uses `primary-soft` ' +
          'and checks the box. Below 768 this row becomes `ListCardInvoiceMobile`.',
      },
    },
  },
  args: {
    invoice: 'INV-0231',
    client: 'Halbrook Energy',
    consultant: 'Priya Nair',
    issued: '01 Jul 26',
    due: '15 Jul 26',
    amount: '£11,400.00',
    status: { label: 'Sent', tone: 'info' },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={INVOICE_COLUMNS} caption="Invoices">
          <TableHeaderInvoices />
          <tbody>
            <Story />
          </tbody>
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof TableRowInvoice>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <>
      <TableRowInvoice {...args} />
      <TableRowInvoice {...args} alt invoice="INV-0232" client="Northgate Rail" />
      <TableRowInvoice {...args} selected invoice="INV-0233" client="Ashworth Digital" />
      <TableRowInvoice
        {...args}
        invoice="INV-0234"
        client="Pemberton Clarke"
        due="04 Jul 26"
        overdue
        status={{ label: 'Overdue', tone: 'danger' }}
        amount="£18,240.00"
      />
    </>
  ),
}

/** Amounts in different currencies still share a right edge. */
export const AmountsAlign: Story = {
  render: (args) => (
    <>
      <TableRowInvoice {...args} amount="£11,400.00" />
      <TableRowInvoice {...args} alt invoice="INV-0232" amount="€14,280.00" />
      <TableRowInvoice {...args} invoice="INV-0233" amount="£128.00" />
      <TableRowInvoice {...args} alt invoice="INV-0234" amount="£1,092.50" />
    </>
  ),
}

/**
 * The invoice number is the route to the invoice, and the row header at the
 * same time. Both, on one cell — a link that replaced the `th` would undo the
 * row header, and a row header with no link leaves the table with no way in.
 */
export const InvoiceNumberIsALink: Story = {
  args: { invoiceElement: <a href="/invoices/inv_231" /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const header = canvas.getByRole('rowheader', { name: 'INV-0231' })
    await expect(header).toBeInTheDocument()

    const link = canvas.getByRole('link', { name: 'INV-0231' })
    await expect(link).toHaveAttribute('href', '/invoices/inv_231')
    // The link is inside the header cell, not instead of it.
    await expect(header).toContainElement(link)
  },
}

/**
 * `showActions={false}` drops the trailing cell, for a header that has dropped
 * the column. Body and header must agree on the count or every value is
 * announced against the wrong heading.
 */
export const ActionsCanBeOmitted: Story = {
  args: { showActions: false },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell
          columns={INVOICE_COLUMNS.filter((c) => c.key !== 'actions')}
          caption="Invoices"
        >
          <tbody>
            <Story />
          </tbody>
        </TableShell>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: /actions for invoice/i }),
    ).toBeNull()
    await expect(canvasElement.querySelectorAll('tbody td')).toHaveLength(
      INVOICE_COLUMNS.filter((c) => c.key !== 'actions').length - 1,
    )
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <>
      <TableRowInvoice
        {...args}
        client="Pemberton Clarke Consulting Group (Northern Division)"
        consultant="Iona Macpherson-Whitfield"
        amount="£1,284,900.00"
        status={{ label: 'Part paid', tone: 'warn' }}
      />
      <TableRowInvoice {...args} alt client="—" consultant="—" amount="£0.00" />
    </>
  ),
}
