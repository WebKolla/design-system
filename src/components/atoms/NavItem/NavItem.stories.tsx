import type { Meta, StoryObj } from '@storybook/react-vite'
import { Clock, FileText, LayoutDashboard, Settings, Users } from 'lucide-react'
import { NavItem } from './NavItem'

const meta = {
  title: 'Atoms/NavItem',
  component: NavItem,
  parameters: {
    docs: {
      description: {
        component:
          'Expanded sidebar navigation item, 236 wide. Default and Active states; Active uses ' +
          '`color/primary-soft` with a primary icon and label. Optional count badge.\n\n' +
          'Pairs with `NavRailItem`, the 52px collapsed equivalent — **keep icon order and grouping ' +
          'identical across the two**, or the sidebar appears to reorder itself when it collapses.',
      },
    },
  },
  args: { label: 'Timesheets', icon: Clock },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[236px] rounded-card border p-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = { args: { active: true } }

export const Sidebar: Story = {
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      <NavItem {...args} label="Overview" icon={LayoutDashboard} />
      <NavItem {...args} label="Timesheets" icon={Clock} active badge={3} />
      <NavItem {...args} label="Approvals" icon={Users} badge={12} />
      <NavItem {...args} label="Invoices" icon={FileText} />
      <NavItem {...args} label="Settings" icon={Settings} />
    </nav>
  ),
}

/** Longest realistic label must truncate, not push the badge out of the item. */
export const EdgeContent: Story = {
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      <NavItem
        {...args}
        label="Approver sign-off and rate exceptions"
        icon={Users}
        badge={128}
      />
      <NavItem {...args} label="A" icon={Clock} />
    </nav>
  ),
}
