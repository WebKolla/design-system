/**
 * The 24 Figma text styles, plus the mobile step for each.
 *
 * Desktop values are read from Figma and authoritative.
 *
 * [code] Mobile sizes come from SPEC "Type scale" — Figma stores a single size
 * per style, so the responsive step cannot live there. Mobile is not scaled
 * desktop: Display 54→34, Hero 44→30, Section 32→24. Where SPEC gives no
 * mobile value the style does not change size.
 *
 * `.ts` deliberately — see BUG-001.
 */

export type TypeFamily = 'sans' | 'mono'

export interface TypeStyle {
  /** Figma style name. */
  figma: string
  /** Tailwind utility generated from the token. */
  utility: string
  family: TypeFamily
  weight: 400 | 500 | 600
  /** px */
  size: number
  /** px */
  lineHeight: number
  /** px, omitted when 0 */
  letterSpacing?: number
  /** px — SPEC mobile step. Equal to `size` when SPEC specifies no change. */
  mobile: number
  uppercase?: boolean
  sample: string
  note?: string
}

export interface TypeGroup {
  title: string
  blurb: string
  styles: TypeStyle[]
}

export const TYPE_SCALE: TypeGroup[] = [
  {
    title: 'heading/*',
    blurb:
      'Geist SemiBold throughout. Display and Hero are marketing-only; every app page H1 is Page title.',
    styles: [
      {
        figma: 'heading/display', utility: 'text-heading-display', family: 'sans', weight: 600,
        size: 54, lineHeight: 57.78, letterSpacing: -1.9, mobile: 34,
        sample: 'Timesheets your consultants actually submit',
        note: 'Marketing hero only',
      },
      {
        figma: 'heading/hero', utility: 'text-heading-hero', family: 'sans', weight: 600,
        size: 44, lineHeight: 47.52, letterSpacing: -1.4, mobile: 30,
        sample: 'Approvals without the chasing',
      },
      {
        figma: 'heading/section', utility: 'text-heading-section', family: 'sans', weight: 600,
        size: 32, lineHeight: 36.8, letterSpacing: -0.9, mobile: 24,
        sample: 'Built for consultancies, not agencies',
      },
      {
        figma: 'heading/page-title', utility: 'text-heading-page-title', family: 'sans', weight: 600,
        size: 24, lineHeight: 28.8, letterSpacing: -0.48, mobile: 20,
        sample: 'Invoices', note: 'Every app page H1',
      },
      {
        figma: 'heading/card-title', utility: 'text-heading-card-title', family: 'sans', weight: 600,
        size: 18, lineHeight: 23.4, letterSpacing: -0.27, mobile: 17,
        sample: 'Awaiting your approval',
      },
      {
        figma: 'heading/block', utility: 'text-heading-block', family: 'sans', weight: 600,
        size: 15, lineHeight: 19.5, mobile: 15,
        sample: 'Week commencing 28 July',
      },
    ],
  },
  {
    title: 'body/*',
    blurb: 'Geist Regular. Body is the default; Cell is table rows.',
    styles: [
      {
        figma: 'body/body-lg', utility: 'text-body-lg', family: 'sans', weight: 400,
        size: 16, lineHeight: 25.92, mobile: 15,
        sample:
          'Consultants log hours once a week. Approvers see only what they need, and finance invoices straight from approved time.',
      },
      {
        figma: 'body/body', utility: 'text-body', family: 'sans', weight: 400,
        size: 14, lineHeight: 21.7, mobile: 14,
        sample:
          'Northgate Advisory submitted 38 hours against three projects for the week ending 1 August.',
      },
      {
        figma: 'body/cell', utility: 'text-body-cell', family: 'sans', weight: 400,
        size: 13, lineHeight: 20.8, mobile: 13,
        sample: 'Pemberton Clarke — Programme delivery',
      },
      {
        figma: 'body/caption', utility: 'text-body-caption', family: 'sans', weight: 400,
        size: 12.5, lineHeight: 18.75, mobile: 12.5,
        sample: 'Approved by Rachel Adeyemi on 1 August 2026.',
      },
      {
        figma: 'body/micro', utility: 'text-body-micro', family: 'sans', weight: 400,
        size: 11.5, lineHeight: 15, mobile: 11.5,
        sample: 'Rates are hidden from approvers.',
      },
    ],
  },
  {
    title: 'ui/*',
    blurb:
      'Geist Medium — controls, labels and navigation. Overline is Geist at 0.07em, never Mono, even where the marketing HTML shows Mono.',
    styles: [
      {
        figma: 'ui/lg', utility: 'text-ui-lg', family: 'sans', weight: 500,
        size: 14.5, lineHeight: 19, mobile: 14.5, sample: 'Submit timesheet',
      },
      {
        figma: 'ui/md', utility: 'text-ui-md', family: 'sans', weight: 500,
        size: 13, lineHeight: 17, mobile: 13, sample: 'Approvals',
        note: 'Nav items are 13, not 13.5',
      },
      {
        figma: 'ui/sm', utility: 'text-ui-sm', family: 'sans', weight: 500,
        size: 12.5, lineHeight: 16, mobile: 12.5, sample: 'Filter by project',
      },
      {
        figma: 'ui/xs', utility: 'text-ui-xs', family: 'sans', weight: 500,
        size: 11.5, lineHeight: 15, mobile: 11.5, sample: 'Feature kicker',
        note: 'Sentence-case prose — replaces the 11px Mono kicker in the HTML',
      },
      {
        figma: 'ui/label', utility: 'text-ui-label', family: 'sans', weight: 500,
        size: 12, lineHeight: 16.8, mobile: 12, sample: 'Project',
      },
      {
        figma: 'ui/overline', utility: 'text-ui-overline', family: 'sans', weight: 500,
        size: 11, lineHeight: 11, letterSpacing: 0.77, mobile: 11, uppercase: true,
        sample: 'This week',
        note: 'Uppercase via text-transform in CSS; literal caps in Figma was a tooling constraint',
      },
      {
        figma: 'ui/nav-section', utility: 'text-ui-nav-section', family: 'sans', weight: 500,
        size: 10, lineHeight: 13, letterSpacing: 0.7, mobile: 10, uppercase: true,
        sample: 'Workspace',
      },
    ],
  },
  {
    title: 'mono/*',
    blurb:
      'Geist Mono, tabular. Every hour, rate, amount, date and identifier — and only those. Never overlines, kickers or labels.',
    styles: [
      {
        figma: 'mono/price', utility: 'text-mono-price', family: 'mono', weight: 600,
        size: 32, lineHeight: 32, letterSpacing: -0.96, mobile: 32,
        sample: '£29', note: 'The one sanctioned ramp exception',
      },
      {
        figma: 'mono/kpi', utility: 'text-mono-kpi', family: 'mono', weight: 600,
        size: 27, lineHeight: 32, letterSpacing: -0.4, mobile: 27, sample: '1,284.5',
      },
      {
        figma: 'mono/metric', utility: 'text-mono-metric', family: 'mono', weight: 500,
        size: 24, lineHeight: 29, mobile: 24, sample: '38.0',
      },
      {
        figma: 'mono/amount', utility: 'text-mono-amount', family: 'mono', weight: 600,
        size: 18, lineHeight: 23.4, letterSpacing: -0.27, mobile: 18, sample: '£11,400.00',
      },
      {
        figma: 'mono/cell', utility: 'text-mono-cell', family: 'mono', weight: 500,
        size: 13, lineHeight: 20, mobile: 13, sample: 'INV-2026-0184',
      },
      {
        figma: 'mono/count', utility: 'text-mono-count', family: 'mono', weight: 500,
        size: 10.5, lineHeight: 14, mobile: 10.5, sample: '03',
        note: 'Step number — genuinely an identifier',
      },
    ],
  },
]

/** Tabular figures line up: £11,400.00 and €14,280.00 must share a column. */
export const MONO_SAMPLE_COLUMN = ['£11,400.00', '€14,280.00', '£1,092.50', '£128.00']
