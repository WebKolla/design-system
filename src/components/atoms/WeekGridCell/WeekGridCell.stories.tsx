import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { WeekGridCell } from './WeekGridCell'

const meta = {
  title: 'Atoms/WeekGridCell',
  component: WeekGridCell,
  parameters: {
    docs: {
      description: {
        component:
          'One day, one project. 32px box inside a 42px cell.\n\n**Empty shows a mid-dot, never a zero.** ' +
          'Zero is a claim — "I worked no hours" — and blank is an absence — "I have not said yet". A ' +
          'grid full of zeros looks submitted when it is not, and that difference is the whole reason ' +
          'this rule exists.\n\nWeekend is dashed on a recessed cell: recessed, not removed. Consultants ' +
          'do work weekends and hiding the column makes that unrecordable.\n\nFocus carries the primary ' +
          'border plus the 3px `color/ring`, matching `Input`.',
      },
    },
  },
  args: { value: '7.5', 'aria-label': 'Hours, Wednesday' },
  decorators: [
    (Story) => (
      <div className="w-[120px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeekGridCell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="border-border bg-surface flex w-[380px] rounded-card border">
      <div className="flex-1">
        <WeekGridCell {...args} value="7.5" aria-label="Filled" />
      </div>
      <div className="flex-1">
        <WeekGridCell {...args} value="" aria-label="Empty" />
      </div>
      <div className="flex-1">
        <WeekGridCell {...args} value="" state="weekend" aria-label="Weekend" />
      </div>
    </div>
  ),
}

/** A project row, showing the mid-dot rule against real entries. */
export const ProjectRow: Story = {
  render: (args) => (
    <div className="border-border bg-surface flex w-[520px] rounded-card border">
      {['8.0', '7.5', '8.0', '', '6.0'].map((v, i) => (
        <div key={i} className="flex-1">
          <WeekGridCell {...args} value={v} aria-label={`Day ${i + 1}`} />
        </div>
      ))}
      {['', ''].map((v, i) => (
        <div key={`w${i}`} className="flex-1">
          <WeekGridCell
            {...args}
            value={v}
            state="weekend"
            aria-label={`Weekend ${i + 1}`}
          />
        </div>
      ))}
    </div>
  ),
}

/** The rule, asserted: an empty cell must not render a zero. */
export const EmptyIsNotZero: Story = {
  args: { value: '', 'aria-label': 'Hours, Thursday' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await expect(input).toHaveValue('')
    await expect(input).toHaveAttribute('placeholder', '·')
  },
}
