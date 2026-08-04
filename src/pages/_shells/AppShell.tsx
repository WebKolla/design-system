import * as React from 'react'
import { Bell, CalendarDays, ChevronDown, PanelLeftClose } from 'lucide-react'
import {
  SidebarExpanded,
  type SidebarExpandedProps,
} from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import { NavRailItem } from '@/components/atoms/NavRailItem/NavRailItem'
import { MobileTabBar, type MobileTab } from './MobileTabBar'
import { navKey, navTarget } from '@/lib/nav-slot'
import { cn } from '@/lib/cn'

export interface AppShellProps extends React.ComponentPropsWithoutRef<'div'> {
  sidebar: SidebarExpandedProps
  /** Breadcrumb: organisation, then the current page. */
  page: string
  /** e.g. "July 2026". */
  period?: string | undefined
  /**
   * Unread count on the static notification button.
   *
   * **Stays a number.** It was tempting to widen this to
   * `number | React.ReactNode` so a live bell could be passed here, and that
   * was rejected: it would give two ways to express the same thing, and the
   * `aria-label` this drives ("Notifications, 3 unread") is meaningless for a
   * node, so the union would carry a prop that is only correct for one of its
   * two branches. `headerActions` covers the node case, and covers it better,
   * because a live bell is rarely the only live control in that cluster.
   */
  notifications?: number | undefined
  /**
   * Replaces the static notification button in the header's right-hand
   * cluster.
   *
   * **Replaces, does not wrap.** That button has no handler — it is a
   * substitute for a real notification control. Appending to it would leave a
   * dead bell sitting next to a live one. Slots in this library replace the
   * static element they stand in for; they never wrap it.
   *
   * The period control is *not* replaced. It is gated by its own `period`
   * prop, is driven entirely by library state, and a caller that wants it gone
   * already has a way to say so.
   *
   * In the consuming app this carries the live `NotificationBell` and Clerk's
   * `<UserButton>` — which is the only sign-out affordance in the product, so
   * without this prop the dashboard has no exit.
   */
  headerActions?: React.ReactNode | undefined
  /**
   * Five plus More. Populated from the sidebar's daily destinations.
   *
   * `MobileTab` rather than the structural copy this used to declare inline.
   * The copy was identical, went straight to `MobileTabBar`, and drifted the
   * moment `MobileTab` gained `element` — leaving a prop the shell could not
   * pass on. One type, so it cannot happen again.
   */
  mobileTabs: MobileTab[]
  /**
   * Force the 52px rail at every width. The invoices list is designed this way
   * at 1440 — a wide table wants the horizontal space more than the sidebar
   * wants to be legible.
   */
  collapsed?: boolean
  children: React.ReactNode
}

/**
 * Application chrome for the five dashboard screens.
 *
 * Layout only — it composes library components and adds no new visual
 * decisions of its own. Three responsive states, matching SPEC:
 *
 * - **≥1280** the 236px expanded sidebar
 * - **834–1279** the 52px icon rail, keeping icon order identical so the
 *   sidebar does not appear to reorder itself
 * - **<834** neither; a bottom tab bar instead, because the consultant and
 *   approver portals otherwise have no navigation below 768
 */
export function AppShell({
  sidebar,
  page,
  period,
  notifications,
  headerActions,
  mobileTabs,
  collapsed = false,
  children,
  className,
  ...rest
}: AppShellProps) {
  const railItems = [sidebar.overview, ...sidebar.groups.flatMap((g) => g.items)]

  return (
    <div
      {...rest}
      className={cn('bg-background flex min-h-screen w-full', className)}
    >
      {/* ≥1280, unless the page asks for the rail throughout */}
      {collapsed ? null : (
        <div className="hidden xl:block">
          <SidebarExpanded {...sidebar} />
        </div>
      )}

      {/* 834–1279 */}
      <nav
        aria-label="Main"
        className={cn(
          'border-border bg-surface-raised hidden w-[52px] shrink-0 flex-col items-center gap-1 border-r py-3 md:flex',
          collapsed ? '' : 'xl:hidden',
        )}
      >
        {railItems.map((item) => (
          <NavRailItem
            key={navKey(item)}
            icon={item.icon}
            label={item.label}
            {...navTarget(item)}
            {...(item.current ? { active: true } : {})}
          />
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-hairline bg-surface flex h-13 shrink-0 items-center justify-between gap-4 border-b px-6">
          <div className="flex min-w-0 items-center gap-3">
            <PanelLeftClose
              className="text-subtle-foreground size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden
            />
            <span aria-hidden className="bg-border h-4 w-px" />
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="text-ui-sm flex min-w-0 items-center gap-2">
                <li className="text-muted-foreground truncate">{sidebar.org}</li>
                {/* Pure punctuation, hidden from AT, carrying no content —
                    the one place faint-foreground is still honest. */}
                <li aria-hidden className="text-faint-foreground">
                  /
                </li>
                <li className="text-foreground truncate" aria-current="page">
                  {page}
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {period ? (
              <button
                type="button"
                className="border-border bg-surface text-ui-sm text-muted-foreground flex h-[30px] items-center gap-2 rounded-control border px-2.5"
              >
                <CalendarDays className="size-3.5" strokeWidth={1.75} aria-hidden />
                {period}
                <ChevronDown className="size-3.5" strokeWidth={1.75} aria-hidden />
              </button>
            ) : null}

            {headerActions ?? (
              <button
                type="button"
                aria-label={
                  notifications
                    ? `Notifications, ${notifications} unread`
                    : 'Notifications'
                }
                className="border-border bg-surface text-muted-foreground relative flex size-[30px] items-center justify-center rounded-control border"
              >
                <Bell className="size-3.5" strokeWidth={1.75} aria-hidden />
                {notifications ? (
                  // 9px is a literal: the count is sized to fit a 16px pip, not
                  // to a ramp step.
                  <span className="bg-danger text-primary-foreground absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px]">
                    {notifications}
                  </span>
                ) : null}
              </button>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      </div>

      {/* <834 */}
      <MobileTabBar tabs={mobileTabs} />
    </div>
  )
}

export interface PageHeaderProps {
  title: string
  context?: string | undefined
  actions?: React.ReactNode | undefined
}

/** Page title block inside `AppShell`. Page title is `heading/page-title`. */
export function PageHeader({ title, context, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-7 pt-6">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-heading-page-title text-foreground">{title}</h1>
        {context ? (
          <p className="text-body text-muted-foreground">{context}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
