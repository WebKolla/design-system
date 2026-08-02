import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { WEEK_COLUMNS } from '../_tables/columns'
import { WeekGridHeader } from '../WeekGridHeader/WeekGridHeader'
import { WeekGridRow } from '../WeekGridRow/WeekGridRow'
import { WeekGridTotalRow } from './WeekGridTotalRow'

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
  title: 'Molecules/WeekGridTotalRow',
  component: WeekGridTotalRow,
  parameters: {
    docs: {
      description: {
        component:
          'Column totals under the grid, on `surface-raised` so it reads as a summary rather than ' +
          'another editable row. Weekend columns stay recessed and **show a mid-dot when nothing was ' +
          'worked** — the same rule as the cell: zero is a claim, blank is an absence.\n\nRendered in a ' +
          '`<tfoot>` with a row header, so assistive technology announces it as a summary.',
      },
    },
  },
  args: { days: ['8.5', '8.5', '8.5', '8.5', '6.0', '', ''], week: '40.00' },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={WEEK_COLUMNS} caption="Week commencing 27 July 2026">
          <WeekGridHeader days={WEEK} />
          <tbody>
            <WeekGridRow
              project="Northgate Rail"
              task="Signal design review"
              values={['7.5', '7.5', '7.5', '7.5', '4.0', '', '']}
              total="34.00"
            />
          </tbody>
          <tfoot>
            <Story />
          </tfoot>
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof WeekGridTotalRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A week that includes weekend work — the columns were recessed, not removed. */
export const WithWeekendWork: Story = {
  args: { days: ['8.5', '8.5', '8.5', '8.5', '6.0', '4.0', ''], week: '44.00' },
}

/** Nothing worked at all: mid-dots throughout, not a row of zeros. */
export const EmptyWeek: Story = {
  args: { days: ['', '', '', '', '', '', ''], week: '0.00' },
  play: async ({ canvasElement }) => {
    const tfoot = canvasElement.querySelector('tfoot') as HTMLElement
    const cells = [...tfoot.querySelectorAll('td')].slice(0, 7)
    for (const c of cells) {
      await expect(c.textContent).toBe('·')
      await expect(c.textContent).not.toBe('0')
      await expect(c.textContent).not.toBe('0.0')
    }
  },
}
