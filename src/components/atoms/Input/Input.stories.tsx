import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ChevronDown } from 'lucide-react'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          '**Does not exist in Figma.** Extracted from the `Box` sub-frame of `Field` (37:42) so ' +
          'dependent components have a bare control to compose with. `Field` adds the label, helper ' +
          'and error around it.\n\n38px tall on `radius/button`. Focus carries a 3px `color/ring` ' +
          'spread **plus** a primary border — per the Figma description, the ring alone measured ' +
          '1.25:1 and failed WCAG 1.4.11, which is why the border colour changes too.\n\n' +
          'Mobile should raise the box to 44px minimum — that is the parent’s call, not this ' +
          'component’s, since a component never sets its own external size.',
      },
    },
  },
  args: { placeholder: 'Placeholder', 'aria-label': 'Project name' },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input {...args} />
      <Input {...args} defaultValue="Northgate Advisory" />
      <Input {...args} defaultValue="Northgate Advisory" invalid />
      <Input {...args} defaultValue="Northgate Advisory" disabled />
    </div>
  ),
}

/** Prefix is mono because the value beside it is. */
export const MoneyAndSelect: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input
        {...args}
        prefix="£"
        defaultValue="650.00"
        aria-label="Day rate"
        inputMode="decimal"
      />
      <Input
        {...args}
        trailingIcon={ChevronDown}
        defaultValue="Programme delivery"
        aria-label="Project"
        readOnly
      />
    </div>
  ),
}

/** Focus must produce a visible border change, not just the soft ring. */
export const FocusChangesBorder: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await userEvent.click(input)
    await expect(input).toHaveFocus()
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Input
        {...args}
        defaultValue="Pemberton Clarke — programme delivery, week ending 1 August 2026"
      />
      <Input {...args} defaultValue="" placeholder="" aria-label="Empty" />
    </div>
  ),
}
