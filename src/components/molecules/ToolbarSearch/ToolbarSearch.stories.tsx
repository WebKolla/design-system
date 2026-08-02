import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarSearch } from './ToolbarSearch'

const meta = {
  title: 'Molecules/ToolbarSearch',
  component: ToolbarSearch,
  parameters: {
    docs: {
      description: {
        component:
          '30px toolbar search, recessed onto `color/background` so it reads as a control inside a white ' +
          'card rather than another card.\n\n**Width is set by the parent** — 190 on invoices, 250 on the ' +
          'approver queue. Mobile collapses to a 44px icon button that expands to full width on tap.',
      },
    },
  },
  args: { 'aria-label': 'Search invoices' },
} satisfies Meta<typeof ToolbarSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
}

/** The two widths the parent actually sets. */
export const Widths: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="w-[190px]">
        <ToolbarSearch {...args} placeholder="Search invoices" />
      </div>
      <div className="w-[250px]">
        <ToolbarSearch {...args} placeholder="Search the approver queue" />
      </div>
    </div>
  ),
}

/** In a white card, which is the whole reason it is recessed. */
export const InCard: Story = {
  render: (args) => (
    <div className="bg-surface border-border flex w-[520px] items-center justify-between gap-4 rounded-card border p-3">
      <div className="w-[250px]">
        <ToolbarSearch {...args} />
      </div>
      <span className="text-body-caption text-subtle-foreground">47 invoices</span>
    </div>
  ),
}

export const Filled: Story = {
  args: { defaultValue: 'Pemberton' },
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
}
