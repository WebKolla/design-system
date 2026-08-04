import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Clock, FileText, LayoutDashboard, Settings, Users } from 'lucide-react'
import { NavRailItem } from './NavRailItem'

const meta = {
  title: 'Atoms/NavRailItem',
  component: NavRailItem,
  parameters: {
    docs: {
      description: {
        component:
          'Collapsed sidebar item for the 52px icon rail. 36×36 centred, giving 8px either side. ' +
          'Fill and icon colour use the same tokens as the expanded `NavItem`, so the two stay in ' +
          'step.\n\n`label` is required even though nothing renders it — the rail has no visible text, ' +
          'so the accessible name is the only name, and it must match the expanded item exactly.',
      },
    },
  },
  args: { icon: Clock, label: 'Timesheets' },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border flex w-[52px] justify-center rounded-card border py-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavRailItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = { args: { active: true } }

/** The rail in full. Icon order must match the expanded sidebar exactly. */
export const Rail: Story = {
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col items-center gap-1">
      <NavRailItem {...args} icon={LayoutDashboard} label="Overview" />
      <NavRailItem {...args} icon={Clock} label="Timesheets" active />
      <NavRailItem {...args} icon={Users} label="Approvals" />
      <NavRailItem {...args} icon={FileText} label="Invoices" />
      <NavRailItem {...args} icon={Settings} label="Settings" />
    </nav>
  ),
}

/** Every rail item must expose a name despite rendering no text. */
export const HasAccessibleName: Story = {
  play: async ({ canvasElement }) => {
    const btn = within(canvasElement).getByRole('button', { name: 'Timesheets' })
    await expect(btn).toBeInTheDocument()
  },
}

/**
 * Default rendering is untouched by `asChild`: an `<a href>` when `href` is
 * given, a `<button type="button">` otherwise.
 */
export const DefaultElementUnchanged: Story = {
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col items-center gap-1">
      <NavRailItem {...args} label="Linked" href="/timesheets" />
      <NavRailItem {...args} label="Unlinked" />
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Linked' })
    await expect(link.tagName).toBe('A')
    await expect(link).toHaveAttribute('href', '/timesheets')

    const button = canvas.getByRole('button', { name: 'Unlinked' })
    await expect(button.tagName).toBe('BUTTON')
    await expect(button).toHaveAttribute('type', 'button')
  },
}

/** `asChild` renders onto the consumer's element, with identical styling. */
export const AsChild: Story = {
  args: { active: true },
  render: (args) => (
    <nav aria-label="Main" className="flex flex-col items-center gap-1">
      <NavRailItem {...args} label="Slotted" href="/ignored" asChild>
        <a href="/timesheets" data-router-link />
      </NavRailItem>
      <NavRailItem {...args} label="Plain" href="/timesheets" />
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slotted = canvas.getByRole('link', { name: 'Slotted' })
    await expect(slotted).toHaveAttribute('data-router-link')
    await expect(slotted).toHaveAttribute('href', '/timesheets')
    await expect(slotted).toHaveAttribute('aria-current', 'page')
    // The icon survived rather than being discarded.
    await expect(slotted.querySelector('svg')).toBeInTheDocument()

    const plain = canvas.getByRole('link', { name: 'Plain' })
    await expect(slotted.getAttribute('class')).toBe(plain.getAttribute('class'))
  },
}
