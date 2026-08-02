import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import * as React from 'react'
import { Toggle } from './Toggle'

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    /**
     * The disabled row's label is faded by hand so the story shows what a
     * disabled control looks like. WCAG 1.4.3 exempts inactive controls, but
     * axe cannot tell that a `<span>` belongs to a disabled `<input>` — so the
     * one node is excluded rather than the rule switched off for the file.
     */
    a11y: { context: { exclude: [['[data-a11y-exempt]']] } },
    docs: {
      description: {
        component:
          'Binary setting that applies immediately — no Save. If the change needs confirming, use a ' +
          'Checkbox inside a form instead.\n\n34×20 track, 16px knob. The knob keeps a hairline shadow ' +
          'so it stays visible against the Off track, which is only one step darker than the surface.',
      },
    },
  },
  args: { 'aria-label': 'Email me when a timesheet is submitted' },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {(
        [
          [false, 'Off'],
          [true, 'On'],
        ] as const
      ).map(([checked, label]) => (
        <span key={label} className="flex items-center gap-2">
          <Toggle {...args} checked={checked} aria-label={label} />
          <span className="text-body-caption">{label}</span>
        </span>
      ))}
      <span className="flex items-center gap-2">
        <Toggle {...args} disabled aria-label="Disabled off" />
        <span data-a11y-exempt className="text-body-caption opacity-50">Disabled</span>
      </span>
      <span className="flex items-center gap-2">
        <Toggle {...args} disabled checked aria-label="Disabled on" />
        <span data-a11y-exempt className="text-body-caption opacity-50">Disabled on</span>
      </span>
    </div>
  ),
}

/** In a settings row: the label is the affordance, so the toggle is unlabelled. */
export const InSettingsRow: Story = {
  render: function Render(args) {
    const [on, setOn] = React.useState(true)
    const id = React.useId()
    return (
      <div className="border-border bg-surface flex max-w-[420px] items-center justify-between gap-6 rounded-card border p-4">
        <label htmlFor={id} className="text-body">
          Email me when a timesheet is submitted
          <span className="text-body-caption text-subtle-foreground block">
            Applies immediately.
          </span>
        </label>
        <Toggle {...args} id={id} checked={on} onCheckedChange={setOn} aria-label="" />
      </div>
    )
  },
}

export const KeyboardToggles: Story = {
  render: function Render(args) {
    const [on, setOn] = React.useState(false)
    return <Toggle {...args} checked={on} onCheckedChange={setOn} />
  },
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch')
    await expect(sw).not.toBeChecked()
    await userEvent.tab()
    await userEvent.keyboard(' ')
    await expect(sw).toBeChecked()
  },
}
