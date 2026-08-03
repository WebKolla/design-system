import * as React from 'react'
import { describe, expect, it } from 'vitest'
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

    it('owns aria-describedby even when the control sets one', () => {
      render(
        <Field
          label="Reason"
          helper="Say what needs changing."
          control={<Textarea aria-describedby="somewhere-else" />}
        />,
      )
      expect(screen.getByLabelText('Reason')).toHaveAccessibleDescription(
        'Say what needs changing.',
      )
    })
  })

  /**
   * The same expectations against both controls. Whichever one is inside it,
   * the error marks *the control* invalid — not the wrapper, not the label.
   */
  interface ErrorCase {
    name: string
    field: (props: { label: string; error: string; helper?: string }) => React.ReactElement
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
  })
})
