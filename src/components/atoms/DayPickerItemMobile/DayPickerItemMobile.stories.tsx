import type { Meta, StoryObj } from '@storybook/react-vite'
import { DayPickerItemMobile } from './DayPickerItemMobile'

const WEEK = [
  { day: 'Mon', date: 27, total: '8.0', state: 'default' as const },
  { day: 'Tue', date: 28, total: '7.5', state: 'default' as const },
  { day: 'Wed', date: 29, total: '8.0', state: 'selected' as const },
  { day: 'Thu', date: 30, total: '8.0', state: 'default' as const },
  { day: 'Fri', date: 31, total: '6.0', state: 'default' as const },
  { day: 'Sat', date: 1, total: '·', state: 'weekend' as const },
  { day: 'Sun', date: 2, total: '·', state: 'weekend' as const },
]

const meta = {
  title: 'Atoms/DayPickerItemMobile',
  component: DayPickerItemMobile,
  parameters: {
    docs: {
      description: {
        component:
          'The seven-day strip that replaces the grid on mobile. **Never render a 7-column grid at 390** ' +
          '— the cells become untappable.\n\nThis is how the week context survives one-day-per-screen ' +
          'entry: every day shows its running total, so the consultant can still reconstruct Tuesday by ' +
          'seeing that Monday and Wednesday were 8. Losing that context is what makes single-entry ' +
          'forms produce worse data.\n\n46×62, above the 44px minimum. Weekend keeps the recessed ' +
          'treatment from the desktop grid — recessed, not removed.',
      },
    },
  },
  args: { day: 'Wed', date: 29, total: '8.0', state: 'selected' },
} satisfies Meta<typeof DayPickerItemMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <DayPickerItemMobile {...args} state="default" day="Mon" date={27} total="8.0" />
      <DayPickerItemMobile {...args} state="selected" day="Wed" date={29} total="8.0" />
      <DayPickerItemMobile {...args} state="weekend" day="Sat" date={1} total="·" />
    </div>
  ),
}

/** The full strip at 390. Totals keep the week visible one day at a time. */
export const WeekStrip: Story = {
  render: (args) => (
    <div className="border-border bg-surface flex w-[358px] gap-1.5 overflow-x-auto rounded-card border p-2">
      {WEEK.map((d) => (
        <DayPickerItemMobile
          {...args}
          key={d.day}
          day={d.day}
          date={d.date}
          total={d.total}
          state={d.state}
        />
      ))}
    </div>
  ),
}
