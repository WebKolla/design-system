import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CircleAlert, Info, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Banner } from './Banner'

const meta = {
  title: 'Molecules/Banner',
  component: Banner,
  parameters: {
    docs: {
      description: {
        component:
          'A standing statement of fact.\n\n**`dismissible` defaults to `false`, and that default is ' +
          'the product guarantee.** The rate-blind banner on the approver queue is the reason that ' +
          'screen is trusted, and an approver who dismisses it loses the one sentence that tells them ' +
          'they are not being asked to make a commercial judgement. That instance is undismissable ' +
          'because *it* is undismissable, not because the component cannot dismiss — which is why ' +
          '`BannerIsUndismissable` on `Pages/1c · Approver queue` asserts the absence of a close ' +
          'control on the rendered page, and still passes.\n\nOpt in for guidance a user has already ' +
          'read: page instructions, a cookie notice. Never for a state they need to keep ' +
          'seeing.\n\n**Dismissal state is the consumer\'s.** The component never touches ' +
          '`localStorage`.\n\nTone `primary` is the rate-blind panel. Info, success, warn and danger ' +
          'are for transient system states — if the message is momentary rather than standing, you ' +
          'want a Toast.',
      },
    },
  },
  args: {
    title: 'You are approving hours, not money',
    body: 'Rates and totals are hidden from approvers by design.',
    icon: ShieldCheck,
    link: { label: 'How this works', href: '#how' },
  },
  decorators: [
    (Story) => (
      <div className="w-[720px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

/** The rate-blind panel — the reason this component has no close button. */
export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Banner {...args} tone="primary" />
      <Banner
        {...args}
        tone="info"
        icon={Info}
        title="Invoicing runs at 18:00 tonight"
        body="Anything approved before then is included."
      />
      <Banner
        {...args}
        tone="success"
        icon={ShieldCheck}
        title="All timesheets approved for July"
        body="Nothing is outstanding for this period."
      />
      <Banner
        {...args}
        tone="warn"
        icon={TriangleAlert}
        title="Three consultants have not submitted"
        body="Week ending 1 August closes on Monday."
      />
      <Banner
        {...args}
        tone="danger"
        icon={CircleAlert}
        title="Two invoices failed to send"
        body="Pemberton Clarke rejected the purchase order reference."
      />
    </div>
  ),
}

export const WithoutLinkOrIcon: Story = {
  render: ({ title, body }) => <Banner title={title} body={body} />,
}

/**
 * Opt-in, and off by default.
 *
 * The component holds no dismissal state and never touches `localStorage`.
 * Whether the banner comes back tomorrow, on another device, or for another
 * user is a decision only the consumer can make — and the product's existing
 * per-browser `localStorage` key is one answer to that question, not the only
 * one.
 */
export const Dismissible: Story = {
  args: {
    dismissible: true,
    onDismiss: () => {},
    dismissLabel: 'Dismiss guidance',
    tone: 'info',
    icon: Info,
    title: 'Timesheets are approved a week at a time',
    body: 'Select a week, review the days, then approve or reject the whole submission.',
    link: undefined,
  },
}

export const DismissibleTones: Story = {
  args: { dismissible: true, onDismiss: () => {}, link: undefined },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Banner {...args} tone="primary" dismissLabel="Dismiss rate notice" />
      <Banner
        {...args}
        tone="info"
        icon={Info}
        title="Invoicing runs at 18:00 tonight"
        body="Anything approved before then is included."
        dismissLabel="Dismiss invoicing notice"
      />
      <Banner
        {...args}
        tone="warn"
        icon={TriangleAlert}
        title="Three consultants have not submitted"
        body="Week ending 1 August closes on Monday."
        dismissLabel="Dismiss submission warning"
      />
      <Banner
        {...args}
        tone="danger"
        icon={CircleAlert}
        title="Two invoices failed to send"
        body="Pemberton Clarke rejected the purchase order reference."
        dismissLabel="Dismiss delivery failure"
      />
    </div>
  ),
}

/** The close control is a real button, named, and reachable by keyboard. */
export const DismissIsOperable: Story = {
  args: { dismissible: true, dismissLabel: 'Dismiss guidance', onDismiss: fn() },
  play: async ({ canvasElement, args }) => {
    const close = within(canvasElement).getByRole('button', { name: 'Dismiss guidance' })
    close.focus()
    await expect(document.activeElement).toBe(close)
    await userEvent.keyboard('{Enter}')
    await expect(args.onDismiss).toHaveBeenCalled()
  },
}

/** There must be no dismiss control, in any tone. */
export const HasNoCloseButton: Story = {
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).queryAllByRole('button')
    await expect(buttons).toHaveLength(0)
  },
}

export const EdgeContent: Story = {
  args: {
    title:
      'You are approving hours, not money — rates, totals and invoice values are hidden from approver-scoped views',
    body: 'This is a product guarantee, not a styling preference. If you can see a rate on this screen, report it.',
  },
}
