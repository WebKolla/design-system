import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { APPROVAL_COLUMNS } from '../_tables/columns'
import { TableHeaderApprovals } from '../TableHeaderApprovals/TableHeaderApprovals'
import { TableRowApproval } from './TableRowApproval'

const meta = {
  title: 'Molecules/TableRowApproval',
  component: TableRowApproval,
  parameters: {
    docs: {
      description: {
        component:
          '**Approve and reject live in the row.** The common case — five identical weekly retainers — ' +
          'never opens a detail page, which is the difference between a queue cleared in a minute and ' +
          'one that sits for six days.\n\nApprove is a filled success square; Reject is an outlined ' +
          'square with a danger glyph. **Reject is deliberately quieter**: it is the rarer action and it ' +
          'opens a reason prompt, because a rejection without a reason just produces a resubmission of ' +
          'the same timesheet.\n\n**No rate, day rate or invoice value appears in any cell** — the ' +
          'approver role cannot see them.',
      },
    },
  },
  args: {
    name: 'Callum Byrne',
    email: 'callum.byrne@meridian.co.uk',
    dates: '27 Jul to 2 Aug',
    cadence: 'Weekly',
    project: 'Northgate Rail',
    phase: 'Phase 2',
    hours: '40.00',
    submitted: '6 days ago',
    reminder: 'Reminder sent',
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={APPROVAL_COLUMNS} caption="Timesheets awaiting approval">
          <TableHeaderApprovals />
          <tbody>
            <Story />
          </tbody>
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof TableRowApproval>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The five identical weekly retainers this queue exists to clear quickly. */
export const Queue: Story = {
  render: (args) => (
    <>
      <TableRowApproval {...args} />
      <TableRowApproval
        {...args}
        name="Priya Nair"
        email="priya.nair@meridian.co.uk"
        project="Halbrook Energy"
        phase="Discovery"
        hours="37.50"
        submitted="2 days ago"
        reminder={undefined}
      />
      <TableRowApproval
        {...args}
        selected
        name="Iona Macpherson"
        email="iona.macpherson@meridian.co.uk"
        project="Pemberton Clarke"
        phase="Phase 1"
        hours="41.25"
        submitted="Yesterday"
        reminder={undefined}
      />
    </>
  ),
}

/** Both decisions must be reachable and separately named per row. */
export const RowActionsAreNamed: Story = {
  args: { onApprove: fn(), onReject: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Approve timesheet for Callum Byrne' }),
    )
    await expect(args.onApprove).toHaveBeenCalled()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Reject timesheet for Callum Byrne' }),
    )
    await expect(args.onReject).toHaveBeenCalled()
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <>
      <TableRowApproval
        {...args}
        name="Iona Macpherson-Whitfield"
        email="iona.macpherson-whitfield@pembertonclarke.co.uk"
        project="Pemberton Clarke Consulting Group (Northern Division)"
        phase="Phase 2 — signal design review and assurance"
        hours="164.75"
        submitted="14 days ago"
      />
      <TableRowApproval {...args} name="A B" email="a@b.co" hours="0.25" reminder={undefined} />
    </>
  ),
}
