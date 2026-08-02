import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Check } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import { Separator } from '@/components/atoms/Separator/Separator'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './Popover'

const PROJECTS = ['Northgate Rail', 'Halbrook Energy', 'Pemberton Clarke']

const meta = {
  title: 'Molecules/Popover',
  component: PopoverContent,
  parameters: {
    docs: {
      description: {
        component:
          'A floating surface, positioned, focus-trapped and dismissible.\n\n**Nothing in this library ' +
          'floated before it.** `Input` with a trailing chevron renders the *closed* appearance of a ' +
          'select and `FilterSelect` renders a toolbar chip, but neither opened anything — so every ' +
          'select, menu, date picker and notification list in the product had nowhere to open ' +
          'into.\n\n**Focus trap, focus restoration and Escape are Radix\'s**: focus moves into the ' +
          'surface, cannot leave while open, returns to the trigger on close, and Escape closes. The ' +
          'same guarantees as `Dialog`, from the same implementation deliberately.\n\n`modal` defaults ' +
          'to **`true`** here, unlike Radix. An overlay that leaves focus loose behind it is reachable ' +
          'by mouse and invisible to a keyboard.\n\nBuild `Select` and `Menu` on this rather than ' +
          'beside it. A second positioning layer is a second design system.',
      },
    },
  },
  args: { label: 'Filter by project' },
  decorators: [
    (Story) => (
      <div className="flex h-64 items-start justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PopoverContent>

export default meta
type Story = StoryObj<typeof meta>

/** Shared by the default story and the two focus-behaviour stories. */
const ProjectFilter: Story['render'] = (args) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="secondary" size="md">
        Project
      </Button>
    </PopoverTrigger>
    <PopoverContent {...args} padding="compact">
      <ul className="flex flex-col">
        {PROJECTS.map((project) => (
          <li key={project}>
            <PopoverClose className="text-body-cell text-muted-foreground hover:bg-control rounded-control flex w-full items-center justify-between gap-3 px-2 py-1.5 text-left">
              {project}
              {project === 'Northgate Rail' ? (
                <Check className="text-primary size-3.5" strokeWidth={2} aria-hidden />
              ) : null}
            </PopoverClose>
          </li>
        ))}
      </ul>
    </PopoverContent>
  </Popover>
)

export const Default: Story = { render: ProjectFilter }

/** As a notification list: heading, items, and a footer action. */
export const InContext: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="md">
          Notifications
        </Button>
      </PopoverTrigger>
      <PopoverContent {...args} label="Notifications" className="w-[300px]">
        <p className="text-ui-overline text-subtle-foreground px-1 pb-2 uppercase">
          Waiting on you
        </p>
        <Separator />
        <ul className="flex flex-col gap-2 py-2">
          <li className="text-body-cell text-foreground px-1">
            Callum Byrne submitted week ending 1 August
          </li>
          <li className="text-body-cell text-foreground px-1">
            Two invoices are overdue at Halbrook Energy
          </li>
        </ul>
        <Separator />
        <div className="pt-2">
          <PopoverClose className="text-ui-sm text-primary px-1 underline-offset-4 hover:underline">
            Mark all as read
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/** Opens on the trigger, traps focus, and gives it back on close. */
export const TrapsAndRestoresFocus: Story = {
  render: ProjectFilter,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Project' })
    await userEvent.click(trigger)

    const surface = await screen.findByRole('dialog', { name: 'Filter by project' })
    await waitFor(() => expect(surface.contains(document.activeElement)).toBe(true))

    await userEvent.click(screen.getByRole('button', { name: /Halbrook Energy/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  },
}

/** Escape closes it, and focus still comes back. */
export const EscapeCloses: Story = {
  render: ProjectFilter,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Project' })
    await userEvent.click(trigger)
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  },
}

export const EdgeContent: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="md">
          Project
        </Button>
      </PopoverTrigger>
      <PopoverContent {...args} className="max-w-[280px]">
        <p className="text-body-cell text-muted-foreground">
          Northgate Rail — signalling upgrade, phase two (Doncaster to Retford), framework
          extension approved 14 July
        </p>
      </PopoverContent>
    </Popover>
  ),
}
