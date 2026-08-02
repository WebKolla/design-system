import { SectionHeader } from '@/components/molecules/SectionHeader/SectionHeader'
import { StatCell } from '@/components/molecules/StatCell/StatCell'
import { FeatureCardPhoto } from '@/components/molecules/FeatureCardPhoto/FeatureCardPhoto'
import { DarkCtaBand } from '@/components/organisms/DarkCtaBand/DarkCtaBand'
import { PHOTOS } from '@/assets/photography'
import { MarketingShell } from '../_shells/MarketingShell'
import { Section } from '../_shells/Section'

const VALUES = [
  {
    photo: PHOTOS.timesheetMoment,
    kicker: 'Time well spent',
    title: 'Time tracking should take seconds, not minutes',
    body: 'A week of hours across three projects is a two-minute job. If the tool takes longer than the recall does, people fill it in badly on a Friday and the data is worth nothing.',
  },
  {
    photo: PHOTOS.featureApproval,
    kicker: 'Rate blindness',
    title: 'Approvers judge time, not money',
    body: 'An approver at the client is confirming that work happened. Showing them a rate turns a factual question into a commercial one, and they start hesitating over numbers that are not theirs to negotiate.',
  },
  {
    photo: PHOTOS.teamCulture,
    kicker: 'Say what is there',
    title: 'No feature we cannot explain in a sentence',
    body: 'Every capability on the pricing page is one a consultancy asked for twice. We would rather say no than ship something that needs a tour.',
  },
]

/**
 * 2d · About.
 *
 * Stat strip over the hero photography, then story, mission and values. The
 * `StatCell`s are positioned by this page with the 20px inset — the component
 * sets no offset of its own.
 */
export function About() {
  return (
    <MarketingShell current="/about">
      <Section>
        <SectionHeader
          as="h1"
          align="centre"
          eyebrow="Built for consultancies"
          heading="About TimeSubmit"
          description="We build one workflow for the loop every consultancy runs: hours in, approvals signed, invoices out."
        />
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="relative overflow-hidden rounded-panel">
          <img
            src={PHOTOS.socialProofTrust.src}
            alt={PHOTOS.socialProofTrust.alt}
            className="h-[340px] w-full object-cover"
          />
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-4">
            <StatCell value="End-to-end" label="timesheet to invoice" />
            <StatCell value="Rates" label="hidden from approvers" />
            <StatCell value="4 days" label="average approval time" />
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <SectionHeader align="left" heading="Our story" />
            <p className="text-body-lg text-muted-foreground">
              TimeSubmit came out of a simple frustration: a consultancy of
              fourteen people was running timesheets in a spreadsheet, approvals
              over email and invoices in an accounting package that knew nothing
              about either.
            </p>
            <p className="text-body-lg text-muted-foreground">
              Every month someone spent two days reconciling the three. Not
              because the work was hard, but because nothing joined up, and the
              same hours were typed three times by three people who each
              believed one of the other two had it right.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <SectionHeader align="left" heading="Our mission" />
            <p className="text-body-lg text-muted-foreground">
              To remove the administrative burden of time tracking from
              consultancies, so the people doing the work spend their attention
              on the work.
            </p>
            <p className="text-body-lg text-muted-foreground">
              That means being ruthless about what we do not build. A tool that
              tries to be a CRM, a project planner and a general ledger ends up
              being a bad version of all three.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeader
            align="centre"
            eyebrow="What we stand for"
            heading="Three things we will not compromise on"
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <FeatureCardPhoto
                key={v.kicker}
                image={v.photo}
                kicker={v.kicker}
                title={v.title}
                body={v.body}
              />
            ))}
          </div>
        </div>
      </Section>

      <DarkCtaBand
        heading="Run one workflow instead of three"
        sub="Practice starts with two months at no cost, for up to five people including your approvers."
        primary={{ label: 'Get started', href: '/sign-up' }}
        secondary={{ label: 'Next: Pricing', href: '/pricing' }}
      />
    </MarketingShell>
  )
}
