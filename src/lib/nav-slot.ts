import type * as React from 'react'

/**
 * An element a consumer hands to a shell in place of an `href`.
 *
 * **The contract: it must be childless.**
 *
 * `NavItem`, `NavRailItem`, `TabBarItemMobile` and `Logo` compose their content
 * from `label`, `icon`, `badge` and `brand` props, and under `asChild` that
 * composed content becomes *this element's* children via `Slot.Slottable`. So
 * an element that brings its own children replaces the icon and the label with
 * them — silently, with no error, leaving a nav of blank links.
 *
 * ```tsx
 * // Right
 * <NavItem label="Clients" icon={Building2} element={<Link href="/clients" />} />
 * // Wrong: the icon and the label are discarded
 * <NavItem label="Clients" icon={Building2} element={<Link href="/clients">Clients</Link>} />
 * ```
 *
 * **This cannot be enforced by the type system**, which is why it is enforced
 * at runtime instead — see `warnIfNotChildless`. `ReactElement<{children?:
 * never}>` looks like it would work and does not: a JSX literal has type
 * `JSX.Element`, which is `ReactElement<any, any>`, so `<a href="/x">Text</a>`
 * satisfies it. Worse, the same annotation *rejects* a correctly childless
 * element held in a `React.ReactElement` variable, because that widens to
 * `ReactElement<unknown>`. It would reject valid code and accept the mistake:
 * exactly backwards. Verified against this repo's TypeScript before choosing
 * the runtime guard.
 */
export type NavElement = React.ReactElement

/**
 * A destination that names its target either by `href` or by `element`.
 *
 * Supply one. `element` is how a framework router link, an
 * analytics-instrumented control, or anything that is not a plain anchor gets
 * expressed — a `string` href cannot carry any of them.
 */
export interface NavTarget {
  /** The destination, when a plain anchor will do. */
  href?: string | undefined
  /**
   * Render this element instead of the generated `<a>`, via the atom's
   * `asChild`. **Pass a childless element** — see `NavElement`.
   */
  element?: NavElement | undefined
}

/**
 * Turns a destination into the props that drive `NavItem`, `NavRailItem` or
 * `TabBarItemMobile`.
 *
 * One chokepoint for all four shells, so the `href`-or-`element` branch is
 * decided once. Without `element` the result is `{ href }`, which is what these
 * shells have always passed, so the default render is untouched.
 *
 * `element` wins when both are given. Injecting the shell's `href` onto a
 * consumer's element would override the destination they had already chosen.
 */
export function navTarget(
  target: NavTarget,
):
  | { asChild: true; children: NavElement }
  | { href: string | undefined } {
  if (target.element) {
    warnIfNotChildless(target.element, 'a navigation destination')
    return { asChild: true, children: target.element }
  }
  return { href: target.href }
}

/**
 * Stable React key for a destination, which may have no `href`.
 *
 * An `element` destination carries its href *inside* the consumer's element,
 * where the shell cannot read it, so the label is the only thing left to key
 * on.
 */
export function navKey(target: NavTarget & { label: string }): string {
  return target.href ?? target.label
}

/**
 * Warns, in development only, when an `element` brings its own children.
 *
 * The failure it catches is silent and visual — the icon and label vanish —
 * so nothing else would surface it: no exception, no type error, and a test
 * asserting only on the href still passes. See `NavElement` for why this is a
 * runtime guard rather than a type.
 *
 * A warning rather than a throw: the mistake costs you an icon, and taking the
 * whole application down over it would be the larger fault.
 */
export function warnIfNotChildless(element: NavElement, where: string): void {
  if (!import.meta.env.DEV) return

  const { children } = (element.props ?? {}) as { children?: React.ReactNode }
  if (children === undefined || children === null) return

  console.warn(
    `[design-system] The element passed to ${where} should be childless. ` +
      'These components compose their own icon and label, and under `asChild` ' +
      'that content becomes the element\'s children — so the children you ' +
      'passed replace it. Pass `<Link href="…" />`, not ' +
      '`<Link href="…">Label</Link>`, and set the text via the `label` prop.',
  )
}
