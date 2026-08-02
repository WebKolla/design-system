import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusPill, type StatusTone } from './StatusPill'

const MEANINGS: Array<{ tone: StatusTone; labels: string[] }> = [
  { tone: 'success', labels: ['Approved', 'Paid'] },
  { tone: 'info', labels: ['Submitted', 'Sent'] },
  { tone: 'warn', labels: ['Pending'] },
  { tone: 'danger', labels: ['Rejected', 'Overdue'] },
  { tone: 'neutral', labels: ['Draft'] },
]

const meta = {
  title: 'Atoms/StatusPill',
  component: StatusPill,
  parameters: {
    docs: {
      description: {
        component:
          'Status, never decoration. **The dot is not optional**: colour alone fails a monochrome print ' +
          'and fails colour vision deficiency, so state must survive without it.\n\n' +
          'Tone maps to meaning, not to preference — Success: Approved, Paid, Approver signed off. ' +
          'Info: Submitted, Sent. Warn: Pending. Danger: Rejected, Overdue. Neutral: Draft.\n\n' +
          'For a bare count use Chip instead.',
      },
    },
  },
  args: { children: 'Approved', tone: 'success' },
} satisfies Meta<typeof StatusPill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Every tone with the workflow states it is allowed to represent. */
export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {MEANINGS.map(({ tone, labels }) => (
        <div key={tone} className="flex items-center gap-3">
          <span className="text-ui-overline text-subtle-foreground w-16 uppercase">
            {tone}
          </span>
          {labels.map((label) => (
            <StatusPill key={label} {...args} tone={tone}>
              {label}
            </StatusPill>
          ))}
        </div>
      ))}
    </div>
  ),
}

/**
 * The dot carries the state as well as the colour, so the pill still reads
 * when colour is removed. This story greys everything to prove it.
 */
export const SurvivesWithoutColour: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3 grayscale">
      {MEANINGS.map(({ tone, labels }) => (
        <StatusPill key={tone} {...args} tone={tone}>
          {labels[0]}
        </StatusPill>
      ))}
    </div>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex max-w-[300px] flex-wrap items-center gap-3">
      <StatusPill {...args} tone="danger">
        Rejected — rate not agreed
      </StatusPill>
      <StatusPill {...args} tone="neutral">
        —
      </StatusPill>
    </div>
  ),
}
