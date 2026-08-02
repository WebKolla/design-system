import * as React from 'react'
import { cn } from '@/lib/cn'

export interface FeatureCardPhotoProps
  extends Omit<React.ComponentPropsWithoutRef<'article'>, 'title'> {
  /**
   * The photograph. An `image` prop rather than an instance swap, so the card
   * does not need a variant per photograph.
   */
  image: { src: string; alt: string }
  /** Sentence-case prose in primary. **Never mono** — this is not an identifier. */
  kicker: string
  title: string
  body: string
}

/**
 * Marketing feature card with photography.
 *
 * 373 wide on the 1160 three-up grid, photo 176 tall. The kicker is Geist, not
 * mono: the marketing HTML sets it in mono at 11px, but mono is reserved for
 * hours, rates, amounts, dates and identifiers, and a kicker is prose.
 */
export const FeatureCardPhoto = React.forwardRef<
  HTMLElement,
  FeatureCardPhotoProps
>(function FeatureCardPhoto({ image, kicker, title, body, className, ...rest }, ref) {
  return (
    <article
      {...rest}
      ref={ref}
      className={cn(
        'bg-surface border-border flex w-full flex-col overflow-hidden rounded-panel border',
        className,
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-col gap-2 p-5.5">
        <span className="text-ui-xs text-primary">{kicker}</span>
        <h3 className="text-heading-card-title text-foreground">{title}</h3>
        <p className="text-body-cell text-muted-foreground">{body}</p>
      </div>
    </article>
  )
})
