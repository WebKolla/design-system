import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonInk } from './ButtonInk'

/** Ink surfaces are mode-invariant, so every story sits on a real ink panel. */
const OnInk = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-ink rounded-panel flex flex-wrap items-center gap-4 p-8">
    {children}
  </div>
)

const meta = {
  title: 'Atoms/ButtonInk',
  component: ButtonInk,
  parameters: {
    docs: {
      description: {
        component:
          'Buttons for use on `color/ink` surfaces (dark CTA bands). Deliberately narrow: Large only, ' +
          'fixed trailing arrow-right, no icon swap — exposing a swap would discard the icon’s ink ' +
          'colour bindings. If a different icon is needed on ink, add a variant here rather than ' +
          'swapping.\n\nInk is mode-invariant, so these render identically in light and dark.',
      },
    },
  },
  args: { children: 'Get started' },
  render: (args) => (
    <OnInk>
      <ButtonInk {...args} />
    </OnInk>
  ),
} satisfies Meta<typeof ButtonInk>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <OnInk>
      <ButtonInk {...args} variant="primary">
        Get started
      </ButtonInk>
      <ButtonInk {...args} variant="secondary">
        Book a walkthrough
      </ButtonInk>
    </OnInk>
  ),
}

export const States: Story = {
  render: (args) => (
    <OnInk>
      <ButtonInk {...args}>Rest</ButtonInk>
      <ButtonInk {...args} showIcon={false}>
        No icon
      </ButtonInk>
      <ButtonInk {...args} disabled>
        Disabled
      </ButtonInk>
    </OnInk>
  ),
}

/** Longest realistic label — must not clip or wrap mid-word. */
export const EdgeContent: Story = {
  render: (args) => (
    <OnInk>
      <ButtonInk {...args}>
        Start your consultancy trial — no card required
      </ButtonInk>
      <ButtonInk {...args} variant="secondary" showIcon={false}>
        OK
      </ButtonInk>
    </OnInk>
  ),
}
