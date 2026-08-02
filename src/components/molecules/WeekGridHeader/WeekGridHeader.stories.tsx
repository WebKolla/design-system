import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { WEEK_COLUMNS } from '../_tables/columns'
import { WeekGridRow } from '../WeekGridRow/WeekGridRow'
import { WeekGridTotalRow } from '../WeekGridTotalRow/WeekGridTotalRow'
import { WeekGridHeader } from './WeekGridHeader'

const WEEK = [
  { day: 'Mon', date: '27' },
  { day: 'Tue', date: '28' },
  { day: 'Wed', date: '29' },
  { day: 'Thu', date: '30' },
  { day: 'Fri', date: '31' },
  { day: 'Sat', date: '01' },
  { day: 'Sun', date: '02' },
]

const meta = {
  title: 'Molecules/WeekGridHeader',
  component: WeekGridHeader,
  parameters: {
    docs: {
      description: {
        component:
          'Column grid `266px repeat(7,1fr) 84px`. **Weekend columns are recessed onto `color/control` ' +
          'from the header down**, so the eye reads Sat and Sun as different without them being ' +
          'missing.\n\nThe date sits under the day name in mono, so the grid position itself carries ' +
          'the date — which is why the per-row date field is deleted.',
      },
    },
  },
  args: { days: WEEK },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={WEEK_COLUMNS} caption="Week commencing 27 July 2026">
          <Story />
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof WeekGridHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The whole grid: header, project rows, totals. */
export const FullGrid: Story = {
  render: (args) => (
    <>
      <WeekGridHeader {...args} />
      <tbody>
        <WeekGridRow
          project="Northgate Rail"
          task="Signal design review"
          values={['7.5', '7.5', '7.5', '7.5', '4.0', '', '']}
          total="34.00"
        />
        <WeekGridRow
          project="Halbrook Energy"
          task="Discovery workshops"
          values={['1.0', '1.0', '1.0', '1.0', '2.0', '', '']}
          total="6.00"
          nonBillable
        />
      </tbody>
      <tfoot>
        <WeekGridTotalRow
          days={['8.5', '8.5', '8.5', '8.5', '6.0', '', '']}
          week="40.00"
        />
      </tfoot>
    </>
  ),
}

/** Weekend columns are recessed, not removed — consultants do work weekends. */
export const WeekendIsRecessedNotRemoved: Story = {
  play: async ({ canvasElement }) => {
    const headers = within(canvasElement).getAllByRole('columnheader')
    const labels = headers.map((h) => h.textContent ?? '')
    await expect(labels.some((l) => l.startsWith('Sat'))).toBe(true)
    await expect(labels.some((l) => l.startsWith('Sun'))).toBe(true)
    await expect(headers).toHaveLength(9)
  },
}
