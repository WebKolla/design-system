import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import { WEEK_COLUMNS } from '../_tables/columns'
import { WeekGridHeader } from '../WeekGridHeader/WeekGridHeader'
import { WeekGridRow } from './WeekGridRow'

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
  title: 'Molecules/WeekGridRow',
  component: WeekGridRow,
  parameters: {
    docs: {
      description: {
        component:
          'One project across one week. **No date field**: grid position is the date, and asking for a ' +
          'date inside a period already declared above it is the most redundant input in the product.\n\n' +
          'Seven nested `WeekGridCell`s, Monday to Sunday. An empty cell shows a mid-dot, never a zero. ' +
          'The row total is mono SemiBold; the non-billable tag is off by default.',
      },
    },
  },
  args: {
    project: 'Northgate Rail',
    task: 'Signal design review',
    values: ['7.5', '7.5', '7.5', '7.5', '4.0', '', ''],
    total: '34.00',
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
        <TableShell columns={WEEK_COLUMNS} caption="Week commencing 27 July 2026">
          <WeekGridHeader days={WEEK} />
          <tbody>
            <Story />
          </tbody>
        </TableShell>
      </div>
    ),
  ],
} satisfies Meta<typeof WeekGridRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Rows: Story = {
  render: (args) => (
    <>
      <WeekGridRow {...args} />
      <WeekGridRow
        {...args}
        project="Halbrook Energy"
        task="Discovery workshops"
        values={['1.0', '1.0', '1.0', '1.0', '2.0', '', '']}
        total="6.00"
        nonBillable
      />
      <WeekGridRow
        {...args}
        project="Pemberton Clarke"
        task="Assurance"
        values={['', '', '', '', '', '4.0', '']}
        total="4.00"
      />
    </>
  ),
}

/** There must be no date input on the row — the column is the date. */
export const HasNoDateField: Story = {
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole('textbox')
    // Seven day cells and nothing else.
    await expect(inputs).toHaveLength(7)
    for (const input of inputs) {
      await expect(input).not.toHaveAttribute('type', 'date')
    }
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <>
      <WeekGridRow
        {...args}
        project="Pemberton Clarke Consulting Group (Northern Division)"
        task="Phase 2 — signal design review, assurance and handover documentation"
        values={['12.25', '12.25', '12.25', '12.25', '12.25', '8.00', '8.00']}
        total="77.25"
        nonBillable
      />
      <WeekGridRow
        {...args}
        project="—"
        task="—"
        values={['', '', '', '', '', '', '']}
        total="0.00"
      />
    </>
  ),
}

/**
 * BUG-DSR2-031. Three rows on one project, distinguished only by task —
 * including a row with an **empty** task, which is legal and must still
 * produce a unique, readable name with no dangling comma or doubled
 * separator. Asserted by set size against count, not by inspection.
 */
export const UniqueCellNames: Story = {
  render: (args) => (
    <>
      <WeekGridRow
        {...args}
        project="Northgate Rail"
        task="Signal design review"
        values={['7.5', '7.5', '7.5', '7.5', '4.0', '', '']}
        total="34.00"
      />
      <WeekGridRow
        {...args}
        project="Northgate Rail"
        task="Assurance"
        values={['1.0', '1.0', '1.0', '1.0', '2.0', '', '']}
        total="6.00"
      />
      <WeekGridRow
        {...args}
        project="Northgate Rail"
        task=""
        values={['', '', '', '', '', '4.0', '']}
        total="4.00"
      />
    </>
  ),
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole('textbox')
    // Three rows x seven day cells.
    await expect(inputs).toHaveLength(21)

    const names = inputs.map((input) => input.getAttribute('aria-label'))
    await expect(new Set(names).size).toBe(names.length)

    // The empty-task row's names must not leave a dangling comma or doubled
    // separator — e.g. "Northgate Rail, , Monday hours" is wrong.
    const emptyTaskNames = names.filter(
      (n) => !n?.includes('Signal design review') && !n?.includes('Assurance'),
    )
    await expect(emptyTaskNames.length).toBe(7)
    for (const name of emptyTaskNames) {
      await expect(name).not.toContain(', ,')
      await expect(name).toBe(`Northgate Rail, ${name?.split(', ').pop()}`)
    }
  },
}
