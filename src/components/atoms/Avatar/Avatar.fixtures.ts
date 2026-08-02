/**
 * A placeholder portrait for the Avatar stories.
 *
 * An inline SVG data URI, so the stories have no external asset dependency and
 * the a11y run cannot fail on a missing file. The only real photograph in the
 * product comes from Clerk's `useUser()`, on the approver profile screen.
 *
 * This file is exempt from the no-raw-hex rule: these values stand in for a
 * photograph, they are not component styling, and an SVG data URI cannot
 * reference a CSS custom property. The exemption is scoped to `*.fixtures.ts`
 * in eslint.config.js — do not widen it.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88">
  <rect width="88" height="88" fill="#16606b"/>
  <circle cx="44" cy="34" r="16" fill="#c6d0d2"/>
  <path d="M12 88c0-17.7 14.3-32 32-32s32 14.3 32 32z" fill="#c6d0d2"/>
</svg>`

export const PORTRAIT = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
