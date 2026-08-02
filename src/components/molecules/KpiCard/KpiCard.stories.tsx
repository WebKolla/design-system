import type { Meta, StoryObj } from '@storybook/react-vite'
import { KpiCard } from './KpiCard'

const meta = {
  title: 'Molecules/KpiCard',
  component: KpiCard,
  parameters: {
    docs: {
      description: {
        component:
          'Dashboard KPI tile. Mono value, optional delta chip, optional sparkline and footnote.\n\n' +
          '**Every figure it displays is an amount or a count**, so the value always uses a `mono/*` ' +
          'style, per the rule that hours, rates, amounts, dates and identifiers are Geist Mono.',
      },
    },
  },
  args: {
    title: 'Hours this month',
    value: '1,284.5',
    delta: { label: '+8.2%', tone: 'success' },
    footnote: 'Across 11 timesheets',
  },
  decorators: [
    (Story) => (
      <div className="w-[307px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KpiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The row as it appears on the admin overview. */
export const Row: Story = {
  decorators: [
    (Story) => (
      <div className="grid w-[960px] grid-cols-3 gap-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <KpiCard {...args} />
      <KpiCard
        {...args}
        title="Billed this month"
        value="£142,900"
        delta={{ label: '+4.1%', tone: 'success' }}
        footnote="12 invoices sent"
      />
      <KpiCard
        {...args}
        title="Overdue"
        value="£18,240"
        delta={{ label: '2 invoices', tone: 'danger' }}
        footnote="Oldest is 21 days"
      />
    </>
  ),
}

export const Minimal: Story = {
  render: ({ title, value }) => <KpiCard title={title} value={value} />,
}

export const EdgeContent: Story = {
  args: {
    title: 'Hours submitted across all consultancies this period',
    value: '1,284,900.75',
    delta: { label: '−12.4%', tone: 'danger' },
    footnote: 'Across 148 timesheets from 37 consultants in 4 consultancies',
  },
}
