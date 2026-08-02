import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { TableShell } from '../_tables/TableShell'
import type { SortDirection, TableColumn, TableSort } from '../_tables/columns'
import { TableCell } from '../TableCell/TableCell'
import { TableRow } from '../TableRow/TableRow'
import { TableHeader } from './TableHeader'

/**
 * A clients list — one of the nine screens that had a `TableShell` to sit in
 * and nothing to put in it. Widths are the invoice grid's proportions.
 */
const CLIENT_COLUMNS: TableColumn[] = [
  { key: 'select', label: '', width: '34px', srLabel: 'Select' },
  { key: 'client', label: 'Client', width: '30%', sortable: true },
  { key: 'contact', label: 'Contact', width: '26%' },
  { key: 'projects', label: 'Projects', width: '96px', align: 'right', sortable: true },
  { key: 'added', label: 'Added', width: '110px', sortable: true },
  { key: 'status', label: 'Status', width: '108px' },
  { key: 'actions', label: '', width: '40px', srLabel: 'Actions' },
]

const meta = {
  title: 'Molecules/TableHeader',
  component: TableHeader,
  parameters: {
    docs: {
      description: {
        component:
          'Column headings for any table, driven by a `TableColumn[]`.\n\nThis is ' +
          '`TableHeaderInvoices` with the invoices removed. The domain headers stay exactly as they ' +
          'are — they encode two screens\' worth of decisions about ordering and alignment — but the ' +
          'nine other list screens in the product had a `TableShell` to sit in and nothing to put in ' +
          'it.\n\n**Sorting.** A sortable heading is a real `<button>` inside its `<th>`, and the `<th>` ' +
          'carries `aria-sort`: `ascending`, `descending`, or `none` when another column holds the ' +
          'sort. Non-sortable columns carry no `aria-sort` at all, which is correct — the attribute ' +
          'means "this is sortable and here is its state", not "this is unsorted".\n\nState stays with ' +
          'the caller, like selection and paging, so `DataTable` remains presentational. A column ' +
          'marked `sortable` with no `onSortChange` renders as a plain heading, so a screen that has ' +
          'not wired sorting yet does not ship a dead control.',
      },
    },
  },
  args: { columns: CLIENT_COLUMNS, selectAllLabel: 'Select all clients' },
} satisfies Meta<typeof TableHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A `<thead>` cannot stand on its own, so the stories that render one in
 * isolation borrow the DataTable organism's shell. Applied per story rather
 * than on the meta, because the sorting stories render a whole table of their
 * own and must not end up nested inside a second one.
 */
const inShell: NonNullable<Story['decorators']> = (Story) => (
  <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
    <TableShell columns={CLIENT_COLUMNS} caption="Clients">
      <Story />
    </TableShell>
  </div>
)

export const Default: Story = { decorators: [inShell] }

export const WithSelectAll: Story = {
  args: { onSelectAll: () => {}, allSelected: 'indeterminate' },
  decorators: [inShell],
}

export const SortStates: Story = {
  decorators: [inShell],
  render: (args) => (
    <>
      <TableHeader {...args} onSortChange={() => {}} />
      <TableHeader
        {...args}
        onSortChange={() => {}}
        sort={{ key: 'client', direction: 'ascending' }}
      />
      <TableHeader
        {...args}
        onSortChange={() => {}}
        sort={{ key: 'projects', direction: 'descending' }}
      />
    </>
  ),
}

function SortableClients() {
  const [sort, setSort] = React.useState<TableSort | undefined>({
    key: 'client',
    direction: 'ascending',
  })

  const rows = [
    { client: 'Halbrook Energy', contact: 'Priya Nair', projects: '3', added: '14 Feb 26' },
    { client: 'Northgate Rail', contact: 'Callum Byrne', projects: '7', added: '02 Mar 26' },
    { client: 'Pemberton Clarke', contact: 'Iona Macpherson', projects: '1', added: '19 May 26' },
  ]

  const ordered = [...rows].sort((a, b) => {
    if (!sort) return 0
    const key = sort.key as 'client' | 'projects' | 'added'
    const compared = a[key].localeCompare(b[key], 'en-GB', { numeric: true })
    return sort.direction === 'ascending' ? compared : -compared
  })

  return (
    <div className="bg-surface border-border w-[900px] overflow-hidden rounded-card border">
      <TableShell columns={CLIENT_COLUMNS} caption="Clients">
        <TableHeader
          columns={CLIENT_COLUMNS}
          selectAllLabel="Select all clients"
          sort={sort}
          onSortChange={(key: string, direction: SortDirection) => setSort({ key, direction })}
        />
        <tbody>
          {ordered.map((row) => (
            <TableRow key={row.client}>
              <TableCell variant="plain" />
              <TableCell variant="text">{row.client}</TableCell>
              <TableCell>{row.contact}</TableCell>
              <TableCell variant="numeric">{row.projects}</TableCell>
              <TableCell variant="date">{row.added}</TableCell>
              <TableCell variant="plain" />
              <TableCell variant="plain" />
            </TableRow>
          ))}
        </tbody>
      </TableShell>
    </div>
  )
}

/**
 * The claim at `COMPONENTS.md:96` — "Sortable headers carry `aria-sort`" — made
 * true and asserted. The attribute changes with the state, and only sortable
 * columns carry one.
 */
export const SortIsAnnounced: Story = {
  render: () => <SortableClients />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const client = canvas.getByRole('columnheader', { name: /Client/ })
    const projects = canvas.getByRole('columnheader', { name: /Projects/ })
    const contact = canvas.getByRole('columnheader', { name: 'Contact' })

    await expect(client).toHaveAttribute('aria-sort', 'ascending')
    await expect(projects).toHaveAttribute('aria-sort', 'none')
    // Not sortable, so no state to report.
    await expect(contact).not.toHaveAttribute('aria-sort')

    // Pressing the active column reverses it.
    await userEvent.click(within(client).getByRole('button'))
    await expect(client).toHaveAttribute('aria-sort', 'descending')

    // Pressing another column takes the sort, and the first reverts to none.
    await userEvent.click(within(projects).getByRole('button'))
    await expect(projects).toHaveAttribute('aria-sort', 'ascending')
    await expect(client).toHaveAttribute('aria-sort', 'none')
  },
}

/** Sortable headings are buttons, so they are reachable and pressable by keyboard. */
export const SortIsKeyboardOperable: Story = {
  render: () => <SortableClients />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const projects = canvas.getByRole('columnheader', { name: /Projects/ })
    const button = within(projects).getByRole('button')

    button.focus()
    await expect(document.activeElement).toBe(button)
    await userEvent.keyboard('{Enter}')
    await expect(projects).toHaveAttribute('aria-sort', 'ascending')
  },
}

/** Every column needs a heading, including the ones with no visible text. */
export const AllColumnsAreNamed: Story = {
  args: { onSelectAll: () => {} },
  decorators: [inShell],
  play: async ({ canvasElement }) => {
    const headers = within(canvasElement).getAllByRole('columnheader')
    await expect(headers).toHaveLength(7)
    await expect(
      within(canvasElement).getByRole('checkbox', { name: 'Select all clients' }),
    ).toBeInTheDocument()
  },
}
