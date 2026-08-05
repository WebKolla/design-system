import * as React from 'react'
import { Check, CircleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ChecklistTone = 'success' | 'warn'

export interface ChecklistCardItem {
  /** Defaults to `label` when omitted. Set explicitly if two items share a label. */
  id?: string
  label: string
  /** @default 'success' */
  tone?: ChecklistTone
}

export interface ChecklistCardProps
  extends React.ComponentPropsWithoutRef<'ul'> {
  items: ChecklistCardItem[]
}

// Glyph and colour move together, per item — state is never colour alone.
// `success` keeps the bare `Check` glyph the "Before you submit" card has
// always used, so an all-satisfied list renders exactly as it does today.
const glyphTone: Record<ChecklistTone, LucideIcon> = {
  success: Check,
  warn: CircleAlert,
}

const iconTone: Record<ChecklistTone, string> = {
  success: 'text-success',
  warn: 'text-warn',
}

/**
 * A per-item satisfied/warning list, for cards like "Before you submit" that
 * tell someone what is still wrong before they act.
 *
 * Copies `Toast`'s per-tone `glyphTone`/`iconTone` map rather than
 * `StatusPill`/`Chip`/`Banner`'s single whole-component tone prop, because a
 * checklist needs an independently toned icon on every row within one list,
 * not one tone for the whole thing.
 *
 * **Accessible name.** `listitem` is not one of the ARIA roles that derives
 * its name from content, so an unlabelled `<li>` has no accessible name at
 * all regardless of its text — an `aria-label` is the only mechanism that
 * actually reaches the accessibility tree here. A satisfied item's label is
 * `aria-label={item.label}`, identical to its visible text. A warning item's
 * is prefixed, `` `Warning: ${item.label}` ``, so the state survives without
 * the icon and without depending on colour. The prefix is the only
 * difference between the two: visible text, classes and icon markup are
 * otherwise the same for both tones, so an all-satisfied list still renders
 * the same content the card showed before this component existed.
 */
export const ChecklistCard = React.forwardRef<HTMLUListElement, ChecklistCardProps>(
  function ChecklistCard({ items, className, ...rest }, ref) {
    return (
      <ul {...rest} ref={ref} className={cn('flex flex-col gap-1.5', className)}>
        {items.map((item) => {
          const tone = item.tone ?? 'success'
          const Glyph = glyphTone[tone]

          return (
            <li
              key={item.id ?? item.label}
              aria-label={tone === 'warn' ? `Warning: ${item.label}` : item.label}
              className="text-body-caption text-muted-foreground flex items-start gap-2"
            >
              <span className="flex h-[18px] shrink-0 items-center">
                <Glyph
                  className={cn('size-3.5', iconTone[tone])}
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              {item.label}
            </li>
          )
        })}
      </ul>
    )
  },
)
