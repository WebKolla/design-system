import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { KpiCard } from '@/components/molecules/KpiCard/KpiCard'
import { ToolbarSearch } from '@/components/molecules/ToolbarSearch/ToolbarSearch'
import { FilterSelect } from '@/components/molecules/FilterSelect/FilterSelect'
import { Tab } from '@/components/atoms/Tab/Tab'
import { TabChipMobile } from '@/components/atoms/TabChipMobile/TabChipMobile'
import { TableHeaderInvoices } from '@/components/molecules/TableHeaderInvoices/TableHeaderInvoices'
import { TableRowInvoice } from '@/components/molecules/TableRowInvoice/TableRowInvoice'
import { ListCardInvoiceMobile } from '@/components/molecules/ListCardInvoiceMobile/ListCardInvoiceMobile'
import { Pagination } from '@/components/molecules/Pagination/Pagination'
import { INVOICE_COLUMNS } from '@/components/molecules/_tables/columns'
import { DataTable } from '@/components/organisms/DataTable/DataTable'
import { AppShell, PageHeader } from '../_shells/AppShell'
import { mobileTabsFor, sidebarFor } from '../_shells/app-data'

const KPIS = [
  { title: 'Outstanding', value: '£64,280', delta: { label: '2 overdue', tone: 'danger' as const }, footnote: 'Across 9 invoices' },
  { title: 'Paid this month', value: '£142,900', delta: { label: '+4.1%', tone: 'success' as const }, footnote: '12 invoices settled' },
  { title: 'Average days to pay', value: '19', delta: { label: '−3 days', tone: 'success' as const }, footnote: 'Rolling 90 days' },
  { title: 'Draft', value: '4', footnote: 'Not yet sent' },
]

const STATUSES = [
  { label: 'All', count: 47, active: true },
  { label: 'Draft', count: 4 },
  { label: 'Sent', count: 31 },
  { label: 'Overdue', count: 3, problem: true },
  { label: 'Paid', count: 9 },
]

const INVOICES = [
  { invoice: 'INV-0231', client: 'Halbrook Energy', consultant: 'Priya Nair', issued: '01 Jul 26', due: '15 Jul 26', amount: '£11,400.00', status: { label: 'Sent', tone: 'info' as const }, meta: 'Priya Nair · due 15 Jul 26' },
  { invoice: 'INV-0232', client: 'Northgate Rail', consultant: 'Callum Byrne', issued: '02 Jul 26', due: '16 Jul 26', amount: '£8,120.50', status: { label: 'Paid', tone: 'success' as const }, meta: 'Callum Byrne · due 16 Jul 26' },
  { invoice: 'INV-0233', client: 'Ashworth Digital', consultant: 'Iona Macpherson', issued: '03 Jul 26', due: '17 Jul 26', amount: '£128.00', status: { label: 'Draft', tone: 'neutral' as const }, meta: 'Iona Macpherson · due 17 Jul 26' },
  { invoice: 'INV-0234', client: 'Pemberton Clarke', consultant: 'Callum Byrne', issued: '20 Jun 26', due: '04 Jul 26', amount: '£18,240.00', status: { label: 'Overdue', tone: 'danger' as const }, overdue: true, meta: 'Callum Byrne · due 04 Jul 26' },
  { invoice: 'INV-0235', client: 'Calderwood', consultant: 'Fenella Okonkwo', issued: '05 Jul 26', due: '19 Jul 26', amount: '£1,092.50', status: { label: 'Sent', tone: 'info' as const }, meta: 'Fenella Okonkwo · due 19 Jul 26' },
]

/**
 * 1d · Invoices list.
 *
 * Designed on the 52px rail even at 1440 — a nine-column table wants the
 * horizontal space more than the sidebar wants to be legible, so `AppShell`
 * is asked for `collapsed`.
 *
 * Below 768 the rows become `ListCardInvoiceMobile` and the status tabs become
 * a scrollable chip row, because an underline on a half-off-screen tab reads
 * as a rendering fault.
 */
export function InvoicesList() {
  return (
    <AppShell
      collapsed
      sidebar={sidebarFor('/invoices')}
      mobileTabs={mobileTabsFor('/invoices')}
      page="Invoices"
      period="July 2026"
      notifications={2}
    >
      <PageHeader
        title="Invoices"
        context="47 invoices · £64,280 outstanding"
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

      <div className="flex flex-col gap-5 px-7 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KPIS.map((k) => (
            <KpiCard key={k.title} {...k} />
          ))}
        </div>

        {/* Desktop: underline tabs. */}
        <div role="tablist" aria-label="Invoice status" className="hidden items-end md:flex">
          {STATUSES.map((s) => (
            <Tab
              key={s.label}
              label={s.label}
              count={s.count}
              {...(s.active ? { active: true } : {})}
              {...(s.problem ? { countIsProblem: true } : {})}
            />
          ))}
        </div>

        {/* Mobile: scrollable chips. */}
        <div
          role="tablist"
          aria-label="Invoice status"
          className="flex gap-2 overflow-x-auto md:hidden"
        >
          {STATUSES.map((s) => (
            <TabChipMobile
              key={s.label}
              label={s.label}
              count={s.count}
              {...(s.active ? { active: true } : {})}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-[190px]">
            <ToolbarSearch aria-label="Search invoices" />
          </div>
          <FilterSelect label="Client" />
          <FilterSelect label="Overdue" active />
        </div>

        <div className="hidden md:block">
          <DataTable
            columns={INVOICE_COLUMNS}
            caption="Invoices"
            header={<TableHeaderInvoices allSelected="indeterminate" />}
            pagination={
              <Pagination page={1} pageCount={10} range="Showing 1–5 of 47" />
            }
          >
            {INVOICES.map((row, i) => (
              <TableRowInvoice
                key={row.invoice}
                invoice={row.invoice}
                client={row.client}
                consultant={row.consultant}
                issued={row.issued}
                due={row.due}
                amount={row.amount}
                status={row.status}
                alt={i % 2 === 1}
                {...(row.overdue ? { overdue: true } : {})}
              />
            ))}
          </DataTable>
        </div>

        <div className="flex flex-col gap-2.5 md:hidden">
          {INVOICES.map((row) => (
            <ListCardInvoiceMobile
              key={row.invoice}
              invoice={row.invoice}
              client={row.client}
              meta={row.meta}
              amount={row.amount}
              status={row.status}
              {...(row.overdue ? { overdue: true } : {})}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
