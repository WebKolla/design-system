import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { FeatureCardPhoto } from './FeatureCardPhoto'
import { placeholderPhoto } from './FeatureCardPhoto.fixtures'

const meta = {
  title: 'Molecules/FeatureCardPhoto',
  component: FeatureCardPhoto,
  parameters: {
    docs: {
      description: {
        component:
          'Marketing feature card with photography. 373 wide on the 1160 three-up grid, photo 176 tall.' +
          '\n\nThe photograph is an **`image` prop, not an instance swap**, so the card does not need a ' +
          'variant per photograph.\n\n**The kicker is Geist, never mono.** The marketing HTML sets it in ' +
          'mono at 11px, but mono is reserved for hours, rates, amounts, dates and identifiers, and a ' +
          'kicker is prose.',
      },
    },
  },
  args: {
    image: {
      src: placeholderPhoto('feature-time-tracking'),
      alt: 'A consultant entering hours on a laptop',
    },
    kicker: 'Multi-project single submission',
    title: 'Stop chasing timesheets round the office',
    body: 'Consultants log hours across every project they touched in one submission, mark what is billable, and say what the time went on. The chasing is done by the reminder emails instead of by you.',
  },
  decorators: [
    (Story) => (
      <div className="w-[373px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureCardPhoto>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The 1160 three-up grid it is designed for. */
export const ThreeUp: Story = {
  decorators: [
    (Story) => (
      <div className="grid w-[1160px] grid-cols-3 gap-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <FeatureCardPhoto {...args} />
      <FeatureCardPhoto
        {...args}
        image={{
          src: placeholderPhoto('feature-approval'),
          alt: 'An approver signing off a week of hours',
        }}
        kicker="Rate-blind approvals"
        title="Approvers sign off hours, not money"
        body="Rates and invoice values never appear in an approver-scoped view, so sign-off is a question about time and nothing else."
      />
      <FeatureCardPhoto
        {...args}
        image={{
          src: placeholderPhoto('feature-invoicing'),
          alt: 'An invoice being prepared from approved time',
        }}
        kicker="Straight to invoice"
        title="Approved time becomes invoice lines"
        body="No re-keying between the timesheet and the invoice, and no reconciliation step where the two quietly disagree."
      />
    </>
  ),
}

/** The photograph must carry alt text — it is content, not decoration. */
export const PhotoHasAltText: Story = {
  play: async ({ canvasElement }) => {
    const img = within(canvasElement).getByRole('img')
    await expect(img).toHaveAccessibleName(
      'A consultant entering hours on a laptop',
    )
  },
}

export const EdgeContent: Story = {
  args: {
    kicker: 'Purchase order reconciliation and cost centre mapping for enterprise clients',
    title: 'Match approved time to the right budget before anything is sent',
    body: 'Short body.',
  },
}
