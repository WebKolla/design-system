import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { AdminOverview } from './AdminOverview'

const meta = {
  title: 'Pages/1a · Admin overview',
  component: AdminOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma `56:284` (desktop) / `59:440` (mobile).\n\n**Assembled entirely from the library** — ' +
          'this page introduces no new visual decisions, only layout. Three responsive states: the ' +
          '236px sidebar at ≥1280, the 52px rail at 834–1279, and a bottom tab bar below 834.\n\n' +
          'Below 768 the attention rows become `AttentionCardMobile` with full-width actions, because ' +
          'a row with a button converts and a summary does not.',
      },
    },
  },
} satisfies Meta<typeof AdminOverview>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/** The page must be built from the library, and stay navigable. */
export const StructureIsSound: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Overview' }),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    // One <main>, and the four KPI figures are present.
    await expect(canvasElement.querySelectorAll('main')).toHaveLength(1)
    for (const v of ['1,284.5', '£142,900', '12', '£18,240']) {
      await expect(canvas.getAllByText(v).length).toBeGreaterThan(0)
    }
  },
}
