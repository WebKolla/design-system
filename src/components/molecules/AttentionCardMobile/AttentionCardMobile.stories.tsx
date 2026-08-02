import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleAlert, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { AttentionCardMobile } from './AttentionCardMobile'

const meta = {
  title: 'Molecules/AttentionCardMobile',
  component: AttentionCardMobile,
  parameters: {
    docs: {
      description: {
        component:
          'The attention row on a phone, and the hero of the mobile overview. The desktop row puts its ' +
          'action to the right of the text; at 390 there is no right, so the action becomes a ' +
          'full-width 42px button beneath.\n\n**That is the whole reason this queue exists**: a row with ' +
          'a button on it converts, a summary makes the reader go and find the screen where the action ' +
          'lives. Keep the button — never reduce these to a list of statements.\n\nSubtitles are ' +
          'shortened on mobile: the desktop version names every consultant, the mobile one gives the ' +
          'project and the cost.',
      },
    },
  },
  args: {
    title: 'Three consultants have not submitted',
    subtitle: 'Northgate Rail · week ending 1 Aug',
    icon: Clock,
    tone: 'warn',
    action: <Button>Nudge approvers</Button>,
  },
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttentionCardMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Queue: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <AttentionCardMobile
        {...args}
        tone="danger"
        icon={CircleAlert}
        title="Two invoices are overdue"
        subtitle="Pemberton Clarke · £18,240.00"
        action={<Button variant="secondary">Chase</Button>}
      />
      <AttentionCardMobile {...args} />
      <AttentionCardMobile
        {...args}
        tone="neutral"
        icon={FileText}
        title="Four timesheets awaiting approval"
        subtitle="Submitted in the last 24 hours"
        action={<Button variant="secondary">Review</Button>}
      />
    </div>
  ),
}

export const EdgeContent: Story = {
  args: {
    title:
      'Seven consultants across four consultancies have not submitted for week ending 1 August',
    subtitle: 'Northgate Rail, Pemberton Clarke, Ashworth Digital · £24,900.00',
  },
}
