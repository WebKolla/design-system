import type { Meta, StoryObj } from '@storybook/react-vite'
import { LegendRow } from './LegendRow'

const meta = {
  title: 'Molecules/LegendRow',
  component: LegendRow,
  parameters: {
    docs: {
      description: {
        component:
          'Chart legend entry: swatch, label and mono count. Sits under the donut and bar charts on the ' +
          'admin overview.\n\nThe swatch colour is bound to the matching `color/chart-*` token rather ' +
          'than set literally, so a ramp change reaches the legend as well as the chart.',
      },
    },
  },
  args: { label: 'Approved', count: 31, series: 1 },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[320px] rounded-card border p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LegendRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A full legend — one entry per chart series. */
export const Legend: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <LegendRow {...args} label="Approved" count={31} series={1} />
      <LegendRow {...args} label="Submitted" count={12} series={2} />
      <LegendRow {...args} label="Pending" count={7} series={3} />
      <LegendRow {...args} label="Rejected" count={2} series={4} />
      <LegendRow {...args} label="Paid" count={28} series={5} />
      <LegendRow {...args} label="Draft" count={4} series={6} />
    </div>
  ),
}

/** Counts stay aligned regardless of digit count. */
export const CountsAlign: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <LegendRow {...args} label="Approved" count={3} series={1} />
      <LegendRow {...args} label="Submitted" count={128} series={2} />
      <LegendRow {...args} label="Pending" count={1284} series={3} />
    </div>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <LegendRow
        {...args}
        label="Awaiting approver sign-off across all consultancies"
        count={1284}
        series={3}
      />
      <LegendRow {...args} label="—" count={0} series={6} />
    </div>
  ),
}
