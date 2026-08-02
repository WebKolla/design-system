import { Chip } from '@/components/atoms/Chip/Chip'
import { FaqAccordionRow } from '@/components/molecules/FaqAccordionRow/FaqAccordionRow'
import { SectionHeader } from '@/components/molecules/SectionHeader/SectionHeader'
import { AccordionGroup } from '@/components/organisms/AccordionGroup/AccordionGroup'
import { PricingTierCard } from '@/components/organisms/PricingTierCard/PricingTierCard'
import { DarkCtaBand } from '@/components/organisms/DarkCtaBand/DarkCtaBand'
import { MarketingShell } from '../_shells/MarketingShell'
import { Section } from '../_shells/Section'

const TIERS = [
  {
    name: 'Solo',
    blurb: 'One consultant, one client list.',
    amount: '$12',
    period: 'per month',
    meta: ['For 1 team member', 'Billed annually'],
    features: ['Clients: unlimited', 'Projects: 5', 'Timesheets and approvals', 'Document storage: 2 GB'],
    cta: { label: 'Get started', href: '/sign-up?plan=solo' },
  },
  {
    name: 'Core',
    blurb: 'The full loop for a growing consultancy.',
    amount: '$33',
    period: 'per month',
    meta: ['For up to 10 team members', 'Then a monthly rate per additional member', 'Billed annually'],
    features: ['Clients: unlimited', 'Projects: unlimited', 'Timesheets and approvals', 'Document storage: 10 GB', 'History retention: 12 months'],
    cta: { label: 'Get started', href: '/sign-up?plan=core' },
  },
  {
    name: 'Margin',
    blurb: 'Cost and bill rates, and what sits between them.',
    amount: '$48',
    period: 'per month',
    promo: 'First 2 months free',
    meta: ['For up to 20 team members', 'Then a monthly rate per additional member', 'Billed annually'],
    features: ['Everything in Core', 'Margin by consultant, project and client', 'Cost rates and bill rates', 'Document storage: 25 GB', 'History retention: 24 months'],
    cta: { label: 'Start free', href: '/sign-up?plan=margin' },
    recommended: true,
  },
  {
    name: 'Practice',
    blurb: 'Multiple consultancies under one roof.',
    amount: '$96',
    period: 'per month',
    meta: ['For up to 40 team members', 'Custom overage', 'Billed annually'],
    features: ['Everything in Margin', 'Multi-entity consolidation', 'SSO and SCIM', 'Document storage: 100 GB', 'History retention: unlimited', 'Named support contact'],
    cta: { label: 'Talk to us', href: '/contact' },
  },
]

const QUESTIONS = [
  { value: 'seats', question: 'Do approvers count towards my seats?', summary: 'Yes, they do', answer: 'Approvers hold a seat, because they need an account to sign work off. Clients you invoice do not.' },
  { value: 'overage', question: 'What happens when we go over the allowance?', summary: 'A per-member rate', answer: 'Additional members are charged at a flat monthly rate. Nothing stops working and nobody is locked out mid-period.' },
  { value: 'switch', question: 'Can we change plan later?', summary: 'At any renewal', answer: 'Move up at any time and the difference is prorated. Move down at renewal, so a mid-period downgrade never deletes data you are still using.' },
  { value: 'cancel', question: 'What if we cancel?', summary: 'Full export, no lock-in', answer: 'Every client, project, timesheet and invoice exports as CSV at any time, without asking us.' },
]

/**
 * 2c · Pricing.
 *
 * The four-up tier grid on the widened 1280 container. **The grid must not
 * clip**: the Recommended badge overhangs its card at -10px, and a wrapper with
 * `overflow: hidden` for rounded corners would eat it.
 */
export function Pricing() {
  return (
    <MarketingShell current="/pricing">
      <Section wide>
        <div className="flex flex-col items-center gap-5">
          <Chip tone="success">Two months free on Margin</Chip>
          <SectionHeader
            as="h1"
            align="centre"
            heading="Pricing that doesn’t punish you for growing"
            description="A base fee with a member allowance, then a flat rate per additional person. No per-seat maths every time someone joins."
          />
        </div>
      </Section>

      <Section wide tone="raised" className="pt-0 md:pt-0">
        {/*
          The tier cards are h3. Without a heading for this section the level
          would jump straight from the hero's h1, which fails heading-order —
          and the section really does need a name, it just does not need a
          visible one above four cards that are self-evidently the plans.
        */}
        <h2 className="sr-only">Plans</h2>

        {/* No overflow-hidden on this grid: the Recommended badge overhangs. */}
        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((t) => (
            <PricingTierCard key={t.name} {...t} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto flex max-w-[800px] flex-col gap-6">
          <SectionHeader align="centre" heading="Questions" />
          <AccordionGroup>
            {QUESTIONS.map((q, i) => (
              <FaqAccordionRow
                key={q.value}
                value={q.value}
                question={q.question}
                answer={q.answer}
                summary={q.summary}
                last={i === QUESTIONS.length - 1}
              />
            ))}
          </AccordionGroup>
        </div>
      </Section>

      <DarkCtaBand
        heading="Submit time, get approvals, generate invoices"
        sub="Start with two months free on Margin. Add your approvers at no extra cost during the trial."
        primary={{ label: 'Get started', href: '/sign-up' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </MarketingShell>
  )
}
