import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { InvoicesList } from './InvoicesList'

const meta = {
  title: 'Pages/1d · Invoices list',
  component: InvoicesList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `44:2` (desktop) / `48:290` (mobile).\n\n**Designed on the 52px rail even at 1440** — a ' +
          'nine-column table wants the horizontal space more than the sidebar wants to be legible, so ' +
          '`AppShell` is asked for `collapsed`.\n\nBelow 768 the rows become `ListCardInvoiceMobile` and ' +
          'the status tabs become a scrollable chip row, because an underline on a half-off-screen tab ' +
          'reads as a rendering fault.',
      },
    },
  },
} satisfies Meta<typeof InvoicesList>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/** One table, nine columns, and the overdue row carries both signals. */
export const StructureIsSound: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('table', { name: 'Invoices' })).toBeInTheDocument()
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(9)
    // Overdue: the pill and the recoloured due date both appear.
    await expect(canvas.getAllByText('Overdue').length).toBeGreaterThan(0)
    await expect(canvas.getByText('04 Jul 26')).toBeInTheDocument()
  },
}
