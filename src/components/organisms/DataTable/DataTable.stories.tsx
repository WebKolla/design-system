import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { FileText } from 'lucide-react'
import {
  APPROVAL_COLUMNS,
  INVOICE_COLUMNS,
} from '@/components/molecules/_tables/columns'
import { TableHeaderInvoices } from '@/components/molecules/TableHeaderInvoices/TableHeaderInvoices'
import { TableRowInvoice } from '@/components/molecules/TableRowInvoice/TableRowInvoice'
import { TableHeaderApprovals } from '@/components/molecules/TableHeaderApprovals/TableHeaderApprovals'
import { TableRowApproval } from '@/components/molecules/TableRowApproval/TableRowApproval'
import { Pagination } from '@/components/molecules/Pagination/Pagination'
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState'
import { Button } from '@/components/atoms/Button/Button'
import { DataTable } from './DataTable'

const INVOICES = [
  { invoice: 'INV-0231', client: 'Halbrook Energy', consultant: 'Priya Nair', issued: '01 Jul 26', due: '15 Jul 26', amount: '£11,400.00', status: { label: 'Sent', tone: 'info' as const } },
  { invoice: 'INV-0232', client: 'Northgate Rail', consultant: 'Callum Byrne', issued: '02 Jul 26', due: '16 Jul 26', amount: '£8,120.50', status: { label: 'Paid', tone: 'success' as const } },
  { invoice: 'INV-0233', client: 'Ashworth Digital', consultant: 'Iona Macpherson', issued: '03 Jul 26', due: '17 Jul 26', amount: '£128.00', status: { label: 'Draft', tone: 'neutral' as const } },
  { invoice: 'INV-0234', client: 'Pemberton Clarke', consultant: 'Callum Byrne', issued: '20 Jun 26', due: '04 Jul 26', amount: '£18,240.00', status: { label: 'Overdue', tone: 'danger' as const }, overdue: true },
]

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          '**Does not exist as a Figma component** — it exists in the file only as assemblies inside ' +
          'screens, so it is composed here from the header, row and pagination molecules.\n\n' +
          'It owns three things the molecules deliberately do not: the enclosing card, the `<table>` / ' +
          '`<caption>` / `<colgroup>` so header and rows share one column definition, and horizontal ' +
          'overflow so a wide table scrolls inside its card rather than pushing the page sideways.\n\n' +
          'Deliberately presentational — sorting, selection and paging state live with the caller. ' +
          'Below 768 the caller renders list cards instead.',
      },
    },
  },
  args: {
    columns: INVOICE_COLUMNS,
    caption: 'Invoices',
    header: <TableHeaderInvoices />,
  },
  decorators: [
    (Story) => (
      <div className="w-[960px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Invoices: Story = {
  render: (args) => (
    <DataTable
      {...args}
      header={<TableHeaderInvoices allSelected="indeterminate" />}
      pagination={
        <Pagination page={1} pageCount={5} range="Showing 1–4 of 47" />
      }
    >
      {INVOICES.map((row, i) => (
        <TableRowInvoice key={row.invoice} {...row} alt={i % 2 === 1} />
      ))}
    </DataTable>
  ),
}

/** The same organism with a different column definition and row molecule. */
export const Approvals: Story = {
  args: { columns: APPROVAL_COLUMNS, caption: 'Timesheets awaiting approval' },
  render: (args) => (
    <DataTable {...args} header={<TableHeaderApprovals />}>
      <TableRowApproval
        name="Callum Byrne"
        email="callum.byrne@meridian.co.uk"
        dates="27 Jul to 2 Aug"
        cadence="Weekly"
        project="Northgate Rail"
        phase="Phase 2"
        hours="40.00"
        submitted="6 days ago"
        reminder="Reminder sent"
      />
      <TableRowApproval
        name="Priya Nair"
        email="priya.nair@meridian.co.uk"
        dates="27 Jul to 2 Aug"
        cadence="Weekly"
        project="Halbrook Energy"
        phase="Discovery"
        hours="37.50"
        submitted="2 days ago"
      />
    </DataTable>
  ),
}

/** No rows: the empty state replaces the body, and pagination is suppressed. */
export const Empty: Story = {
  render: (args) => (
    <DataTable
      {...args}
      header={<TableHeaderInvoices />}
      pagination={<Pagination page={1} pageCount={1} range="Showing 0 of 0" />}
      empty={
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          body="Approved timesheets become invoice lines, so approve a week to see something here."
          action={<Button size="md">Go to approvals</Button>}
        />
      }
    />
  ),
}

/** One table, one caption, and the column count matches the definition. */
export const StructureIsSound: Story = {
  render: (args) => (
    <DataTable {...args} header={<TableHeaderInvoices />}>
      <TableRowInvoice {...INVOICES[0]!} />
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Invoices' })
    await expect(table).toBeInTheDocument()
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(
      INVOICE_COLUMNS.length,
    )
    await expect(canvasElement.querySelectorAll('table')).toHaveLength(1)
  },
}
