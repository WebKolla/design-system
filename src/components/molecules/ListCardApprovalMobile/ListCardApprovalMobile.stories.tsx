import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ListCardApprovalMobile } from './ListCardApprovalMobile'

const meta = {
  title: 'Molecules/ListCardApprovalMobile',
  component: ListCardApprovalMobile,
  parameters: {
    docs: {
      description: {
        component:
          'The approval row on a phone. **Approve and Reject become full-width 42px buttons at the card ' +
          'foot**, because in-row 28px icon buttons are unhittable on a phone and because the decision ' +
          'is the whole reason the approver opened the screen.\n\nApprove is filled success, Reject is ' +
          'an outlined shell with danger text — the same asymmetry as desktop. Reject still opens a ' +
          'reason prompt.\n\nThe checkbox is gone: bulk selection on mobile is long-press, not a visible ' +
          'control. **No money appears anywhere** — the approver role cannot see it.',
      },
    },
  },
  args: {
    name: 'Callum Byrne',
    initials: 'CB',
    period: '27 Jul to 2 Aug · Weekly',
    project: 'Northgate Rail · Phase 2',
    hours: '40.00',
  },
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListCardApprovalMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Queue: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2.5">
      <ListCardApprovalMobile {...args} />
      <ListCardApprovalMobile
        {...args}
        name="Priya Nair"
        initials="PN"
        project="Halbrook Energy · Discovery"
        hours="37.50"
      />
    </div>
  ),
}

/**
 * Both decisions must be reachable and separately named.
 *
 * Button *size* is asserted visually rather than here — pixel measurement
 * inside a play function reports pre-layout values in this harness. See the
 * note in NOTES.md.
 */
export const DecisionsAreReachable: Story = {
  args: { onApprove: fn(), onReject: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // The accessible names carry the consultant; the visible labels do not.
    // Five cards would otherwise be ten controls called "Approve" and "Reject".
    await userEvent.click(
      canvas.getByRole('button', { name: 'Approve timesheet for Callum Byrne' }),
    )
    await expect(args.onApprove).toHaveBeenCalled()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Reject timesheet for Callum Byrne' }),
    )
    await expect(args.onReject).toHaveBeenCalled()
    // The label a thumb reads is still two words.
    await expect(
      canvas.getByRole('button', { name: 'Approve timesheet for Callum Byrne' }),
    ).toHaveTextContent('Approve')
  },
}

/** No rate, amount or invoice value may render in an approver-scoped view. */
export const ShowsNoMoney: Story = {
  play: async ({ canvasElement }) => {
    const text = canvasElement.textContent ?? ''
    await expect(text).not.toMatch(/[£$€]/)
  },
}

export const EdgeContent: Story = {
  args: {
    name: 'Iona Macpherson-Whitfield',
    initials: 'IM',
    period: '27 Jul to 2 Aug · Fortnightly, carried over',
    project: 'Pemberton Clarke Consulting Group · Phase 2 assurance',
    hours: '164.75',
  },
}

/**
 * `showDecisions={false}`, for a card there is no decision left to take on.
 *
 * An approver's full timesheet list holds approved, rejected and draft rows
 * beside the submitted ones, and the server refuses the rest with "Only
 * submitted timesheets can be approved". A control whose only outcome is a
 * refusal is a dead control.
 */
export const NoDecisions: Story = {
  args: { showDecisions: false, onApprove: fn(), onReject: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    // Everything that identifies the card survives the drop.
    await expect(canvas.getByText('Callum Byrne')).toBeInTheDocument()
    await expect(canvas.getByText('40.00')).toBeInTheDocument()
  },
}
