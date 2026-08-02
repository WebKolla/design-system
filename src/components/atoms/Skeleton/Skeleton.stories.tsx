import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Card } from '../Card/Card'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'The shape of what is arriving, in `--color-control`.\n\n**Never a spinner inside a page.** A ' +
          'spinner says "something is happening"; a skeleton says "here is what is arriving", and it ' +
          'holds the layout so nothing jumps when the data lands.\n\nMatch the real layout\'s shape and ' +
          'row count. Twelve skeleton rows for a table that returns twelve. A single grey rectangle ' +
          'standing in for a whole screen is a spinner with square corners.\n\nThe pulse is ' +
          '`animate-pulse`, which the token layer\'s `prefers-reduced-motion` reset already neutralises.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Skeleton shape="text" label="Loading the project name" />
      <Skeleton shape="text" lines={3} label="Loading the description" />
      <Skeleton shape="block" label="Loading the filter" />
      <Skeleton shape="circle" label={null} />
    </div>
  ),
}

/**
 * A KPI tile arriving. The bars are the size of what replaces them, so the card
 * does not resize when the figures land.
 */
export const InContext: Story = {
  render: () => (
    <Card className="flex flex-col gap-2.5">
      <Skeleton shape="text" label="Loading unbilled hours" className="w-24" />
      <Skeleton shape="text" label={null} className="h-7 w-32" />
      <Skeleton shape="text" label={null} className="w-40" />
    </Card>
  ),
}

/** Twelve rows, because the table returns twelve. */
export const TableRows: Story = {
  render: () => (
    <Card padding="none" clip className="flex flex-col">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="border-hairline flex h-[42px] items-center gap-3 border-b px-2.5">
          <Skeleton shape="text" label={i === 0 ? 'Loading invoices' : null} className="w-24" />
          <Skeleton shape="text" label={null} className="w-40" />
          <Skeleton shape="text" label={null} className="w-16" />
        </div>
      ))}
    </Card>
  ),
}

/**
 * One announcement, not twelve.
 *
 * The first skeleton in a group carries the label; the rest pass `label={null}`
 * and are hidden, so a table of skeleton rows says "loading invoices" once
 * rather than reading a wall of nothing.
 */
export const AnnouncesItselfOnce: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton label="Loading invoices" />
      <Skeleton label={null} />
      <Skeleton label={null} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const statuses = canvas.getAllByRole('status')
    await expect(statuses).toHaveLength(1)
    await expect(canvas.getByText('Loading invoices')).toBeInTheDocument()
  },
}
