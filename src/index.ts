/**
 * Public entry point for @timesubmit/design-system.
 *
 * What is here: every atom, molecule and organism, plus `cn` and the type ramp
 * it validates against.
 *
 * What is deliberately not here:
 *
 * - **Page compositions** (`src/pages/*`). They are static reference layouts
 *   built from hardcoded content constants, not parameterised components.
 *   Exporting them would invite an application to render fixture copy, and
 *   would tie the library's public API to demo content. Read them as
 *   blueprints; do not import them.
 * - **Shells** (`AppShell`, `MarketingShell`, `PortalShell`, `MobileTabBar`,
 *   `Section`). These are real components and are exported, but from the
 *   `./shells` subpath so that an application importing a Button does not pull
 *   a navigation shell into its module graph.
 * - **Foundations** (`src/foundations/*`). Palette, type scale and contrast
 *   helpers exist to drive the Storybook documentation. The tokens themselves
 *   ship as CSS at `./tokens/globals.css`.
 * - **`src/components/ui/*`.** Raw shadcn primitives kept for the mapping
 *   story. The atoms are the supported surface.
 */

export * from './components/atoms'
export * from './components/molecules'
export * from './components/organisms'

export { cn, TYPE_RAMP } from './lib/cn'
