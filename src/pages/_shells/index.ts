// Barrel for the layout shells.
//
// Only the components and their prop types are public. The fixture data next
// door (`app-data.ts`, and the nav/footer constants in `marketing-data.ts`) is
// demo content for the page compositions and stays internal, so an application
// cannot accidentally ship this library's placeholder navigation.

/**
 * `LogoArtwork` is an atom's type, re-exported here because every prop that
 * takes it on this subpath — `AppShellProps.logo`, `PortalLogo` — is reachable
 * without importing the root entry. A consumer typing a shell prop should not
 * have to pull the whole atom barrel in to name it.
 */
export type { LogoArtwork } from '@/components/atoms/Logo/Logo'

export * from './AppShell'
export * from './MarketingShell'
export * from './PortalShell'
export * from './MobileTabBar'
export * from './Section'
