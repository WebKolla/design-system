import { Clock, FileText, Plus, Send } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { DayPickerItemMobile } from '@/components/atoms/DayPickerItemMobile/DayPickerItemMobile'
import { ChecklistCard } from '@/components/molecules/ChecklistCard/ChecklistCard'
import { WeekGridRow } from '@/components/molecules/WeekGridRow/WeekGridRow'
import { WeekGrid } from '@/components/organisms/WeekGrid/WeekGrid'
import { PortalShell } from '../_shells/PortalShell'

const DAYS = [
  { day: 'Mon', date: '27' },
  { day: 'Tue', date: '28' },
  { day: 'Wed', date: '29' },
  { day: 'Thu', date: '30' },
  { day: 'Fri', date: '31' },
  { day: 'Sat', date: '01' },
  { day: 'Sun', date: '02' },
]

const ROWS = [
  { project: 'Northgate Rail', task: 'Signal design review', values: ['7.5', '7.5', '7.5', '7.5', '4.0', '', ''], total: '34.00' },
  { project: 'Halbrook Energy', task: 'Discovery workshops', values: ['1.0', '1.0', '1.0', '1.0', '1.0', '', ''], total: '5.00' },
  { project: 'Internal', task: 'Team meeting', values: ['', '', '', '', '1.0', '', ''], total: '1.00', nonBillable: true },
]

const MOBILE_WEEK = [
  { day: 'Mon', date: 27, total: '8.5', state: 'default' as const },
  { day: 'Tue', date: 28, total: '8.5', state: 'default' as const },
  { day: 'Wed', date: 29, total: '8.5', state: 'selected' as const },
  { day: 'Thu', date: 30, total: '8.5', state: 'default' as const },
  { day: 'Fri', date: 31, total: '6.0', state: 'default' as const },
  { day: 'Sat', date: 1, total: '·', state: 'weekend' as const },
  { day: 'Sun', date: 2, total: '·', state: 'weekend' as const },
]

const LINKS = [
  { label: 'Timesheet', href: '/timesheet', current: true },
  { label: 'History', href: '/timesheet/history' },
  { label: 'Projects', href: '/projects' },
]

const TABS = [
  { label: 'Timesheet', icon: Clock, href: '/timesheet', current: true },
  { label: 'History', icon: FileText, href: '/timesheet/history' },
  { label: 'Projects', icon: Send, href: '/projects' },
]

function SummaryCard({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-surface border-border flex flex-1 flex-col gap-2.5 rounded-card border p-4">
      <h2 className="text-ui-label text-subtle-foreground">{heading}</h2>
      {children}
    </section>
  )
}

/**
 * 1b · Consultant weekly timesheet.
 *
 * Portal chrome — a consultant has three destinations and the grid wants the
 * full width.
 *
 * Below 768 the seven-column grid is replaced entirely by the day-picker
 * strip: never render a 7-column grid at 390, the cells become untappable.
 * Every day in the strip keeps its running total, so the week context survives
 * one-day-per-screen entry.
 */
export function ConsultantTimesheet() {
  return (
    <PortalShell
      links={LINKS}
      user={{ name: 'Callum Byrne', initials: 'CB' }}
      mobileTabs={TABS}
    >
      <div className="mx-auto flex w-full max-w-[1384px] flex-col gap-5 px-7 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-page-title text-foreground">
              Week commencing 27 July
            </h1>
            <p className="text-body text-muted-foreground">
              Meridian Partners · due Monday 4 August
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary">
              Save draft
            </Button>
            <Button size="sm" icon={Send}>
              Submit for approval
            </Button>
          </div>
        </div>

        {/* ≥768: the full grid. */}
        <div className="hidden md:flex md:flex-col md:gap-3">
          <WeekGrid
            caption="Week commencing 27 July 2026"
            days={DAYS}
            dayTotals={['8.5', '8.5', '8.5', '8.5', '6.0', '', '']}
            weekTotal="40.00"
          >
            {ROWS.map((r) => (
              <WeekGridRow
                key={r.project + r.task}
                project={r.project}
                task={r.task}
                values={r.values}
                total={r.total}
                {...(r.nonBillable ? { nonBillable: true } : {})}
              />
            ))}
          </WeekGrid>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button size="sm" variant="secondary" icon={Plus} iconPosition="leading">
              Add a project row
            </Button>
            <span className="text-body-micro text-subtle-foreground">
              Tab across days, Enter to move down, quarter hour steps
            </span>
          </div>
        </div>

        {/* <768: the day strip replaces the grid entirely. */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="border-border bg-surface flex gap-1.5 overflow-x-auto rounded-card border p-2">
            {MOBILE_WEEK.map((d) => (
              <DayPickerItemMobile
                key={d.day}
                day={d.day}
                date={d.date}
                total={d.total}
                state={d.state}
              />
            ))}
          </div>
          {ROWS.map((r) => (
            <div
              key={r.project + r.task}
              className="bg-surface border-border flex items-center justify-between gap-3 rounded-card border p-3.5"
            >
              <span className="flex min-w-0 flex-col">
                <span className="text-body-cell text-foreground truncate">
                  {r.project}
                </span>
                <span className="text-body-micro text-subtle-foreground truncate">
                  {r.task}
                </span>
              </span>
              <span className="text-foreground shrink-0 font-mono text-mono-amount tabular-nums">
                {r.values[2] || '·'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <SummaryCard heading="This week">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-mono text-mono-kpi tabular-nums">
                40.00
              </span>
              <span className="text-body-caption text-subtle-foreground">
                hours · 39.00 billable
              </span>
            </div>
          </SummaryCard>

          <SummaryCard heading="Goes to">
            <div className="flex flex-col gap-2">
              {[
                { name: 'Jo Mensah', initials: 'JM', role: 'Northgate Rail' },
                { name: 'Ade Fadeyi', initials: 'AF', role: 'Halbrook Energy' },
              ].map((a) => (
                <span key={a.name} className="flex items-center gap-2.5">
                  <Avatar initials={a.initials} size={20} label={a.name} />
                  <span className="text-body-cell text-foreground">{a.name}</span>
                  <span className="text-body-micro text-subtle-foreground">
                    {a.role}
                  </span>
                </span>
              ))}
            </div>
          </SummaryCard>

          <SummaryCard heading="Before you submit">
            <ChecklistCard
              items={[
                { label: 'Every day has an entry or is deliberately blank' },
                { label: 'Non-billable time is tagged' },
              ]}
            />
          </SummaryCard>
        </div>
      </div>
    </PortalShell>
  )
}
