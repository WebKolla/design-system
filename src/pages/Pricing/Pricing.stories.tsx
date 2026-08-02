import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pricing } from './Pricing'

const meta = {
  title: 'Pages/2c · Pricing',
  component: Pricing,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `100:2` (desktop) / `100:438` (mobile).\n\nThe four-up tier grid on the widened 1280 container. **The grid must not clip**: the Recommended badge overhangs its card at -10px, and a wrapper with `overflow: hidden` for rounded corners would eat it.',
      },
    },
  },
} satisfies Meta<typeof Pricing>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
