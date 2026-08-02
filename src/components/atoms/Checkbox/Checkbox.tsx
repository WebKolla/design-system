import * as React from 'react'
import { Checkbox as RadixCheckbox } from 'radix-ui'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
    'asChild'
  > {
  /**
   * Indeterminate is for the table select-all header cell when only some rows
   * are selected. Pass `'indeterminate'` as `checked`.
   */
  checked?: boolean | 'indeterminate'
}

/**
 * 14px box on a 3px radius.
 *
 * The radius is deliberately off the scale: `radius/pip` (5) on a 14px square
 * reads as a circle, and a circle means radio.
 *
 * The box is 14px but the hit area is not — wrap it in a 44px target on mobile
 * and a 34px cell in desktop tables. This component does not add that padding
 * itself, because external spacing is the parent's job.
 *
 * Keyboard handling, ARIA and the indeterminate state come from Radix.
 */
export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(function Checkbox({ className, ...rest }, ref) {
  return (
    <RadixCheckbox.Root
      {...rest}
      ref={ref}
      className={cn(
        'peer size-[14px] shrink-0 rounded-[3px] border transition-colors',
        'border-border-strong bg-surface',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <RadixCheckbox.Indicator className="text-primary-foreground flex items-center justify-center">
        {rest.checked === 'indeterminate' ? (
          // A bar, not a dash glyph.
          <Minus className="size-2.5" strokeWidth={3} aria-hidden />
        ) : (
          <Check className="size-2.5" strokeWidth={3} aria-hidden />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
})
