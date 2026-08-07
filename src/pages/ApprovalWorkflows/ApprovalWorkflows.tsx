import { Button } from '@/components/atoms/Button/Button'
import { Container } from '@/components/atoms/Container/Container'
import { SectionHeader } from '@/components/molecules/SectionHeader/SectionHeader'
import { StepCard } from '@/components/molecules/StepCard/StepCard'
import { FeatureCardPhoto } from '@/components/molecules/FeatureCardPhoto/FeatureCardPhoto'
import { FaqAccordionRow } from '@/components/molecules/FaqAccordionRow/FaqAccordionRow'
import { AccordionGroup } from '@/components/organisms/AccordionGroup/AccordionGroup'
import { DarkCtaBand } from '@/components/organisms/DarkCtaBand/DarkCtaBand'
import { PHOTOS } from '@/assets/photography'
import { MarketingShell } from '../_shells/MarketingShell'
import { Section } from '../_shells/Section'

const SUB_NAV = [
  { label: 'All features', href: '/features' },
  { label: 'Time tracking', href: '/features/time-tracking' },
  { label: 'Approval workflows', href: '/approvals', current: true },
  { label: 'Invoicing', href: '/features/invoicing' },
]

const STEPS = [
  { number: '01', title: 'Submit', body: 'A consultant enters hours against each project and day of the period, then submits the timesheet for approval.' },
  { number: '02', title: 'Approve', body: 'The named approver signs the week off from a queue, seeing hours and projects but never a rate.' },
  { number: '03', title: 'Invoice', body: 'Approved time becomes invoice lines, grouped by client and ready to send without re-keying.' },
]

const DIFFERENTIATORS = [
  {
    photo: PHOTOS.featureApproval,
    kicker: 'Several approvers per project',
    title: 'Any one of them can sign the week off',
    body: 'Assign as many approvers as a project needs. The queue records who approved what, so cover during leave does not become a bottleneck.',
  },
  {
    photo: PHOTOS.consultancyManager,
    kicker: 'Rate blindness',
    title: 'Rates never reach an approver-scoped view',
    body: 'Not hidden by a permission that someone can flip. No rate, day rate or invoice value is rendered in an approver view at all.',
  },
  {
    photo: PHOTOS.supportHelpdesk,
    kicker: 'Reasons, not rejections',
    title: 'A rejection has to say why',
    body: 'Rejecting asks for a reason, which the consultant sees. A rejection without one just produces a resubmission of the same timesheet.',
  },
]

const BENEFICIARIES = [
  { role: 'Delivery manager', body: 'Review and approve timesheets from an account you own without being handed commercial information you did not ask for.' },
  { role: 'Consultancy admin', body: 'See what is outstanding, nudge the approvers who are holding a period open, and invoice the moment a week clears.' },
  { role: 'Consultant', body: 'Submit once and know where it is. No email thread, no wondering whether Friday’s hours ever landed.' },
]

const FAQS = [
  { value: 'chase', question: 'What if an approver never responds?', summary: 'Reminders, then escalation', answer: 'Approvers are reminded automatically, and the admin queue shows how long a period has been waiting so it can be escalated to a second approver.' },
  { value: 'bulk', question: 'Can an approver sign off several weeks at once?', summary: 'Yes', answer: 'Identical weekly retainers are the common case, so the queue supports approving a selection in one action rather than five identical clicks.' },
  { value: 'audit', question: 'Is there an audit trail?', summary: 'Yes, per timesheet', answer: 'Every submission, approval, rejection and reason is recorded against the timesheet with a timestamp and the person who did it.' },
]

/**
 * 2b · Approval workflows.
 *
 * Pillar page. The secondary action on the closing band doubles as the
 * next-page link, which is what that slot is for on pillar pages.
 */
export function ApprovalWorkflows() {
  return (
    <MarketingShell current="/approvals">
      {/* Feature sub-nav */}
      <div className="border-hairline bg-surface w-full border-b">
        <Container>
          <nav aria-label="Features">
            <ul className="flex items-center gap-6 overflow-x-auto py-3.5">
              {SUB_NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={l.current ? 'page' : undefined}
                    className={
                      l.current
                        ? 'text-ui-md text-primary whitespace-nowrap'
                        : 'text-ui-md text-muted-foreground hover:text-foreground whitespace-nowrap'
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>

      <Section>
        <div className="flex flex-col items-center gap-6">
          <SectionHeader
            as="h1"
            align="centre"
            eyebrow="Approval workflows"
            heading="Approval workflows that keep rates out of sight"
            description="Approvers confirm that work happened. They never see what it bills at, which is what makes them comfortable signing quickly."
          />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <a href="/sign-up">Get started</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/pricing">See pricing</a>
            </Button>
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <div className="mx-auto flex max-w-[840px] flex-col gap-4 text-center">
          <SectionHeader
            align="centre"
            heading="Why are timesheet approvals so painful?"
            description="Approving over email creates bottlenecks. A week sits in someone’s inbox, the admin cannot invoice, and nobody can say whose turn it is."
          />
          <p className="text-body-lg text-muted-foreground">
            The usual fix is to show the approver more context. That makes it
            worse: the moment a rate appears, a factual question about hours
            becomes a commercial one, and it stops being a two-minute job.
          </p>
        </div>
      </Section>

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

      <Section tone="raised">
        <div className="flex flex-col gap-10">
          <SectionHeader align="centre" heading="What makes it different" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {DIFFERENTIATORS.map((d) => (
              <FeatureCardPhoto
                key={d.kicker}
                image={d.photo}
                kicker={d.kicker}
                title={d.title}
                body={d.body}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader align="centre" heading="Who benefits" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {BENEFICIARIES.map((b) => (
              <div
                key={b.role}
                className="bg-surface border-border flex flex-col gap-2 rounded-card border p-6"
              >
                <h3 className="text-heading-block text-foreground">{b.role}</h3>
                <p className="text-body-cell text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <div className="mx-auto flex max-w-[800px] flex-col gap-6">
          <SectionHeader align="centre" heading="Approval workflow FAQ" />
          <AccordionGroup>
            {FAQS.map((f, i) => (
              <FaqAccordionRow
                key={f.value}
                value={f.value}
                question={f.question}
                answer={f.answer}
                summary={f.summary}
                last={i === FAQS.length - 1}
              />
            ))}
          </AccordionGroup>
        </div>
      </Section>

      <DarkCtaBand
        heading="Streamline approvals for your consultancy"
        sub="Practice starts with two months at no cost, for up to five people including your approvers."
        primary={{ label: 'Get started', href: '/sign-up' }}
        secondary={{ label: 'Next: Invoicing', href: '/features/invoicing' }}
      />
    </MarketingShell>
  )
}
