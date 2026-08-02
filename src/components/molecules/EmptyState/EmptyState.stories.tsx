import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building2, FileText, Inbox } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          'Dashed-border zero state for any list surface. Icon, title, one sentence of orientation, and ' +
          'a single primary action.\n\nThe dashed border is what distinguishes an empty surface from a ' +
          'populated card. More than one action is a sign the state is not really empty.',
      },
    },
  },
  args: {
    title: 'Add your first client',
    body: 'Projects, timesheets and invoices all hang off a client, so this is the place to start.',
    icon: Building2,
    action: <Button size="md">Add client</Button>,
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variations: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      <EmptyState {...args} />
      <EmptyState
        {...args}
        icon={Inbox}
        title="Nothing awaiting your approval"
        body="Everything submitted for this period has been signed off."
      />
      <EmptyState
        {...args}
        icon={FileText}
        title="No invoices yet"
        body="Approved timesheets become invoice lines, so approve a week to see something here."
        action={<Button size="md">Go to approvals</Button>}
      />
    </div>
  ),
}

/** A genuinely finished state needs no action at all. */
export const NoAction: Story = {
  args: {
    icon: Inbox,
    title: 'Nothing awaiting your approval',
    body: 'Everything submitted for this period has been signed off.',
  },
  render: ({ title, body, icon }) => <EmptyState title={title} body={body} icon={icon} />,
}

export const EdgeContent: Story = {
  args: {
    title: 'No purchase order references have been recorded for this client yet',
    body: 'Pemberton Clarke require a purchase order reference and a cost centre on every invoice line, so add them before the first invoice run.',
  },
}
