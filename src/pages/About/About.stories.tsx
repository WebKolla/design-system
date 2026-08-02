import type { Meta, StoryObj } from '@storybook/react-vite'
import { About } from './About'

const meta = {
  title: 'Pages/2d · About',
  component: About,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `97:2` (desktop) / `97:209` (mobile).\n\nStat cells over the hero photography, then story, mission and values. The `StatCell`s are positioned by the page with the 20px inset — the component sets no offset of its own.',
      },
    },
  },
} satisfies Meta<typeof About>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
