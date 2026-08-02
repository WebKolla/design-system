import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { APPROVAL_COLUMNS } from '../_tables/columns'
import { TableRowApproval } from '../TableRowApproval/TableRowApproval'
import { TableHeaderApprovals } from './TableHeaderApprovals'

const meta = {
  title: 'Molecules/TableHeaderApprovals',
  component: TableHeaderApprovals,
  parameters: {
    docs: {
      description: {
        component:
          'Approver queue column grid: `38 select · 1.5fr consultant · 1.05fr period · 1.15fr project · ' +
          '92 hours · 118 submitted · 96 review`, summing to 1384 inside a 1440 frame with 28 gutters ' +
          'and no sidebar.\n\n**Review is right-aligned and last**, because the decision is the end of ' +
          'the scan, not the start of it.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={APPROVAL_COLUMNS} caption="Timesheets awaiting approval">
          <Story />
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof TableHeaderApprovals>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithRows: Story = {
  render: () => (
    <>
      <TableHeaderApprovals allSelected="indeterminate" />
      <tbody>
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
          selected
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
      </tbody>
    </>
  ),
}

/** No money may appear anywhere in the approver queue. */
export const NoMoneyColumn: Story = {
  play: async ({ canvasElement }) => {
    const headers = within(canvasElement)
      .getAllByRole('columnheader')
      .map((h) => h.textContent?.toLowerCase() ?? '')
    for (const banned of ['amount', 'rate', 'total', 'value']) {
      await expect(headers.some((h) => h.includes(banned))).toBe(false)
    }
  },
}
