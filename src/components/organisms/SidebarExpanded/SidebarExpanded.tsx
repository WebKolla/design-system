import * as React from 'react'
import { Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { Logo } from '@/components/atoms/Logo/Logo'
import { NavItem } from '@/components/atoms/NavItem/NavItem'
import { CompletenessCard } from '@/components/molecules/CompletenessCard/CompletenessCard'
import { navKey, navTarget, type NavTarget } from '@/lib/nav-slot'
import { cn } from '@/lib/cn'

export interface SidebarDestination extends NavTarget {
  label: string
  icon: LucideIcon
  /**
   * The destination.
   *
   * Optional only because `element` is the alternative — supply one or the
   * other. In a Next.js application `element` is the difference between a
   * client-side transition and a full document load on every sidebar click:
   * `element={<Link href="/clients" />}`.
   *
   * **Pass a childless element.** This component composes the icon, label and
   * badge, and under `asChild` they become the element's children. See
   * `NavElement`.
   */
  href?: string | undefined
  current?: boolean
  badge?: string | number
}

export interface SidebarGroup {
  /** Manage · Work · Insight · Account. */
  heading: string
  items: SidebarDestination[]
}

export interface SidebarExpandedProps
  extends React.ComponentPropsWithoutRef<'aside'> {
  org: string
  orgInitials: string
  user: string
  role: string
  userInitials: string
  /** Ungrouped destination pinned above the groups. */
  overview: SidebarDestination
  /** Four groups: a flat list of thirteen is unscannable. */
  groups: SidebarGroup[]
  plan?:
    | { name: string; seatsUsed: number; seatsTotal: number; note: string }
    | undefined
  /**
   * Replaces the org switcher button.
   *
   * **Replaces, does not wrap.** The button this stands in for is a static
   * substitute with no handler — it looks like an org switcher and does
   * nothing. Wrapping would render the placeholder next to the real control
   * and leave two things that look like the same affordance, one of them dead.
   * The rule is the same for every slot here: a slot replaces the static
   * element it stands in for.
   *
   * `org` and `orgInitials` are still required and still feed the breadcrumb in
   * `AppShell`; they are simply not rendered here when this is set.
   */
  orgSlot?: React.ReactNode | undefined
  /**
   * Replaces the avatar, name and role block at the foot of the sidebar.
   *
   * **Replaces, does not wrap** — see `orgSlot`. In the consuming app this
   * carries Clerk's `<UserButton>`, which is the only sign-out affordance in
   * the product, so rendering it *beside* a static avatar would give two user
   * controls where only one signs you out.
   *
   * `user`, `role` and `userInitials` stay required and are simply not
   * rendered when this is set.
   */
  accountSlot?: React.ReactNode | undefined
}

/**
 * The 236px expanded sidebar for admin and consultant screens.
 *
 * Thirteen destinations in four groups — Manage, Work, Insight, Account —
 * because a flat list of thirteen is unscannable and the groups match how the
 * roles think about the product.
 *
 * **The plan card is pinned to the bottom by a growing spacer, not by absolute
 * position**, so it stays put at any viewport height.
 *
 * Collapses to the 52px rail below 1280 — the caller swaps in `NavRailItem`,
 * keeping icon order and grouping identical so the sidebar does not appear to
 * reorder itself.
 */
export const SidebarExpanded = React.forwardRef<
  HTMLElement,
  SidebarExpandedProps
>(function SidebarExpanded(
  {
    org,
    orgInitials,
    user,
    role,
    userInitials,
    overview,
    groups,
    plan,
    orgSlot,
    accountSlot,
    className,
    ...rest
  },
  ref,
) {
  return (
    <aside
      {...rest}
      ref={ref}
      className={cn(
        'bg-surface-raised border-border flex h-full w-[236px] flex-col gap-3.5 border-r px-3 pt-4 pb-3.5',
        className,
      )}
    >
      <div className="flex flex-col gap-2.5">
        {/* `sm` is the 20px lockup, and it is not the 24px one scaled — see Logo. */}
        <Logo size="sm" />

        {orgSlot ?? (
          <button
            type="button"
            className="hover:bg-control flex items-center gap-2 rounded-control px-1.5 py-1.5 text-left transition-colors"
          >
            <Avatar initials={orgInitials} size={20} tone="primary" label={org} />
            <span className="text-ui-sm text-foreground truncate">{org}</span>
          </button>
        )}

        <button
          type="button"
          className="bg-background border-border text-subtle-foreground flex items-center gap-2 rounded-control border px-2.5 py-1.5"
        >
          <Search className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="text-ui-sm flex-1 text-left">Search or jump to</span>
          <span className="text-subtle-foreground font-mono text-mono-count">⌘K</span>
        </button>
      </div>

      <nav aria-label="Sidebar" className="flex flex-col gap-0.5">
        <NavItem
          label={overview.label}
          icon={overview.icon}
          {...navTarget(overview)}
          {...(overview.current ? { active: true } : {})}
          {...(overview.badge !== undefined ? { badge: overview.badge } : {})}
        />

        {groups.map((group) => (
          <div key={group.heading} className="flex flex-col gap-0.5 pt-3">
            <span className="text-ui-nav-section text-subtle-foreground px-2 uppercase">
              {group.heading}
            </span>
            {group.items.map((item) => (
              <NavItem
                key={navKey(item)}
                label={item.label}
                icon={item.icon}
                {...navTarget(item)}
                {...(item.current ? { active: true } : {})}
                {...(item.badge !== undefined ? { badge: item.badge } : {})}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* The growing spacer is what pins the footer, at any viewport height. */}
      <div className="flex-1" aria-hidden />

      <div className="flex flex-col gap-3">
        {plan ? (
          <CompletenessCard
            title={plan.name}
            done={plan.seatsUsed}
            total={plan.seatsTotal}
            note={plan.note}
          />
        ) : null}

        {accountSlot ?? (
          <div className="flex items-center gap-2.5">
            <Avatar initials={userInitials} size={26} tone="primary" label={user} />
            <span className="flex min-w-0 flex-col">
              <span className="text-ui-sm text-foreground truncate">{user}</span>
              <span className="text-body-micro text-subtle-foreground truncate">
                {role}
              </span>
            </span>
          </div>
        )}
      </div>
    </aside>
  )
})
