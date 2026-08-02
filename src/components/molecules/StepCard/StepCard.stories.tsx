import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { StepCard } from './StepCard'

const meta = {
  title: 'Molecules/StepCard',
  component: StepCard,
  parameters: {
    docs: {
      description: {
        component:
          'Numbered step cell for "How it works". 386 wide, sits in a 3-up hairline grid (1px gaps over ' +
          '`color/border`).\n\n**Square corners by design** — the parent grid clips them. The container ' +
          'owns radius, border and clipping; a rounded cell inside a clipped grid produces a visible ' +
          'notch.',
      },
    },
  },
  args: {
    number: '01',
    title: 'Submit',
    body: 'A consultant enters hours against each project and day of the period, then submits the timesheet for approval.',
  },
  decorators: [
    (Story) => (
      <div className="w-[386px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * The 3-up hairline grid it is designed for: the container owns the radius,
 * border and clipping, and the 1px gaps show the border through.
 */
export const HairlineGrid: Story = {
  decorators: [
    (Story) => (
      <div className="w-[1160px]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="bg-border border-border grid grid-cols-3 gap-px overflow-hidden rounded-card border">
      <StepCard {...args} />
      <StepCard
        {...args}
        number="02"
        title="Approve"
        body="An approver signs the week off from the queue without ever seeing what those hours bill at."
      />
      <StepCard
        {...args}
        number="03"
        title="Invoice"
        body="Approved time becomes invoice lines, grouped by client and ready to send."
      />
    </div>
  ),
}

/** The cell must not introduce its own radius. */
export const HasSquareCorners: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement)
      .getByText('Submit')
      .closest('div') as HTMLElement
    await expect(getComputedStyle(card).borderTopLeftRadius).toBe('0px')
  },
}

export const EdgeContent: Story = {
  args: {
    number: '12',
    title: 'Reconcile against purchase orders and cost centres',
    body: 'Pemberton Clarke require a purchase order reference and a cost centre on every invoice line, so the reconciliation step matches approved time to the right budget before anything is sent.',
  },
}
