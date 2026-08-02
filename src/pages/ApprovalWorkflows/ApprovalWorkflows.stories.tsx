import type { Meta, StoryObj } from '@storybook/react-vite'
import { ApprovalWorkflows } from './ApprovalWorkflows'

const meta = {
  title: 'Pages/2b · Approval workflows',
  component: ApprovalWorkflows,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `99:2` (desktop) / `99:276` (mobile).\n\nPillar page. The secondary action on the closing band doubles as the next-page link, which is what that slot is for on pillar pages.',
      },
    },
  },
} satisfies Meta<typeof ApprovalWorkflows>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
