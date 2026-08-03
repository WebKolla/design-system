import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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

/**
 * Default rendering is untouched by `asChild`: an `<a href>` when `href` is
 * given, a `<button type="button">` otherwise. This is the guard for every
 * existing consumer.
 */
export const DefaultElementUnchanged: Story = {
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      <NavItem {...args} label="Linked" href="/timesheets" />
      <NavItem {...args} label="Unlinked" />
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: /Linked/ })
    await expect(link.tagName).toBe('A')
    await expect(link).toHaveAttribute('href', '/timesheets')

    const button = canvas.getByRole('button', { name: /Unlinked/ })
    await expect(button.tagName).toBe('BUTTON')
    await expect(button).toHaveAttribute('type', 'button')
  },
}

/**
 * `asChild` renders onto the consumer's element — a framework router link —
 * and the icon, label and badge become its children. The styling is byte-identical
 * to the default `<a>`, which is what the class comparison here proves.
 */
export const AsChild: Story = {
  args: { badge: 3, active: true },
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      <NavItem {...args} label="Slotted" href="/ignored" asChild>
        <a href="/timesheets" data-router-link />
      </NavItem>
      <NavItem {...args} label="Plain" href="/timesheets" />
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slotted = canvas.getByRole('link', { name: /Slotted/ })

    // The consumer's element won, and kept its own href.
    await expect(slotted).toHaveAttribute('data-router-link')
    await expect(slotted).toHaveAttribute('href', '/timesheets')

    // The composed content survived rather than being discarded.
    await expect(slotted).toHaveTextContent('Slotted')
    await expect(slotted).toHaveTextContent('3')
    await expect(slotted).toHaveAttribute('aria-current', 'page')

    // Same styling as the default path.
    const plain = canvas.getByRole('link', { name: /Plain/ })
    await expect(slotted.getAttribute('class')).toBe(plain.getAttribute('class'))
  },
}
