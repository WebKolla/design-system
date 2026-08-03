import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ChevronDown } from 'lucide-react'
import { Textarea } from '@/components/atoms/Textarea/Textarea'
import { Field, type FieldWithInputProps } from './Field'

const meta = {
  title: 'Molecules/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'One field for text, select, money and anything multi-line. Turn on a trailing chevron for a select; add a prefix ' +
          'for a currency field (the prefix is mono, because the value beside it is).\n\n38px tall on ' +
          '`radius/button`. Focused carries a 3px `color/ring` spread **plus** a primary border — the ' +
          'ring alone measured 1.25:1 and failed WCAG 1.4.11, which is why the border colour changes ' +
          'too.\n\n**Error shows the helper automatically and states what to do**, never just that ' +
          'something is wrong. Mobile: raise the box to 44px minimum.\n\n**Pass `control` for anything ' +
          'the built-in `Input` is not** — a `Textarea` above all. The label, the message and the ' +
          '`aria-describedby`/`aria-invalid` wiring stay here either way; the control never wires ' +
          'its own.',
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
  /**
   * `FieldWithInputProps` rather than `typeof Field`: the component's props are
   * a union now (it renders an `Input`, or it clones the `control` it is
   * given), and Storybook cannot infer args from a union — it collapses to
   * `never`. These args are the input side, which is what every story below
   * except `WrappingATextarea` uses.
   */
} satisfies Meta<FieldWithInputProps>

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

/**
 * The same field around a `Textarea`. The label, the message and the wiring are
 * `Field`'s; only the control changed.
 */
export const WrappingATextarea: Story = {
  args: { label: 'Reason' },
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Field
        label={args.label}
        helper="Say what needs changing. Callum is told immediately and can resubmit."
        control={<Textarea placeholder="Say what needs changing." />}
      />
      <Field
        label="Rejection reason"
        error="Say what needs changing, not just that something is wrong."
        control={<Textarea rows={3} defaultValue="No." />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const helped = canvas.getByLabelText('Reason')
    await expect(helped.tagName).toBe('TEXTAREA')
    await expect(helped).toHaveAccessibleDescription(
      'Say what needs changing. Callum is told immediately and can resubmit.',
    )
    await expect(helped).not.toHaveAttribute('aria-invalid')

    // The error marks the *control*, whichever control it is.
    const rejected = canvas.getByLabelText('Rejection reason')
    await expect(rejected.tagName).toBe('TEXTAREA')
    await expect(rejected).toHaveAttribute('aria-invalid', 'true')
    await expect(rejected).toHaveAccessibleDescription(
      'Say what needs changing, not just that something is wrong.',
    )
  },
}

/**
 * Proof, from inside the browser run, that the Tailwind utilities were actually
 * generated — the same guard `Atoms/Card → IsActuallyStyled` puts on `Card`.
 *
 * Without `tailwindcss()` in `vitest.config.ts` the tokens still load and not
 * one utility class does, so every story mounts unstyled and axe's
 * colour-contrast rule measures browser defaults instead of this design system.
 * A contrast pass in that state means nothing. These are values that can only
 * come from generated utilities resolving real tokens.
 */
export const IsActuallyStyled: Story = {
  args: { label: 'Reason' },
  render: (args) => (
    <div className="flex flex-col gap-5">
      <Field
        label={args.label}
        helper="Say what needs changing."
        control={<Textarea defaultValue="Scope changed mid-week." />}
      />
      <Field
        label="Rejection reason"
        error="Say what needs changing, not just that something is wrong."
        control={<Textarea defaultValue="No." />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = getComputedStyle(document.documentElement)

    // The tokens are loaded — necessary, and on its own not sufficient.
    await expect(root.getPropertyValue('--radius-button').trim()).toBe('8px')
    await expect(root.getPropertyValue('--color-danger').trim()).not.toBe('')

    // rounded-button, px-3 py-2, border — utilities, not browser defaults.
    const control = getComputedStyle(canvas.getByLabelText('Reason'))
    await expect(control.borderRadius).toBe('8px')
    await expect(control.padding).toBe('8px 12px')
    await expect(control.borderBottomWidth).toBe('1px')
    await expect(control.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    // border-danger resolved to something other than border-input, so the
    // error styling is real and not two identically unstyled boxes.
    const errored = getComputedStyle(canvas.getByLabelText('Rejection reason'))
    await expect(errored.borderBottomColor).not.toBe(control.borderBottomColor)

    // text-ui-sm on the label, text-body-caption on the message.
    const label = getComputedStyle(canvasElement.querySelectorAll('label')[0]!)
    await expect(label.fontSize).toBe('12.5px')
    await expect(label.fontWeight).toBe('500')

    const message = getComputedStyle(canvas.getByText('Say what needs changing.'))
    await expect(message.fontSize).toBe('12.5px')
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
