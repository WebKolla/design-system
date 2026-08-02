import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-medium select-none',
  {
    variants: {
      size: {
        // 8.5 and 10 are literals on purpose. Initials are sized to fit the
        // circle, so these track the diameter rather than the type ramp — a
        // change to the ramp should not move them. 34 and 44 happen to land
        // on real ramp steps and use them.
        20: 'size-5 rounded-full text-[8.5px]',
        26: 'size-[26px] rounded-full text-[10px]',
        34: 'size-[34px] rounded-full text-body-caption',
        // 44 alone is a rounded square: at that size a circle reads as a
        // social profile picture, and this is a record, not a person page.
        44: 'size-11 rounded-panel text-body-lg',
      },
      tone: {
        neutral: 'bg-border text-muted-foreground',
        primary: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: { size: 20, tone: 'neutral' },
  },
)

export type AvatarSize = 20 | 26 | 34 | 44

export interface AvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Two-letter initials. Longer strings are truncated to two characters. */
  initials: string
  /**
   * Fixed to their use: 20 inline in a table cell, 26 in a topbar or list row,
   * 34 in a card header, 44 on a record header.
   * @default 20
   */
  size?: AvatarSize
  /**
   * `primary` is reserved for the signed-in user and the record subject.
   * @default 'neutral'
   */
  tone?: 'neutral' | 'primary'
  /**
   * Accessible name, e.g. the full person's name. Without it the avatar is
   * decorative and hidden — correct when the name is already beside it.
   */
  label?: string
}

/**
 * Initials only.
 *
 * TimeSubmit stores no profile photographs, so an image avatar would always be
 * a placeholder.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    { initials, size = 20, tone = 'neutral', label, className, ...rest },
    ref,
  ) {
    return (
      <span
        {...rest}
        ref={ref}
        className={cn(avatarVariants({ size, tone }), className)}
        {...(label
          ? { role: 'img', 'aria-label': label }
          : { 'aria-hidden': true })}
      >
        {initials.slice(0, 2).toUpperCase()}
      </span>
    )
  },
)
