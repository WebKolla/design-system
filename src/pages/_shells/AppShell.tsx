import * as React from 'react'
import { Bell, CalendarDays, ChevronDown, PanelLeftClose } from 'lucide-react'
import {
  SidebarExpanded,
  type SidebarExpandedProps,
} from '@/components/organisms/SidebarExpanded/SidebarExpanded'
import { NavRailItem } from '@/components/atoms/NavRailItem/NavRailItem'
import { TabBarItemMobile } from '@/components/atoms/TabBarItemMobile/TabBarItemMobile'
import { cn } from '@/lib/cn'

export interface AppShellProps extends React.ComponentPropsWithoutRef<'div'> {
  sidebar: SidebarExpandedProps
  /** Breadcrumb: organisation, then the current page. */
  page: string
  /** e.g. "July 2026". */
  period?: string | undefined
  notifications?: number | undefined
  /** Five plus More. Populated from the sidebar's daily destinations. */
  mobileTabs: Array<{ label: string; icon: SidebarExpandedProps['overview']['icon']; href: string; current?: boolean }>
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
  mobileTabs,
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
      {/* ≥1280 */}
      <div className="hidden xl:block">
        <SidebarExpanded {...sidebar} />
      </div>

      {/* 834–1279 */}
      <nav
        aria-label="Main"
        className="border-border bg-surface-raised hidden w-[52px] shrink-0 flex-col items-center gap-1 border-r py-3 md:flex xl:hidden"
      >
        {railItems.map((item) => (
          <NavRailItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
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
                <span className="bg-danger text-primary-foreground absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px]">
                  {notifications}
                </span>
              ) : null}
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      </div>

      {/* <834 */}
      <nav
        aria-label="Primary"
        className="border-border bg-surface fixed inset-x-0 bottom-0 flex items-stretch border-t md:hidden"
      >
        {mobileTabs.map((tab) => (
          <TabBarItemMobile
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            href={tab.href}
            {...(tab.current ? { active: true } : {})}
          />
        ))}
      </nav>
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
