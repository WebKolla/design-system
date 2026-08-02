import * as React from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ICON_SIZE_PX, ICON_STROKE_WIDTH, type IconSize } from './Icon.constants'

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
  const px = ICON_SIZE_PX[size]

  return (
    // `rest` is spread first so the component's own computed size and stroke
    // always win over caller-supplied width/height.
    <LucideGlyph
      {...rest}
      ref={ref}
      width={px}
      height={px}
      strokeWidth={strokeWidth ?? ICON_STROKE_WIDTH}
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  )
})
