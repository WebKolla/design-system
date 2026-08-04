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

/**
 * The consultant name is the route to the timesheet, and the row header at
 * the same time. Both, on one cell — a link that replaced the `th` would undo
 * the row header, and a row header with no link leaves the table with no way
 * in. Mirrors `TableRowInvoice`'s `InvoiceNumberIsALink`.
 */
export const NameIsALink: Story = {
  args: { nameElement: <a href="/timesheets/ts_callum_byrne" /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const header = canvas.getByRole('rowheader', { name: 'Callum Byrne' })
    await expect(header).toBeInTheDocument()

    const link = canvas.getByRole('link', { name: 'Callum Byrne' })
    await expect(link).toHaveAttribute('href', '/timesheets/ts_callum_byrne')
    // The link is inside the header cell, not instead of it.
    await expect(header).toContainElement(link)
  },
}

/**
 * A name too long for the column is clipped, never wrapped. Wrapping breaks
 * the name across two lines inside a fixed-height row, and a name split in
 * half cannot be matched at a glance against the row below it. Mirrors
 * `TableRowInvoice`'s `LongInvoiceNumberDoesNotWrap`.
 */
export const LongNameDoesNotWrap: Story = {
  args: { name: 'Persephone Okonkwo-Fitzgerald-Thistlewood' },
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('rowheader', {
      name: 'Persephone Okonkwo-Fitzgerald-Thistlewood',
    })
    await expect(getComputedStyle(header).whiteSpace).toBe('nowrap')
    // One line box, whatever the column does to it.
    await expect(header.getClientRects()).toHaveLength(1)
    // And the full name stays recoverable.
    await expect(header).toHaveAttribute(
      'title',
      'Persephone Okonkwo-Fitzgerald-Thistlewood',
    )
  },
}

/**
 * No rate, day rate or invoice value may render in an approver-scoped view.
 * Copied from `ListCardApprovalMobile`'s `ShowsNoMoney` — this is the one
 * approver component that had no money invariant of its own.
 */
export const ShowsNoMoney: Story = {
  play: async ({ canvasElement }) => {
    const text = canvasElement.textContent ?? ''
    await expect(text).not.toMatch(/[£$€]/)
  },
}
