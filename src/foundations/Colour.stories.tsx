import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  PALETTE,
  INK_TRAP,
  THRESHOLD,
  type TokenEntry,
  type TokenGroup,
} from './palette'
import { contrastRatio, ratioLabel, resolveColour, toHex } from './contrast'

interface Measured {
  hex: string
  againstHex: string
  ratio: number
  passes: boolean
}

/** Measure every entry against a live host element, so `.dark` applies. */
function useMeasured(
  host: React.RefObject<HTMLElement | null>,
  entries: TokenEntry[],
): Record<string, Measured> {
  const [result, setResult] = React.useState<Record<string, Measured>>({})

  React.useLayoutEffect(() => {
    const el = host.current
    if (!el) return
    const next: Record<string, Measured> = {}
    for (const e of entries) {
      const fg = resolveColour(el, e.cssVar)
      const bg = resolveColour(el, e.against)
      if (!fg || !bg) continue
      const ratio = contrastRatio(fg, bg)
      next[e.cssVar] = {
        hex: toHex(fg),
        againstHex: toHex(bg),
        ratio,
        passes: ratio >= THRESHOLD[e.kind],
      }
    }
    setResult(next)
  }, [host, entries])

  return result
}

function Verdict({ ok, note }: { ok: boolean; note?: string }) {
  return (
    <span
      title={note}
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '2px 6px',
        borderRadius: 5,
        whiteSpace: 'nowrap',
        background: ok ? 'var(--color-success-bg)' : 'var(--color-warn-bg)',
        color: ok ? 'var(--color-success)' : 'var(--color-warn)',
        border: `1px solid ${ok ? 'var(--color-success-border)' : 'var(--color-warn-border)'}`,
      }}
    >
      {ok ? 'pass' : 'below'}
    </span>
  )
}

function Swatch({ cssVar }: { cssVar: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 36,
        height: 24,
        borderRadius: 'var(--radius-pip)',
        background: `var(${cssVar})`,
        border: '1px solid var(--color-border)',
        flex: '0 0 auto',
      }}
    />
  )
}

function Group({ group }: { group: TokenGroup }) {
  const host = React.useRef<HTMLDivElement>(null)
  const measured = useMeasured(host, group.entries)
  const onInk = group.surface === '--color-ink'

  return (
    <section
      ref={host}
      style={{
        background: `var(${group.surface})`,
        color: onInk ? 'var(--color-ink-foreground)' : 'var(--color-foreground)',
        border: `1px solid ${onInk ? 'var(--color-ink-border)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-panel)',
        padding: 'var(--spacing-5)',
        marginBottom: 'var(--spacing-5)',
      }}
    >
      <h3 style={{ font: 'var(--text-heading-card-title)', fontWeight: 600, margin: 0 }}>
        {group.title}
      </h3>
      {group.blurb ? (
        <p
          style={{
            margin: 'var(--spacing-2) 0 var(--spacing-4)',
            maxWidth: '68ch',
            fontSize: 'var(--text-body-caption)',
            lineHeight: 1.5,
            color: onInk ? 'var(--color-ink-muted)' : 'var(--color-muted-foreground)',
          }}
        >
          {group.blurb}
        </p>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <caption className="sr-only">
          {group.title} tokens with resolved values and contrast ratios
        </caption>
        <thead>
          <tr
            style={{
              textAlign: 'left',
              fontSize: 11,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: onInk ? 'var(--color-ink-subtle)' : 'var(--color-subtle-foreground)',
            }}
          >
            <th scope="col" style={{ padding: '6px 8px 6px 0', fontWeight: 500 }}>
              Swatch
            </th>
            <th scope="col" style={{ padding: '6px 8px', fontWeight: 500 }}>
              Figma name
            </th>
            <th scope="col" style={{ padding: '6px 8px', fontWeight: 500 }}>
              Value
            </th>
            <th scope="col" style={{ padding: '6px 8px', fontWeight: 500 }}>
              Against
            </th>
            <th scope="col" style={{ padding: '6px 8px', fontWeight: 500 }}>
              Ratio
            </th>
            <th scope="col" style={{ padding: '6px 0 6px 8px', fontWeight: 500 }}>
              WCAG
            </th>
          </tr>
        </thead>
        <tbody>
          {group.entries.map((e) => {
            const m = measured[e.cssVar]
            return (
              <tr
                key={e.cssVar}
                style={{
                  borderTop: `1px solid ${onInk ? 'var(--color-ink-border)' : 'var(--color-hairline)'}`,
                }}
              >
                <td style={{ padding: '8px 8px 8px 0' }}>
                  <Swatch cssVar={e.cssVar} />
                </td>
                <td style={{ padding: '8px' }}>
                  <div style={{ fontWeight: 500 }}>{e.figma}</div>
                  {e.note ? (
                    <div
                      style={{
                        fontSize: 11,
                        color: onInk
                          ? 'var(--color-ink-subtle)'
                          : 'var(--color-subtle-foreground)',
                      }}
                    >
                      {e.note}
                    </div>
                  ) : null}
                </td>
                <td
                  style={{
                    padding: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {m ? m.hex : '—'}
                </td>
                <td
                  style={{
                    padding: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: onInk
                      ? 'var(--color-ink-subtle)'
                      : 'var(--color-subtle-foreground)',
                  }}
                >
                  {m ? m.againstHex : '—'}
                </td>
                <td
                  style={{
                    padding: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {m ? ratioLabel(m.ratio) : '—'}
                </td>
                <td style={{ padding: '8px 0 8px 8px' }}>
                  {m ? (
                    <Verdict
                      ok={m.passes}
                      {...(e.note ? { note: e.note } : {})}
                    />
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

/** §8.5, demonstrated rather than described. */
function InkTrap() {
  const host = React.useRef<HTMLDivElement>(null)
  const measured = useMeasured(host, INK_TRAP)

  return (
    <section
      ref={host}
      style={{
        background: 'var(--color-ink)',
        borderRadius: 'var(--radius-panel)',
        border: '1px solid var(--color-ink-border)',
        padding: 'var(--spacing-5)',
      }}
    >
      <h3
        style={{
          font: 'var(--text-heading-card-title)',
          fontWeight: 600,
          margin: 0,
          color: 'var(--color-ink-foreground)',
        }}
      >
        Contrast on ink is not automatic
      </h3>
      <p
        style={{
          margin: 'var(--spacing-2) 0 var(--spacing-4)',
          maxWidth: '68ch',
          fontSize: 'var(--text-body-caption)',
          lineHeight: 1.5,
          color: 'var(--color-ink-muted)',
        }}
      >
        This shipped as a real bug: an arrow icon rendered in muted-foreground was
        invisible on the dark CTA band. Both rows are live, so the failure stays
        visible instead of living in a comment.
      </p>

      {INK_TRAP.map((e) => {
        const m = measured[e.cssVar]
        return (
          <div
            key={e.figma + e.verdict}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-3) 0',
              borderTop: '1px solid var(--color-ink-border)',
            }}
          >
            <span
              style={{
                color: `var(${e.cssVar})`,
                fontSize: 15,
                fontWeight: 500,
                minWidth: 260,
              }}
            >
              Continue to invoicing →
            </span>
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--color-ink-subtle)',
              }}
            >
              {e.figma}
            </code>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--color-ink-foreground)',
              }}
            >
              {m ? ratioLabel(m.ratio) : '—'}
            </span>
            <Verdict ok={e.verdict === 'right'} />
            <span style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>
              {e.verdict === 'wrong' ? 'never use on ink' : 'correct'}
            </span>
          </div>
        )
      })}
    </section>
  )
}

function Palette() {
  return (
    <div style={{ maxWidth: 1000 }}>
      {PALETTE.map((g) => (
        <Group key={g.title} group={g} />
      ))}
      <InkTrap />
    </div>
  )
}

const meta = {
  title: 'Foundations/Colour',
  component: Palette,
  parameters: {
    docs: {
      description: {
        component:
          'Every semantic token in the Figma `Color` collection (50), grouped, with its resolved value ' +
          'and contrast ratio against the background it is actually intended to sit on. Values are ' +
          'measured live from the rendered DOM, so what you see is what the browser computes — not a ' +
          'transcription. Switch the Theme toolbar to “Side by side” to compare modes.',
      },
    },
  },
} satisfies Meta<typeof Palette>

export default meta
type Story = StoryObj<typeof meta>

export const AllTokens: Story = {}
