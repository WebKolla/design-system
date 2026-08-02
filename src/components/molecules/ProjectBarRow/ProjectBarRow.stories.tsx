import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectBarRow } from './ProjectBarRow'

const meta = {
  title: 'Molecules/ProjectBarRow',
  component: ProjectBarRow,
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal bar row for the project hours chart. The bar length is data-driven; the hours ' +
          'figure is mono and tabular so rows align down the column.',
      },
    },
  },
  args: {
    project: 'Northgate Rail · Phase 2',
    hours: '386.0',
    fraction: 0.86,
    series: 1,
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[560px] rounded-card border p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectBarRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The chart as it appears on the overview. */
export const Chart: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <ProjectBarRow {...args} />
      <ProjectBarRow
        {...args}
        project="Halbrook Energy · Discovery"
        hours="248.5"
        fraction={0.55}
        series={2}
      />
      <ProjectBarRow
        {...args}
        project="Pemberton Clarke · Assurance"
        hours="164.0"
        fraction={0.36}
        series={3}
      />
      <ProjectBarRow
        {...args}
        project="Ashworth Digital · Retainer"
        hours="42.0"
        fraction={0.09}
        series={4}
      />
    </div>
  ),
}

/** Zero-length bars still render a row, so the project is not invisible. */
export const ZeroAndFull: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <ProjectBarRow {...args} project="Not started" hours="0.0" fraction={0} />
      <ProjectBarRow {...args} project="At capacity" hours="450.0" fraction={1} />
    </div>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <ProjectBarRow
        {...args}
        project="Pemberton Clarke Consulting Group (Northern Division) · Phase 2 assurance"
        hours="1,284.75"
        fraction={0.99}
      />
    </div>
  ),
}
