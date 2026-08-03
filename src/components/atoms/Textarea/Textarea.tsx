import * as React from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<'textarea'> {
  /** Marks the control invalid and switches the border to danger. */
  invalid?: boolean | undefined
  /**
   * Visible lines before it scrolls. The box is `rows` lines tall and grows no
   * further on its own — a control that resizes as you type moves everything
   * below it.
   * @default 4
   */
  rows?: number
  /**
   * `resize-y` by default, because a rejection reason can run long and the
   * person writing it should be able to see it. `none` for a fixed box in a
   * dense form.
   * @default 'vertical'
   */
  resize?: 'vertical' | 'none'
}

/**
 * The multi-line text control.
 *
 * Same border, radius, focus treatment, disabled treatment and type token as
 * `Input` — deliberately, and `COMPONENTS.md` specifies inputs, selects and
 * textareas in one section for that reason. The differences are the three that
 * multi-line forces: a height driven by `rows` rather than the 38px control
 * height, vertical padding instead of vertical centring, and a resize handle.
 *
 * The focus ring is the same pairing as `Input`: a 3px `color/ring` spread
 * **plus** a primary border, because the ring alone measures 1.25:1 and fails
 * WCAG 1.4.11 as a sole indicator.
 *
 * Most textareas in the product are raw `<textarea>` elements rather than a
 * shared control, so they have drifted. This is what they become.
 *
 * **Not reviewed by design.** Every class is `Input`'s.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      invalid = false,
      rows = 4,
      resize = 'vertical',
      className,
      disabled,
      'aria-invalid': ariaInvalid,
      ...rest
    },
    ref,
  ) {
    // The prop or the attribute, as in `Input` and for the same reason:
    // `Field` sends only the standard attribute.
    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'

    return (
      <textarea
        {...rest}
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        className={cn(
          'w-full rounded-button border px-3 py-2 transition-colors',
          'bg-surface border-input',
          'focus:border-primary focus:ring-ring focus:ring-[3px] focus:outline-none',
          'text-body-cell text-foreground placeholder:text-subtle-foreground',
          // faint-foreground survives here on purpose, as in Input: WCAG 1.4.3
          // exempts inactive controls, and looking unavailable is the point.
          'disabled:cursor-not-allowed disabled:bg-control disabled:text-faint-foreground',
          isInvalid && 'border-danger',
          resize === 'vertical' ? 'resize-y' : 'resize-none',
          className,
        )}
      />
    )
  },
)
