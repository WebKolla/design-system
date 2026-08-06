import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { SiteFooter } from './SiteFooter'

/**
 * A fixed 1440 stage for the measurement stories.
 *
 * Storybook's canvas is ~1152 wide, below both caps, so a story measured in it
 * proves the column is full-width and nothing more. The stage is wider than the
 * cap, which is the only width at which the alignment can be wrong.
 */
const at1440: Decorator = (Story) => (
  <div style={{ width: 1440 }}>
    <Story />
  </div>
)


const meta = {
  title: 'Organisms/SiteFooter',
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Marketing site footer on ink. Brand blurb, three link columns, social links, legal bar.\n\n' +
          'Every colour here is `ink-*`. The footer is an ink surface, so the ordinary ' +
          '`muted-foreground` / `subtle-foreground` pair would fail contrast against it — the same trap ' +
          'that produced an invisible arrow on the CTA band.\n\nEach link column is its own labelled ' +
          '`<nav>`, so the landmarks stay distinguishable.',
      },
    },
  },
  args: {
    blurb:
      'Timesheet management, approvals and invoicing for consultancies that bill by the hour.',
    columns: [
      {
        heading: 'Product',
        links: [
          { label: 'Features', href: '/features' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Approvals', href: '/approvals' },
          { label: 'Invoicing', href: '/invoicing' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'Help centre', href: '/help' },
          { label: 'Status', href: '/status' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
          { label: 'Data processing', href: '/dpa' },
        ],
      },
    ],
    social: [
      { label: 'X', href: 'https://x.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'GitHub', href: 'https://github.com' },
    ],
    copyright: '© 2026 TimeSubmit Ltd. All rights reserved.',
    strapline: 'Built for consultancies',
  },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/*
 * No side-by-side story here.
 *
 * SiteFooter renders a `contentinfo` landmark, so rendering it twice for a
 * mode comparison creates two and fails axe's landmark-unique. Ink is
 * mode-invariant anyway — the Foundations colour story proves the eight ink
 * tokens are byte-identical across modes.
 */

/** Each column is a separately-named nav, so landmarks stay unique. */
export const NavsAreNamed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('contentinfo')).toBeInTheDocument()
    for (const name of ['Product', 'Resources', 'Legal']) {
      await expect(canvas.getByRole('navigation', { name })).toBeInTheDocument()
    }
  },
}

/**
 * The ink block is full-bleed and its columns are on the centred column.
 *
 * Same measurement as `SiteHeader`: the dark surface still reaches both edges,
 * while the first column lines up with the page above it instead of sitting on
 * a fixed 40px gutter.
 */
export const ContentsSitOnTheCentredColumn: Story = {
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    const column = footer.firstElementChild as HTMLElement

    const block = footer.getBoundingClientRect()
    const inner = column.getBoundingClientRect()

    // Measured against the footer's own parent, not the canvas: Storybook's
    // theme decorator wraps every story in a `p-6` pane.
    await expect(Math.round(block.width)).toBe(
      Math.round(footer.parentElement!.getBoundingClientRect().width),
    )
    await expect(Math.round(inner.width)).toBe(Math.min(Math.round(block.width), 1160))
    await expect(Math.round(inner.left - block.left)).toBe(
      Math.round(block.right - inner.right),
    )
  },
}

/** `wide` moves the chrome's column to 1280 so it agrees with a `wide` Section. */
export const WideMatchesAWideSection: Story = {
  args: { wide: true },
  decorators: [at1440],
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    const inner = (footer.firstElementChild as HTMLElement).getBoundingClientRect()
    const block = footer.getBoundingClientRect()

    await expect(Math.round(inner.width)).toBe(Math.min(Math.round(block.width), 1280))
  },
}

export const WithoutStrapline: Story = {
  render: ({ blurb, columns, social, copyright }) => (
    <SiteFooter
      blurb={blurb}
      columns={columns}
      social={social}
      copyright={copyright}
    />
  ),
}
