import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Textarea } from './Textarea'

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'The multi-line text control.\n\nSame border, radius, focus treatment, disabled treatment and ' +
          'type token as `Input` — deliberately, and `COMPONENTS.md` specifies inputs, selects and ' +
          'textareas in one section for that reason. The differences are the three that multi-line ' +
          'forces: a height driven by `rows`, vertical padding instead of vertical centring, and a ' +
          'resize handle.\n\nThe focus ring is the same pairing as `Input` — a 3px `color/ring` spread ' +
          '**plus** a primary border, because the ring alone measures 1.25:1 and fails WCAG 1.4.11 as a ' +
          'sole indicator.\n\nMost textareas in the product are raw `<textarea>` elements rather than a ' +
          'shared control, so they have drifted. This is what they become.',
      },
    },
  },
  args: {
    placeholder: 'Why is this timesheet being rejected?',
    'aria-label': 'Rejection reason',
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} />
      <Textarea
        {...args}
        defaultValue="Thursday and Friday are booked against Northgate Rail, but the project closed on Wednesday."
      />
      <Textarea {...args} invalid defaultValue="" />
      <Textarea {...args} disabled defaultValue="Approved on 2 August. Reasons are read-only once a decision is recorded." />
    </div>
  ),
}

export const Rows: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} rows={2} aria-label="Two rows" />
      <Textarea {...args} rows={4} aria-label="Four rows" />
      <Textarea {...args} rows={8} resize="none" aria-label="Eight rows, fixed" />
    </div>
  ),
}

/** With a real label and error message, which is how a form uses it. */
export const InContext: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="reason" className="text-ui-label text-muted-foreground">
        Rejection reason <span className="text-danger">*</span>
      </label>
      <Textarea {...args} id="reason" invalid aria-label={undefined} aria-describedby="reason-error" />
      <p id="reason-error" className="text-body-caption text-danger">
        Say what needs changing. "Incorrect" gives the consultant nothing to act on.
      </p>
    </div>
  ),
}

export const EdgeContent: Story = {
  args: {
    defaultValue:
      'Hours on 28 and 29 July are logged against Northgate Rail signalling, but that engagement ' +
      'closed on 27 July and the remaining scope moved to the Pemberton Clarke framework. Please ' +
      'resubmit those two days against the new project code so the invoice lands on the right ' +
      'purchase order, and flag anything else in the period that was booked the same way.',
  },
}

/** Typable, and it announces itself as invalid when it is. */
export const IsOperable: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('textbox', { name: 'Rejection reason' })
    await userEvent.type(box, 'Wrong project code')
    await expect(box).toHaveValue('Wrong project code')
    await expect(box).not.toHaveAttribute('aria-invalid')
  },
}
