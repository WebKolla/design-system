import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Logo } from './Logo'

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          'The TimeSubmit lockup: the `TS` tile and the wordmark, at a fixed gap. One source for the ' +
          'mark, which until now was composed inline in five places.\n\n' +
          '**The two sizes are not scalings of each other, on purpose.** `md` is a 24px tile with a ' +
          '10.5px `mono/count` mark; `sm` is a 20px tile with a 9.5px mark. The arithmetic ratio would ' +
          'put `sm` at 8.75px — the sidebar has always rendered 9.5, 8.6% larger, because a mark set ' +
          'to the ratio reads thin and recessive at that size. Optical correction at small sizes is ' +
          'normal for a wordmark. It is why `ForDesigners` holds the sidebar mark as one of five ' +
          'literals outside the type ramp, and it is not a defect to be smoothed away.\n\n' +
          '`tone` is a surface question rather than a palette one: `ink` takes the mode-invariant ' +
          '`ink-foreground`, because on the ink footer and the sign-in panel the ordinary `foreground` ' +
          'flips with the theme and lands near 2:1.\n\n' +
          '`href` renders the lockup as a link home; `asChild` renders it into an element you supply, ' +
          'for a router link or a positioned wrapper.\n\n' +
          '**Unreviewed by design**, on the same terms as the ten primitives added on 2 August 2026: ' +
          'derived from what already shipped, no new token, no new geometry.',
      },
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Both lockups, together, at the sizes their call sites use. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-mono-cell text-subtle-foreground w-8">sm</span>
        <Logo size="sm" />
        <span className="text-body-caption text-subtle-foreground">
          Expanded sidebar
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-mono-cell text-subtle-foreground w-8">md</span>
        <Logo size="md" />
        <span className="text-body-caption text-subtle-foreground">
          Site header, portal header, site footer, sign in
        </span>
      </div>
    </div>
  ),
}

/** `ink` on the ink surface it exists for. Anywhere else it is the wrong tone. */
export const OnInk: Story = {
  render: () => (
    <div className="bg-ink flex flex-col gap-4 p-8">
      <Logo tone="ink" />
    </div>
  ),
}

/**
 * `sm` geometry, measured: 20px tile, 9.5px mark, 8px gap, `foreground`
 * wordmark. These are the numbers the sidebar has always rendered.
 */
export const SmGeometry: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Logo {...args} />
      {/* Reference spans: comparing computed colour against these proves the
          tone maps to the intended token without hardcoding a colour space. */}
      <span data-testid="ref-foreground" className="text-foreground">
        reference
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByText('TS')
    const wordmark = canvas.getByText('TimeSubmit')
    const lockup = tile.parentElement as HTMLElement

    await expect(getComputedStyle(lockup).columnGap).toBe('8px')
    await expect(tile.getBoundingClientRect().width).toBe(20)
    await expect(tile.getBoundingClientRect().height).toBe(20)
    await expect(getComputedStyle(tile).fontSize).toBe('9.5px')

    await expect(getComputedStyle(wordmark).color).toBe(
      getComputedStyle(canvas.getByTestId('ref-foreground')).color,
    )
  },
}

/**
 * `md` geometry, measured: 24px tile, 10.5px `mono/count` mark, 10px gap. Note
 * 20/24 × 10.5 = 8.75, not the 9.5 above — the two lockups are drawn, not
 * computed, and this pair of tests is what stops someone unifying them.
 */
export const MdGeometry: Story = {
  args: { size: 'md' },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Logo {...args} />
      <span data-testid="ref-foreground" className="text-foreground">
        reference
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByText('TS')
    const wordmark = canvas.getByText('TimeSubmit')
    const lockup = tile.parentElement as HTMLElement

    await expect(getComputedStyle(lockup).columnGap).toBe('10px')
    await expect(tile.getBoundingClientRect().width).toBe(24)
    await expect(tile.getBoundingClientRect().height).toBe(24)
    await expect(getComputedStyle(tile).fontSize).toBe('10.5px')

    await expect(getComputedStyle(wordmark).color).toBe(
      getComputedStyle(canvas.getByTestId('ref-foreground')).color,
    )
  },
}

/**
 * `tone="ink"` moves the wordmark to `ink-foreground` and nothing else — the
 * tile keeps `bg-primary`, which is legible on both surfaces.
 */
export const InkTone: Story = {
  args: { tone: 'ink' },
  render: (args) => (
    <div className="bg-ink flex items-center gap-4 p-8">
      <Logo {...args} />
      <span data-testid="ref-ink" className="text-ink-foreground">
        reference
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const wordmark = canvas.getByText('TimeSubmit')

    await expect(getComputedStyle(wordmark).color).toBe(
      getComputedStyle(canvas.getByTestId('ref-ink')).color,
    )
    await expect(getComputedStyle(canvas.getByText('TS')).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
  },
}

/** `href` renders the whole lockup as one link home. */
export const AsLink: Story = {
  args: { href: '/' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link')
    await expect(link).toHaveAttribute('href', '/')
    await expect(link).toHaveTextContent('TimeSubmit')
  },
}

/**
 * `asChild` renders into the element you supply. The sign-in panel uses it for
 * a positioned `<div>`; an application uses it for a router link.
 */
export const AsChild: Story = {
  args: { asChild: true },
  render: (args) => (
    <Logo {...args}>
      <a href="/dashboard" data-testid="router-link" />
    </Logo>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByTestId('router-link')
    await expect(link).toHaveAttribute('href', '/dashboard')
    await expect(link).toHaveTextContent('TimeSubmit')
    await expect(link.className).toContain('gap-2.5')
  },
}

/** The wordmark takes a `brand`; the tile is the mark and does not follow it. */
export const CustomBrand: Story = {
  args: { brand: 'Meridian' },
}
