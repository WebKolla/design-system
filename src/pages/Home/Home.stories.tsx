import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home } from './Home'

const meta = {
  title: 'Pages/2a · Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `101:2` (desktop) / `101:558` (mobile).\n\nThe longest page in the set. Every band is a `Section`, so vertical rhythm lives in one place and no component carries external margin.\n\nTwo §8 traps are handled deliberately: the pricing preview grid must not clip, because the Recommended badge overhangs its card at -10px; and the rate-blind band is an ink surface where every colour comes from `ink/*`.',
      },
    },
  },
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
