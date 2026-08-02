import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Button variants and sizes, read from Figma node 15:53 (15 variants).
 *
 * `.ts` deliberately — an exported binding in a `.tsx` file is mutated at
 * runtime by the docgen plugin. See BUG-001.
 *
 * From the Figma component description, verbatim:
 *   "Approve is reserved for the approver queue sign-off action and nowhere
 *    else. Destructive is a secondary shell with danger text, never a filled
 *    red button — a filled red button reads as the primary action on the
 *    screen, which it never is."
 *
 * Geometry per size, from the component set:
 *   Large   h42  px20  gap8  radius/button-lg  ui/lg 14.5  icon 16
 *   Medium  h34  px14  gap8  radius/button      ui/md 13    icon 15
 *   Small   h30  px11  gap7  radius/control     ui/sm 12.5  icon 14
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'font-medium select-none',
    'transition-colors',
    // Icon sizing is driven here rather than on the Icon atom so that a
    // consumer-supplied svg under `asChild` is sized identically.
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    // Disabled is a state, not a permanently-rendered control: never ship a
    // control that is always disabled.
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary:
          'bg-surface text-foreground border border-input hover:bg-control',
        ghost: 'bg-transparent text-muted-foreground hover:bg-control',
        approve:
          'bg-success-solid text-primary-foreground hover:bg-success',
        // Secondary shell, danger text. Never a filled red button.
        destructive:
          'bg-surface text-danger border border-input hover:bg-danger-bg hover:border-danger-border',
      },
      size: {
        lg: 'h-[42px] px-5 gap-2 rounded-button-lg text-ui-lg [&_svg]:size-4',
        md: 'h-[34px] px-3.5 gap-2 rounded-button text-ui-md [&_svg]:size-[15px]',
        sm: 'h-[30px] px-[11px] gap-[7px] rounded-control text-ui-sm [&_svg]:size-[14px]',
      },
    },
    defaultVariants: {
      // Figma's own defaults: Variant=Primary, Size=Large.
      variant: 'primary',
      size: 'lg',
    },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

/** Explicit iteration order for stories and docs. */
export const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'ghost',
  'approve',
  'destructive',
] as const

export const BUTTON_SIZES = ['lg', 'md', 'sm'] as const

/** Figma's size names, for cross-referencing against the component set. */
export const SIZE_LABEL: Record<(typeof BUTTON_SIZES)[number], string> = {
  lg: 'Large · 42',
  md: 'Medium · 34',
  sm: 'Small · 30',
}
