import { Clock, FileText, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { Banner } from '@/components/molecules/Banner/Banner'
import { ToolbarSearch } from '@/components/molecules/ToolbarSearch/ToolbarSearch'
import { FilterSelect } from '@/components/molecules/FilterSelect/FilterSelect'
import { TableHeaderApprovals } from '@/components/molecules/TableHeaderApprovals/TableHeaderApprovals'
import { TableRowApproval } from '@/components/molecules/TableRowApproval/TableRowApproval'
import { ListCardApprovalMobile } from '@/components/molecules/ListCardApprovalMobile/ListCardApprovalMobile'
import { APPROVAL_COLUMNS } from '@/components/molecules/_tables/columns'
import { DataTable } from '@/components/organisms/DataTable/DataTable'
import { PortalShell } from '../_shells/PortalShell'

const QUEUE = [
  { name: 'Callum Byrne', initials: 'CB', email: 'callum.byrne@meridian.co.uk', dates: '27 Jul to 2 Aug', cadence: 'Weekly', project: 'Northgate Rail', phase: 'Phase 2', hours: '40.00', submitted: '6 days ago', reminder: 'Reminder sent' },
  { name: 'Priya Nair', initials: 'PN', email: 'priya.nair@meridian.co.uk', dates: '27 Jul to 2 Aug', cadence: 'Weekly', project: 'Halbrook Energy', phase: 'Discovery', hours: '37.50', submitted: '2 days ago' },
  { name: 'Iona Macpherson', initials: 'IM', email: 'iona.macpherson@meridian.co.uk', dates: '27 Jul to 2 Aug', cadence: 'Weekly', project: 'Pemberton Clarke', phase: 'Assurance', hours: '41.25', submitted: 'Yesterday' },
  { name: 'Tomas レイエス', initials: 'TR', email: 'tomas.reyes@meridian.co.uk', dates: '20 Jul to 26 Jul', cadence: 'Fortnightly', project: 'Ashworth Digital', phase: 'Retainer', hours: '76.00', submitted: '3 days ago' },
  { name: 'Fenella Okonkwo', initials: 'FO', email: 'fenella.okonkwo@meridian.co.uk', dates: '27 Jul to 2 Aug', cadence: 'Weekly', project: 'Calderwood', phase: 'Advisory', hours: '18.75', submitted: '4 hours ago' },
]

const LINKS = [
  { label: 'Queue', href: '/approvals', current: true },
  { label: 'History', href: '/approvals/history' },
  { label: 'Team', href: '/team' },
]

const TABS = [
  { label: 'Queue', icon: ShieldCheck, href: '/approvals', current: true },
  { label: 'History', icon: Clock, href: '/approvals/history' },
  { label: 'Team', icon: FileText, href: '/team' },
]

/**
 * 1c · Approver queue.
 *
 * Top-nav chrome rather than the admin sidebar: an approver has three
 * destinations, and the queue wants the full width.
 *
 * The rate-blind `Banner` is the reason this screen is trusted, which is why
 * it has no dismiss control. **No money appears anywhere on this page.**
 */
export function ApproverQueue() {
  return (
    <PortalShell
      links={LINKS}
      user={{ name: 'Jo Mensah', initials: 'JM' }}
      mobileTabs={TABS}
    >
      <div className="mx-auto flex w-full max-w-[1384px] flex-col gap-5 px-7 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-page-title text-foreground">
              Awaiting your approval
            </h1>
            <p className="text-body text-muted-foreground">
              Five timesheets from Meridian Partners · period ending 2 August
            </p>
          </div>
          <Button size="sm" variant="approve">
            Approve all five
          </Button>
        </div>

        <Banner
          tone="primary"
          icon={ShieldCheck}
          title="You are approving hours, not money"
          body="Rates, day rates and invoice values are hidden from this view by design."
          link={{ label: 'How this works', href: '/help/rate-blind' }}
        />

        <div className="hidden md:block">
          <DataTable
            columns={APPROVAL_COLUMNS}
            caption="Timesheets awaiting your approval"
            header={<TableHeaderApprovals />}
          >
            {QUEUE.map((r) => (
              <TableRowApproval key={r.email} {...r} />
            ))}
          </DataTable>
        </div>

        {/* Below 768 the row becomes a card with full-width decisions. */}
        <div className="flex flex-col gap-3 md:hidden">
          {QUEUE.map((r) => (
            <ListCardApprovalMobile
              key={r.email}
              name={r.name}
              initials={r.initials}
              period={`${r.dates} · ${r.cadence}`}
              project={`${r.project} · ${r.phase}`}
              hours={r.hours}
            />
          ))}
        </div>

        <p className="text-body-caption text-subtle-foreground">
          Rejecting asks for a reason, which the consultant sees. A rejection
          without one just produces a resubmission of the same timesheet.
        </p>
      </div>
    </PortalShell>
  )
}

/** Toolbar used above the queue on wider screens. */
export function QueueToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-[250px]">
        <ToolbarSearch aria-label="Search the approver queue" />
      </div>
      <FilterSelect label="Northgate Rail" active />
      <FilterSelect label="Period" />
    </div>
  )
}
