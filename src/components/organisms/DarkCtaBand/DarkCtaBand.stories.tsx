import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { at1440 } from '@/test/story-decorators'
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
          'the Figma build.\n\nThe ink block is full-bleed and its contents sit on `Container`, the same ' +
          'centred column `Section` and the chrome use, so the band agrees with the footer beneath it ' +
          'above 1160.\n\nEverything here uses `ink-*` colours. `muted-foreground` on ink measures ' +
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

/**
 * The ink block is full-bleed and its contents are on the centred column.
 *
 * Same measurement as `SiteHeader` and `SiteFooter`: the dark surface still
 * reaches both edges, while the heading lines up with the footer beneath it
 * instead of sitting on a fixed 40px gutter.
 */
export const ContentsSitOnTheCentredColumn: Story = {
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const band = canvasElement.querySelector('section') as HTMLElement
    const column = band.firstElementChild as HTMLElement
    const heading = within(canvasElement).getByRole('heading', { level: 2 })

    const block = band.getBoundingClientRect()
    const inner = column.getBoundingClientRect()

    // Measured against the band's own parent, not the canvas: Storybook's theme
    // decorator wraps every story in a `p-6` pane.
    await expect(Math.round(block.width)).toBe(
      Math.round(band.parentElement!.getBoundingClientRect().width),
    )
    await expect(Math.round(inner.width)).toBe(
      Math.min(Math.round(block.width), 1160),
    )
    await expect(Math.round(inner.left - block.left)).toBe(
      Math.round(block.right - inner.right),
    )

    // The heading starts on the column's content edge, not on the band. The
    // gutter is read off the column rather than written down as 40: `Container`
    // owns that number, and this fix exists partly to stop it being copied.
    const gutter = parseFloat(getComputedStyle(column).paddingLeft)
    const h2 = heading.getBoundingClientRect()
    await expect(Math.round(h2.left)).toBe(Math.round(inner.left + gutter))
    // ...and keeps its 600 measure rather than taking the column's full width.
    await expect(Math.round(h2.width)).toBe(600)

    // The vertical rhythm moved from the root on to the column with the
    // gutter. Without this the band still centres and still measures 600 while
    // its heading, sub and actions collapse together.
    const columnStyle = getComputedStyle(column)
    await expect(columnStyle.display).toBe('flex')
    await expect(columnStyle.flexDirection).toBe('column')
    await expect(columnStyle.alignItems).toBe('flex-start')
    await expect(parseFloat(columnStyle.rowGap)).toBeGreaterThan(0)
  },
}

/**
 * `wide` moves the band's column to 1280, so a `wide` page closes on the same
 * width it was laid out on. The agreement with a `wide` `Section` is asserted
 * in `MarketingShell`'s stories, where both are on the page.
 */
export const WideCapsAt1280: Story = {
  args: { wide: true },
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const band = canvasElement.querySelector('section') as HTMLElement
    const inner = (band.firstElementChild as HTMLElement).getBoundingClientRect()
    const block = band.getBoundingClientRect()

    await expect(Math.round(inner.width)).toBe(
      Math.min(Math.round(block.width), 1280),
    )
  },
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
