import type { Meta, StoryObj } from '@storybook/react-vite'
import { Clock, CircleAlert, FileText, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { AttentionRow } from './AttentionRow'

const meta = {
  title: 'Molecules/AttentionRow',
  component: AttentionRow,
  parameters: {
    docs: {
      description: {
        component:
          'Attention queue row on the admin overview — the things needing action. Tone selects the icon ' +
          'and its background together (danger for overdue, warn for pending, info for informational).\n\n' +
          '**The action is the point of the row.** A row without one is a statement, and a statement ' +
          'makes the reader go and find the screen where the action lives.\n\n' +
          '`AttentionCardMobile` is the stacked equivalent below 768.',
      },
    },
  },
  args: {
    title: 'Three consultants have not submitted',
    subtitle: 'Week ending 1 August · Northgate Rail, Pemberton Clarke',
    icon: Clock,
    tone: 'warn',
    action: <Button size="sm" variant="secondary">Nudge approvers</Button>,
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[720px] overflow-hidden rounded-card border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttentionRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The queue as it appears on the overview, tone doing the triage. */
export const Queue: Story = {
  render: (args) => (
    <>
      <AttentionRow
        {...args}
        tone="danger"
        icon={CircleAlert}
        title="Two invoices are overdue"
        subtitle="£18,240.00 outstanding · Pemberton Clarke"
        action={<Button size="sm" variant="secondary">Chase</Button>}
      />
      <AttentionRow {...args} tone="warn" icon={Clock} />
      <AttentionRow
        {...args}
        tone="neutral"
        icon={FileText}
        title="Four timesheets awaiting your approval"
        subtitle="Submitted in the last 24 hours"
        action={<Button size="sm" variant="secondary">Review</Button>}
      />
      <AttentionRow
        {...args}
        tone="success"
        icon={TriangleAlert}
        title="July invoicing complete"
        subtitle="All 12 invoices sent"
      />
    </>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <>
      <AttentionRow
        {...args}
        title="Seven consultants across four consultancies have not submitted a timesheet for the week ending 1 August 2026"
        subtitle="Northgate Rail, Pemberton Clarke, Ashworth Digital and Calderwood Partners are all affected"
      />
      <AttentionRow icon={Clock} title="One item" />
    </>
  ),
}
