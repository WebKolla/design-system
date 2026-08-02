import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { FaqAccordionRow } from '@/components/molecules/FaqAccordionRow/FaqAccordionRow'
import { AccordionGroup } from './AccordionGroup'

const FAQS = [
  {
    value: 'install',
    question: 'Do I need to install any software?',
    answer:
      'TimeSubmit runs entirely in the browser. There is nothing to install, and nothing for your IT team to approve.',
    summary: 'No, it runs in the browser',
  },
  {
    value: 'approvers',
    question: 'Can approvers see what the hours bill at?',
    answer:
      'No. Rates, day rates and invoice values are hidden from every approver-scoped view. That is a product guarantee, not a setting.',
    summary: 'No, never',
  },
  {
    value: 'export',
    question: 'Can I export to my accounting system?',
    answer:
      'Approved time exports as CSV, and invoices can be pushed to Xero or QuickBooks.',
    summary: 'CSV, Xero and QuickBooks',
  },
]

const meta = {
  title: 'Organisms/AccordionGroup',
  component: AccordionGroup,
  parameters: {
    docs: {
      description: {
        component:
          '**Does not exist as a Figma component** — composed from `FaqAccordionRow`.\n\nSupplies the ' +
          'bordered 12-radius container and the Radix `Accordion.Root` the rows are items of. Keyboard ' +
          'handling, roving focus and ARIA come from Radix.\n\nThe last row’s divider is suppressed by ' +
          'passing `last` rather than by a `:last-child` selector — a row may be conditionally ' +
          'rendered, and `:last-child` would then draw a divider under whichever row happened to be ' +
          'last in the DOM.',
      },
    },
  },
  args: { defaultValue: 'install', children: null },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <AccordionGroup {...args}>
      {FAQS.map((f, i) => (
        <FaqAccordionRow
          key={f.value}
          value={f.value}
          question={f.question}
          answer={f.answer}
          summary={f.summary}
          last={i === FAQS.length - 1}
        />
      ))}
    </AccordionGroup>
  ),
} satisfies Meta<typeof AccordionGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllClosed: Story = { args: { defaultValue: undefined } }

export const Multiple: Story = { args: { type: 'multiple' } }

/** Single mode closes the previous row — Radix behaviour, asserted. */
export const OpeningOneClosesTheOther: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('button', { name: /install any software/ })
    const second = canvas.getByRole('button', { name: /bill at/ })

    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(second)
    await expect(second).toHaveAttribute('aria-expanded', 'true')
    await expect(first).toHaveAttribute('aria-expanded', 'false')
  },
}
