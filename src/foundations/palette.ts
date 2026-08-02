/**
 * The colour catalogue for the Foundations story.
 *
 * Every semantic token from the Figma `Color` collection (50), grouped, each
 * paired with the background it is *intended* to sit on so the contrast figure
 * means something. A ratio against an arbitrary background is decoration.
 *
 * `.ts` deliberately — see BUG-001.
 */

/** What the token is used for, which sets the WCAG threshold. */
export type TokenKind = 'text' | 'surface' | 'line' | 'graphic'

export interface TokenEntry {
  /** Figma name, e.g. `color/primary-soft`. */
  figma: string
  /** CSS custom property. */
  cssVar: string
  /** Token whose colour this is measured against. */
  against: string
  kind: TokenKind
  note?: string
}

export interface TokenGroup {
  title: string
  blurb?: string
  /** Surface the swatches in this group are previewed on. */
  surface: string
  entries: TokenEntry[]
}

/** WCAG 2.1 minimums. Large text is 3:1 but nothing here is large-only. */
export const THRESHOLD: Record<TokenKind, number> = {
  text: 4.5,
  surface: 4.5,
  line: 3,
  graphic: 3,
}

const t = (
  figma: string,
  against: string,
  kind: TokenKind,
  note?: string,
): TokenEntry => ({
  figma,
  cssVar: `--color-${figma.replace('color/', '')}`,
  against: `--color-${against.replace('color/', '')}`,
  kind,
  ...(note ? { note } : {}),
})

export const PALETTE: TokenGroup[] = [
  {
    title: 'Surfaces',
    blurb:
      'Three surfaces, down from six. Anything needing a fourth is a layout problem wearing a colour costume. Measured against foreground, the text they carry.',
    surface: '--color-background',
    entries: [
      t('background', 'foreground', 'surface'),
      t('surface', 'foreground', 'surface'),
      t('surface-raised', 'foreground', 'surface'),
      t('control', 'foreground', 'surface'),
    ],
  },
  {
    title: 'Text',
    blurb: 'Measured against background, the default page surface.',
    surface: '--color-background',
    entries: [
      t('foreground', 'background', 'text'),
      t('muted-foreground', 'background', 'text'),
      t('subtle-foreground', 'background', 'text'),
      t('faint-foreground', 'background', 'text', 'Decorative only — not for body copy'),
    ],
  },
  {
    title: 'Lines',
    blurb: 'Non-text UI boundaries. WCAG threshold is 3:1, and hairlines are expected to sit below it — they are decorative separators, not affordances.',
    surface: '--color-background',
    entries: [
      t('border', 'background', 'line'),
      t('border-strong', 'background', 'line'),
      t('hairline', 'background', 'line', 'Deliberately sub-threshold — separator, not an affordance'),
      t('input', 'background', 'line'),
    ],
  },
  {
    title: 'Accent',
    blurb:
      'One accent, doing less. It appears on the primary button, the active nav marker, the focus ring, and the single most important figure on a screen. Not icons, not headings, not decoration.',
    surface: '--color-background',
    entries: [
      t('primary', 'primary-foreground', 'text', 'Button fill vs its own label'),
      t('primary-hover', 'primary-foreground', 'text'),
      t('primary-foreground', 'primary', 'text'),
      t('primary-soft', 'primary', 'text', 'Tinted fill carrying primary text'),
      t('primary-border', 'background', 'line'),
      t('ring', 'background', 'line', 'Focus ring'),
    ],
  },
  {
    title: 'Status',
    blurb:
      'Status colour means status. If a decorative element is emerald, "approved" has stopped meaning anything. Each measured as its text colour on its own tinted background.',
    surface: '--color-background',
    entries: [
      t('success', 'success-bg', 'text'),
      t('success-border', 'success-bg', 'line'),
      t('success-solid', 'primary-foreground', 'text', 'Solid fill vs white'),
      t('warn', 'warn-bg', 'text'),
      t('warn-border', 'warn-bg', 'line'),
      t('danger', 'danger-bg', 'text'),
      t('danger-border', 'danger-bg', 'line'),
      t('info', 'info-bg', 'text'),
      t('info-border', 'info-bg', 'line'),
      t('neutral', 'neutral-bg', 'text'),
      t('neutral-border', 'neutral-bg', 'line'),
    ],
  },
  {
    title: 'Charts',
    blurb:
      'One chart ramp, used by every chart. Chart 1 is the accent. Graphical objects need 3:1 against the surface behind them. chart-grid and chart-axis are the only second-order aliases in the collection — they point at hairline and faint-foreground.',
    surface: '--color-surface',
    entries: [
      t('chart-1', 'surface', 'graphic'),
      t('chart-2', 'surface', 'graphic'),
      t('chart-3', 'surface', 'graphic'),
      t('chart-4', 'surface', 'graphic'),
      t('chart-5', 'surface', 'graphic'),
      t('chart-6', 'surface', 'graphic'),
      t('chart-grid', 'surface', 'line', 'Alias of color/hairline'),
      t('chart-axis', 'surface', 'line', 'Alias of color/faint-foreground'),
    ],
  },
  {
    title: 'Ink — mode-invariant',
    blurb:
      'A self-contained dark palette for CTA bands, the sign-in panel and the rate-blind band. Ink is ink in both modes: these eight are identical in Light and Dark and are never overridden in .dark. Everything here is measured against ink, the surface they sit on.',
    surface: '--color-ink',
    entries: [
      t('ink', 'ink-foreground', 'surface'),
      t('ink-raised', 'ink-foreground', 'surface'),
      t('ink-foreground', 'ink', 'text'),
      t('ink-muted', 'ink', 'text'),
      t('ink-subtle', 'ink', 'text'),
      t('ink-faint', 'ink', 'text', 'Decorative only'),
      t('ink-border', 'ink', 'line', 'Separator — sub-threshold by design'),
      t('ink-accent', 'ink', 'text'),
    ],
  },
]

/**
 * The contrast trap from §8.5, shown rather than described.
 *
 * `muted-foreground` on `ink` shipped as a real bug — an arrow icon was
 * invisible on the dark CTA band. Both rows render in every mode so the
 * failure stays visible instead of living in a comment.
 */
export const INK_TRAP: Array<TokenEntry & { verdict: 'wrong' | 'right' }> = [
  { ...t('muted-foreground', 'ink', 'text'), verdict: 'wrong' },
  { ...t('ink-muted', 'ink', 'text'), verdict: 'right' },
]
