import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ConsultantTimesheet } from './ConsultantTimesheet'

const meta = {
  title: 'Pages/1b · Consultant weekly timesheet',
  component: ConsultantTimesheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `63:2` (desktop) / `64:179` (mobile).\n\nPortal chrome — a consultant has three ' +
          'destinations and the grid wants the full width.\n\n**Below 768 the seven-column grid is ' +
          'replaced entirely by the day-picker strip.** Never render a 7-column grid at 390, the cells ' +
          'become untappable. Every day in the strip keeps its running total, so the week context ' +
          'survives one-day-per-screen entry.',
      },
    },
  },
} satisfies Meta<typeof ConsultantTimesheet>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/** The grid is a real table with a caption, and empty days show the mid-dot. */
export const StructureIsSound: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('table', { name: 'Week commencing 27 July 2026' }),
    ).toBeInTheDocument()
    await expect(canvasElement.querySelectorAll('tfoot')).toHaveLength(1)
    // No zeros anywhere in the grid: blank is an absence, zero is a claim.
    const inputs = [...canvasElement.querySelectorAll('tbody input')]
    for (const i of inputs) {
      await expect((i as HTMLInputElement).value).not.toBe('0')
      await expect((i as HTMLInputElement).value).not.toBe('0.0')
    }
  },
}
