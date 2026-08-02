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
 *
 * **Touch targets.** All three heights are short of the 44px floor that
 * Apple's HIG and WCAG 2.5.5 both use. Rather than change heights that Figma
 * and SPEC both state explicitly, each size widens its hit area with a
 * transparent `::after`, so every button measures 44 to a finger and its Figma
 * height to the eye. Nothing on screen moves and Figma stays correct.
 *
 *   Large   42 → 44   1px proud
 *   Medium  34 → 44   5px proud
 *   Small   30 → 44   7px proud
 *
 * `pointer: coarse` was the obvious alternative and is worse: it reports the
 * *primary* pointer, so a touchscreen laptop with a trackpad reads as `fine`
 * and would keep the small target. `any-pointer: coarse` overcorrects the
 * other way and inflates every desktop with a touchscreen. Expanding
 * unconditionally costs nothing, because the expansion is invisible.
 *
 * **The one caveat.** Two Small buttons stacked vertically closer than
 * `gap-4` (16px) have hit areas that overlap by a pixel or two, which shifts
 * the boundary between them very slightly. That is a far smaller problem than
 * a 30px target, but it is why the expansion is vertical only — horizontally
 * these buttons are already well over 44 once they have a label.
 */
export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center whitespace-nowrap',
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
        // ink-foreground, not primary-foreground: the latter flips to ink/950
        // in dark mode, putting dark text on the green fill at 2.98:1.
        approve:
          'bg-success-solid text-ink-foreground hover:bg-success',
        // Secondary shell, danger text. Never a filled red button.
        destructive:
          'bg-surface text-danger border border-input hover:bg-danger-bg hover:border-danger-border',
      },
      size: {
        // Heights are Figma's and stay Figma's; each ::after buys the
        // difference up to 44. See the touch-target note in the file header.
        lg: [
          'h-[42px] px-5 gap-2 rounded-button-lg text-ui-lg [&_svg]:size-4',
          "after:absolute after:inset-x-0 after:-inset-y-px after:content-['']",
        ].join(' '),
        md: [
          'h-[34px] px-3.5 gap-2 rounded-button text-ui-md [&_svg]:size-[15px]',
          "after:absolute after:inset-x-0 after:-inset-y-[5px] after:content-['']",
        ].join(' '),
        sm: [
          'h-[30px] px-[11px] gap-[7px] rounded-control text-ui-sm [&_svg]:size-[14px]',
          "after:absolute after:inset-x-0 after:-inset-y-[7px] after:content-['']",
        ].join(' '),
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
