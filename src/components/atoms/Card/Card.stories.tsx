import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Card } from './Card'

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'The neutral container the domain cards are all special cases of.\n\n`KpiCard`, ' +
          '`CompletenessCard`, `StepCard`, `PricingTierCard` and the two mobile list cards each ' +
          're-declare this surface with their own content on top. This is that surface with the content ' +
          'removed, so a screen with nothing domain-specific to say does not inline ' +
          '`bg-surface border border-border rounded-card p-4` for the twenty-second time.\n\n' +
          '**It imposes no layout.** Pass `flex flex-col gap-*` if you want the stack the domain cards ' +
          'use; a container that forces a layout is not neutral.\n\n**Built ahead of its Figma node** ' +
          'and derived entirely from the cards above. Not yet reviewed by design.',
      },
    },
  },
  args: { children: 'Twelve timesheets are waiting on you.' },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Padding: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Card {...args} padding="compact">
        Compact · 14 — the dense app card, as used by `CompletenessCard`
      </Card>
      <Card {...args} padding="standard">
        Standard · 16 — as used by `KpiCard`
      </Card>
      <Card {...args} padding="roomy">
        Roomy · 24 — the marketing card, as used by `PricingTierCard`
      </Card>
      <Card {...args} padding="none" clip>
        <div className="bg-control p-3.5 text-body-caption">
          None · for content that paints to the edge, like a table or an image
        </div>
      </Card>
    </div>
  ),
}

export const ContextAndElevation: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Card {...args} context="app">
        App · radius/card 10
      </Card>
      <Card {...args} context="marketing" padding="roomy">
        Marketing · radius/panel 12
      </Card>
      <Card {...args} elevation="e1">
        Elevation e1
      </Card>
      <Card {...args} elevation="e2">
        Elevation e2
      </Card>
    </div>
  ),
}

/** What it is for: a KPI, a note and a form section, with no bespoke surface. */
export const InContext: Story = {
  render: (args) => (
    <Card {...args} className="flex flex-col gap-2.5">
      <p className="text-ui-label text-subtle-foreground">Unbilled hours</p>
      <p className="text-foreground text-mono-kpi font-mono tabular-nums">184.5</p>
      <p className="text-body-micro text-subtle-foreground">
        Across four projects at Northgate Rail.
      </p>
    </Card>
  ),
}

export const EdgeContent: Story = {
  args: {
    children:
      'Pemberton Clarke rejected the purchase order reference on two invoices, so neither has ' +
      'been delivered and both still count as sent rather than overdue.',
  },
}

/**
 * The surface is real CSS, not an unstyled div.
 *
 * This is also the canary for the `vitest.config.ts` trap recorded in
 * `NOTES.md`: if the Tailwind plugin ever falls out of the test project again,
 * `bg-surface` resolves to nothing, the background reads as transparent, and
 * this fails — instead of every contrast check quietly passing against browser
 * defaults.
 */
export const IsActuallyStyled: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByText(
      'Twelve timesheets are waiting on you.',
    )
    const styles = getComputedStyle(card)

    const surface = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-surface')
      .trim()
    await expect(surface).not.toBe('')

    await expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    await expect(styles.borderBottomWidth).toBe('1px')
    await expect(styles.borderRadius).toBe('10px')
    await expect(styles.padding).toBe('16px')
  },
}
