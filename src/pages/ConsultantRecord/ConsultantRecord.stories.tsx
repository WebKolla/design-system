import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ConsultantRecord } from './ConsultantRecord'

const meta = {
  title: 'Pages/1e · Consultant record',
  component: ConsultantRecord,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `68:2` (desktop) / `69:387` (mobile).\n\nThe section nav plus `CompletenessCard` is the ' +
          'pattern that makes a long form finishable: per-section state turns an unbounded scroll into ' +
          'a checklist, and the completeness note says what the remaining gap actually costs rather ' +
          'than scoring the user.\n\nBelow 768 the section nav becomes a scrollable chip row. The ' +
          'unsaved guard stays visible from any section.',
      },
    },
  },
} satisfies Meta<typeof ConsultantRecord>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/** Completeness is announced, and the error field says what to do. */
export const GuidanceIsProgrammatic: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Two on this page — the sidebar plan card and the record's own — so
    // disambiguate by name, which is also how a screen reader user would.
    const bar = canvas.getByRole('progressbar', { name: /Record completeness/ })
    await expect(bar).toHaveAttribute('aria-valuenow', '5')
    await expect(bar).toHaveAttribute('aria-valuemax', '7')

    const costRate = canvas.getByLabelText('Cost rate')
    await expect(costRate).toHaveAttribute('aria-invalid', 'true')
    await expect(costRate).toHaveAccessibleDescription(
      'Enter a cost rate, or margin reporting will show this consultant at 100%.',
    )
  },
}
