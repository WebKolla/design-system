import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Check, Clock, FileText, TriangleAlert } from 'lucide-react'
import { Icon, ICON_SIZES } from './Icon'

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          'Thin wrapper over `lucide-react`. The Figma icon set is lucide and layer names map 1:1 ' +
          '(`icon/arrow-right` → `ArrowRight`), so icons are never exported from Figma as SVG. ' +
          'Stroke width defaults to 1.75 rather than lucide’s 2, and colour always inherits from the parent.',
      },
    },
  },
  args: { icon: ArrowRight, size: 'md' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      {(Object.keys(ICON_SIZES) as Array<keyof typeof ICON_SIZES>).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon {...args} size={size} />
          <span className="text-xs">
            {size} · {ICON_SIZES[size]}px
          </span>
        </div>
      ))}
    </div>
  ),
}

/** Colour is inherited, never set per instance — proved by recolouring the parent only. */
export const InheritsColour: Story = {
  render: (args) => (
    <div className="flex gap-6">
      <span className="text-primary flex items-center gap-2">
        <Icon {...args} icon={Check} />
        Inherits primary
      </span>
      <span className="flex items-center gap-2 opacity-60">
        <Icon {...args} icon={Clock} />
        Inherits muted
      </span>
    </div>
  ),
}

/** A labelled icon is exposed to assistive tech; a decorative one is hidden. */
export const Labelled: Story = {
  args: { icon: TriangleAlert, label: 'Overdue' },
}

export const Gallery: Story = {
  render: (args) => (
    <div className="flex gap-4">
      {[ArrowRight, Check, Clock, FileText, TriangleAlert].map((glyph, i) => (
        <Icon key={i} {...args} icon={glyph} />
      ))}
    </div>
  ),
}
