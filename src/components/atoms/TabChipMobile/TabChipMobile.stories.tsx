import type { Meta, StoryObj } from '@storybook/react-vite'
import { TabChipMobile } from './TabChipMobile'

const meta = {
  title: 'Atoms/TabChipMobile',
  component: TabChipMobile,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        component:
          'The desktop `Tab` underline does not survive a horizontally scrollable row — an underline on ' +
          'a chip that is half off-screen reads as a rendering fault. So mobile uses a filled chip ' +
          'instead, on `radius/button` rather than a pill, because a full pill is softer than anything ' +
          'else in this product.\n\n36px tall, sat in a row with 4px padding each side, giving the 44px ' +
          'minimum touch target without a 44px chip.',
      },
    },
  },
  args: { label: 'All', count: 47 },
  /** `role="tab"` is only valid inside a `role="tablist"`. */
  decorators: [
    (Story) => (
      <div
        role="tablist"
        aria-label="Invoice status"
        className="flex max-w-[360px] gap-2 overflow-x-auto"
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabChipMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { active: true } }

/** The scrollable row, including the 4px padding that makes the target 44. */
export const ScrollableRow: Story = {
  render: (args) => (
    <>
      <TabChipMobile {...args} label="All" count={47} active />
      <TabChipMobile {...args} label="Draft" count={4} />
      <TabChipMobile {...args} label="Sent" count={31} />
      <TabChipMobile {...args} label="Overdue" count={3} />
      <TabChipMobile {...args} label="Paid" count={9} />
    </>
  ),
}

export const States: Story = {
  render: (args) => (
    <>
      <TabChipMobile {...args} active />
      <TabChipMobile {...args} label="Draft" count={4} />
      <TabChipMobile label="No count" />
    </>
  ),
}
