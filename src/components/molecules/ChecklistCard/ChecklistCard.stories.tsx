import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ChecklistCard } from './ChecklistCard'

const meta = {
  title: 'Molecules/ChecklistCard',
  component: ChecklistCard,
  parameters: {
    docs: {
      description: {
        component:
          'A per-item satisfied/warning list, for cards like "Before you submit" that tell someone ' +
          'what is still wrong before they act.\n\nCopies `Toast`\'s per-tone icon-and-colour map ' +
          'rather than `StatusPill`/`Chip`/`Banner`\'s single whole-component tone, because a ' +
          'checklist needs an independently toned row inside one list.\n\n**Accessible name.** ' +
          '`listitem` does not derive its name from content, so each row carries an explicit ' +
          '`aria-label`. A satisfied item\'s label matches its visible text; a warning item\'s is ' +
          'prefixed `"Warning: "`, so the state survives without the icon and without colour.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[280px] rounded-card border p-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChecklistCard>

export default meta
type Story = StoryObj<typeof meta>

/** Every item satisfied — the shape "Before you submit" has always rendered. */
export const AllSatisfied: Story = {
  args: {
    items: [
      { label: 'Every day has an entry or is deliberately blank' },
      { label: 'Non-billable time is tagged' },
    ],
  },
}

/** Some rows satisfied, at least one warning — the state FEAT-D1B-008 adds. */
export const Mixed: Story = {
  args: {
    items: [
      { label: 'Every row has a description', tone: 'success' },
      { label: 'Practice development has no note yet', tone: 'warn' },
    ],
  },
}

/** The accessible name distinguishes a warning row from a satisfied one. */
export const AccessibleNameCarriesState: Story = {
  args: Mixed.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const satisfied = await canvas.findByText('Every row has a description')
    expect(satisfied.closest('li')).toHaveAccessibleName('Every row has a description')

    const warning = await canvas.findByText('Practice development has no note yet')
    expect(warning.closest('li')).toHaveAccessibleName(
      'Warning: Practice development has no note yet',
    )
  },
}
