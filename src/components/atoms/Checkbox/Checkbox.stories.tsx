import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import * as React from 'react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
          '14px box on a 3px radius — deliberately off the radius scale, because `radius/pip` (5) on a ' +
          '14px square reads as a circle and a circle means radio.\n\nIndeterminate is a bar, not a dash ' +
          'glyph, and exists for the table select-all header cell when only some rows are selected.\n\n' +
          '**The box is 14px but the hit area is not**: wrap it in a 44px target on mobile, and in a ' +
          '34px cell on desktop tables. This component adds no external padding of its own.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { 'aria-label': 'Select row' } }

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(
        [
          [false, 'Unchecked'],
          [true, 'Checked'],
          ['indeterminate', 'Indeterminate'],
        ] as const
      ).map(([checked, label]) => (
        <label key={label} className="flex items-center gap-2">
          <Checkbox checked={checked} aria-label={label} />
          <span className="text-body-caption">{label}</span>
        </label>
      ))}
      <label className="flex items-center gap-2">
        <Checkbox disabled aria-label="Disabled" />
        <span data-a11y-exempt className="text-body-caption opacity-50">Disabled</span>
      </label>
    </div>
  ),
}

/** The required hit area, shown rather than described. */
export const HitArea: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <span className="border-danger-border flex size-[34px] items-center justify-center rounded-control border border-dashed">
          <Checkbox aria-label="Desktop table cell" />
        </span>
        <span className="text-body-micro text-subtle-foreground">34 · desktop</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="border-danger-border flex size-11 items-center justify-center rounded-control border border-dashed">
          <Checkbox aria-label="Mobile target" />
        </span>
        <span className="text-body-micro text-subtle-foreground">44 · mobile</span>
      </div>
    </div>
  ),
}

/** Keyboard operation comes from Radix — Space toggles. */
export const KeyboardToggles: Story = {
  render: function Render() {
    const [checked, setChecked] = React.useState(false)
    return (
      <label className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
          aria-label="Approve all rows"
        />
        <span className="text-body-caption">
          Approve all rows — {checked ? 'checked' : 'unchecked'}
        </span>
      </label>
    )
  },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox')
    await expect(box).not.toBeChecked()
    await userEvent.tab()
    await userEvent.keyboard(' ')
    await expect(box).toBeChecked()
  },
}
