import type { Meta, StoryObj } from '@storybook/react-vite'
import { SubNavItem } from './SubNavItem'

const meta = {
  title: 'Atoms/SubNavItem',
  component: SubNavItem,
  parameters: {
    docs: {
      description: {
        component:
          'Section navigation for long records. **The badge is the whole point**: "3/7" against Bank ' +
          'details tells you what is outstanding without opening it.\n\nA long form is not intimidating ' +
          'because it is long — it is intimidating because you cannot see the end. Sectioning with ' +
          'per-section state turns an unbounded scroll into a checklist, and checklists get finished.\n\n' +
          'Use `warn` for incomplete counts and `faint` for plain ones, and the word **"Empty"** rather ' +
          'than "0/4" when nothing has been entered at all.\n\nBecomes a scrollable chip row below 768.',
      },
    },
  },
  args: { label: 'Rates and billing', badge: '3/7' },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[224px] rounded-card border p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubNavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = { args: { active: true } }

/** A record's section list, with the badge doing the work. */
export const RecordSections: Story = {
  render: (args) => (
    <nav aria-label="Sections" className="flex flex-col gap-0.5">
      <SubNavItem {...args} label="Company details" badge="6/6" active />
      <SubNavItem {...args} label="Rates and billing" badge="3/7" badgeTone="warn" />
      <SubNavItem {...args} label="Bank details" badge="Empty" badgeTone="warn" />
      <SubNavItem {...args} label="Approvers" badge="2" />
      <SubNavItem {...args} label="Notes" />
    </nav>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <nav aria-label="Sections" className="flex flex-col gap-0.5">
      <SubNavItem
        {...args}
        label="Purchase order references and cost centre mapping"
        badge="12/12"
      />
      <SubNavItem {...args} label="VAT" />
    </nav>
  ),
}
