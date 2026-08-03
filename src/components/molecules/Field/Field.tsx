import * as React from 'react'
import { Input, type InputProps } from '@/components/atoms/Input/Input'
import { cn } from '@/lib/cn'

/**
 * What `Field` puts on whatever control it is wrapping.
 *
 * `invalid` is the library's own control prop; `aria-invalid` is the attribute
 * it resolves to, sent as well so that a control which is not one of ours is
 * still marked correctly.
 */
export interface FieldControlWiring {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
  invalid: boolean
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
    Omit<InputProps, 'invalid' | 'id' | 'className'> {
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
   * A single element. `Field` clones it with `id`, `aria-describedby`,
   * `aria-invalid` and `invalid`; leave those to `Field`.
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
  const { label, hideLabel = false, helper, error, className } = props

  const id = React.useId()
  const messageId = `${id}-message`
  const message = error ?? helper
  const invalid = Boolean(error)

  const wiring: FieldControlWiring = {
    id,
    'aria-describedby': message ? messageId : undefined,
    'aria-invalid': invalid || undefined,
    invalid,
  }

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn('text-ui-sm text-muted-foreground', hideLabel && 'sr-only')}
      >
        {label}
      </label>

      {props.control !== undefined ? (
        React.cloneElement(props.control, controlWiringFor(props.control, wiring))
      ) : (
        <FieldInput {...props} wiring={wiring} />
      )}

      {message ? (
        <p
          id={messageId}
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
 * `invalid` is a prop of this library's controls, not an attribute. Sending it
 * to a bare `<textarea>` or `<select>` would put an unknown attribute on a DOM
 * node and make React complain, so a host element gets the ARIA attribute only
 * — which is the half that assistive technology reads either way.
 */
function controlWiringFor(
  control: React.ReactElement,
  wiring: FieldControlWiring,
): Partial<FieldControlWiring> {
  if (typeof control.type === 'string') {
    const { invalid: _invalid, ...ariaOnly } = wiring
    return ariaOnly
  }
  return wiring
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
  className: _className,
  control: _control,
  wiring,
  ref,
  ...rest
}: FieldWithInputProps & { wiring: FieldControlWiring }) {
  return (
    <Input
      {...rest}
      ref={ref}
      id={wiring.id}
      invalid={wiring.invalid}
      aria-describedby={wiring['aria-describedby']}
    />
  )
}
