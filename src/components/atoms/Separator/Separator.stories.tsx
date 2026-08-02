import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Card } from '../Card/Card'
import { Separator } from './Separator'

const meta = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          'One hairline. Nothing else.\n\n`--color-hairline` is the divider weight every list in this ' +
          'library already uses: table rows carry `border-b border-hairline`, `FaqAccordionRow` carries ' +
          'its own and suppresses it on the last item. **That remains the preferred pattern** — a ' +
          'divider belongs to the component that owns the list, where it can be suppressed without the ' +
          'parent counting children.\n\nThis exists for the case that pattern does not cover: two ' +
          'unrelated blocks stacked in a panel. Reach for the list component\'s own divider first.\n\n' +
          'Decorative by default, so it is announced to nobody. Pass `decorative={false}` only when the ' +
          'line genuinely divides two groups a screen reader user needs told apart — which is rarer ' +
          'than it sounds, because a heading usually says it better.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  render: () => (
    <Card className="flex flex-col gap-3">
      <p className="text-body-cell text-foreground">Northgate Rail · signalling upgrade</p>
      <Separator />
      <p className="text-body-caption text-muted-foreground">
        Two approvers. Invoices issued monthly in arrears.
      </p>
    </Card>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-3">
      <span className="text-body-caption text-muted-foreground">37.5 hours</span>
      <Separator orientation="vertical" />
      <span className="text-body-caption text-muted-foreground">4 projects</span>
      <Separator orientation="vertical" />
      <span className="text-body-caption text-muted-foreground">Week ending 1 August</span>
    </div>
  ),
}

/** Decorative by default; semantic only when asked for. */
export const RoleIsOptIn: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Separator />
      <Separator decorative={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separators = within(canvasElement).getAllByRole('separator')
    await expect(separators).toHaveLength(1)
    await expect(separators[0]).toHaveAttribute('aria-orientation', 'horizontal')
  },
}
