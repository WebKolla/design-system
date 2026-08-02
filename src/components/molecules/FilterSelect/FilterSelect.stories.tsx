import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { FilterSelect } from './FilterSelect'

const meta = {
  title: 'Molecules/FilterSelect',
  component: FilterSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Toolbar filter. Default shows a chevron and opens a menu; Active shows the chosen value with ' +
          'an x that clears it, on `primary-soft`.\n\n**That swap matters**: an applied filter that looks ' +
          'identical to an unapplied one is how people conclude the list is broken. The clear affordance ' +
          'sits on the chip itself, not in a separate "reset filters" link.\n\nSet `label` to the chosen ' +
          'value when active — "Northgate Rail", not "Project".',
      },
    },
  },
  args: { label: 'Project' },
} satisfies Meta<typeof FilterSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Active: Story = { args: { label: 'Northgate Rail', active: true } }

/** A toolbar as it actually appears — applied filters are unmistakable. */
export const Toolbar: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect {...args} label="Northgate Rail" active />
      <FilterSelect {...args} label="Overdue" active />
      <FilterSelect {...args} label="Consultant" />
      <FilterSelect {...args} label="Period" />
    </div>
  ),
}

/** The clear affordance must be reachable and separately named. */
export const ClearIsLabelled: Story = {
  args: { label: 'Northgate Rail', active: true, onClear: fn() },
  play: async ({ canvasElement, args }) => {
    const clear = within(canvasElement).getByRole('button', {
      name: 'Clear Northgate Rail filter',
    })
    await userEvent.click(clear)
    await expect(args.onClear).toHaveBeenCalled()
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex max-w-[320px] flex-wrap items-center gap-2">
      <FilterSelect
        {...args}
        label="Pemberton Clarke — programme delivery"
        active
      />
      <FilterSelect {...args} label="VAT" />
    </div>
  ),
}
