import {
  Building2,
  ChartNoAxesColumn,
  Clock,
  CreditCard,
  Ellipsis,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  UserSquare,
  Users,
} from 'lucide-react'
import type { SidebarExpandedProps } from '@/components/organisms/SidebarExpanded/SidebarExpanded'

/**
 * The shared sidebar for the five dashboard screens.
 *
 * Thirteen destinations in four groups. Icon order here is the single source
 * for both the expanded sidebar and the collapsed rail, so the two cannot
 * disagree — the rail is generated from this list.
 *
 * `.ts` deliberately — see BUG-001.
 */
export function sidebarFor(currentHref: string): SidebarExpandedProps {
  const mark = <T extends { href: string }>(item: T) =>
    item.href === currentHref ? { ...item, current: true } : item

  return {
    org: 'Meridian Partners',
    orgInitials: 'MP',
    user: 'Diane Rowe',
    role: 'Consultancy admin',
    userInitials: 'DR',
    overview: mark({
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard',
    }),
    groups: [
      {
        heading: 'Manage',
        items: [
          { label: 'Clients', icon: Building2, href: '/clients' },
          { label: 'Projects', icon: FolderKanban, href: '/projects' },
          { label: 'People', icon: Users, href: '/people' },
        ].map(mark),
      },
      {
        heading: 'Work',
        items: [
          { label: 'Timesheets', icon: Clock, href: '/timesheets', badge: 3 },
          { label: 'Approvals', icon: ShieldCheck, href: '/approvals', badge: 12 },
          { label: 'Invoices', icon: Receipt, href: '/invoices', badge: 2 },
        ].map(mark),
      },
      {
        heading: 'Insight',
        items: [
          { label: 'Reports', icon: ChartNoAxesColumn, href: '/reports' },
          { label: 'Documents', icon: FileText, href: '/documents' },
        ].map(mark),
      },
      {
        heading: 'Account',
        items: [
          { label: 'Profile', icon: UserSquare, href: '/profile' },
          { label: 'Billing', icon: CreditCard, href: '/billing' },
          { label: 'Settings', icon: Settings, href: '/settings' },
        ].map(mark),
      },
    ],
    plan: {
      name: 'Margin plan',
      seatsUsed: 14,
      seatsTotal: 20,
      note: '6 seats available.',
    },
  }
}

/**
 * Five plus More. The sidebar has thirteen entries and a phone cannot carry
 * thirteen, so these are the five a role opens daily.
 */
export function mobileTabsFor(currentHref: string) {
  return [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Timesheets', icon: Clock, href: '/timesheets' },
    { label: 'Approvals', icon: ShieldCheck, href: '/approvals' },
    { label: 'Invoices', icon: Receipt, href: '/invoices' },
    { label: 'More', icon: Ellipsis, href: '/more' },
  ].map((t) => (t.href === currentHref ? { ...t, current: true } : t))
}
