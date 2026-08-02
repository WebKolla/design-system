import * as React from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Default stroke width across the system is 1.75, not lucide's 2 (§4).
 */
export const ICON_STROKE_WIDTH = 1.75

/** Sizes in px. `sm` pairs with 13px text, `md` is the default, `lg` with headings. */
export const ICON_SIZES = { sm: 14, md: 16, lg: 20 } as const

export type IconSize = keyof typeof ICON_SIZES

export interface IconProps extends Omit<LucideProps, 'ref' | 'size' | 'color'> {
  /** Any icon from `lucide-react`, passed as the component itself. */
  icon: LucideIcon
  /** @default 'md' */
  size?: IconSize
  /**
   * Accessible label. Omit for decorative icons — they are hidden from
   * assistive technology, which is correct when adjacent text carries the
   * meaning.
   */
  label?: string
}

/**
 * Thin wrapper over lucide-react.
 *
 * Colour is never set here: icons inherit `currentColor` from the parent (§4),
 * so a Button controls its own icon colour and nothing has to be re-themed
 * per instance.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: LucideGlyph, size = 'md', label, className, strokeWidth, ...rest },
  ref,
) {
  const px = ICON_SIZES[size]

  return (
    <LucideGlyph
      ref={ref}
      width={px}
      height={px}
      strokeWidth={strokeWidth ?? ICON_STROKE_WIDTH}
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      {...rest}
    />
  )
})
