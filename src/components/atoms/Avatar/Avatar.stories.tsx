import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, type AvatarSize } from './Avatar'

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
          'Initials only. TimeSubmit stores no profile photographs, so an image avatar would always be ' +
          'a placeholder.\n\nSizes are fixed to their use: 20 inline in a table cell, 26 in a topbar or ' +
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
