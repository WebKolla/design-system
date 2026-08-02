import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Input } from '@/components/atoms/Input/Input'
import { cn } from '@/lib/cn'

export interface FieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'invalid' | 'id'> {
  label: string
  /** Hide the label visually but keep it for assistive technology. */
  hideLabel?: boolean
  /**
   * Helper text. Shown automatically whenever `error` is set — an error must
   * state what to do, never just that something is wrong.
   */
  helper?: string | undefined
  /** Error message. Replaces the helper and switches the control to danger. */
  error?: string | undefined
  prefix?: string | undefined
  trailingIcon?: LucideIcon | undefined
}

/**
 * One field for text, select and money.
 *
 * Pass a `trailingIcon` chevron for a select; pass a `prefix` for a currency
 * field — the prefix is mono, because the value beside it is.
 *
 * Mobile should raise the box to a 44px minimum; that is the parent's call.
 */
export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  function Field(
    { label, hideLabel = false, helper, error, className, ...rest },
    ref,
  ) {
    const id = React.useId()
    const messageId = `${id}-message`
    const message = error ?? helper

    return (
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        <label
          htmlFor={id}
          className={cn(
            'text-ui-sm text-muted-foreground',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>

        <Input
          {...rest}
          ref={ref}
          id={id}
          invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
        />

        {message ? (
          <p
            id={messageId}
            className={cn(
              'text-body-caption',
              error ? 'text-danger' : 'text-subtle-foreground',
            )}
          >
            {message}
          </p>
        ) : null}
      </div>
    )
  },
)
