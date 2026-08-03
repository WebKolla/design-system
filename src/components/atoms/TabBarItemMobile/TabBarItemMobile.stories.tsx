import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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

/**
 * Default rendering is untouched by `asChild`: an `<a href>` when `href` is
 * given, a `<button type="button">` otherwise.
 */
export const DefaultElementUnchanged: Story = {
  render: (args) => (
    <nav
      aria-label="Primary"
      className="border-border bg-surface flex w-[390px] items-stretch border-t"
    >
      <TabBarItemMobile {...args} label="Linked" href="/invoices" />
      <TabBarItemMobile {...args} label="Unlinked" />
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Linked' })
    await expect(link.tagName).toBe('A')
    await expect(link).toHaveAttribute('href', '/invoices')

    const button = canvas.getByRole('button', { name: 'Unlinked' })
    await expect(button.tagName).toBe('BUTTON')
    await expect(button).toHaveAttribute('type', 'button')
  },
}

/** `asChild` renders onto the consumer's element, with identical styling. */
export const AsChild: Story = {
  args: { active: true },
  render: (args) => (
    <nav
      aria-label="Primary"
      className="border-border bg-surface flex w-[390px] items-stretch border-t"
    >
      <TabBarItemMobile {...args} label="Slotted" href="/ignored" asChild>
        <a href="/invoices" data-router-link />
      </TabBarItemMobile>
      <TabBarItemMobile {...args} label="Plain" href="/invoices" />
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slotted = canvas.getByRole('link', { name: 'Slotted' })
    await expect(slotted).toHaveAttribute('data-router-link')
    await expect(slotted).toHaveAttribute('href', '/invoices')
    await expect(slotted).toHaveAttribute('aria-current', 'page')
    await expect(slotted).toHaveTextContent('Slotted')

    const plain = canvas.getByRole('link', { name: 'Plain' })
    await expect(slotted.getAttribute('class')).toBe(plain.getAttribute('class'))
  },
}
