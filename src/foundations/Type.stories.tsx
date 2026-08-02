import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { TYPE_SCALE, MONO_SAMPLE_COLUMN, type TypeStyle } from './typography'

function styleFor(s: TypeStyle, size: number): React.CSSProperties {
  const scale = size / s.size
  return {
    fontFamily: s.family === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
    fontWeight: s.weight,
    fontSize: `${size}px`,
    lineHeight: `${Math.round(s.lineHeight * scale * 100) / 100}px`,
    ...(s.letterSpacing
      ? { letterSpacing: `${Math.round(s.letterSpacing * scale * 100) / 100}px` }
      : {}),
    ...(s.uppercase ? { textTransform: 'uppercase' as const } : {}),
    ...(s.family === 'mono' ? { fontVariantNumeric: 'tabular-nums' as const } : {}),
    margin: 0,
  }
}

function Spec({ s }: { s: TypeStyle }) {
  const bits = [
    `${s.size}/${s.weight}`,
    `lh ${s.lineHeight}`,
    s.letterSpacing ? `ls ${s.letterSpacing}` : null,
    s.mobile !== s.size ? `mobile ${s.mobile}` : null,
  ].filter(Boolean)

  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--color-subtle-foreground)',
        whiteSpace: 'nowrap',
      }}
    >
      {bits.join(' · ')}
    </div>
  )
}

function Row({ s }: { s: TypeStyle }) {
  const shrinks = s.mobile !== s.size

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(150px, 200px) 1fr',
        gap: 'var(--spacing-4)',
        padding: 'var(--spacing-4) 0',
        borderTop: '1px solid var(--color-hairline)',
        alignItems: 'baseline',
      }}
    >
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.figma}</div>
        <code
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-primary)',
          }}
        >
          {s.utility}
        </code>
        <Spec s={s} />
        {s.note ? (
          <div
            style={{
              fontSize: 11,
              lineHeight: 1.45,
              marginTop: 4,
              color: 'var(--color-subtle-foreground)',
            }}
          >
            {s.note}
          </div>
        ) : null}
      </div>

      <div style={{ minWidth: 0 }}>
        <p style={styleFor(s, s.size)}>{s.sample}</p>

        {shrinks ? (
          <div
            style={{
              marginTop: 'var(--spacing-3)',
              paddingTop: 'var(--spacing-3)',
              borderTop: '1px dashed var(--color-border)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--color-subtle-foreground)',
                marginBottom: 6,
              }}
            >
              Mobile · {s.mobile}px
            </div>
            <p style={styleFor(s, s.mobile)}>{s.sample}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Ramp() {
  return (
    <div style={{ maxWidth: 1000 }}>
      {TYPE_SCALE.map((g) => (
        <section
          key={g.title}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-panel)',
            padding: 'var(--spacing-5)',
            marginBottom: 'var(--spacing-5)',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {g.title}
          </h3>
          <p
            style={{
              margin: 'var(--spacing-2) 0 0',
              maxWidth: '68ch',
              fontSize: 12.5,
              lineHeight: 1.5,
              color: 'var(--color-muted-foreground)',
            }}
          >
            {g.blurb}
          </p>
          {g.styles.map((s) => (
            <Row key={s.figma} s={s} />
          ))}
        </section>
      ))}

      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-panel)',
          padding: 'var(--spacing-5)',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Tabular figures</h3>
        <p
          style={{
            margin: 'var(--spacing-2) 0 var(--spacing-4)',
            maxWidth: '68ch',
            fontSize: 12.5,
            lineHeight: 1.5,
            color: 'var(--color-muted-foreground)',
          }}
        >
          Every figure is mono and tabular, right-aligned in tables, so amounts in
          different currencies still share a column edge.
        </p>
        <div
          style={{
            display: 'inline-block',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.6,
            borderRight: '2px solid var(--color-primary-border)',
            paddingRight: 'var(--spacing-3)',
          }}
        >
          {MONO_SAMPLE_COLUMN.map((v) => (
            <div key={v}>{v}</div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: 'Foundations/Type',
  component: Ramp,
  parameters: {
    docs: {
      description: {
        component:
          'The 24 Figma text styles. Desktop values are read from Figma and authoritative; the mobile ' +
          'step comes from SPEC, because Figma stores one size per style. Mobile is not scaled desktop — ' +
          'Display 54→34, Hero 44→30, Section 32→24 — so only styles that actually change show a mobile row.',
      },
    },
  },
} satisfies Meta<typeof Ramp>

export default meta
type Story = StoryObj<typeof meta>

export const Ramp_: Story = { name: 'Type ramp' }
