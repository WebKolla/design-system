import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ApproverQueue } from './ApproverQueue'

const meta = {
  title: 'Pages/1c · Approver queue',
  component: ApproverQueue,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `51:50` (desktop) / `54:238` (mobile).\n\n**Top-nav chrome, not the admin sidebar** — ' +
          'an approver has three destinations and the queue wants the full width.\n\nThe rate-blind ' +
          'Banner is the reason this screen is trusted, which is why it has no dismiss control. Below ' +
          '768 the rows become cards with full-width Approve and Reject.',
      },
    },
  },
} satisfies Meta<typeof ApproverQueue>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/**
 * The product guarantee, asserted at page level: no rate, amount or invoice
 * value may render anywhere in an approver-scoped view.
 */
export const ShowsNoMoney: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.textContent ?? '').not.toMatch(/[£$€]/)
  },
}

/** The rate-blind banner must be present and undismissable. */
export const BannerIsUndismissable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('You are approving hours, not money'),
    ).toBeInTheDocument()
    const close = canvas.queryByRole('button', { name: /close|dismiss/i })
    await expect(close).toBeNull()
  },
}
