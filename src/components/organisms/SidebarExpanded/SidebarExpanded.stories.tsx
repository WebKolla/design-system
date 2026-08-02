import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  Building2,
  ChartNoAxesColumn,
  Clock,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  UserSquare,
} from 'lucide-react'
import { SidebarExpanded } from './SidebarExpanded'

const meta = {
  title: 'Organisms/SidebarExpanded',
  component: SidebarExpanded,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The 236px expanded sidebar for admin and consultant screens. **Thirteen destinations in four ' +
          'groups** — Manage, Work, Insight, Account — because a flat list of thirteen is unscannable ' +
          'and the groups match how the roles think about the product.\n\n**The plan card is pinned to ' +
          'the bottom by a growing spacer, not by absolute position**, so it stays put at any viewport ' +
          'height.\n\nTimesheets and Invoices carry warn and danger badges: those counts are the reason ' +
          'someone opens the app. Collapses to the 52px rail below 1280, where the caller swaps in ' +
          '`NavRailItem` keeping icon order and grouping identical.',
      },
    },
  },
  args: {
    org: 'Meridian Partners',
    orgInitials: 'MP',
    user: 'Diane Rowe',
    role: 'Consultancy admin',
    userInitials: 'DR',
    overview: {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard',
      current: true,
    },
    groups: [
      {
        heading: 'Manage',
        items: [
          { label: 'Clients', icon: Building2, href: '/clients' },
          { label: 'Projects', icon: FolderKanban, href: '/projects' },
          { label: 'People', icon: Users, href: '/people' },
        ],
      },
      {
        heading: 'Work',
        items: [
          { label: 'Timesheets', icon: Clock, href: '/timesheets', badge: 3 },
          { label: 'Approvals', icon: ShieldCheck, href: '/approvals', badge: 12 },
          { label: 'Invoices', icon: Receipt, href: '/invoices', badge: 2 },
        ],
      },
      {
        heading: 'Insight',
        items: [
          { label: 'Reports', icon: ChartNoAxesColumn, href: '/reports' },
          { label: 'Documents', icon: FileText, href: '/documents' },
        ],
      },
      {
        heading: 'Account',
        items: [
          { label: 'Profile', icon: UserSquare, href: '/profile' },
          { label: 'Billing', icon: CreditCard, href: '/billing' },
          { label: 'Settings', icon: Settings, href: '/settings' },
        ],
      },
    ],
    plan: {
      name: 'Margin plan',
      seatsUsed: 14,
      seatsTotal: 20,
      note: '6 seats available.',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background h-[900px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarExpanded>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Short viewport: the spacer collapses and the footer stays at the bottom. */
export const ShortViewport: Story = {
  decorators: [
    (Story) => (
      <div className="bg-background h-[620px]">
        <Story />
      </div>
    ),
  ],
}

export const WithoutPlanCard: Story = {
  render: ({ plan: _plan, ...args }) => <SidebarExpanded {...args} />,
}

/** Thirteen destinations, one marked current, in a single labelled nav. */
export const StructureIsSound: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Sidebar' })
    await expect(nav).toBeInTheDocument()
    const links = within(nav).getAllByRole('link')
    await expect(links).toHaveLength(12)
    await expect(canvas.getByRole('link', { name: /Overview/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}
