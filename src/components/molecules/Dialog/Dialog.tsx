import * as React from 'react'
import { Dialog as RadixDialog } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Root. Controlled via `open`/`onOpenChange`, or uncontrolled with
 * `defaultOpen`. Always modal: a dialog that does not take the page is a
 * popover, and this library has one of those.
 */
export const Dialog = RadixDialog.Root

/** Wraps your own trigger. Pass `asChild` and give it a `Button`. */
export const DialogTrigger = RadixDialog.Trigger

/**
 * Closes the dialog. Wrap the cancel action and any footer control that should
 * dismiss rather than submit — `<DialogClose asChild><Button …/></DialogClose>`.
 */
export const DialogClose = RadixDialog.Close

export type DialogSize = 'confirm' | 'form'

export interface DialogContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixDialog.Content>, 'title'> {
  /**
   * `confirm` is 480 and holds a question. `form` is 640 and holds fields.
   * @default 'confirm'
   */
  size?: DialogSize
  /**
   * Required. It is the dialog's accessible name, and a dialog without one is
   * announced as "dialog" and nothing else.
   *
   * **A destructive confirm names the object and states the consequence.**
   * "Deactivate Priya Raman?" then, in the body, what deactivating releases.
   * Not "Are you sure?".
   */
  title: string
  /** One or two sentences under the title. Also the dialog's description. */
  description?: string | undefined
  /**
   * Right-aligned action row, secondary before primary. Left to the caller
   * because only the caller knows whether the primary action is `primary`,
   * `destructive` or `approve`.
   */
  footer?: React.ReactNode | undefined
  /** @default true */
  showClose?: boolean
  /** Accessible name for the corner close control. @default 'Close' */
  closeLabel?: string
}

/**
 * The dialog surface: overlay, panel, title, description and actions.
 *
 * Radius 12, `e3`, padding 24, 480 for a confirm and 640 for a form — the
 * geometry `COMPONENTS.md` already specified and nothing had been built
 * against.
 *
 * **Focus trap, focus restoration and Escape are Radix's**, not
 * hand-rolled: the content traps focus while open, returns it to whatever
 * opened the dialog on close, and closes on Escape. That is also why this
 * component and `Popover` are built on the same vendor rather than on two
 * different focus implementations.
 *
 * The three `window.confirm()` call sites in the product belong here. The
 * consultant deactivation warning about seat release is important copy sitting
 * in a browser chrome box that cannot be styled, read out properly, or
 * translated.
 *
 * **Not reviewed by design.** Surface derived from `Card`/`Toast`
 * (`bg-surface`, `border-border`, `rounded-panel`); the overlay is `--color-ink`
 * at 60%, the same ink the CTA bands and sign-in panel use.
 */
export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof RadixDialog.Content>,
  DialogContentProps
>(function DialogContent(
  {
    size = 'confirm',
    title,
    description,
    footer,
    showClose = true,
    closeLabel = 'Close',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        // The z scale lives outside @theme (it is not a Tailwind namespace), so
        // it is read through var() rather than a utility.
        style={{ zIndex: 'var(--z-overlay)' }}
        className="bg-ink/60 fixed inset-0"
      />
      <RadixDialog.Content
        {...rest}
        ref={ref}
        style={{ zIndex: 'var(--z-dialog)', ...rest.style }}
        className={cn(
          'bg-surface border-border rounded-panel fixed top-1/2 left-1/2 flex w-[calc(100vw-32px)] max-h-[calc(100vh-64px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto border p-6 shadow-e3',
          size === 'confirm' ? 'max-w-[480px]' : 'max-w-[640px]',
          className,
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <RadixDialog.Title className="text-heading-card-title text-foreground">
              {title}
            </RadixDialog.Title>
            {description ? (
              <RadixDialog.Description className="text-body-cell text-muted-foreground">
                {description}
              </RadixDialog.Description>
            ) : null}
          </div>

          {showClose ? (
            <RadixDialog.Close
              aria-label={closeLabel}
              className="text-subtle-foreground hover:bg-control rounded-control shrink-0 p-1 transition-colors"
            >
              <X className="size-4" strokeWidth={1.75} aria-hidden />
            </RadixDialog.Close>
          ) : null}
        </div>

        {children ? <div className="min-w-0">{children}</div> : null}

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2">{footer}</div>
        ) : null}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
})
