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

/*
 * Stand-in artwork for the stories below.
 *
 * Deliberately not the real TimeSubmit files: the library ships no brand
 * assets, and a story that imported one would make the artwork slot look like
 * something the design system supplies rather than something the application
 * hands in. A clock mark and a mark-plus-wordmark lockup, sized by the
 * artwork itself, is exactly the shape a consumer passes.
 */
const ClockMark = () => (
  <svg data-testid="mark" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

/*
 * The wordmark half is drawn as bars rather than an SVG `<text>` node on
 * purpose. Real artwork sets the name in outlines, and a live text node here
 * would put a second readable "TimeSubmit" in the tree — which is both untrue
 * to the artwork and enough to make `getByText` ambiguous in the play
 * functions below.
 */
const ClockLockup = () => (
  <svg
    data-testid="lockup"
    width="120"
    height="24"
    viewBox="0 0 120 24"
    fill="none"
    aria-hidden
    focusable="false"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="30" y="7" width="76" height="5" rx="2.5" fill="currentColor" />
    <rect x="30" y="15" width="52" height="4" rx="2" fill="currentColor" />
  </svg>
)

/**
 * `mark` replaces the tile and keeps the text wordmark beside it — for a brand
 * whose mark is artwork but whose name is still set in the product's type.
 */
export const ArtworkMark: Story = {
  args: { mark: <ClockMark /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The built-in tile is gone, the text wordmark is still visible.
    await expect(canvas.queryByText('TS')).not.toBeInTheDocument()
    await expect(canvas.getByTestId('mark')).toBeInTheDocument()
    await expect(canvas.getByText('TimeSubmit')).toBeVisible()
  },
}

/**
 * `lockup` stands in for the tile *and* the wordmark, for artwork drawn as one
 * piece. The `brand` text stays in the document as `sr-only`, because the
 * artwork carries no accessible name of its own.
 */
export const ArtworkLockup: Story = {
  args: { lockup: <ClockLockup />, href: '/' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('TS')).not.toBeInTheDocument()
    await expect(canvas.getByTestId('lockup')).toBeInTheDocument()
    // Still named, and still named the same thing: the wordmark is hidden
    // from sight, not removed, so the link home is not left nameless.
    await expect(canvas.getByRole('link', { name: 'TimeSubmit' })).toBeInTheDocument()
    // `sr-only` clips rather than hiding, so this is a class assertion:
    // `toBeVisible` reads a clipped element as visible, correctly.
    await expect(canvas.getByText('TimeSubmit')).toHaveClass('sr-only')
  },
}

/**
 * The 52px collapsed rail. One artwork object is passed to every surface and
 * `wordmark={false}` picks the piece that fits: `mark`, never the lockup.
 */
export const ArtworkOnTheRail: Story = {
  args: {
    size: 'sm',
    wordmark: false,
    mark: <ClockMark />,
    lockup: <ClockLockup />,
    href: '/dashboard',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The mark, not the 120px lockup, so the 52px rail is not overrun.
    await expect(canvas.getByTestId('mark').getBoundingClientRect().width).toBe(24)
    await expect(canvas.queryByTestId('lockup')).not.toBeInTheDocument()
    // Named all the same, from the hidden wordmark.
    await expect(canvas.getByRole('link', { name: 'TimeSubmit' })).toBeInTheDocument()
  },
}
