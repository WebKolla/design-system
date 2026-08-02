import { FaqAccordionRow } from '@/components/molecules/FaqAccordionRow/FaqAccordionRow'
import { SectionHeader } from '@/components/molecules/SectionHeader/SectionHeader'
import { AccordionGroup } from '@/components/organisms/AccordionGroup/AccordionGroup'
import { MarketingShell } from '../_shells/MarketingShell'
import { Section } from '../_shells/Section'

const GROUPS = [
  {
    heading: 'General',
    faqs: [
      { value: 'install', question: 'Do I need to install any software?', summary: 'No, it runs in the browser', answer: 'TimeSubmit runs entirely in the browser. There is nothing to install, and nothing for your IT team to approve.' },
      { value: 'size', question: 'How small can a consultancy be and still benefit?', summary: 'Three people upwards', answer: 'From about three people. Below that a spreadsheet genuinely is fine. The point at which this pays for itself is when one person is chasing timesheets on a Monday morning.' },
      { value: 'migrate', question: 'Can I bring historical timesheets across?', summary: 'Yes, by CSV', answer: 'Historical time can be imported as CSV against existing clients and projects, so your reporting does not start from zero.' },
    ],
  },
  {
    heading: 'Approvals',
    faqs: [
      { value: 'rates', question: 'Can approvers see what the hours bill at?', summary: 'No, never', answer: 'No. Rates, day rates and invoice values are hidden from every approver-scoped view. That is a product guarantee rather than a setting, so it cannot be switched off by mistake.' },
      { value: 'multi', question: 'Can a project have more than one approver?', summary: 'Yes', answer: 'Assign as many approvers as a project needs. Any one of them can sign a week off, and the queue shows who did.' },
      { value: 'reject', question: 'What happens when an approver rejects a week?', summary: 'It asks for a reason', answer: 'Rejecting asks for a reason, which the consultant sees. A rejection without one just produces a resubmission of the same timesheet.' },
    ],
  },
  {
    heading: 'Pricing and billing',
    faqs: [
      { value: 'trial', question: 'Is there a free trial?', summary: 'Two months on Practice', answer: 'Practice starts with two months at no cost, for up to five people including your approvers. No card is required to start.' },
      { value: 'seats', question: 'Do approvers count towards my seats?', summary: 'Yes, they do', answer: 'Approvers hold a seat, because they need an account to sign work off. Clients you invoice do not.' },
      { value: 'annual', question: 'Is annual billing cheaper?', summary: 'Yes', answer: 'Annual billing is the listed rate. Monthly is available at a small premium, and you can switch at any renewal.' },
    ],
  },
  {
    heading: 'Data and security',
    faqs: [
      { value: 'where', question: 'Where is our data held?', summary: 'UK and EU regions', answer: 'Data is held in UK and EU regions. The region is fixed per account at sign-up and does not move.' },
      { value: 'export', question: 'Can we export everything if we leave?', summary: 'Yes, in full', answer: 'Every client, project, timesheet and invoice exports as CSV at any time, without asking us.' },
    ],
  },
]

/**
 * 2e · FAQ.
 *
 * Four grouped `AccordionGroup`s. Every closed row carries a one-line summary,
 * which is what makes a page of thirty questions scannable: the dealbreakers
 * answer themselves without a single click.
 */
export function Faq() {
  return (
    <MarketingShell current="/faq">
      <Section>
        <SectionHeader
          as="h1"
          align="centre"
          eyebrow="Help centre"
          heading="Frequently asked questions"
          description="If the answer you need is not here, the contact form reaches a person rather than a queue."
        />
      </Section>

      <Section tone="raised" className="pt-0 md:pt-0">
        <div className="mx-auto flex max-w-[800px] flex-col gap-10">
          {GROUPS.map((g) => (
            <div key={g.heading} className="flex flex-col gap-4">
              <h2 className="text-heading-card-title text-foreground">{g.heading}</h2>
              <AccordionGroup>
                {g.faqs.map((f, i) => (
                  <FaqAccordionRow
                    key={f.value}
                    value={f.value}
                    question={f.question}
                    answer={f.answer}
                    summary={f.summary}
                    last={i === g.faqs.length - 1}
                  />
                ))}
              </AccordionGroup>
            </div>
          ))}
        </div>
      </Section>
    </MarketingShell>
  )
}
