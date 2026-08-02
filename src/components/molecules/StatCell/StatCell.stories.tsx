import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatCell } from './StatCell'

const meta = {
  title: 'Molecules/StatCell',
  component: StatCell,
  parameters: {
    docs: {
      description: {
        component:
          'Floating stat card that overlays pillar-page hero photography. Hugs its content; the page ' +
          'positions it absolutely over the image with a 20px inset.\n\nThe inset is the page’s job — ' +
          'this component sets no external offset of its own, per the rule that spacing between ' +
          'components belongs to the parent.',
      },
    },
  },
  args: { value: 'Rates', label: 'hidden from approvers' },
} satisfies Meta<typeof StatCell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variations: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      <StatCell {...args} />
      <StatCell {...args} value="4 days" label="average approval time" />
      <StatCell {...args} value="£1.2m" label="invoiced last quarter" />
    </div>
  ),
}

/**
 * Over photography, which is the only place it appears. The 20px inset comes
 * from this wrapper, not from the component.
 */
export const OverPhotography: Story = {
  render: (args) => (
    <div className="relative h-[280px] w-[520px] overflow-hidden rounded-panel">
      <div
        aria-hidden
        className="from-ink to-ink-raised absolute inset-0 bg-gradient-to-br"
      />
      <div className="absolute bottom-5 left-5">
        <StatCell {...args} />
      </div>
    </div>
  ),
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex max-w-[260px] flex-wrap items-start gap-4">
      <StatCell
        {...args}
        value="No commercial judgement"
        label="approvers see hours only, never rates or invoice values"
      />
    </div>
  ),
}
