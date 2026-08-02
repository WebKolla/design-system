import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CompletenessCard } from './CompletenessCard'

const meta = {
  title: 'Molecules/CompletenessCard',
  component: CompletenessCard,
  parameters: {
    docs: {
      description: {
        component:
          'Sits under the section nav and answers "can I stop now?". **The note is the important part** ' +
          'and must always say what the remaining gap costs — "Enough to invoice. Company block is ' +
          'optional." tells someone they can leave, which a bare 5/7 does not.\n\n**Never phrase this ' +
          'as a completion score.** It is not a game and the user is not being marked; some sections ' +
          'are genuinely optional and the copy should say so.',
      },
    },
  },
  args: {
    done: 5,
    total: 7,
    note: 'Enough to invoice. Company block is optional.',
  },
  decorators: [
    (Story) => (
      <div className="w-[224px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompletenessCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The note changes with the gap — that is what makes the card useful. */
export const Progression: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <CompletenessCard
        {...args}
        done={2}
        total={7}
        note="Add bank details before the first invoice run."
      />
      <CompletenessCard {...args} />
      <CompletenessCard
        {...args}
        done={7}
        total={7}
        note="Nothing outstanding on this record."
      />
    </div>
  ),
}

/** Progress must be announced, not just drawn. */
export const IsAnnounced: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuenow', '5')
    await expect(bar).toHaveAttribute('aria-valuemax', '7')
  },
}

export const EdgeContent: Story = {
  args: {
    done: 0,
    total: 4,
    note: 'Nothing entered yet. Company name and VAT number are the only required sections.',
  },
}
