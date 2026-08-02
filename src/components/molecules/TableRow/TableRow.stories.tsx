import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { StatusPill } from '@/components/atoms/StatusPill/StatusPill'
import { TableShell } from '../_tables/TableShell'
import type { TableColumn } from '../_tables/columns'
import { TableCell } from '../TableCell/TableCell'
import { TableHeader } from '../TableHeader/TableHeader'
import { TableRow } from './TableRow'

const CLIENT_COLUMNS: TableColumn[] = [
  { key: 'select', label: '', width: '34px', srLabel: 'Select' },
  { key: 'client', label: 'Client', width: '32%' },
  { key: 'contact', label: 'Contact', width: '28%' },
  { key: 'projects', label: 'Projects', width: '96px', align: 'right' },
  { key: 'added', label: 'Added', width: '110px' },
  { key: 'status', label: 'Status', width: '108px' },
]

const meta = {
  title: 'Molecules/TableRow',
  component: TableRow,
  parameters: {
    docs: {
      description: {
        component:
          'A table row on the shared column grid, with nothing domain-specific in it.\n\nThis is ' +
          '`TableRowInvoice` with the invoice columns removed: same 42px height, same hairline divider, ' +
          'same selected and zebra treatments. Cells come from `TableCell`, which carries the ' +
          'typography rules the invoice row hardcoded.\n\n`TableRowInvoice` and `TableRowApproval` are ' +
          'untouched. They encode two screens\' worth of decisions a generic row cannot express, and ' +
          'rewriting them on top of this one would put those decisions at risk for no benefit.\n\n' +
          'Pass `onSelectedChange` to get the leading checkbox cell, and `selectLabel` to name the row ' +
          'it selects — "Select Northgate Rail", not "Select" forty times.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={CLIENT_COLUMNS} caption="Clients">
          <TableHeader columns={CLIENT_COLUMNS} />
          <tbody>
            <Story />
          </tbody>
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof TableRow>

export default meta
type Story = StoryObj<typeof meta>

const CELLS = (
  <>
    <TableCell variant="text">Northgate Rail</TableCell>
    <TableCell>Callum Byrne</TableCell>
    <TableCell variant="numeric">7</TableCell>
    <TableCell variant="date">02 Mar 26</TableCell>
    <TableCell variant="plain">
      <StatusPill tone="success">Active</StatusPill>
    </TableCell>
  </>
)

export const Default: Story = {
  args: { onSelectedChange: () => {}, selectLabel: 'Select Northgate Rail', children: CELLS },
}

export const States: Story = {
  render: () => (
    <>
      <TableRow onSelectedChange={() => {}} selectLabel="Select Northgate Rail">
        {CELLS}
      </TableRow>
      <TableRow alt onSelectedChange={() => {}} selectLabel="Select Halbrook Energy">
        {CELLS}
      </TableRow>
      <TableRow selected onSelectedChange={() => {}} selectLabel="Select Pemberton Clarke">
        {CELLS}
      </TableRow>
    </>
  ),
}

/** Compact is 30px — for a table someone scans rather than reads. */
export const Density: Story = {
  render: () => (
    <>
      <TableRow density="comfortable">{CELLS}</TableRow>
      <TableRow density="compact">{CELLS}</TableRow>
    </>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('row')
    // Row 0 is the header. Rounded, and compared relatively as well as
    // absolutely: an absolute pixel assertion on its own would not notice both
    // rows collapsing to the same height.
    const comfortable = Math.round(rows[1]?.getBoundingClientRect().height ?? 0)
    const compact = Math.round(rows[2]?.getBoundingClientRect().height ?? 0)
    await expect(comfortable).toBe(42)
    await expect(compact).toBe(30)
  },
}

/** Without `onSelectedChange` there is no checkbox cell at all. */
export const SelectionIsOptional: Story = {
  render: () => <TableRow>{CELLS}</TableRow>,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('checkbox')).toBeNull()
  },
}

/** Every checkbox names its own row, so forty of them are distinguishable. */
export const EachCheckboxIsNamed: Story = {
  render: () => (
    <>
      <TableRow onSelectedChange={() => {}} selectLabel="Select Northgate Rail">
        {CELLS}
      </TableRow>
      <TableRow onSelectedChange={() => {}} selectLabel="Select Halbrook Energy">
        {CELLS}
      </TableRow>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('checkbox', { name: 'Select Northgate Rail' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('checkbox', { name: 'Select Halbrook Energy' }),
    ).toBeInTheDocument()
  },
}

export const EdgeContent: Story = {
  render: () => (
    <TableRow onSelectedChange={() => {}} selectLabel="Select Northgate Rail">
      <TableCell variant="text">
        Northgate Rail — signalling upgrade, phase two (Doncaster to Retford)
      </TableCell>
      <TableCell>Iona Macpherson-Fitzgerald</TableCell>
      <TableCell variant="numeric">148</TableCell>
      <TableCell variant="date">02 Mar 26</TableCell>
      <TableCell variant="plain">
        <StatusPill tone="warn">Past due</StatusPill>
      </TableCell>
    </TableRow>
  ),
}
