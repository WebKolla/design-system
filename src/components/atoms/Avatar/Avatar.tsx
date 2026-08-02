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
  /**
   * A photograph, when one exists. Initials are the fallback, and they are not
   * optional: pass them even with a `src`, because a broken image, a signed URL
   * that has expired or a user who has never uploaded one all land back on
   * them.
   *
   * The only source of these in the product is Clerk's `useUser()`, on the
   * approver profile screen.
   */
  src?: string | undefined
}

/**
 * Initials, with an optional photograph over them.
 *
 * TimeSubmit stores no profile photographs of its own; the one place a real
 * image appears is the account picture Clerk holds. So the image is the
 * exception and the initials are the component — which is why `initials` stays
 * required and a failed load silently reverts to them rather than showing a
 * broken-image glyph in a 20px circle.
 *
 * **Not reviewed by design.** The image slot adds no new value: it fills the
 * existing circle at the existing four sizes, clipped by the existing radius.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    { initials, size = 20, tone = 'neutral', label, src, className, ...rest },
    ref,
  ) {
    // Which src failed, rather than a boolean: a new src must get its own
    // attempt, and a boolean would keep the fallback forever.
    const [failed, setFailed] = React.useState<string | null>(null)
    const showImage = src !== undefined && src !== '' && failed !== src

    return (
      <span
        {...rest}
        ref={ref}
        className={cn(
          avatarVariants({ size, tone }),
          showImage && 'overflow-hidden',
          className,
        )}
        {...(showImage
          ? {}
          : label
            ? { role: 'img', 'aria-label': label }
            : { 'aria-hidden': true })}
      >
        {showImage ? (
          <img
            src={src}
            // An empty alt where there is no label, matching the initials path:
            // an avatar beside the name it depicts is decoration, and reading
            // the name twice is noise.
            alt={label ?? ''}
            className="size-full object-cover"
            onError={() => setFailed(src)}
          />
        ) : (
          initials.slice(0, 2).toUpperCase()
        )}
      </span>
    )
  },
)
