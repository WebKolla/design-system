import * as React from 'react'
import { Slot } from 'radix-ui'
import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { buttonVariants, type ButtonVariantProps } from './Button.constants'

export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>
export type ButtonSize = NonNullable<ButtonVariantProps['size']>

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> {
  /**
   * `approve` is reserved for the approver-queue sign-off action and nowhere
   * else. `destructive` is a secondary shell with danger text, never a filled
   * red button.
   * @default 'primary'
   */
  variant?: ButtonVariant
  /** Large 42 · Medium 34 · Small 30. @default 'lg' */
  size?: ButtonSize
  /** An icon from `lucide-react`. Omit for a label-only button. */
  icon?: LucideIcon
  /**
   * Which side the icon sits on.
   *
   * Defaults to `trailing`, which matches the component sheet and all seven
   * marketing pages. The built Figma variant set currently places it leading —
   * that discrepancy is logged and Figma is expected to follow. See NOTES.md.
   *
   * @default 'trailing'
   */
  iconPosition?: 'leading' | 'trailing'
  /** Swaps the icon for a spinner and marks the control busy. */
  loading?: boolean
  /**
   * Render as the child element instead of a `<button>` — needed so a Button
   * can be a link without duplicating its styling.
   */
  asChild?: boolean
}

/**
 * The one button.
 *
 * Five variants across, three sizes down, matching Figma node 15:53. Every
 * value comes from a semantic token; nothing here is a literal colour.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'lg',
      icon: IconGlyph,
      iconPosition = 'trailing',
      loading = false,
      asChild = false,
      disabled,
      className,
      children,
      type,
      ...rest
    },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : 'button'
    const isDisabled = disabled ?? loading

    // Under asChild the consumer owns the subtree, so injecting an icon would
    // fight Slot's single-child requirement.
    const glyph = loading ? (
      <LoaderCircle className="animate-spin" aria-hidden />
    ) : IconGlyph ? (
      <IconGlyph strokeWidth={1.75} aria-hidden />
    ) : null

    const content = asChild ? (
      children
    ) : (
      <>
        {iconPosition === 'leading' ? glyph : null}
        {children}
        {iconPosition === 'trailing' ? glyph : null}
      </>
    )

    return (
      <Comp
        {...rest}
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        // Only a real <button> takes these; Slot forwards them to whatever the
        // consumer rendered, where `type` would be invalid on an anchor.
        {...(asChild ? {} : { type: type ?? 'button', disabled: isDisabled })}
        {...(asChild && isDisabled ? { 'aria-disabled': true } : {})}
        {...(loading ? { 'aria-busy': true } : {})}
      >
        {content}
      </Comp>
    )
  },
)
