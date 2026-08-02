import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ListCardInvoiceMobile } from './ListCardInvoiceMobile'

const meta = {
  title: 'Molecules/ListCardInvoiceMobile',
  component: ListCardInvoiceMobile,
  parameters: {
    docs: {
      description: {
        component:
          'The desktop table row below 768. Nine columns will not fit on a phone, and shrinking them ' +
          'produces a row nobody can read, so **the row becomes a card and the columns become a ' +
          'hierarchy**.\n\nWhat survives: invoice number, status, client, amount. What moves into the ' +
          'meta line: consultant and the due date. What disappears: issued date and the row checkbox — ' +
          'bulk selection is a desktop task.\n\nThe amount stays mono and right-aligned so a scrolled ' +
          'column of cards still lines up its decimal points.',
      },
    },
  },
  args: {
    invoice: 'INV-0231',
    client: 'Halbrook Energy',
    meta: 'Priya Nair · due 15 Jul 26',
    amount: '£11,400.00',
    status: { label: 'Sent', tone: 'info' },
  },
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListCardInvoiceMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Overdue recolours the meta line as well as swapping the pill. */
export const Overdue: Story = {
  args: {
    invoice: 'INV-0234',
    client: 'Pemberton Clarke',
    meta: 'Callum Byrne · due 04 Jul 26',
    amount: '£18,240.00',
    status: { label: 'Overdue', tone: 'danger' },
    overdue: true,
  },
}

/** A scrolled column: decimal points still line up down the right edge. */
export const List: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2.5">
      <ListCardInvoiceMobile {...args} />
      <ListCardInvoiceMobile
        {...args}
        invoice="INV-0232"
        client="Northgate Rail"
        meta="Callum Byrne · due 16 Jul 26"
        amount="£8,120.50"
      />
      <ListCardInvoiceMobile
        {...args}
        invoice="INV-0233"
        client="Ashworth Digital"
        meta="Iona Macpherson · due 20 Jul 26"
        amount="£128.00"
        status={{ label: 'Draft', tone: 'neutral' }}
      />
    </div>
  ),
}

/** The checkbox is a desktop-only affordance and must not appear here. */
export const HasNoCheckbox: Story = {
  play: async ({ canvasElement }) => {
    const boxes = within(canvasElement).queryAllByRole('checkbox')
    await expect(boxes).toHaveLength(0)
  },
}

export const EdgeContent: Story = {
  args: {
    client: 'Pemberton Clarke Consulting Group (Northern Division)',
    meta: 'Iona Macpherson-Whitfield · due 04 Jul 26',
    amount: '£1,284,900.00',
    status: { label: 'Part paid', tone: 'warn' },
  },
}
