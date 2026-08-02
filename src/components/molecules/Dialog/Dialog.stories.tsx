import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '@/components/atoms/Button/Button'
import { Textarea } from '@/components/atoms/Textarea/Textarea'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog'

const meta = {
  title: 'Molecules/Dialog',
  component: DialogContent,
  parameters: {
    docs: {
      description: {
        component:
          'Radius 12, `e3`, padding 24, 480 for a confirm and 640 for a form — the geometry ' +
          '`COMPONENTS.md` already specified and nothing had been built against.\n\n**Focus trap, focus ' +
          'restoration and Escape are Radix\'s**, not hand-rolled: focus is trapped while open, returns ' +
          'to whatever opened the dialog on close, and Escape closes. That is also why this and ' +
          '`Popover` are built on the same vendor rather than on two different focus ' +
          'implementations.\n\n**The three `window.confirm()` call sites in the product belong here.** ' +
          'The consultant deactivation warning about seat release is important copy sitting in a ' +
          'browser chrome box that cannot be styled, read out properly, or translated.\n\n' +
          '**A destructive confirm names the object and states the consequence.** "Deactivate Priya ' +
          'Raman?", then what deactivating releases. Never "Are you sure?".',
      },
    },
  },
  args: {
    title: 'Deactivate Priya Raman?',
    description:
      'Her seat is released at the end of the current billing period and she loses access immediately. ' +
      'Submitted timesheets are unaffected.',
  },
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

/** Shared by the confirm story and the two focus-behaviour stories. */
const ConfirmDialog: Story['render'] = (args) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive" size="md">
        Deactivate consultant
      </Button>
    </DialogTrigger>
    <DialogContent
      {...args}
      footer={
        <>
          <DialogClose asChild>
            <Button variant="secondary" size="md">
              Keep active
            </Button>
          </DialogClose>
          <Button variant="destructive" size="md">
            Deactivate
          </Button>
        </>
      }
    />
  </Dialog>
)

export const Default: Story = { render: ConfirmDialog }

/** 640 and a form in it. Secondary before primary, right-aligned. */
export const FormSize: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="md">Reject timesheet</Button>
      </DialogTrigger>
      <DialogContent
        {...args}
        size="form"
        title="Reject week ending 1 August?"
        description="Callum Byrne is told immediately and can resubmit."
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" size="md">
              Reject timesheet
            </Button>
          </>
        }
      >
        {/* Not `Field`: it wraps an `Input` and has no slot for another
            control. Noted as a follow-up rather than changed here. */}
        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="reject-reason" className="text-ui-sm text-muted-foreground">
            Reason <span className="text-danger">*</span>
          </label>
          <Textarea id="reject-reason" placeholder="Say what needs changing." />
        </div>
      </DialogContent>
    </Dialog>
  ),
}

/** Opens, names itself, and returns focus to the trigger when it closes. */
export const TrapsAndRestoresFocus: Story = {
  render: ConfirmDialog,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Deactivate consultant',
    })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: 'Deactivate Priya Raman?' })
    // Radix moves focus into the dialog; it must not be left on the trigger.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    await userEvent.click(screen.getByRole('button', { name: 'Keep active' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  },
}

/** Escape closes it, and focus still comes back. */
export const EscapeCloses: Story = {
  render: ConfirmDialog,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Deactivate consultant',
    })
    await userEvent.click(trigger)
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="md">
          Delete project
        </Button>
      </DialogTrigger>
      <DialogContent
        {...args}
        title="Delete Northgate Rail — signalling upgrade, phase two (Doncaster to Retford)?"
        description={
          'Four consultants are assigned and 312 hours are approved but not yet invoiced. Deleting ' +
          'the project leaves those hours unbillable, and there is no undo. Consider archiving it ' +
          'instead, which keeps the record and stops new time being booked against it.'
        }
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" size="md">
              Delete project
            </Button>
          </>
        }
      />
    </Dialog>
  ),
}
