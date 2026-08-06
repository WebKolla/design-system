import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { at1440 } from '@/test/story-decorators'
import { MarketingShell } from './MarketingShell'
import { Section } from './Section'
import { FOOTER } from './marketing-data'

/**
 * `MarketingShell`'s props are proved in `marketing-shell.test.tsx`, in jsdom.
 *
 * These stories exist for the one thing jsdom cannot answer: where things
 * actually are. No CSS applies there, so every element reports a zero-width
 * rect and an alignment assertion passes proving nothing.
 */
const meta = {
  title: 'Shells/MarketingShell',
  component: MarketingShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Marketing chrome: `SiteHeader`, the page, `SiteFooter`.\n\nThe three bars are full-bleed ' +
          'and their contents share one `Container`, so backgrounds and borders reach the viewport ' +
          'edge while the logo, the page copy and the footer columns all sit on the same centred ' +
          'column. `wide` moves that column to 1280 for the chrome as well as the sections, because ' +
          'a wide page under 1160-wide chrome is the misalignment this exists to prevent.',
      },
    },
  },
  args: {
    current: '/',
    children: (
      <Section>
        <h1 data-testid="hero">Timesheets, approvals and invoicing</h1>
      </Section>
    ),
  },
} satisfies Meta<typeof MarketingShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * The header logo, the page heading and the first footer column start at the
 * same x, and the bars they sit in still span the full viewport.
 *
 * This is BUG-019 measured. `getBoundingClientRect`, not a screenshot.
 */
export const ChromeAndPageShareOneColumn: Story = {
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole('banner')
    const footer = canvas.getByRole('contentinfo')

    const logo = within(header).getByRole('link', { name: /TimeSubmit/ })
    const hero = canvas.getByTestId('hero')
    // The blurb is a block child of the footer's first column, so its left edge
    // is the column's. The wordmark next to it is inset by the logo tile.
    const firstColumn = within(footer).getByText(FOOTER.blurb)

    const left = (el: Element) => Math.round(el.getBoundingClientRect().left)
    await expect(left(logo)).toBe(left(hero))
    await expect(left(firstColumn)).toBe(left(hero))

    // The bars themselves are untouched: still edge to edge. The shell root is
    // the reference, not the canvas — the theme decorator adds a `p-6` pane.
    const page = Math.round(header.parentElement!.getBoundingClientRect().width)
    await expect(Math.round(header.getBoundingClientRect().width)).toBe(page)
    await expect(Math.round(footer.getBoundingClientRect().width)).toBe(page)
  },
}

/** `wide` widens chrome and sections together, so they still agree. */
export const WideChromeAgreesWithWideSections: Story = {
  decorators: [at1440],
  args: {
    wide: true,
    children: (
      <Section wide>
        <h1 data-testid="hero">Pricing</h1>
      </Section>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole('banner')
    const footer = canvas.getByRole('contentinfo')

    const left = (el: Element) => Math.round(el.getBoundingClientRect().left)
    await expect(left(within(header).getByRole('link', { name: /TimeSubmit/ }))).toBe(
      left(canvas.getByTestId('hero')),
    )
    await expect(left(within(footer).getByText(FOOTER.blurb))).toBe(
      left(canvas.getByTestId('hero')),
    )
  },
}
