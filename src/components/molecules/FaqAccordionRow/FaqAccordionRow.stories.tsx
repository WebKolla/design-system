import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Accordion } from 'radix-ui'
import { FaqAccordionRow } from './FaqAccordionRow'

const meta = {
  title: 'Molecules/FaqAccordionRow',
  component: FaqAccordionRow,
  parameters: {
    docs: {
      description: {
        component:
          'FAQ row for marketing pages. 800 wide, sits inside a bordered 12-radius container. **The ' +
          'closed state can carry a one-line summary answer so dealbreakers are scannable** without ' +
          'opening every row. The divider hides on the last row.\n\nFigma has no `chevron-up`; its open ' +
          'state is a rotated `chevron-down`. In code that is exactly what happens — a CSS rotation on ' +
          'the same glyph — so no icon is missing.\n\nThe `Accordion.Root` and the bordered container ' +
          'come from `AccordionGroup`; this row is an `Accordion.Item`.',
      },
    },
  },
  args: {
    value: 'install',
    question: 'Do I need to install any software?',
    answer:
      'TimeSubmit runs entirely in the browser. There is nothing to install, and nothing for your IT team to approve.',
    summary: 'No, it runs in the browser',
  },
  decorators: [
    (Story) => (
      <div className="border-border w-[800px] overflow-hidden rounded-panel border">
        <Accordion.Root type="single" collapsible defaultValue="install">
          <Story />
        </Accordion.Root>
      </div>
    ),
  ],
} satisfies Meta<typeof FaqAccordionRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A group, with the divider suppressed on the last row. */
export const Group: Story = {
  render: (args) => (
    <>
      <FaqAccordionRow {...args} />
      <FaqAccordionRow
        {...args}
        value="approvers"
        question="Can approvers see what the hours bill at?"
        answer="No. Rates, day rates and invoice values are hidden from every approver-scoped view. That is a product guarantee, not a setting."
        summary="No, never"
      />
      <FaqAccordionRow
        {...args}
        value="export"
        question="Can I export to my accounting system?"
        answer="Approved time exports as CSV, and invoices can be pushed to Xero or QuickBooks."
        summary="CSV, Xero and QuickBooks"
        last
      />
    </>
  ),
}

/** The summary is a closed-state affordance and hides once the row opens. */
export const SummaryHidesWhenOpen: Story = {
  decorators: [
    (Story) => (
      <div className="border-border w-[800px] overflow-hidden rounded-panel border">
        <Accordion.Root type="single" collapsible>
          <Story />
        </Accordion.Root>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', {
      name: /Do I need to install any software/,
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const WithoutSummary: Story = {
  render: ({ value, question, answer }) => (
    <FaqAccordionRow value={value} question={question} answer={answer} last />
  ),
}

export const EdgeContent: Story = {
  args: {
    question:
      'What happens if a consultant submits a timesheet after the period has already been invoiced?',
    answer:
      'The submission is accepted and flagged as a late entry against a closed period. It does not alter the sent invoice; instead it appears on the next invoice run as a separate line with the original period in its description, so the client can reconcile it against the earlier document.',
    summary: 'It rolls into the next run',
  },
}
