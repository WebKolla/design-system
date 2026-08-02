import * as React from 'react'
import { CircleAlert, Clock, Download, FileText, Plus, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { Chip } from '@/components/atoms/Chip/Chip'
import { KpiCard } from '@/components/molecules/KpiCard/KpiCard'
import { AttentionRow } from '@/components/molecules/AttentionRow/AttentionRow'
import { AttentionCardMobile } from '@/components/molecules/AttentionCardMobile/AttentionCardMobile'
import { ProjectBarRow } from '@/components/molecules/ProjectBarRow/ProjectBarRow'
import { LegendRow } from '@/components/molecules/LegendRow/LegendRow'
import { AppShell, PageHeader } from '../_shells/AppShell'
import { mobileTabsFor, sidebarFor } from '../_shells/app-data'

const KPIS = [
  { title: 'Hours this month', value: '1,284.5', delta: { label: '+8.2%', tone: 'success' as const }, footnote: 'Across 11 timesheets' },
  { title: 'Billed this month', value: '£142,900', delta: { label: '+4.1%', tone: 'success' as const }, footnote: '12 invoices sent' },
  { title: 'Awaiting approval', value: '12', delta: { label: '3 overdue', tone: 'warn' as const }, footnote: 'Oldest submitted 6 days ago' },
  { title: 'Overdue invoices', value: '£18,240', delta: { label: '2 invoices', tone: 'danger' as const }, footnote: 'Oldest is 21 days' },
]

const ATTENTION = [
  {
    tone: 'danger' as const,
    icon: CircleAlert,
    title: 'Two invoices are overdue',
    subtitle: 'Pemberton Clarke and Halbrook Energy · £18,240.00 outstanding',
    mobileSubtitle: 'Pemberton Clarke · £18,240.00',
    action: 'Chase',
  },
  {
    tone: 'warn' as const,
    icon: Clock,
    title: 'Three consultants have not submitted',
    subtitle: 'Callum Byrne, Priya Nair and Iona Macpherson · week ending 1 August',
    mobileSubtitle: 'Northgate Rail · week ending 1 Aug',
    action: 'Nudge approvers',
  },
  {
    tone: 'neutral' as const,
    icon: FileText,
    title: 'Four timesheets awaiting your approval',
    subtitle: 'Submitted in the last 24 hours across three projects',
    mobileSubtitle: 'Submitted in the last 24 hours',
    action: 'Review',
  },
  {
    tone: 'success' as const,
    icon: TriangleAlert,
    title: 'July invoicing complete',
    subtitle: 'All 12 invoices sent and reconciled against approved time',
    mobileSubtitle: 'All 12 invoices sent',
    action: 'View run',
  },
]

const PROJECTS = [
  { project: 'Northgate Rail · Phase 2', hours: '386.0', fraction: 1, series: 1 as const },
  { project: 'Halbrook Energy · Discovery', hours: '248.5', fraction: 0.64, series: 2 as const },
  { project: 'Pemberton Clarke · Assurance', hours: '164.0', fraction: 0.42, series: 3 as const },
  { project: 'Ashworth Digital · Retainer', hours: '92.0', fraction: 0.24, series: 4 as const },
  { project: 'Calderwood · Advisory', hours: '42.0', fraction: 0.11, series: 5 as const },
]

const STATUS = [
  { label: 'Approved', count: 31, series: 1 as const, weight: 219 },
  { label: 'Submitted', count: 12, series: 2 as const, weight: 92 },
  { label: 'Approver signed off', count: 7, series: 3 as const, weight: 57 },
  { label: 'Rejected', count: 2, series: 4 as const, weight: 28 },
  { label: 'Draft', count: 4, series: 6 as const, weight: 21 },
]

const BAR_TONE: Record<number, string> = {
  1: 'bg-chart-1',
  2: 'bg-chart-2',
  3: 'bg-chart-3',
  4: 'bg-chart-4',
  6: 'bg-chart-6',
}

function Card({
  heading,
  badge,
  aside,
  children,
}: {
  heading: string
  badge?: React.ReactNode
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="bg-surface border-border overflow-hidden rounded-card border">
      <div className="border-hairline flex items-center justify-between gap-3 border-b px-4 py-3.5">
        <h2 className="text-heading-block text-foreground flex items-center gap-2">
          {heading}
          {badge}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

/**
 * 1a · Admin overview.
 *
 * Assembled entirely from the library — this page introduces no new visual
 * decisions, only layout. Anything that looked like it needed a new component
 * is noted in NOTES.md rather than invented here.
 */
export function AdminOverview() {
  return (
    <AppShell
      sidebar={sidebarFor('/dashboard')}
      mobileTabs={mobileTabsFor('/dashboard')}
      page="Overview"
      period="July 2026"
      notifications={3}
    >
      <PageHeader
        title="Overview"
        context="Meridian Partners · 14 consultants across 6 clients"
        actions={
          <>
            <Button size="sm" variant="secondary" icon={Download}>
              Export
            </Button>
            <Button size="sm" icon={Plus} iconPosition="leading">
              New invoice
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 px-7 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KPIS.map((k) => (
            <KpiCard key={k.title} {...k} />
          ))}
        </div>

        <Card
          heading="Needs your attention"
          badge={<Chip tone="neutral">{String(ATTENTION.length)}</Chip>}
          aside={
            <a href="/attention" className="text-ui-sm text-primary">
              View all
            </a>
          }
        >
          {/* Desktop rows */}
          <div className="hidden md:block">
            {ATTENTION.map((a) => (
              <AttentionRow
                key={a.title}
                tone={a.tone}
                icon={a.icon}
                title={a.title}
                subtitle={a.subtitle}
                action={
                  <Button size="sm" variant="secondary">
                    {a.action}
                  </Button>
                }
              />
            ))}
          </div>

          {/* Below 768 the row becomes a card with a full-width action. */}
          <div className="flex flex-col gap-3 p-3.5 md:hidden">
            {ATTENTION.map((a) => (
              <AttentionCardMobile
                key={a.title}
                tone={a.tone}
                icon={a.icon}
                title={a.title}
                subtitle={a.mobileSubtitle}
                action={<Button variant="secondary">{a.action}</Button>}
              />
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_453px]">
          <Card heading="Hours by project">
            <div className="flex flex-col gap-2.5 p-4">
              {PROJECTS.map((p) => (
                <ProjectBarRow key={p.project} {...p} />
              ))}
            </div>
          </Card>

          <Card heading="Timesheet status">
            <div className="flex flex-col gap-4 p-4">
              <div
                role="img"
                aria-label="Timesheet status: 31 approved, 12 submitted, 7 approver signed off, 2 rejected, 4 draft"
                className="flex h-2 w-full overflow-hidden rounded-pip"
              >
                {STATUS.map((s) => (
                  <span
                    key={s.label}
                    className={BAR_TONE[s.series]}
                    style={{ width: `${(s.weight / 417) * 100}%` }}
                  />
                ))}
              </div>

              <div className="flex flex-col">
                {STATUS.map((s) => (
                  <LegendRow
                    key={s.label}
                    label={s.label}
                    count={s.count}
                    series={s.series}
                  />
                ))}
              </div>

              <p className="text-body-caption text-subtle-foreground border-hairline border-t pt-3">
                Approver signed off means the client contact has confirmed the
                hours. Those timesheets are safe to invoice.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
