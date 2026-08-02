import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CalendarDays } from 'lucide-react'
import { WeekGridRow } from '@/components/molecules/WeekGridRow/WeekGridRow'
import { EmptyState } from '@/components/molecules/EmptyState/EmptyState'
import { Button } from '@/components/atoms/Button/Button'
import { WeekGrid } from './WeekGrid'

const DAYS = [
  { day: 'Mon', date: '27' },
  { day: 'Tue', date: '28' },
  { day: 'Wed', date: '29' },
  { day: 'Thu', date: '30' },
  { day: 'Fri', date: '31' },
  { day: 'Sat', date: '01' },
  { day: 'Sun', date: '02' },
]

const meta = {
  title: 'Organisms/WeekGrid',
  component: WeekGrid,
  parameters: {
    docs: {
      description: {
        component:
          '**Does not exist as a Figma component** — composed from the header, row and total row.\n\n' +
          'Owns the card, the `<table>` and the shared `266px repeat(7,1fr) 84px` column definition, so ' +
          'the three parts cannot drift. The totals row sits in a `<tfoot>` so it is announced as a ' +
          'summary rather than another editable row.\n\n**Below 768 the caller replaces this entirely** ' +
          'with the day-picker strip — never render a 7-column grid at 390, the cells become untappable.',
      },
    },
  },
  args: {
    caption: 'Week commencing 27 July 2026',
    days: DAYS,
    dayTotals: ['8.5', '8.5', '8.5', '8.5', '6.0', '', ''],
    weekTotal: '40.00',
  },
  decorators: [
    (Story) => (
      <div className="w-[960px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeekGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <WeekGrid {...args}>
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
    </WeekGrid>
  ),
}

/** A week including weekend work — the columns were recessed, not removed. */
export const WithWeekendWork: Story = {
  args: {
    dayTotals: ['8.5', '8.5', '8.5', '8.5', '6.0', '4.0', ''],
    weekTotal: '44.00',
  },
  render: (args) => (
    <WeekGrid {...args}>
      <WeekGridRow
        project="Pemberton Clarke"
        task="Go-live support"
        values={['8.5', '8.5', '8.5', '8.5', '6.0', '4.0', '']}
        total="44.00"
      />
    </WeekGrid>
  ),
}

export const Empty: Story = {
  render: (args) => (
    <WeekGrid
      {...args}
      empty={
        <EmptyState
          icon={CalendarDays}
          title="No projects on this timesheet yet"
          body="Add a project to start recording hours against it for this week."
          action={<Button size="md">Add project</Button>}
        />
      }
    />
  ),
}

/** One table, a caption, and a real tfoot summary row. */
export const StructureIsSound: Story = {
  render: (args) => (
    <WeekGrid {...args}>
      <WeekGridRow
        project="Northgate Rail"
        task="Signal design review"
        values={['7.5', '7.5', '7.5', '7.5', '4.0', '', '']}
        total="34.00"
      />
    </WeekGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('table', { name: 'Week commencing 27 July 2026' }),
    ).toBeInTheDocument()
    await expect(canvasElement.querySelectorAll('tfoot')).toHaveLength(1)
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(9)
  },
}
