import * as React from 'react'
import { Slot } from 'radix-ui'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

/*
 * Two lockups, one component.
 *
 * `sm` and `md` are NOT uniform scalings of each other, and that is deliberate.
 * Scaling the 24px lockup down to a 20px tile would give a 8.75px mark; the
 * sidebar renders 9.5px, 8.6% larger. That is optical correction — a wordmark
 * mark set to the arithmetic ratio reads thin and recessive at 20px — and it is
 * the reason `ForDesigners.mdx` holds "the sidebar's 20px logo mark" as one of
 * five literals outside the type ramp. Do not "fix" the ratio; the two sizes
 * are drawn, not computed.
 *
 * What this component unifies is the *source*, not the geometry. Before it, the
 * lockup was composed inline in five places and any change to the mark meant
 * finding all five.
 */
const logoVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-2.5',
    },
  },
  defaultVariants: { size: 'md' },
})

const markVariants = cva(
  'bg-primary text-primary-foreground flex items-center justify-center rounded-control font-mono',
  {
    variants: {
      size: {
        // 9.5px is a literal: the mark is sized to the 20px tile, not the ramp.
        sm: 'size-5 text-[9.5px]',
        md: 'size-6 text-mono-count',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

/*
 * `tone`, not a new token and not a colour prop.
 *
 * The wordmark is `text-foreground` on the three surface-mounted call sites
 * (sidebar, portal header, site header) and `text-ink-foreground` on the two
 * ink-mounted ones (site footer, sign-in panel). `ink/*` is the mode-invariant
 * set: on the ink panel, `foreground` would flip with the theme and land at
 * roughly 2:1 against it.
 *
 * So this is a surface question, not a palette question, which is why it is a
 * closed two-value `tone` matching `Avatar` and `Chip` rather than an open
 * `color` prop or a `className` override. A consumer that needs a third answer
 * has a surface the design system has not defined yet, and should say so rather
 * than pass a class.
 *
 * The tile keeps `bg-primary` in both tones: primary is already legible on ink
 * and on surface, and the two call sites on ink render it unchanged today.
 */
const wordmarkVariants = cva('text-heading-block', {
  variants: {
    tone: {
      default: 'text-foreground',
      ink: 'text-ink-foreground',
    },
  },
  defaultVariants: { tone: 'default' },
})

export type LogoSize = 'sm' | 'md'
export type LogoTone = 'default' | 'ink'

/**
 * Real brand artwork, in place of the built-in `TS` tile.
 *
 * **A content slot, not a destination slot.** `NavElement` and `navTarget`
 * exist to answer "where does this go", and they carry the childless-element
 * contract because the atom composes children into the element they name.
 * Nothing is composed into these: they *are* the content, so they are a plain
 * `ReactNode` and an element with children is not a mistake here. Passing one
 * of these does not change where the lockup points; `href` and `asChild` still
 * do that, and still compose around the artwork.
 *
 * Two fields because artwork comes drawn one of two ways, and the difference
 * is not something the library can infer from a node:
 *
 * - `mark` is the tile's replacement, with the text wordmark still beside it.
 * - `lockup` is the mark and the wordmark drawn as one piece, so it stands in
 *   for both. The `brand` text is then kept `sr-only`, because artwork carries
 *   no accessible name that a link home can use.
 *
 * Supply both and one object serves every surface: the 52px collapsed rail
 * asks for `wordmark={false}` and takes `mark`, everything else takes
 * `lockup`. That is why this is one type threaded through the shells rather
 * than a prop per call site.
 *
 * **The artwork sizes itself.** No width, height or colour is imposed on it —
 * `size` and `tone` continue to govern the gap and the text wordmark only, and
 * a `tone="ink"` lockup is the consumer's to draw. The only thing added is a
 * `shrink-0` flex wrapper, so the row cannot squash artwork wider than the
 * tile it replaces.
 */
export interface LogoArtwork {
  /** Replaces the built-in "TS" tile, keeping the text wordmark beside it. */
  mark?: React.ReactNode
  /** Replaces the tile and the wordmark together, for artwork drawn as a single lockup. */
  lockup?: React.ReactNode
}

export interface LogoProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children' | 'ref'>,
    LogoArtwork {
  /**
   * `md` is the 24px lockup used by the site header, site footer, portal header
   * and sign-in panel. `sm` is the 20px lockup used by the expanded sidebar,
   * where the mark sits against 236px of navigation and a 24px tile crowds it.
   * @default 'md'
   */
  size?: LogoSize
  /**
   * `ink` for the ink surfaces — the site footer and the sign-in panel.
   * @default 'default'
   */
  tone?: LogoTone
  /**
   * The wordmark. The tile stays `TS` regardless: it is the mark, not an
   * initialism generated from this string.
   * @default 'TimeSubmit'
   */
  brand?: string
  /**
   * Show the wordmark beside the tile. Set `false` for the 52px collapsed
   * rail, where there is no room for it.
   *
   * With artwork supplied this is also what picks between the two pieces: the
   * rail takes `mark`, because a lockup drawn with its wordmark does not fit
   * 52px, and falls back to `lockup` when only that was given.
   *
   * The wordmark is not removed from the document, only visually hidden. It
   * carries the lockup's accessible name — the tile is `aria-hidden`, because
   * "TS" read aloud is noise — so deleting it would leave a link to the home
   * page named nothing at all.
   * @default true
   */
  wordmark?: boolean
  /** Render as a link home. Omit for a plain `<span>`. */
  href?: string | undefined
  /**
   * Render as the child element instead of a `<span>` or `<a>` — the same
   * escape hatch `Button` and `NavItem` have. A framework router link needs the
   * lockup without the element, and the sign-in panel needs a positioned
   * `<div>` wrapper it cannot get any other way.
   *
   * The child owns its own `href`; nothing is injected. The tile and wordmark
   * are still composed here and become the child's children, so pass a
   * childless element: `<Logo asChild><Link href="/" /></Logo>`.
   *
   * @default false
   */
  asChild?: boolean
  /** The element to render into when `asChild` is set. Ignored otherwise. */
  children?: React.ReactNode
}

/**
 * The TimeSubmit lockup: the `TS` tile and the wordmark, at a fixed gap.
 *
 * One source for the mark, in two documented sizes that are not scalings of
 * each other — see the note above `logoVariants`.
 */
export const Logo = React.forwardRef<HTMLElement, LogoProps>(function Logo(
  {
    size = 'md',
    tone = 'default',
    brand = 'TimeSubmit',
  wordmark = true,
    mark,
    lockup,
    href,
    asChild = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  /*
   * Consumer element under asChild, an <a> when href is given, a <span>
   * otherwise. Same one-cast-at-the-boundary approach as NavItem: a full
   * polymorphic generic is a lot of machinery for a three-case switch.
   */
  const Comp = (asChild ? Slot.Root : href ? 'a' : 'span') as React.ElementType

  /*
   * Which piece of artwork wins, and whether the text wordmark survives it.
   *
   *   wordmark !== false, lockup given  -> lockup, text hidden (it is drawn in)
   *   wordmark !== false, mark only     -> mark, text visible beside it
   *   wordmark === false                -> mark, else lockup, else the tile
   *
   * `lockup` beats `mark` in the wordmark case and loses to it in the rail
   * case, which is the whole point: one artwork object is passed everywhere
   * and each surface takes the piece that fits it.
   *
   * Absent artwork leaves `artwork` null and `showWordmark` equal to
   * `wordmark`, so the render below is character-for-character what it was
   * before this prop existed. `logo-call-sites.test.tsx` holds that.
   */
  const hasMark = mark != null
  const hasLockup = lockup != null
  const artwork = wordmark
    ? (hasLockup ? lockup : hasMark ? mark : null)
    : (hasMark ? mark : hasLockup ? lockup : null)
  const showWordmark = wordmark && !hasLockup

  return (
    <Comp
      {...rest}
      ref={ref as never}
      {...(asChild ? {} : href ? { href } : {})}
      className={cn(logoVariants({ size }), className)}
    >
      {/* Slottable is what lets the composed tile and wordmark become the
          consumer element's children rather than being discarded. */}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : null}
      {artwork == null ? (
        <span aria-hidden className={markVariants({ size })}>
          TS
        </span>
      ) : (
        /*
         * `aria-hidden`, like the tile it replaces. The wordmark span below is
         * the lockup's accessible name in every case — visible when the text
         * is shown, `sr-only` when the artwork carries it — and artwork that
         * announced itself as well would name the link twice.
         *
         * `shrink-0` and nothing else. The wrapper exists so a flex row cannot
         * compress artwork wider than the 20/24px tile; it imposes no size, no
         * colour and no aspect ratio, because the consumer drew those.
         */
        <span aria-hidden className="flex shrink-0 items-center">
          {artwork}
        </span>
      )}
      <span
        className={cn(wordmarkVariants({ tone }), showWordmark ? '' : 'sr-only')}
      >
        {brand}
      </span>
    </Comp>
  )
})
