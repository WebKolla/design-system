/**
 * Placeholder photography for the FeatureCardPhoto stories.
 *
 * Inline SVG data URIs, so the stories have no external asset dependency and
 * the a11y run cannot fail on a missing file. Real photography lives in the
 * product, not in this library.
 *
 * This file is exempt from the no-raw-hex rule: these values stand in for a
 * photograph, they are not component styling, and an SVG data URI cannot
 * reference a CSS custom property. The exemption is scoped to `*.fixtures.ts`
 * in eslint.config.js — do not widen it.
 */
export function placeholderPhoto(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="373" height="176">
  <rect width="373" height="176" fill="#16606b"/>
  <text x="50%" y="50%" fill="#ecf2f2" font-family="sans-serif" font-size="13"
        text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
