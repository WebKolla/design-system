import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ArrowRight, Check, Download, Plus, X } from 'lucide-react'
import { Button } from './Button'
import { BUTTON_SIZES, BUTTON_VARIANTS, SIZE_LABEL } from './Button.constants'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'The one button. Variant across (Primary · Secondary · Ghost · Approve · Destructive), ' +
          'size down (Large 42 · Medium 34 · Small 30).\n\n' +
          '**Approve is reserved for the approver queue sign-off action and nowhere else.** ' +
          '**Destructive is a secondary shell with danger text, never a filled red button** — a filled ' +
          'red button reads as the primary action on the screen, which it never is.\n\n' +
          'Icon defaults to the trailing side, matching the component sheet and every marketing page. ' +
          'The Figma variant set currently places it leading; that is a known discrepancy.',
      },
    },
  },
  args: { children: 'Get started' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The full 5 × 3 grid, matching the Figma component set one for one. */
export const Matrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {BUTTON_SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-ui-overline text-subtle-foreground uppercase">
            {SIZE_LABEL[size]}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} {...args} variant={variant} size={size}>
                {variant === 'approve'
                  ? 'Approve week'
                  : variant === 'destructive'
                    ? 'Delete draft'
                    : 'Get started'}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

/** Icon side. Trailing is the default; leading is available. */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} icon={ArrowRight}>
        Trailing (default)
      </Button>
      <Button {...args} icon={Plus} iconPosition="leading">
        Leading
      </Button>
      <Button {...args} variant="approve" icon={Check}>
        Approve week
      </Button>
      <Button {...args} variant="secondary" icon={Download}>
        Export CSV
      </Button>
      <Button {...args} variant="destructive" icon={X}>
        Delete draft
      </Button>
    </div>
  ),
}

/** Interactive states. Hover and focus are driven by the play function below. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Rest</Button>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} loading>
        Submitting
      </Button>
      <Button {...args} variant="secondary" disabled>
        Disabled secondary
      </Button>
    </div>
  ),
}

/** Focus ring uses primary at 6.72:1 light / 6.21:1 dark, not color/ring. */
export const FocusVisible: Story = {
  args: { children: 'Tab to me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getAllByRole('button')[0]
    if (!button) throw new Error('no button rendered')
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

/** `asChild` renders the styling onto a link without duplicating it. */
export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#pricing">See pricing</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'See pricing' })
    await expect(link).toHaveAttribute('href', '#pricing')
  },
}

/**
 * A disabled button must not fire its handler.
 *
 * `pointerEventsCheck: 0` is required because the variant sets
 * `disabled:pointer-events-none`, and user-event refuses to dispatch to an
 * element that cannot receive pointer events — which would make the test throw
 * rather than assert the thing we care about.
 */
export const DisabledDoesNotFire: Story = {
  args: { children: 'Cannot submit', disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button')
    await expect(button).toBeDisabled()
    await userEvent.click(button, { pointerEventsCheck: 0 })
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

/**
 * Edge content: the longest realistic label, a single character, and an empty
 * label. Nothing may clip or collapse.
 */
export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex max-w-[420px] flex-col items-start gap-3">
      <Button {...args} icon={ArrowRight}>
        Submit timesheet for Pemberton Clarke — week ending 1 August 2026
      </Button>
      <Button {...args} size="sm">
        £
      </Button>
      <Button {...args} icon={Plus} aria-label="Add project" />
    </div>
  ),
}
