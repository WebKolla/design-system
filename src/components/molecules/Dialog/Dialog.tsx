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
 * **Focus trap and Escape are Radix's, unmodified. Focus restoration is
 * not, on purpose.** Radix's `Dialog` always installs its own
 * `onCloseAutoFocus` — `event.preventDefault()` then
 * `context.triggerRef.current?.focus()` — which *replaces* `FocusScope`'s
 * own generic default (restore to whatever was focused when the dialog
 * mounted) with one that depends on a real `Dialog.Trigger` having been
 * rendered, because only `DialogTrigger` ever populates `triggerRef`. Seven
 * of the eight `Dialog` consumers in the product (`RejectDialog`,
 * `ConfirmDialog`, …) open by setting external state, not by rendering a
 * `Trigger` — for those, `triggerRef.current` is `null` forever, Radix's own
 * restore is a silent no-op, and `preventDefault()` has already suppressed
 * `FocusScope`'s fallback, so focus lands on `<body>`. Traced to source in
 * `node_modules/@radix-ui/react-dialog` (`DialogContentModal`) and
 * `node_modules/@radix-ui/react-focus-scope` (`FocusScope`'s unmount
 * effect), confirmed live: opening and closing (Escape and Cancel) leave
 * `document.activeElement` on `BODY` with a zero-length `focus()` call log —
 * not a failed restore, no restore attempt at all. BUG-D1C-004.
 *
 * The fix captures `document.activeElement` the instant `Overlay` mounts —
 * before `FocusScope`'s own mount-autofocus effect has run, so it is
 * whatever was focused immediately before the dialog opened, exactly what
 * `FocusScope`'s own default would have captured had Radix not intercepted
 * it — and restores it on close, ourselves, via `onCloseAutoFocus`. It does
 * not consult `context.triggerRef`; that context is internal to
 * `radix-ui` and not reachable from here. For the one consumer that does
 * render a real `DialogTrigger` (`generate-invoice-dialog.tsx`), this is not
 * a behaviour change: a trigger button is what has focus immediately before
 * the dialog opens, by mouse click or by keyboard activation, in every
 * browser this product tests against, so the captured element and Radix's
 * own `triggerRef` target are the same element in practice. (The one
 * platform where they could diverge is Safari on macOS, which does not
 * always focus a `<button>` on click — a pre-existing, Dialog-unrelated
 * platform quirk, not something this fix introduces or this product's test
 * suite exercises.)
 *
 * A caller-supplied `onCloseAutoFocus` still wins: it runs first, and if it
 * calls `event.preventDefault()` this restore is skipped entirely, same as
 * Radix's own composition contract. If the captured element has since left
 * the document — the row it belonged to can vanish on a successful
 * decision — this quietly does nothing rather than focusing a detached
 * node; picking a sensible next target for *that* case is app-specific and
 * stays with the caller.
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
    onCloseAutoFocus,
    ...rest
  },
  ref,
) {
  /**
   * Whatever had focus immediately before this dialog opened. Captured via a
   * ref callback on `Overlay` rather than an effect on this component,
   * because this component itself does not unmount between opens — the
   * Radix subtree gated by `Presence` does, and `Overlay` mounts inside that
   * subtree in the same commit as `Content`, before `FocusScope`'s own
   * mount-autofocus effect (a passive effect, so strictly later) can move
   * focus into the dialog. See the component doc comment for why this
   * exists instead of relying on Radix's own restore.
   */
  const openedFromRef = React.useRef<HTMLElement | null>(null)
  const captureOpener = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      openedFromRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
    }
  }, [])

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        ref={captureOpener}
        // The z scale lives outside @theme (it is not a Tailwind namespace), so
        // it is read through var() rather than a utility.
        style={{ zIndex: 'var(--z-overlay)' }}
        className="bg-ink/60 fixed inset-0"
      />
      <RadixDialog.Content
        aria-modal="true"
        {...rest}
        ref={ref}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event)
          // A caller-supplied handler that already claimed the event wins;
          // we do not fight it. Otherwise, replace Radix's own no-op
          // (triggerRef-based) restore with ours.
          if (event.defaultPrevented) return
          event.preventDefault()
          const target = openedFromRef.current
          if (target && document.contains(target)) {
            target.focus({ preventScroll: true })
          }
        }}
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
