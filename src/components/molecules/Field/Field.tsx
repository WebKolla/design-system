import * as React from 'react'
import { Input, type InputProps } from '@/components/atoms/Input/Input'
import { cn } from '@/lib/cn'

/**
 * What `Field` puts on whatever control it is wrapping.
 *
 * Standard attributes only. `Input` and `Textarea` also take an `invalid` prop,
 * and `Field` deliberately does not send it: it is a library-private prop that
 * no third-party control understands, and a composite forwarding its props to a
 * DOM node would emit it as an unknown attribute. Both controls read
 * `aria-invalid` for their danger border instead, so the attribute an AT reads
 * and the border a sighted user sees cannot disagree.
 */
export interface FieldControlWiring {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
  required: true | undefined
}

interface FieldShellProps {
  label: string
  /** Hide the label visually but keep it for assistive technology. */
  hideLabel?: boolean
  /**
   * Helper text. Shown automatically whenever `error` is set — an error must
   * state what to do, never just that something is wrong.
   */
  helper?: string | undefined
  /** Error message. Replaces the helper and switches the control to danger. */
  error?: string | undefined
  /**
   * Marks the control required and draws the `*` marker `COMPONENTS.md`
   * specifies. Both, from one prop: the attribute is what is announced, and the
   * marker is the only signal a sighted user gets before they submit — the
   * native validation bubble is transient and at 400% zoom can land outside the
   * viewport entirely.
   */
  required?: boolean | undefined
  /** Applied to the field wrapper, not to the control. */
  className?: string | undefined
}

/**
 * The shipped shape: `Field` renders the `Input` itself and everything else is
 * forwarded to it. Unchanged, which is why `control` is `never` here rather
 * than absent — every existing call site type-checks exactly as before.
 */
export interface FieldWithInputProps
  extends FieldShellProps,
    Omit<InputProps, 'invalid' | 'id' | 'className' | 'required'> {
  control?: never
  /** The `Input` this field renders; it is the element the caller cannot reach. */
  ref?: React.Ref<HTMLInputElement>
}

/**
 * The control comes from outside. Nothing else is forwarded, because there is
 * no longer one control to forward it to — put control props on the element.
 */
export interface FieldWithControlProps extends FieldShellProps {
  /**
   * **A single element that renders one focusable control and forwards `id`,
   * `aria-describedby`, `aria-invalid` and `required` to it.**
   *
   * `Field` clones it with those four; leave them to `Field`. A caller's own
   * `aria-describedby` is merged rather than replaced, because it is a
   * space-separated list and a field may well point at a character counter or a
   * shared format note as well as its own message.
   *
   * A Fragment cannot receive props and is rejected in development. A composite
   * that spreads onto a wrapper `<div>` will type-check and leave the real
   * control nameless — the library's own `Input` is wrapper-plus-input and
   * works only because it spreads onto the inner element.
   */
  control: React.ReactElement<Partial<FieldControlWiring>>
  /** Put the ref on the control element — `Field` no longer owns one. */
  ref?: never
}

export type FieldProps = FieldWithInputProps | FieldWithControlProps

/**
 * One field for text, select, money and anything multi-line.
 *
 * Pass a `trailingIcon` chevron for a select; pass a `prefix` for a currency
 * field — the prefix is mono, because the value beside it is. Pass `control`
 * for anything the built-in `Input` is not, a `Textarea` above all.
 *
 * Mobile should raise the box to a 44px minimum; that is the parent's call.
 *
 * ---
 *
 * **Why `control` takes an element, and what was rejected.**
 *
 * The `useId`, the `htmlFor`/`id` pair, `aria-describedby` and `aria-invalid`
 * stay here, in one place, for every control. Only the element changes.
 *
 * - *A render prop*, `control={(wiring) => <Textarea {...wiring} />}`, hands the
 *   a11y wiring back to the caller. One forgotten spread on one screen and the
 *   error message is no longer announced, silently, and the component that was
 *   supposed to guarantee it cannot tell. Cloning cannot be forgotten.
 * - *`asChild` and `children`*, the in-house idiom on `Button`. `asChild` there
 *   means "replace the element I render", and `Field` renders a wrapper, a
 *   label, a control and a message — "replace which one?" has no obvious
 *   answer, so reusing the name would make one word mean two things. `control`
 *   names the slot it fills. The `Slot` *mechanism* is deliberately not used
 *   either: Radix lets the child's props win, and a caller-supplied `id` would
 *   then quietly break the `htmlFor` association this component exists to make.
 *   `cloneElement` puts `Field` last, so it wins.
 * - *A polymorphic `as`*, which would drag every control's props through
 *   `Field`'s own type and grow it with each new control.
 * - *A sibling `TextareaField`*, two components to keep in step forever.
 *
 * `ref` is a plain prop rather than `forwardRef` because the ref's element type
 * depends on a sibling prop: `HTMLInputElement` when `Field` renders the input,
 * and nothing at all when the caller owns the control and can put a ref on it
 * directly. `forwardRef` fixes one element type for the whole component, and
 * the honest alternative to a union here was widening to `any`.
 */
export function Field(props: FieldProps) {
  const { label, hideLabel = false, helper, error, required, className } = props

  const id = React.useId()
  const messageId = `${id}-message`
  // `||`, not `??`: a form library handing back `error=""` for "no error"
  // should show the helper, not suppress it. `invalid` reads the same way.
  const message = error || helper
  const invalid = Boolean(error)

  const wiring = (callerDescribedBy: string | undefined): FieldControlWiring => ({
    id,
    'aria-describedby': mergeDescribedBy(
      callerDescribedBy,
      message ? messageId : undefined,
    ),
    'aria-invalid': invalid || undefined,
    required: required || undefined,
  })

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn('text-ui-sm text-muted-foreground', hideLabel && 'sr-only')}
      >
        {label}
        {required ? (
          // aria-hidden so the accessible name stays "Reason" rather than
          // "Reason asterisk"; `required` on the control carries the meaning.
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        ) : null}
      </label>

      {props.control !== undefined ? (
        cloneControl(props.control, wiring)
      ) : (
        <FieldInput {...props} wiring={wiring} />
      )}

      {message ? (
        /**
         * WCAG 4.1.3. `role="alert"` only when there is an error — an always-on
         * alert announces helper text on mount.
         *
         * The `key` is load-bearing and not a list key. Helper and error share
         * `messageId`, so without it React updates the existing paragraph's text
         * and an AT has nothing to notice: the alert fires on *insertion*, and
         * an element merely re-rendered in place does not announce reliably
         * (Safari/VoiceOver especially). Keying on the state forces a remount,
         * so the alert element is genuinely new to the DOM.
         *
         * A permanently-mounted `aria-live` wrapper was the alternative. It
         * would announce twice here — once for the region's contents changing
         * and once for the alert inside it — so this component picks one
         * channel. `Toast` uses the wrapper form because it has no second one.
         */
        <p
          key={error ? 'error' : 'helper'}
          id={messageId}
          {...(error ? { role: 'alert' } : {})}
          className={cn(
            'text-body-caption',
            error ? 'text-danger' : 'text-subtle-foreground',
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}

/**
 * `aria-describedby` is a space-separated list precisely so that it can
 * accumulate. `Field` winning outright is right for `id` — one element, one id,
 * and `htmlFor` depends on it — and wrong here: a caller pointing a field at a
 * character counter or a shared "UK date format" note would lose it silently,
 * which would make a `Field` with no helper text worse than a bare `<input>`.
 */
function mergeDescribedBy(
  caller: string | undefined,
  own: string | undefined,
): string | undefined {
  return [caller, own].filter(Boolean).join(' ') || undefined
}

/**
 * `Children.only` rejects zero, two or an array. The Fragment check is separate
 * because a Fragment *is* a single valid child and silently swallows every prop
 * cloned onto it: the control ends up with no id, the label points at nothing,
 * and nothing throws. Development-only, because it costs a comparison on every
 * render and a production bundle should not pay for a wiring mistake that fails
 * loudly the first time it is run.
 */
function cloneControl(
  control: React.ReactElement<Partial<FieldControlWiring>>,
  wiring: (callerDescribedBy: string | undefined) => FieldControlWiring,
) {
  const only = React.Children.only(control)

  if (import.meta.env.DEV && only.type === React.Fragment) {
    throw new Error(
      'Field: `control` cannot be a Fragment. A Fragment cannot receive the ' +
        'id and ARIA attributes Field puts on the control, so the label would ' +
        'point at nothing. Pass the control element itself.',
    )
  }

  return React.cloneElement(only, wiring(only.props['aria-describedby']))
}

/**
 * The default control. Split out so that the shell props can be stripped by
 * destructuring rather than by a list of keys that would drift.
 */
function FieldInput({
  label: _label,
  hideLabel: _hideLabel,
  helper: _helper,
  error: _error,
  required: _required,
  className: _className,
  control: _control,
  'aria-describedby': callerDescribedBy,
  wiring,
  ref,
  ...rest
}: FieldWithInputProps & {
  wiring: (callerDescribedBy: string | undefined) => FieldControlWiring
}) {
  // Spread first, wiring last: the same precedence the clone path has.
  return <Input {...rest} ref={ref} {...wiring(callerDescribedBy)} />
}
