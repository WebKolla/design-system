import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { StatusPill } from '@/components/atoms/StatusPill/StatusPill'
import { TableShell } from '../_tables/TableShell'
import type { TableColumn } from '../_tables/columns'
import { TableHeader } from '../TableHeader/TableHeader'
import { TableRow } from '../TableRow/TableRow'
import { TableCell } from './TableCell'

const COLUMNS: TableColumn[] = [
  { key: 'reference', label: 'Reference', width: '120px' },
  { key: 'project', label: 'Project', width: '30%' },
  { key: 'consultant', label: 'Consultant', width: '24%' },
  { key: 'hours', label: 'Hours', width: '96px', align: 'right' },
  { key: 'submitted', label: 'Submitted', width: '120px' },
  { key: 'status', label: 'Status', width: '110px' },
]

const meta = {
  title: 'Molecules/TableCell',
  component: TableCell,
  parameters: {
    docs: {
      description: {
        component:
          'One cell, carrying the typography rule its column implies.\n\nThe rules are not new. ' +
          '`TableRowInvoice` already applies all six: the invoice number is mono in `primary` because ' +
          'it is the link, the client is `foreground` because it is what the row is about, the ' +
          'consultant is `muted`, the dates are mono at the smaller step, the amount is mono and ' +
          'right-aligned, and the status and actions cells carry nothing because the pill and the ' +
          'button bring their own. They were spelt out inline in that one component. Here they have ' +
          'names.\n\n**Alignment must match the column definition the header reads**, or the heading ' +
          'and its figures part company. `numeric` right-aligns itself; pass `align` only to override.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={COLUMNS} caption="Timesheets">
          <TableHeader columns={COLUMNS} />
          <tbody>
            <Story />
          </tbody>
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof TableCell>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <TableRow>
      <TableCell variant="link">TS-1042</TableCell>
      <TableCell variant="text">Northgate Rail</TableCell>
      <TableCell>Callum Byrne</TableCell>
      <TableCell variant="numeric">37.50</TableCell>
      <TableCell variant="date">01 Aug 26</TableCell>
      <TableCell variant="plain">
        <StatusPill tone="info">Submitted</StatusPill>
      </TableCell>
    </TableRow>
  ),
}

export const Default: Story = { ...Variants }

/**
 * Figures right-align so decimal points line up down the column — the reason
 * `COMPONENTS.md` specifies it and the reason a column of hours can be compared
 * at a glance.
 */
export const NumericColumnsLineUp: Story = {
  render: () => (
    <>
      <TableRow>
        <TableCell variant="link">TS-1042</TableCell>
        <TableCell variant="text">Northgate Rail</TableCell>
        <TableCell>Callum Byrne</TableCell>
        <TableCell variant="numeric">37.50</TableCell>
        <TableCell variant="date">01 Aug 26</TableCell>
        <TableCell variant="plain" />
      </TableRow>
      <TableRow alt>
        <TableCell variant="link">TS-1043</TableCell>
        <TableCell variant="text">Halbrook Energy</TableCell>
        <TableCell>Priya Nair</TableCell>
        <TableCell variant="numeric">7.25</TableCell>
        <TableCell variant="date">02 Aug 26</TableCell>
        <TableCell variant="plain" />
      </TableRow>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('columnheader', { name: 'Hours' })
    const first = canvas.getByText('37.50')
    const second = canvas.getByText('7.25')

    const right = (el: Element) => Math.round(el.getBoundingClientRect().right)
    await expect(right(first)).toBe(right(second))
    await expect(right(first)).toBe(right(heading))
  },
}

export const EdgeContent: Story = {
  render: () => (
    <TableRow>
      <TableCell variant="link">TS-1042-REV-B</TableCell>
      <TableCell variant="text">
        Northgate Rail — signalling upgrade, phase two (Doncaster to Retford)
      </TableCell>
      <TableCell>Iona Macpherson-Fitzgerald</TableCell>
      <TableCell variant="numeric">1,204.75</TableCell>
      <TableCell variant="date">01 Aug 26</TableCell>
      <TableCell variant="plain">
        <StatusPill tone="warn">Pending</StatusPill>
      </TableCell>
    </TableRow>
  ),
}
