import { Button } from '@/components/atoms/Button/Button'
import { Chip } from '@/components/atoms/Chip/Chip'
import { SectionHeader } from '@/components/molecules/SectionHeader/SectionHeader'
import { StepCard } from '@/components/molecules/StepCard/StepCard'
import { StatCell } from '@/components/molecules/StatCell/StatCell'
import { FeatureCardPhoto } from '@/components/molecules/FeatureCardPhoto/FeatureCardPhoto'
import { PricingTierCard } from '@/components/organisms/PricingTierCard/PricingTierCard'
import { DarkCtaBand } from '@/components/organisms/DarkCtaBand/DarkCtaBand'
import { PHOTOS } from '@/assets/photography'
import { MarketingShell } from '../_shells/MarketingShell'
import { Section } from '../_shells/Section'

const FEATURES = [
  {
    photo: PHOTOS.featureTimeTracking,
    kicker: 'Multi-project single submission',
    title: 'Stop chasing timesheets round the office',
    body: 'Consultants log hours across every project they touched in one submission, mark what is billable, and say what the time went on. The chasing is done by reminder emails instead of by you.',
  },
  {
    photo: PHOTOS.featureApproval,
    kicker: 'Rate-blind approvals',
    title: 'Approvers sign off hours, not money',
    body: 'Rates and invoice values never appear in an approver-scoped view, so sign-off is a question about time and nothing else. That is what makes it quick.',
  },
  {
    photo: PHOTOS.featureInvoicing,
    kicker: 'Straight to invoice',
    title: 'Approved time becomes invoice lines',
    body: 'No re-keying between the timesheet and the invoice, and no reconciliation step where the two quietly disagree.',
  },
]

const CAPABILITIES = [
  { title: 'Multi-project timesheets', body: 'Split hours across engagements in a single submission.' },
  { title: 'Several approvers', body: 'Assign as many as a project needs; any one can sign off.' },
  { title: 'Non-billable tagging', body: 'Internal time recorded without reaching an invoice.' },
  { title: 'CSV and accounting export', body: 'Xero and QuickBooks, or plain CSV.' },
]

const STEPS = [
  { number: '01', title: 'Submit', body: 'A consultant enters hours against each project and day of the period, then submits the timesheet for approval.' },
  { number: '02', title: 'Approve', body: 'The named approver signs the week off from a queue, seeing hours and projects but never a rate.' },
  { number: '03', title: 'Invoice', body: 'Approved time becomes invoice lines, grouped by client and ready to send.' },
]

const NOT_DOING = [
  { title: 'We are not a project planner', body: 'No Gantt charts, no dependencies, no resource levelling. Your delivery tool already does that, and worse duplication helps nobody.' },
  { title: 'We are not an accounting package', body: 'Invoices leave here as PDFs or push to Xero and QuickBooks. We do not want to be your ledger.' },
  { title: 'We are not a CRM', body: 'Clients exist so time can be billed to them. There are no pipelines, deals or forecasts.' },
]

const TIERS = [
  {
    name: 'Core',
    blurb: 'The full loop for a growing consultancy.',
    amount: '$33',
    period: 'per month',
    meta: ['For up to 10 team members', 'Billed annually'],
    features: ['Clients: unlimited', 'Projects: unlimited', 'Timesheets and approvals', 'Document storage: 10 GB'],
    cta: { label: 'Get started', href: '/sign-up?plan=core' },
  },
  {
    name: 'Margin',
    blurb: 'Cost and bill rates, and what sits between them.',
    amount: '$48',
    period: 'per month',
    promo: 'First 2 months free',
    meta: ['For up to 20 team members', 'Billed annually'],
    features: ['Everything in Core', 'Margin by consultant, project and client', 'Cost rates and bill rates', 'History retention: 24 months'],
    cta: { label: 'Start free', href: '/sign-up?plan=margin' },
    recommended: true,
  },
  {
    name: 'Practice',
    blurb: 'Multiple consultancies under one roof.',
    amount: '$96',
    period: 'per month',
    meta: ['For up to 40 team members', 'Billed annually'],
    features: ['Everything in Margin', 'Multi-entity consolidation', 'SSO and SCIM', 'Named support contact'],
    cta: { label: 'Talk to us', href: '/contact' },
  },
]

/**
 * 2a · Home.
 *
 * The longest page in the set. Every band is a `Section`, so vertical rhythm
 * lives in one place and no component carries external margin.
 *
 * Two §8 traps live on this page and are handled deliberately: the pricing
 * preview grid must not clip (the Recommended badge overhangs), and the
 * rate-blind band is an ink surface where every colour comes from `ink/*`.
 */
export function Home() {
  return (
    <MarketingShell current="/">
      {/* Hero */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <SectionHeader
              as="h1"
              align="left"
              eyebrow="Built for consultancies"
              heading="Time tracking and invoicing for consultancies"
              description="Consultants submit their hours. Approvers sign them off without ever seeing what those hours bill at. Finance invoices from approved time, once."
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href="/sign-up">Get started</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/pricing">See pricing</a>
              </Button>
            </div>
            <p className="text-body-caption text-subtle-foreground">
              Two months free on Margin · no card required
            </p>
          </div>

          <div className="relative overflow-hidden rounded-panel">
            <img
              src={PHOTOS.heroBanner.src}
              alt={PHOTOS.heroBanner.alt}
              className="h-[380px] w-full object-cover"
            />
            <div className="absolute bottom-5 left-5">
              <StatCell value="Rates" label="hidden from approvers" />
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section tone="raised">
        <div className="flex flex-col gap-10">
          <SectionHeader
            align="centre"
            heading="Built for the way consultancies actually work"
            description="One workflow for the loop every consultancy runs, rather than three tools that each know a third of it."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCardPhoto
                key={f.kicker}
                image={f.photo}
                kicker={f.kicker}
                title={f.title}
                body={f.body}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Capability strip */}
      <Section>
        <div className="bg-border border-border grid grid-cols-1 gap-px overflow-hidden rounded-card border sm:grid-cols-2 xl:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="bg-surface flex flex-col gap-1.5 p-6">
              <h3 className="text-heading-block text-foreground">{c.title}</h3>
              <p className="text-body-cell text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Rate-blind band — ink surface, ink/* only */}
      <section className="bg-ink w-full py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1160px] px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex w-full max-w-[600px] flex-col gap-5">
              <span className="text-ui-overline text-ink-accent uppercase">
                Rates hidden from approvers
              </span>
              <h2 className="text-heading-section text-ink-foreground">
                Approvers never see billing rates
              </h2>
              <p className="text-body-lg text-ink-muted w-full max-w-[540px]">
                A client contact confirming a week of work does not need to know
                what it costs, and showing them turns a factual question into a
                commercial negotiation. Rate blindness is a product guarantee
                here, not a permission someone can switch off.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  'No rate, day rate or invoice value in any approver view',
                  'Enforced in the product, not by configuration',
                  'The approver queue says so on the screen',
                ].map((l) => (
                  <li key={l} className="text-body-cell text-ink-muted">
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-panel">
              <img
                src={PHOTOS.consultancyManager.src}
                alt={PHOTOS.consultancyManager.alt}
                className="h-[340px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader align="centre" heading="How it works" />
          <div className="bg-border border-border grid grid-cols-1 gap-px overflow-hidden rounded-card border md:grid-cols-3">
            {STEPS.map((s) => (
              <StepCard key={s.number} {...s} />
            ))}
          </div>
        </div>
      </Section>

      {/* Split */}
      <Section tone="raised">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-panel">
            <img
              src={PHOTOS.timesheetMoment.src}
              alt={PHOTOS.timesheetMoment.alt}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <SectionHeader align="left" heading="The timesheet moment, made small" />
            <p className="text-body-lg text-muted-foreground">
              Hours go in once, against the project and the day, in about two
              minutes. If entering a week takes longer than remembering it did,
              people fill it in badly on a Friday and the data is worth nothing.
            </p>
            <p className="text-body-lg text-muted-foreground">
              Empty days show a mid-dot rather than a zero, because zero is a
              claim and blank is an absence. A grid full of zeros looks
              submitted when it is not.
            </p>
          </div>
        </div>
      </Section>

      {/* Pricing preview — the grid must not clip the Recommended badge */}
      <Section>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-4">
            <Chip tone="success">Two months free on Margin</Chip>
            <SectionHeader
              align="centre"
              heading="Pricing that doesn’t punish you for growing"
              description="A base fee with a member allowance, then a flat rate per additional person."
            />
          </div>
          <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
            {TIERS.map((t) => (
              <PricingTierCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </Section>

      {/* What we do not do */}
      <Section tone="raised">
        <div className="flex flex-col gap-10">
          <SectionHeader
            align="centre"
            eyebrow="Say what is there"
            heading="What TimeSubmit does not do"
            description="Three things we have been asked for and deliberately have not built."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {NOT_DOING.map((n) => (
              <div
                key={n.title}
                className="bg-surface border-border flex flex-col gap-2 rounded-card border p-6"
              >
                <h3 className="text-heading-block text-foreground">{n.title}</h3>
                <p className="text-body-cell text-muted-foreground">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DarkCtaBand
        heading="Submit time, get approvals, generate invoices"
        sub="Start free with up to five team members, including your approvers. No card required."
        primary={{ label: 'Get started', href: '/sign-up' }}
        secondary={{ label: 'See pricing', href: '/pricing' }}
      />
    </MarketingShell>
  )
}
