import type { Meta, StoryObj } from '@storybook/react-vite'
import { Contact } from './Contact'

const meta = {
  title: 'Pages/2f · Contact',
  component: Contact,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `95:2` (desktop) / `95:111` (mobile).\n\nTwo columns: the form, and how else to reach us. No footer on this screen — the contact details are the footer’s job and repeating them below would be the same information twice.',
      },
    },
  },
} satisfies Meta<typeof Contact>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
