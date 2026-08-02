import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { SectionHeader } from './SectionHeader'

const meta = {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  parameters: {
    docs: {
      description: {
        component:
          'Marketing section heading block. Optional overline eyebrow, section heading, optional ' +
          'supporting paragraph. Centre for home and pricing, Left for pillar pages.\n\n' +
          '**Max-width, not fixed width.** Centre is `max-width: 840px`, Left `max-width: 1000px`, both ' +
          'on `width: 100%`. A fixed width overflows at 390 — that mistake broke the CTA band and seven ' +
          'Section header instances during the Figma build.\n\nThe eyebrow is uppercased in CSS. Figma ' +
          'stores literal capitals only because setting `textCase` there detaches the style.',
      },
    },
  },
  args: {
    heading: 'Built for the way consultancies actually work',
    description:
      'Consultants submit their hours. Approvers sign them off without ever seeing what those hours bill at.',
  },
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Alignments: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <SectionHeader {...args} align="centre" eyebrow="Built for consultancies" />
      <SectionHeader {...args} align="left" eyebrow="Built for consultancies" />
    </div>
  ),
}

export const HeadingOnly: Story = {
  render: ({ heading }) => <SectionHeader heading={heading} />,
}

/**
 * The regression this component exists to prevent: at 390 the block must
 * reflow, not overflow.
 */
export const AtMobileWidth: Story = {
  decorators: [
    (Story) => (
      <div className="border-danger-border w-[390px] border border-dashed p-4">
        <Story />
      </div>
    ),
  ],
  args: { eyebrow: 'Built for consultancies' },
  play: async ({ canvasElement }) => {
    const block = canvasElement.querySelector('h2')?.parentElement as HTMLElement
    const parent = block.parentElement as HTMLElement
    // Relative comparison only — absolute pixel values are unreliable here.
    await expect(block.scrollWidth).toBeLessThanOrEqual(parent.clientWidth)
  },
}

export const EdgeContent: Story = {
  args: {
    eyebrow: 'Approver workflows, rate blindness and purchase order reconciliation',
    heading:
      'Approvers sign off hours without ever seeing a rate, a day rate or an invoice value',
    description:
      'That is a product guarantee rather than a preference: no rate, amount or invoice total may be rendered in an approver-scoped view, on any screen, at any breakpoint.',
  },
}
