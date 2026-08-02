import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tab } from './Tab'

const meta = {
  title: 'Atoms/Tab',
  component: Tab,
  parameters: {
    docs: {
      description: {
        component:
          'Status tabs for a list screen. **The count is the point**: for most visits the count is the ' +
          'whole answer ("how many are overdue?") and the person never opens the table.\n\nThe count is ' +
          'mono and faint by default. Set `countIsProblem` when the number is the problem — Overdue on ' +
          'invoices, Rejected on timesheets. **Never recolour the label itself.**\n\nActive carries a ' +
          '2px primary underline and primary label.',
      },
    },
  },
  args: { label: 'All', count: 47 },
  /**
   * `role="tab"` is only valid inside a `role="tablist"`, so every story
   * supplies one. Rendering a Tab bare fails axe on `aria-required-parent` —
   * which is correct, and worth showing rather than working around.
   */
  decorators: [
    (Story) => (
      <div role="tablist" aria-label="Invoice status" className="flex items-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <>
      <Tab {...args} label="All" count={47} active />
      <Tab {...args} label="Draft" count={4} />
      <Tab {...args} label="Submitted" count={12} />
      <Tab {...args} label="Paid" count={28} />
    </>
  ),
}

/** A row as it actually appears, with the problem count picked out in danger. */
export const InvoiceRow: Story = {
  render: (args) => (
    <>
      <Tab {...args} label="All" count={47} active />
      <Tab {...args} label="Draft" count={4} />
      <Tab {...args} label="Sent" count={31} />
      <Tab {...args} label="Overdue" count={3} countIsProblem />
    </>
  ),
}

/** No count at all, and the longest realistic label. */
export const EdgeContent: Story = {
  render: (args) => (
    <>
      <Tab {...args} label="Awaiting approver sign-off" count={128} active />
      <Tab {...args} label="All" />
      <Tab {...args} label="Zero" count={0} />
    </>
  ),
}
