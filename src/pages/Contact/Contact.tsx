import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { Field } from '@/components/molecules/Field/Field'
import { SectionHeader } from '@/components/molecules/SectionHeader/SectionHeader'
import { MarketingShell } from '../_shells/MarketingShell'
import { Section } from '../_shells/Section'

const CHANNELS = [
  {
    icon: Mail,
    heading: 'Email',
    body: 'hello@timesubmit.com',
    note: 'Answered within one working day, by a person.',
  },
  {
    icon: MessageCircle,
    heading: 'Support',
    body: 'support@timesubmit.com',
    note: 'For existing accounts. Include your consultancy name.',
  },
  {
    icon: MapPin,
    heading: 'Where we are',
    body: 'Manchester, United Kingdom',
    note: 'Remote-first, UK and EU data regions.',
  },
]

/**
 * 2f · Contact.
 *
 * Two columns: the form, and how else to reach us. No footer on this screen —
 * the contact details are the footer's job and repeating them below would be
 * the same information twice.
 */
export function Contact() {
  return (
    <MarketingShell current="/contact">
      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeader
              as="h1"
              align="left"
              eyebrow="We'd love to hear from you"
              heading="Get in touch"
              description="Tell us how your consultancy runs its timesheets today and we will tell you honestly whether this helps."
            />

            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Your name" autoComplete="name" placeholder="Diane Rowe" />
                <Field
                  label="Work email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@consultancy.co.uk"
                />
              </div>
              <Field label="Consultancy" placeholder="Meridian Partners" />
              <Field
                label="How many people submit timesheets?"
                placeholder="14"
                inputMode="numeric"
                helper="Include approvers. It changes what we would recommend."
              />
              <Button type="submit" className="self-start">
                Send message
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-4">
            {CHANNELS.map((c) => (
              <div
                key={c.heading}
                className="bg-surface border-border flex gap-3.5 rounded-card border p-5"
              >
                <span className="bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-control">
                  <c.icon className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-heading-block text-foreground">{c.heading}</h2>
                  <p className="text-body text-foreground">{c.body}</p>
                  <p className="text-body-caption text-subtle-foreground">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </MarketingShell>
  )
}
