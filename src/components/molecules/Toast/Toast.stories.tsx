import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Toast } from './Toast'

const meta = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component:
          'Transient confirmation. 380 max width. The accent bar colour carries the status, with a ' +
          'matching leading icon so the state survives without colour.\n\nUse a Toast when the message ' +
          'is dismissible. If it is a standing statement of fact, use a `Banner` — which deliberately ' +
          'has no close button.',
      },
    },
  },
  args: {
    title: 'Timesheet approved',
    detail: 'Callum Byrne, 27 Jul to 2 Aug',
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Toast {...args} tone="success" />
      <Toast
        {...args}
        tone="warn"
        title="Invoice saved as draft"
        detail="It will not send until you approve it."
      />
      <Toast
        {...args}
        tone="danger"
        title="Could not send invoice"
        detail="Pemberton Clarke rejected the purchase order reference."
      />
    </div>
  ),
}

export const TitleOnly: Story = {
  render: ({ title }) => <Toast title={title} />,
}

/** A toast must announce itself without stealing focus. */
export const IsAnnounced: Story = {
  play: async ({ canvasElement }) => {
    const toast = within(canvasElement).getByRole('status')
    await expect(toast).toHaveAttribute('aria-live', 'polite')
  },
}

export const EdgeContent: Story = {
  args: {
    title: 'Timesheet approved and queued for invoicing',
    detail:
      'Callum Byrne, Pemberton Clarke — programme delivery, week ending 2 August 2026',
  },
}
