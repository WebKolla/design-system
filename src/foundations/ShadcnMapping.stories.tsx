import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Button } from '@/components/ui/button'

/**
 * Proof that the shadcn compatibility block resolves.
 *
 * This mounts the UNMODIFIED shadcn Button — not the TimeSubmit Button, which
 * is Phase 2 and has a different variant set and 42/34/30 heights. Its only
 * job here is to exercise the mapped names (`bg-secondary`, `bg-accent`,
 * `bg-destructive`, `text-secondary-foreground`, `ring-ring`, `rounded-md`)
 * against real DOM in both modes.
 *
 * This matters because the names cannot be checked by reading CSS variables:
 * Tailwind only generates a utility it finds in source, so an unmounted class
 * has no rule to read. Mounting is the only valid proof.
 */

const MAPPED = [
  { name: '--color-card', from: '--color-surface', utility: 'bg-card' },
  { name: '--color-popover', from: '--color-surface', utility: 'bg-popover' },
  { name: '--color-secondary', from: '--color-control', utility: 'bg-secondary' },
  { name: '--color-muted', from: '--color-control', utility: 'bg-muted' },
  { name: '--color-accent', from: '--color-primary-soft', utility: 'bg-accent' },
  { name: '--color-destructive', from: '--color-danger', utility: 'bg-destructive' },
] as const

function Mapping() {
  const host = React.useRef<HTMLDivElement>(null)
  const [used, setUsed] = React.useState<Record<string, string>>({})

  React.useLayoutEffect(() => {
    const el = host.current
    if (!el) return
    const next: Record<string, string> = {}
    for (const m of MAPPED) {
      const probe = el.querySelector<HTMLElement>(`[data-probe="${m.utility}"]`)
      if (probe) next[m.utility] = getComputedStyle(probe).backgroundColor
    }
    setUsed(next)
  }, [])

  return (
    <div ref={host} style={{ maxWidth: 1000 }}>
      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-panel)',
          padding: 'var(--spacing-5)',
          marginBottom: 'var(--spacing-5)',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
          Unmodified shadcn Button
        </h3>
        <p
          style={{
            margin: 'var(--spacing-2) 0 var(--spacing-4)',
            maxWidth: '68ch',
            fontSize: 12.5,
            lineHeight: 1.5,
            color: 'var(--color-muted-foreground)',
          }}
        >
          Not the TimeSubmit Button — that is Phase 2, with five variants and
          42/34/30 heights. This is the stock primitive, mounted only to prove the
          mapped names resolve and follow the mode.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-3)',
            alignItems: 'center',
          }}
        >
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-panel)',
          padding: 'var(--spacing-5)',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Mapped names</h3>
        <p
          style={{
            margin: 'var(--spacing-2) 0 var(--spacing-4)',
            maxWidth: '68ch',
            fontSize: 12.5,
            lineHeight: 1.5,
            color: 'var(--color-muted-foreground)',
          }}
        >
          Each swatch is painted by the shadcn utility and read back from the DOM.
          Nothing here is a TimeSubmit design decision — every one aliases a token
          defined above it.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <caption className="sr-only">shadcn name to TimeSubmit token mapping</caption>
          <thead>
            <tr
              style={{
                textAlign: 'left',
                fontSize: 11,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--color-subtle-foreground)',
              }}
            >
              <th scope="col" style={{ padding: '6px 8px 6px 0', fontWeight: 500 }}>Painted</th>
              <th scope="col" style={{ padding: '6px 8px', fontWeight: 500 }}>shadcn name</th>
              <th scope="col" style={{ padding: '6px 8px', fontWeight: 500 }}>Aliases</th>
              <th scope="col" style={{ padding: '6px 0 6px 8px', fontWeight: 500 }}>Used value</th>
            </tr>
          </thead>
          <tbody>
            {MAPPED.map((m) => (
              <tr key={m.name} style={{ borderTop: '1px solid var(--color-hairline)' }}>
                <td style={{ padding: '8px 8px 8px 0' }}>
                  <span
                    data-probe={m.utility}
                    className={m.utility}
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: 36,
                      height: 24,
                      borderRadius: 'var(--radius-pip)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                </td>
                <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  {m.name}
                </td>
                <td
                  style={{
                    padding: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--color-subtle-foreground)',
                  }}
                >
                  {m.from}
                </td>
                <td
                  style={{
                    padding: '8px 0 8px 8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {used[m.utility] ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

const meta = {
  title: 'Foundations/shadcn mapping',
  component: Mapping,
  parameters: {
    docs: {
      description: {
        component:
          'Proof that the shadcn/ui compatibility block resolves against our tokens, in both modes. ' +
          'Set the Theme toolbar to “Side by side”: the used values in the right-hand column must differ ' +
          'between the two panes, which is what shows the aliases are resolved per element rather than ' +
          'frozen at their Light value.',
      },
    },
  },
} satisfies Meta<typeof Mapping>

export default meta
type Story = StoryObj<typeof meta>

export const Proof: Story = {}
