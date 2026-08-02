import { ShieldCheck } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { Button } from '@/components/atoms/Button/Button'
import { StatusPill } from '@/components/atoms/StatusPill/StatusPill'
import { SubNavItem } from '@/components/atoms/SubNavItem/SubNavItem'
import { Field } from '@/components/molecules/Field/Field'
import { Banner } from '@/components/molecules/Banner/Banner'
import { CompletenessCard } from '@/components/molecules/CompletenessCard/CompletenessCard'
import { AppShell } from '../_shells/AppShell'
import { mobileTabsFor, sidebarFor } from '../_shells/app-data'

const SECTIONS = [
  { label: 'Personal details', badge: '4/4' },
  { label: 'Rates and billing', badge: '3/7', tone: 'warn' as const, current: true },
  { label: 'Bank details', badge: 'Empty', tone: 'warn' as const },
  { label: 'Projects', badge: '2' },
  { label: 'Approvers', badge: '2' },
  { label: 'Documents', badge: '5' },
  { label: 'Company block', badge: 'Optional' },
]

/**
 * 1e · Consultant record.
 *
 * Admin sidebar chrome. The section nav plus `CompletenessCard` is the pattern
 * that makes a long form finishable: per-section state turns an unbounded
 * scroll into a checklist, and the completeness note says what the remaining
 * gap actually costs rather than scoring the user.
 *
 * The unsaved guard sits in the topbar so it is visible from any section.
 */
export function ConsultantRecord() {
  return (
    <AppShell
      sidebar={sidebarFor('/people')}
      mobileTabs={mobileTabsFor('/more')}
      page="Callum Byrne"
      notifications={3}
    >
      <div className="flex flex-col gap-5 px-7 py-6">
        {/* Unsaved guard — visible from any section. */}
        <div className="border-warn-border bg-warn-bg flex flex-wrap items-center justify-between gap-3 rounded-card border px-4 py-2.5">
          <span className="text-body-caption text-warn flex items-center gap-2">
            <span aria-hidden className="bg-warn size-1.5 rounded-full" />
            Unsaved changes
          </span>
          <span className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              Discard
            </Button>
            <Button size="sm">Save changes</Button>
          </span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar initials="CB" size={44} tone="primary" label="Callum Byrne" />
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2.5">
                <h1 className="text-heading-page-title text-foreground">
                  Callum Byrne
                </h1>
                <StatusPill tone="success">Active</StatusPill>
              </span>
              <p className="text-body-caption text-subtle-foreground">
                callum.byrne@meridian.co.uk · on 2 projects · joined 14 Mar 2024
              </p>
            </div>
          </div>
          <Button size="sm" variant="destructive">
            Deactivate
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[224px]">
            {/* Below 768 this becomes a scrollable chip row. */}
            <nav
              aria-label="Sections"
              className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible"
            >
              {SECTIONS.map((s) => (
                <SubNavItem
                  key={s.label}
                  label={s.label}
                  badge={s.badge}
                  className="shrink-0 lg:shrink"
                  {...(s.tone ? { badgeTone: s.tone } : {})}
                  {...(s.current ? { active: true } : {})}
                />
              ))}
            </nav>

            <CompletenessCard
              done={5}
              total={7}
              note="Enough to invoice. Company block is optional."
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-heading-card-title text-foreground">
                  Rates and billing
                </h2>
                <p className="text-body-caption text-subtle-foreground">
                  Defaults for new project assignments. A per-project rate always
                  wins over these.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Default day rate" prefix="£" defaultValue="650.00" inputMode="decimal" />
                <Field label="Default hourly rate" prefix="£" defaultValue="86.67" inputMode="decimal" />
                <Field
                  label="Cost rate"
                  prefix="£"
                  defaultValue="0"
                  error="Enter a cost rate, or margin reporting will show this consultant at 100%."
                  inputMode="decimal"
                />
                <Field label="Currency" defaultValue="GBP" readOnly />
              </div>

              <Banner
                tone="primary"
                icon={ShieldCheck}
                title="Approvers never see these figures"
                body="Rates are visible to consultancy admins and finance only."
              />
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-heading-card-title text-foreground">
                  Bank details
                </h2>
                <p className="text-body-caption text-subtle-foreground">
                  Only the fields this consultant’s country and currency require.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Account name" placeholder="As it appears on the account" />
                <Field label="Sort code" placeholder="00-00-00" />
              </div>

              <p className="text-body-micro text-subtle-foreground">
                IBAN, SWIFT, routing number and bank name are not needed for a UK
                GBP account, so they are not asked for.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
