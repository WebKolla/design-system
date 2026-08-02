import type { Meta, StoryObj } from '@storybook/react-vite'
import { Faq } from './Faq'

const meta = {
  title: 'Pages/2e · FAQ',
  component: Faq,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `96:2` (desktop) / `96:287` (mobile).\n\nFour grouped accordions. Every closed row carries a one-line summary, which is what makes a page of thirty questions scannable: the dealbreakers answer themselves without a single click.',
      },
    },
  },
} satisfies Meta<typeof Faq>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
