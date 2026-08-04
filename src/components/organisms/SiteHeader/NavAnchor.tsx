import { Slot } from 'radix-ui'
import type { NavLink } from './SiteHeader'
import { warnIfNotChildless } from '@/lib/nav-slot'

/**
 * Renders one marketing chrome entry.
 *
 * Internal. Not in the organisms barrel and not public API — `SiteHeader` and
 * `SiteFooter` share it so the two cannot drift on how an `element` entry is
 * rendered.
 *
 * Without `element` this is the `<a href>` both components have always
 * rendered, and the output is byte-identical to before.
 *
 * With `element` it is the same `asChild` mechanism `Button` and the nav atoms
 * use: `Slot.Root` merges the computed className and `aria-current` onto the
 * caller's element, and `Slot.Slottable` makes the entry's `label` that
 * element's children. So the caller passes a childless element and gets the
 * chrome's styling on it — a router link, or a `<button>` for something like a
 * cookie-settings control that has no href at all.
 */
export function NavAnchor({
  link,
  className,
}: {
  link: NavLink
  className: string
}) {
  const current = link.current ? ('page' as const) : undefined

  if (link.element) {
    warnIfNotChildless(link.element, 'a navigation entry')
    return (
      <Slot.Root className={className} aria-current={current}>
        <Slot.Slottable>{link.element}</Slot.Slottable>
        {link.label}
      </Slot.Root>
    )
  }

  return (
    <a href={link.href} aria-current={current} className={className}>
      {link.label}
    </a>
  )
}

/**
 * Stable React key for an entry, which may have no href.
 *
 * Re-exported from `@/lib/nav-slot`, where the shells' navigation also keys
 * from, so marketing chrome and application chrome cannot disagree about what
 * identifies a destination.
 */
export { navKey } from '@/lib/nav-slot'
