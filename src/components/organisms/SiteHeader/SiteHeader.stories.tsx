import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { SiteHeader } from './SiteHeader'

const NAV = [
  { label: 'Home', href: '/', current: true },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Help', href: '/help' },
]

const meta = {
  title: 'Organisms/SiteHeader',
  component: SiteHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Marketing site chrome. Brand, 7-item nav, Sign In, primary CTA.\n\nA real `<header>` landmark ' +
          'with a `<nav>` inside — this one **is** the page banner, unlike `SectionHeader`, which is ' +
          'only a heading block and renders a plain div to avoid duplicate landmarks.\n\nBelow 834 the ' +
          'caller swaps the nav for a menu trigger; that is a page concern, not a header one.',
      },
    },
  },
  args: {
    nav: NAV,
    signIn: { label: 'Sign in', href: '/sign-in' },
    cta: { label: 'Get started', href: '/sign-up' },
  },
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OnPricing: Story = {
  args: {
    nav: NAV.map((n) => ({ ...n, current: n.href === '/pricing' })),
  },
}

/** One banner, one navigation, and the current page is marked. */
export const LandmarksAreCorrect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('banner')).toBeInTheDocument()
    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    const current = canvas.getByRole('link', { name: 'Home' })
    await expect(current).toHaveAttribute('aria-current', 'page')
  },
}

/*
 * No side-by-side story here.
 *
 * SiteHeader renders a `banner` landmark, so rendering it twice for a mode
 * comparison creates two banners and fails axe's landmark-unique — a defect in
 * the comparison, not in the component. Use the Theme toolbar to switch modes
 * on any of the stories above instead.
 */
