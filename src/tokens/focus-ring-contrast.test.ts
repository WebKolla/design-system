/**
 * The focus ring must be visible on every surface it can land on.
 *
 * WCAG 2.4.11 Focus Appearance and 1.4.11 Non-text Contrast both want 3:1 for a focus
 * indicator. The ring is declared per mode, so Light and Dark were measured when it was
 * introduced — but ink is a third surface, mode-invariant, and it was measured against
 * neither. In Light it sat at 2.53:1 on ink/950, which is what this test now prevents
 * from returning.
 *
 * Reads the stylesheet rather than a rendered page: jsdom does not resolve `var()` chains,
 * and the values that matter are declarations, not computed styles.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { contrastRatio, type Rgb } from '../foundations/contrast'

// Read from the project root rather than import.meta.url: the test environment does not
// hand this file a file: URL, and the stylesheet's location is fixed anyway.
const css = readFileSync(path.join(process.cwd(), 'src/tokens/globals.css'), 'utf8')

/**
 * Every `--name: value;` inside the first block matching `selector`.
 *
 * A missing block returns empty rather than throwing. Deleting the ink rule is precisely the
 * regression this file guards, and it should fail with the measured ratio rather than with a
 * parser crash that says nothing about contrast.
 */
function block(selector: string, required = true): Record<string, string> {
  const start = css.indexOf(selector)
  if (start === -1) {
    if (required) throw new Error(`no ${selector} block in globals.css`)
    return {}
  }
  const open = css.indexOf('{', start)
  let depth = 0
  let end = open
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) {
      end = i
      break
    }
  }
  const out: Record<string, string> = {}
  for (const m of css.slice(open, end).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const [, name, value] = m
    if (name && value) out[name] = value.trim()
  }
  return out
}

const theme = block('@theme static')
const root = block(':root {')
const dark = block('.dark {')
const inkSurface = block('.bg-ink,', false)

/** Follows a var() chain to a literal, preferring the given mode's declarations. */
function resolve(name: string, ...scopes: Record<string, string>[]): string {
  let value: string | undefined
  for (const scope of scopes) {
    if (scope[name] !== undefined) {
      value = scope[name]
      break
    }
  }
  if (value === undefined) throw new Error(`unresolved token ${name}`)
  const ref = value.match(/^var\((--[\w-]+)\)$/)
  const target = ref?.[1]
  return target ? resolve(target, ...scopes) : value
}

/*
 * Authored tokens are hex; `parseRgb` reads the `rgb()` strings a browser computes. Two
 * different inputs, so this keeps its own parser rather than widening the shared helper's
 * contract. The WCAG arithmetic itself is still the shared `contrastRatio`.
 */
function hexToRgb(hex: string): Rgb {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`unparseable colour: ${hex}`)
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function ratio(colour: string, surface: string): number {
  return contrastRatio(hexToRgb(colour), hexToRgb(surface))
}

const MINIMUM = 3

describe('focus ring contrast (WCAG 2.4.11 / 1.4.11)', () => {
  it('is visible on the Light background', () => {
    const light = [root, theme]
    const r = ratio(resolve('--color-focus-ring', ...light), resolve('--color-background', ...light))
    expect(r).toBeGreaterThanOrEqual(MINIMUM)
  })

  it('is visible on the Dark background', () => {
    const darkScopes = [dark, root, theme]
    const r = ratio(
      resolve('--color-focus-ring', ...darkScopes),
      resolve('--color-background', ...darkScopes),
    )
    expect(r).toBeGreaterThanOrEqual(MINIMUM)
  })

  /*
   * The regression this file exists for. Ink is mode-invariant, so it must clear in BOTH
   * modes — a ring that only works in Dark is the exact bug that shipped, because the dark
   * background happens to be ink and hid it.
   */
  it.each([
    ['Light', [root, theme]],
    ['Dark', [dark, root, theme]],
  ] as const)('is visible on ink in %s mode', (_mode, modeScopes) => {
    const scopes = [inkSurface, ...modeScopes]
    const r = ratio(resolve('--color-focus-ring', ...scopes), resolve('--color-ink', ...scopes))
    expect(r).toBeGreaterThanOrEqual(MINIMUM)
  })

  it('is visible on the raised ink surface too, which dialogs and cards use', () => {
    for (const modeScopes of [[root, theme], [dark, root, theme]]) {
      const scopes = [inkSurface, ...modeScopes]
      const r = ratio(
        resolve('--color-focus-ring', ...scopes),
        resolve('--color-ink-raised', ...scopes),
      )
      expect(r).toBeGreaterThanOrEqual(MINIMUM)
    }
  })
})
