import type { Meta, StoryObj } from '@storybook/react-vite'
import { SignIn } from './SignIn'

const meta = {
  title: 'Pages/2g · Sign in',
  component: SignIn,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `94:2` (desktop) / `94:68` (mobile).\n\nTwo panels, no site chrome. The ink panel is one of the three places `ink/*` is used, so every colour on it comes from that mode-invariant set.\n\nBelow 834 the ink panel is dropped rather than stacked: on a phone it would push the form below the fold, and the form is the entire purpose of the page.',
      },
    },
  },
} satisfies Meta<typeof SignIn>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
