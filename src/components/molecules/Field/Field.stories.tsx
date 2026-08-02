import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ChevronDown } from 'lucide-react'
import { Field } from './Field'

const meta = {
  title: 'Molecules/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'One field for text, select and money. Turn on a trailing chevron for a select; add a prefix ' +
          'for a currency field (the prefix is mono, because the value beside it is).\n\n38px tall on ' +
          '`radius/button`. Focused carries a 3px `color/ring` spread **plus** a primary border — the ' +
          'ring alone measured 1.25:1 and failed WCAG 1.4.11, which is why the border colour changes ' +
          'too.\n\n**Error shows the helper automatically and states what to do**, never just that ' +
          'something is wrong. Mobile: raise the box to 44px minimum.',
      },
    },
  },
  args: { label: 'Project', placeholder: 'Placeholder' },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Field {...args} label="Default" />
      <Field {...args} label="Filled" defaultValue="Northgate Advisory" />
      <Field
        {...args}
        label="With helper"
        helper="Shown on the invoice as the project reference."
      />
      <Field
        {...args}
        label="Error"
        defaultValue="0"
        error="Enter a day rate above £0, or mark the project non-billable."
      />
      <Field {...args} label="Disabled" defaultValue="Northgate Advisory" disabled />
    </div>
  ),
}

/** Money and select, the two shapes the field has to cover. */
export const MoneyAndSelect: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Field
        {...args}
        label="Day rate"
        prefix="£"
        defaultValue="650.00"
        inputMode="decimal"
      />
      <Field
        {...args}
        label="Project"
        trailingIcon={ChevronDown}
        defaultValue="Programme delivery"
        readOnly
      />
    </div>
  ),
}

/** The error message must be programmatically associated with the control. */
export const ErrorIsAnnounced: Story = {
  args: {
    label: 'Day rate',
    defaultValue: '0',
    error: 'Enter a day rate above £0, or mark the project non-billable.',
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Day rate')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription(
      'Enter a day rate above £0, or mark the project non-billable.',
    )
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Field
        {...args}
        label="Purchase order reference and cost centre mapping"
        helper="Pemberton Clarke require both on every invoice line, or it is rejected by their AP system."
      />
      <Field {...args} label="VAT" hideLabel placeholder="Search projects" />
    </div>
  ),
}
