import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PricingTierCard } from './PricingTierCard'

const CORE = {
  name: 'Core',
  blurb: 'The full loop for a growing consultancy.',
  amount: '$33',
  period: 'per month',
  meta: [
    'For up to 10 team members',
    'Then a monthly rate per additional member',
    'Billed annually',
  ],
  features: [
    'Clients: unlimited',
    'Projects: unlimited',
    'Timesheets and approvals',
    'Document storage: 10 GB',
    'History retention: 12 months',
  ],
  cta: { label: 'Get started', href: '#core' },
}

const meta = {
  title: 'Organisms/PricingTierCard',
  component: PricingTierCard,
  parameters: {
    docs: {
      description: {
        component:
          'Marketing pricing tier. 308 wide on the 1280 four-up grid. Base-fee model: headline price, ' +
          'member allowance, overage note.\n\n**The Recommended badge overhangs the card at ' +
          '`top: -10px`.** Any ancestor with `overflow: hidden` eats it — and grid wrappers routinely ' +
          'get `overflow: hidden` for rounded corners. **If you need clipping for radius, clip the ' +
          'card, not the grid.**\n\nFeatures and meta lines are arrays, not numbered props: tiers carry ' +
          'four to seven features and Figma deliberately does not model them as component properties.',
      },
    },
  },
  args: CORE,
  decorators: [
    (Story) => (
      <div className="w-[308px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingTierCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Recommended: Story = { args: { recommended: true } }

export const WithPromo: Story = {
  args: { recommended: true, promo: 'First 2 months free' },
}

/** The four-up grid. Note the wrapper does not clip, so the badge survives. */
export const FourUp: Story = {
  decorators: [
    (Story) => (
      <div className="grid w-[1280px] grid-cols-4 gap-6 pt-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <PricingTierCard
        {...args}
        name="Solo"
        blurb="One consultant, one client list."
        amount="$12"
        meta={['For 1 team member', 'Billed annually']}
        features={['Clients: unlimited', 'Projects: 5', 'Document storage: 2 GB']}
      />
      <PricingTierCard {...args} />
      <PricingTierCard
        {...args}
        recommended
        promo="First 2 months free"
        name="Margin"
        blurb="Cost and bill rates, and what sits between them."
        amount="$48"
        features={[
          'Everything in Core',
          'Margin by consultant, project and client',
          'Cost rates and bill rates',
          'Document storage: 25 GB',
          'History retention: 24 months',
        ]}
      />
      <PricingTierCard
        {...args}
        name="Practice"
        blurb="Multiple consultancies under one roof."
        amount="$96"
        meta={['For up to 40 team members', 'Custom overage', 'Billed annually']}
        features={[
          'Everything in Margin',
          'Multi-entity consolidation',
          'SSO and SCIM',
          'Document storage: 100 GB',
          'History retention: unlimited',
          'Named support contact',
          'Annual review',
        ]}
      />
    </>
  ),
}

/**
 * §8.2, demonstrated. The left grid clips for rounded corners and eats the
 * badge; the right one clips the card instead and keeps it.
 */
export const ClippingTrap: Story = {
  decorators: [
    (Story) => (
      <div className="w-[720px]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <p className="text-body-caption text-danger mb-3">
          Wrong — wrapper has overflow-hidden, badge is eaten
        </p>
        {/* No top padding: the badge overhangs the clip box and is cut off. */}
        <div className="overflow-hidden rounded-card">
          <PricingTierCard {...args} recommended />
        </div>
      </div>
      <div>
        <p className="text-body-caption text-success mb-3">
          Right — no clipping, badge survives
        </p>
        <div className="pt-2.5">
          <PricingTierCard {...args} recommended />
        </div>
      </div>
    </div>
  ),
}

/**
 * The badge must render and be readable.
 *
 * Its *overhang* is verified visually by the ClippingTrap story rather than
 * measured here — absolute geometry inside a play function is pre-layout and
 * unreliable in this harness.
 */
export const BadgeIsPresent: Story = {
  args: { recommended: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Recommended')).toBeVisible()
  },
}

/** Feature counts vary per tier — four through seven all lay out. */
export const VaryingFeatureCounts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <PricingTierCard {...args} features={['Clients: unlimited', 'Projects: 5']} />
      <PricingTierCard
        {...args}
        features={[
          'Everything in Margin',
          'Multi-entity consolidation',
          'SSO and SCIM',
          'Document storage: 100 GB',
          'History retention: unlimited',
          'Named support contact',
          'Annual review',
        ]}
      />
    </div>
  ),
}
