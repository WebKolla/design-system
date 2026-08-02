import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { SiteFooter } from './SiteFooter'

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
