/**
 * WCAG 2.1 contrast maths.
 *
 * `.ts` deliberately — an exported binding in a `.tsx` file is mutated at
 * runtime by the docgen plugin. See BUG-001.
 */

export type Rgb = { r: number; g: number; b: number }

/** Parse whatever `getComputedStyle` hands back: `rgb(a, b, c)` or `rgba(...)`. */
export function parseRgb(input: string): Rgb | null {
  const m = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)
  if (!m || !m[1] || !m[2] || !m[3]) return null
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
}

export function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

/** Relative luminance, per WCAG 2.1. */
export function luminance({ r, g, b }: Rgb): number {
  const chan = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
}

/** Contrast ratio between two colours, 1–21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export function ratioLabel(ratio: number): string {
  return `${Math.round(ratio * 100) / 100}:1`
}

/**
 * Resolve a CSS custom property to a concrete colour, in the context of a real
 * element — so `.dark` overrides and `var()` indirection both apply.
 *
 * Reading the custom property directly is not enough: a second-order alias
 * returns the literal string `var(--color-hairline)`. Painting it onto a probe
 * element and reading back the used value is what forces resolution.
 */
export function resolveColour(host: Element, cssVar: string): Rgb | null {
  const probe = document.createElement('span')
  probe.style.cssText = `color: var(${cssVar}); position: absolute; visibility: hidden;`
  host.appendChild(probe)
  const used = getComputedStyle(probe).color
  probe.remove()
  return parseRgb(used)
}
