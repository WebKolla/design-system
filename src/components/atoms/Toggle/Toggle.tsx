import * as React from 'react'
import { Switch } from 'radix-ui'
import { cn } from '@/lib/cn'

export type ToggleProps = Omit<
  React.ComponentPropsWithoutRef<typeof Switch.Root>,
  'asChild'
>

/**
 * Binary setting that applies immediately — no Save.
 *
 * If the change needs confirming, use a `Checkbox` inside a form instead.
 *
 * 34×20 track, 16px knob. The knob keeps a hairline shadow so it stays visible
 * against the Off track, which is only one step darker than the surface.
 */
export const Toggle = React.forwardRef<
  React.ComponentRef<typeof Switch.Root>,
  ToggleProps
>(function Toggle({ className, ...rest }, ref) {
  return (
    <Switch.Root
      {...rest}
      ref={ref}
      className={cn(
        'inline-flex h-5 w-[34px] shrink-0 items-center rounded-full p-0.5 transition-colors',
        'bg-input data-[state=checked]:bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <Switch.Thumb
        className={cn(
          'block size-4 rounded-full bg-surface shadow-e1 transition-transform',
          'data-[state=checked]:translate-x-3.5',
        )}
      />
    </Switch.Root>
  )
})
