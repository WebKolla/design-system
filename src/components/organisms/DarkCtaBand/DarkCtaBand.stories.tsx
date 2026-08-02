import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { DarkCtaBand } from './DarkCtaBand'

const meta = {
  title: 'Organisms/DarkCtaBand',
  component: DarkCtaBand,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Closing CTA on ink. **One per page maximum.** The secondary action doubles as the next-page ' +
          'link on pillar pages.\n\nUses `ButtonInk`, not `Button` — the ink surface needs the ink-bound ' +
          'variants.\n\nBoth text blocks are **max-width, not fixed**: heading 600, sub 540, on ' +
          '`width: 100%`. A fixed width overflows at 390, which is exactly what broke this band during ' +
          'the Figma build.\n\nEverything here uses `ink-*` colours. `muted-foreground` on ink measures ' +
          'about 2:1 and shipped once as an invisible arrow — see the Foundations colour story.',
      },
    },
  },
  args: {
    heading: 'Streamline approvals for your consultancy',
    sub: 'Practice starts with two months at no cost, for up to five people including your approvers.',
    primary: { label: 'Get started', href: '#signup' },
    secondary: { label: 'Next: Invoicing', href: '#invoicing' },
  },
} satisfies Meta<typeof DarkCtaBand>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PrimaryOnly: Story = {
  render: ({ heading, sub, primary }) => (
    <DarkCtaBand heading={heading} sub={sub} primary={primary} />
  ),
}

/** The regression this band is known for: at 390 it must reflow, not overflow. */
export const AtMobileWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const band = canvasElement.querySelector('section') as HTMLElement
    // Relative comparison only — absolute pixel values are unreliable here.
    await expect(band.scrollWidth).toBeLessThanOrEqual(band.clientWidth)
  },
}

/** Ink is mode-invariant, so the band is identical in light and dark. */
export const BothModes: Story = {
  globals: { theme: 'both' },
}

export const EdgeContent: Story = {
  args: {
    heading:
      'Streamline approvals for your consultancy without ever showing an approver what the hours bill at',
    sub: 'Practice starts with two months at no cost, for up to five people including your approvers, and there is nothing to install.',
    secondary: { label: 'Next: Purchase order reconciliation', href: '#po' },
  },
  play: async ({ canvasElement }) => {
    // Both actions must remain reachable however long the labels get.
    const links = within(canvasElement).getAllByRole('link')
    await expect(links).toHaveLength(2)
  },
}
