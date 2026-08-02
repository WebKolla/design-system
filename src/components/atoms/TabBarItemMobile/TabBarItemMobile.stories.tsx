import type { Meta, StoryObj } from '@storybook/react-vite'
import { Clock, Ellipsis, FileText, LayoutDashboard, Users } from 'lucide-react'
import { TabBarItemMobile } from './TabBarItemMobile'

const meta = {
  title: 'Atoms/TabBarItemMobile',
  component: TabBarItemMobile,
  parameters: {
    docs: {
      description: {
        component:
          'Bottom tab bar destination. Five plus More — the sidebar has thirteen entries and a phone ' +
          'cannot carry thirteen, so the five that survive are the ones a role opens daily.\n\n' +
          '52px tall inside a 64px bar with safe-area padding beneath. **The label is always present**: ' +
          'an icon-only tab bar makes people tap to find out what things are.',
      },
    },
  },
  args: { label: 'Invoices', icon: FileText },
} satisfies Meta<typeof TabBarItemMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { active: true } }

/** The full bar as shipped: five destinations plus More. */
export const Bar: Story = {
  render: (args) => (
    <nav
      aria-label="Primary"
      className="border-border bg-surface flex w-[390px] items-stretch border-t"
    >
      <TabBarItemMobile {...args} label="Overview" icon={LayoutDashboard} />
      <TabBarItemMobile {...args} label="Timesheets" icon={Clock} active />
      <TabBarItemMobile {...args} label="Approvals" icon={Users} />
      <TabBarItemMobile {...args} label="Invoices" icon={FileText} />
      <TabBarItemMobile {...args} label="More" icon={Ellipsis} />
    </nav>
  ),
}

/** Longest realistic label must not wrap or overlap its neighbour. */
export const EdgeContent: Story = {
  render: (args) => (
    <nav
      aria-label="Primary"
      className="border-border bg-surface flex w-[390px] items-stretch border-t"
    >
      <TabBarItemMobile {...args} label="Approvals" icon={Users} />
      <TabBarItemMobile {...args} label="Timesheets" icon={Clock} active />
      <TabBarItemMobile {...args} label="More" icon={Ellipsis} />
    </nav>
  ),
}
