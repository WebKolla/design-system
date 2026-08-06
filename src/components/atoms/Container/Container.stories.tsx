import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { at1440 } from '@/test/story-decorators'
import { Container } from './Container'

const meta = {
  title: 'Atoms/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The 1160 centred content column, or 1280 with `wide`.\n\nOne definition of "the column". ' +
          '`Section` puts a page band on it, and `SiteHeader` and `SiteFooter` put the chrome on the ' +
          'same one, which is what keeps a logo above a hero heading aligned with it.\n\nIt is a ' +
          '`max-width`, never a fixed width, so it reflows at 390 rather than overflowing. The 40px ' +
          'gutter belongs to the column rather than the band around it; a caller needing a different ' +
          'one passes it in `className`, which wins through `cn`.',
      },
    },
  },
  args: {
    children: <p data-testid="content">Content</p>,
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Wide: Story = { args: { wide: true } }

/**
 * Capped and centred, measured rather than eyeballed.
 *
 * The assertion holds at any viewport: below the cap the column is the full
 * width, above it the leftover space is split evenly.
 */
export const CappedAndCentred: Story = {
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const column = within(canvasElement).getByTestId('content').parentElement!
    // The column's own parent, not the canvas: Storybook's theme decorator
    // wraps every story in a `p-6` pane, so the canvas is 48px wider.
    const outer = column.parentElement!.getBoundingClientRect()
    const inner = column.getBoundingClientRect()

    await expect(Math.round(inner.width)).toBe(Math.min(Math.round(outer.width), 1160))
    await expect(Math.round(inner.left - outer.left)).toBe(
      Math.round(outer.right - inner.right),
    )
  },
}

/** `wide` moves the cap to 1280 and nothing else. */
export const WideCapsAt1280: Story = {
  args: { wide: true },
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const column = within(canvasElement).getByTestId('content').parentElement!
    const outer = column.parentElement!.getBoundingClientRect()
    const inner = column.getBoundingClientRect()

    await expect(Math.round(inner.width)).toBe(Math.min(Math.round(outer.width), 1280))
  },
}

/** The gutter is overridable, because the app's mobile chrome uses 20px. */
export const GutterIsOverridable: Story = {
  args: { className: 'px-5' },
  play: async ({ canvasElement }) => {
    const content = within(canvasElement).getByTestId('content')
    const column = content.parentElement!

    await expect(
      Math.round(content.getBoundingClientRect().left - column.getBoundingClientRect().left),
    ).toBe(20)
  },
}
