import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { Avatar, type AvatarSize } from './Avatar'
import { PORTRAIT } from './Avatar.fixtures'

const SIZES: Array<{ size: AvatarSize; use: string }> = [
  { size: 20, use: 'Inline in a table cell' },
  { size: 26, use: 'Topbar or list row' },
  { size: 34, use: 'Card header' },
  { size: 44, use: 'Record header' },
]

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'Initials, with an optional photograph over them.\n\nTimeSubmit stores no profile ' +
          'photographs of its own; the one place a real image appears is the account picture Clerk ' +
          'holds, on the approver profile screen. So the image is the exception and the initials are ' +
          'the component — which is why `initials` stays required and a failed load silently reverts ' +
          'to them rather than showing a broken-image glyph in a 20px circle.\n\nSizes are fixed to their use: 20 inline in a table cell, 26 in a topbar or ' +
          'list row, 34 in a card header, 44 on a record header. **44 alone is a rounded square on ' +
          '`radius/panel` rather than a circle** — at that size a circle reads as a social profile ' +
          'picture, and this is a record, not a person page.\n\nTone `primary` is reserved for the ' +
          'signed-in user and the record subject.',
      },
    },
  },
  args: { initials: 'CB', label: 'Chidi Balogun' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Matrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {SIZES.map(({ size, use }) => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-mono-cell text-subtle-foreground w-8">
            {size}
          </span>
          <Avatar {...args} size={size} tone="neutral" />
          <Avatar {...args} size={size} tone="primary" initials="RA" />
          <span className="text-body-caption text-subtle-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
}

/** In context: 20 sits inline against 13px cell text without shifting the row. */
export const InTableCell: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Avatar {...args} size={20} />
      <span className="text-body-cell">Chidi Balogun</span>
    </div>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} initials="A" label="Ada" />
      <Avatar {...args} initials="MACPHERSON" label="Iona Macpherson" />
      <Avatar {...args} initials="ø" label="Øyvind Nilsen" />
    </div>
  ),
}

/**
 * With a photograph. `initials` is still required, because a signed URL that
 * has expired and a user who has never uploaded one both land back on it.
 */
export const WithImage: Story = {
  args: { src: PORTRAIT },
  render: (args) => (
    <div className="flex items-center gap-4">
      {SIZES.map(({ size }) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

/** A broken image reverts to the initials rather than a broken-image glyph. */
export const FallsBackWhenTheImageFails: Story = {
  args: { src: 'https://example.invalid/not-a-photograph.png', size: 34 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(async () => {
      await expect(canvas.getByText('CB')).toBeInTheDocument()
    })
    // The <img> is gone entirely, rather than left showing a broken glyph.
    await expect(canvasElement.querySelector('img')).toBeNull()
  },
}
