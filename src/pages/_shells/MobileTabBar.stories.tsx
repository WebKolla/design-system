import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Clock, Ellipsis, LayoutDashboard, Receipt, ShieldCheck } from 'lucide-react'
import { MobileTabBar } from './MobileTabBar'

const TABS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Timesheets', icon: Clock, href: '/timesheets', current: true },
  { label: 'Approvals', icon: ShieldCheck, href: '/approvals' },
  { label: 'Invoices', icon: Receipt, href: '/invoices' },
  { label: 'More', icon: Ellipsis, href: '/more' },
]

const meta = {
  title: 'Pages/Shells/MobileTabBar',
  component: MobileTabBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The bottom tab bar below 834. **The bar owns its height, not the item** — ' +
          '`TabBarItemMobile` is 52px by design and the bar is 64px, so the 12px difference is the ' +
          'bar’s padding. Safe-area padding sits beneath and resolves to 0 without a home indicator.' +
          '\n\nBoth shells use this rather than each rendering their own `<nav>`. They previously did ' +
          'the latter and both omitted the bar height — BUG-002.',
      },
    },
  },
  args: { tabs: TABS },
  decorators: [
    (Story) => (
      <div className="relative h-[200px] w-[390px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileTabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * BUG-002 regression.
 *
 * Asserts the declared classes, not the resolved padding.
 *
 * The bar is `md:hidden` and this harness runs the browser at desktop width,
 * so the element is `display: none` and `getComputedStyle` reports `0px` for
 * padding whether or not the fix is present. A resolved-value assertion here
 * would fail for the wrong reason and pass for none — it would look like a
 * test while checking nothing.
 *
 * The resolved value *is* correct (12px, verified in the browser at mobile
 * width); it simply cannot be read from here. Checking the declaration is the
 * strongest thing this harness can honestly assert.
 */
export const BarSuppliesItsOwnHeight: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('navigation', { name: 'Primary' })
    // 12px top: a 52px item inside a 64px bar.
    await expect(bar.className).toContain('pt-3')
    // Safe-area inset beneath, 0 on devices without a home indicator.
    await expect(bar.className).toContain('pb-[env(safe-area-inset-bottom)]')
  },
}
