import * as React from 'react'
import { Accordion } from 'radix-ui'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface FaqAccordionRowProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Accordion.Item>, 'children'> {
  question: string
  answer: string
  /**
   * One-line summary shown in the closed state, so dealbreakers are scannable
   * without opening every row.
   */
  summary?: string | undefined
  /** Suppress the divider on the last row of a group. */
  last?: boolean
}

/**
 * FAQ row for marketing pages.
 *
 * Sits inside a bordered 12-radius container, which `AccordionGroup` supplies
 * along with the Radix `Accordion.Root`. The closed state can carry a one-line
 * summary answer so dealbreakers are scannable.
 *
 * Figma has no `chevron-up` icon and the open state there is a rotated
 * `chevron-down`. In code that is exactly what this does — a CSS rotation on
 * the same glyph — so no icon is missing.
 *
 * Keyboard handling and ARIA come from Radix.
 */
export const FaqAccordionRow = React.forwardRef<
  React.ComponentRef<typeof Accordion.Item>,
  FaqAccordionRowProps
>(function FaqAccordionRow(
  { question, answer, summary, last = false, className, ...rest },
  ref,
) {
  return (
    <Accordion.Item
      {...rest}
      ref={ref}
      className={cn(!last && 'border-hairline border-b', className)}
    >
      <Accordion.Header>
        <Accordion.Trigger
          className={cn(
            'group flex w-full items-center gap-3 px-4.5 py-3.5 text-left',
            'focus-visible:outline-focus-ring',
          )}
        >
          <span className="text-body-cell text-foreground min-w-0 flex-1">
            {question}
          </span>
          {summary ? (
            <span className="text-success text-ui-label shrink-0 group-data-[state=open]:hidden">
              {summary}
            </span>
          ) : null}
          <ChevronDown
            className="text-subtle-foreground size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
            strokeWidth={1.75}
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className="overflow-hidden">
        <p className="text-body-cell text-muted-foreground px-4.5 pb-3.5">{answer}</p>
      </Accordion.Content>
    </Accordion.Item>
  )
})
