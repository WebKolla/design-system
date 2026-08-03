import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Textarea } from '@/components/atoms/Textarea/Textarea'
import { Field } from './Field'

/**
 * The wiring lives in `Field` and nowhere else. These assertions are the
 * contract: whichever control is inside it, the label points at it, the message
 * describes it, and an error marks it invalid.
 *
 * A story cannot express the two cases side by side against the *same*
 * expectations, which is why this is a unit file rather than more stories.
 */
describe('Field', () => {
  describe('wrapping its own Input — the shipped behaviour, unchanged', () => {
    it('associates the label with the input', () => {
      render(<Field label="Day rate" />)
      expect(screen.getByLabelText('Day rate').tagName).toBe('INPUT')
    })

    it('describes the input with the helper', () => {
      render(<Field label="Day rate" helper="Excluding VAT." />)
      expect(screen.getByLabelText('Day rate')).toHaveAccessibleDescription(
        'Excluding VAT.',
      )
    })

    it('is not invalid without an error', () => {
      render(<Field label="Day rate" helper="Excluding VAT." />)
      expect(screen.getByLabelText('Day rate')).not.toHaveAttribute('aria-invalid')
    })

    it('still forwards input props', () => {
      render(<Field label="Day rate" placeholder="0.00" inputMode="decimal" />)
      const input = screen.getByLabelText('Day rate')
      expect(input).toHaveAttribute('placeholder', '0.00')
      expect(input).toHaveAttribute('inputmode', 'decimal')
    })

    it('still forwards a ref to the input element', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Field label="Day rate" ref={ref} />)
      expect(ref.current).toBe(screen.getByLabelText('Day rate'))
    })

    it('merges the caller’s aria-describedby with its own message', () => {
      render(
        <>
          <p id="ext">Dates are UK format.</p>
          <Field label="Day rate" helper="Excluding VAT." aria-describedby="ext" />
        </>,
      )
      expect(screen.getByLabelText('Day rate')).toHaveAccessibleDescription(
        'Dates are UK format. Excluding VAT.',
      )
    })

    it('keeps the caller’s aria-describedby when there is no message at all', () => {
      render(
        <>
          <p id="ext">Dates are UK format.</p>
          <Field label="Day rate" aria-describedby="ext" />
        </>,
      )
      expect(screen.getByLabelText('Day rate')).toHaveAccessibleDescription(
        'Dates are UK format.',
      )
    })
  })

  describe('wrapping a control passed in', () => {
    it('associates the label with the control', () => {
      render(<Field label="Reason" control={<Textarea />} />)
      expect(screen.getByLabelText('Reason').tagName).toBe('TEXTAREA')
    })

    it('describes the control with the helper', () => {
      render(
        <Field
          label="Reason"
          helper="Say what needs changing."
          control={<Textarea />}
        />,
      )
      expect(screen.getByLabelText('Reason')).toHaveAccessibleDescription(
        'Say what needs changing.',
      )
    })

    it('keeps the control’s own props', () => {
      render(<Field label="Reason" control={<Textarea rows={7} />} />)
      expect(screen.getByLabelText('Reason')).toHaveAttribute('rows', '7')
    })

    it('owns the id even when the control sets one', () => {
      render(<Field label="Reason" control={<Textarea id="mine" />} />)
      const control = screen.getByLabelText('Reason')
      expect(control.id).not.toBe('mine')
      expect(document.querySelector('label')).toHaveAttribute('for', control.id)
    })

    /**
     * The first version of this test pointed at an id that did not exist in the
     * DOM, so `toHaveAccessibleDescription` returned the helper text whether the
     * implementation merged or overwrote. It proved nothing. The referenced
     * element has to exist for the assertion to have any content to miss.
     */
    it('merges the caller’s aria-describedby with its own message', () => {
      render(
        <>
          <p id="ext">Dates are UK format.</p>
          <Field
            label="Reason"
            helper="Say what needs changing."
            control={<Textarea aria-describedby="ext" />}
          />
        </>,
      )
      expect(screen.getByLabelText('Reason')).toHaveAccessibleDescription(
        'Dates are UK format. Say what needs changing.',
      )
    })

    it('keeps the caller’s aria-describedby when there is no message at all', () => {
      render(
        <>
          <p id="ext">Dates are UK format.</p>
          <Field label="Reason" control={<Textarea aria-describedby="ext" />} />
        </>,
      )
      expect(screen.getByLabelText('Reason')).toHaveAccessibleDescription(
        'Dates are UK format.',
      )
    })
  })

  /**
   * The same expectations against both controls. Whichever one is inside it,
   * the error marks *the control* invalid — not the wrapper, not the label.
   */
  interface ErrorCase {
    name: string
    field: (props: {
      label: string
      error: string
      helper?: string
      required?: boolean
    }) => React.ReactElement
  }

  const cases: ErrorCase[] = [
    { name: 'its own Input', field: (props) => <Field {...props} /> },
    {
      name: 'a Textarea passed in',
      field: (props) => <Field {...props} control={<Textarea />} />,
    },
  ]

  describe.each(cases)('the error state, with $name', ({ field }) => {
    const props = { label: 'Reason', error: 'Say what needs changing.' }

    it('marks the control invalid', () => {
      render(field(props))
      expect(screen.getByLabelText('Reason')).toHaveAttribute('aria-invalid', 'true')
    })

    it('describes the control with the error', () => {
      render(field(props))
      expect(screen.getByLabelText('Reason')).toHaveAccessibleDescription(
        'Say what needs changing.',
      )
    })

    it('replaces the helper with the error', () => {
      render(field({ ...props, helper: 'Excluding VAT.' }))
      expect(screen.queryByText('Excluding VAT.')).toBeNull()
    })

    /**
     * WCAG 4.1.3. Without this, submitting with focus on the submit button
     * changes `aria-invalid` on a control the user is not on and swaps text
     * under an id that was already referenced — nothing an AT is watching
     * changes, and the user hears silence.
     *
     * This asserts the role and the remount. It does **not** prove the
     * announcement: that needs a real screen reader.
     */
    it('announces the error with role="alert"', () => {
      render(field(props))
      expect(screen.getByRole('alert')).toHaveTextContent('Say what needs changing.')
    })

    it('does not make the helper an alert', () => {
      render(field({ ...props, error: '' , helper: 'Excluding VAT.' }))
      expect(screen.queryByRole('alert')).toBeNull()
    })

    /**
     * The transition trap: a live element that is merely *updated* does not
     * announce reliably. The error element has to be newly inserted, so the
     * node identity must change when helper becomes error.
     */
    it('remounts the message when the helper becomes an error', () => {
      const { rerender } = render(field({ ...props, error: '', helper: 'Excluding VAT.' }))
      const before = screen.getByText('Excluding VAT.')

      rerender(field(props))
      const after = screen.getByRole('alert')

      expect(after).not.toBe(before)
      expect(after).toHaveTextContent('Say what needs changing.')
    })

    /** COMPONENTS.md:54 — the marker is the only pre-submission signal a
     *  sighted user gets, and the native validation bubble is not a substitute. */
    it('draws the required marker and keeps the accessible name clean', () => {
      render(field({ ...props, required: true }))
      // By role, not by label text: the label's *text* is now "Reason *" while
      // its *accessible name* is still "Reason", which is the assertion below.
      const control = screen.getByRole('textbox')
      expect(control).toBeRequired()
      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
      expect(control).toHaveAccessibleName('Reason')
    })

    /** The label must point at something a person can actually focus. */
    it('points the label at a focusable control', () => {
      render(field(props))
      const label = document.querySelector('label')!
      const target = document.getElementById(label.htmlFor)
      expect(target).not.toBeNull()
      expect(target!.matches('input, textarea, select, [tabindex]')).toBe(true)
    })
  })

  describe('rejecting a control it cannot wire', () => {
    /**
     * A Fragment swallows the props, so the control ends up with `id=""`, the
     * label points at nothing and `getByLabelText` matches zero elements. The
     * type accepts it, so this is the only thing that can catch it.
     */
    it('throws on a Fragment', () => {
      expect(() =>
        render(
          <Field
            label="Reason"
            control={
              <>
                <Textarea />
              </>
            }
          />,
        ),
      ).toThrow(/Fragment/)
    })

    it('throws on more than one child', () => {
      expect(() =>
        render(
          <Field
            label="Reason"
            // @ts-expect-error two children is exactly what the type forbids
            control={[<Textarea key="a" />, <Textarea key="b" />]}
          />,
        ),
      ).toThrow()
    })
  })

  describe('what reaches the DOM', () => {
    /**
     * `invalid` is a library prop, not an attribute. A composite that forwards
     * unknown props to a DOM node used to make React warn; only standard ARIA
     * leaves `Field` now.
     */
    it('sends no non-standard prop to a control that forwards everything', () => {
      const warn = vi.spyOn(console, 'error').mockImplementation(() => {})
      const Passthrough = (props: React.ComponentPropsWithoutRef<'textarea'>) => (
        <textarea {...props} />
      )

      render(<Field label="Reason" error="Say what." control={<Passthrough />} />)

      const control = screen.getByLabelText('Reason')
      expect(control).toHaveAttribute('aria-invalid', 'true')
      expect(control).not.toHaveAttribute('invalid')
      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    })

    /** aria-invalid, not the private prop, is what drives the danger border. */
    it('styles a host-element control from aria-invalid alone', () => {
      render(<Field label="Reason" error="Say what." control={<textarea />} />)
      const control = screen.getByLabelText('Reason')
      expect(control).toHaveAttribute('aria-invalid', 'true')
      expect(control).not.toHaveAttribute('invalid')
    })
  })
})
