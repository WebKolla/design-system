import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cn, TYPE_RAMP } from './cn'

/**
 * Read from disk, not `import ... from '...css?raw'`. Vitest stubs CSS imports
 * by default, so the `?raw` form silently resolves to an empty string and every
 * assertion below passes against nothing.
 */
const TOKENS = readFileSync(
  resolve(process.cwd(), 'src/tokens/globals.css'),
  'utf-8',
)

/**
 * Every `--text-*` size token has to be registered in `TYPE_RAMP`, or
 * tailwind-merge classifies it as a text *colour* and drops whatever real
 * colour class shares the element. That shipped once — every Button label
 * rendered the inherited foreground because `text-ui-lg` was eating
 * `text-primary-foreground`.
 *
 * It is a nasty bug to find by eye, because it only affects the one token
 * somebody forgot to add.
 */
function declaredTextTokens(): string[] {
  const names = new Set<string>()
  // Size declarations only: `--text-foo: 12px`. The `--text-foo--line-height`
  // and `--font-weight` companions are not utilities and must not be counted.
  for (const m of TOKENS.matchAll(/^\s*--text-([a-z0-9-]+):\s*[\d.]+px;/gm)) {
    const name = m[1]
    if (name && !name.includes('--')) names.add(name)
  }
  return [...names].sort()
}

describe('type ramp registration', () => {
  it('registers every --text-* token declared in globals.css', () => {
    const missing = declaredTextTokens().filter(
      (t) => !(TYPE_RAMP as readonly string[]).includes(t),
    )
    expect(missing).toEqual([])
  })

  it('has no entry that no longer exists in globals.css', () => {
    const declared = declaredTextTokens()
    const stale = TYPE_RAMP.filter((t) => !declared.includes(t))
    expect(stale).toEqual([])
  })
})

describe('cn', () => {
  it('keeps a size and a colour that share the text-* namespace', () => {
    // The exact pairing that used to collapse.
    expect(cn('text-primary-foreground', 'text-ui-lg')).toBe(
      'text-primary-foreground text-ui-lg',
    )
  })

  it('still lets a later size win over an earlier one', () => {
    expect(cn('text-mono-sm', 'text-mono-md')).toBe('text-mono-md')
  })

  it('still lets a later colour win over an earlier one', () => {
    expect(cn('text-foreground', 'text-danger')).toBe('text-danger')
  })
})
