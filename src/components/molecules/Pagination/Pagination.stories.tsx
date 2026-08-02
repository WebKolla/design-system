import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Pagination } from './Pagination'

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Desktop pagination for list screens. The range text is on the left because "how many are ' +
          'there" is asked more often than "take me to page 3".\n\n**Mobile replaces this entirely** ' +
          'with infinite scroll under a count header — do not shrink these 28px targets to fit a phone.',
      },
    },
  },
  args: { page: 1, pageCount: 5, range: 'Showing 1–10 of 47' },
  decorators: [
    (Story) => (
      <div className="bg-surface border-border w-[720px] rounded-card border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MidRange: Story = {
  args: { page: 3, range: 'Showing 21–30 of 47' },
}

export const LastPage: Story = {
  args: { page: 5, range: 'Showing 41–47 of 47' },
}

/** A single page still renders, with both arrows disabled. */
export const SinglePage: Story = {
  args: { page: 1, pageCount: 1, range: 'Showing 1–4 of 4' },
}

/** Every control needs a distinct accessible name, not just a glyph. */
export const ControlsAreNamed: Story = {
  args: { page: 2, range: 'Showing 11–20 of 47', onPageChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeEnabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Page 4' }))
    await expect(args.onPageChange).toHaveBeenCalledWith(4)
  },
}
