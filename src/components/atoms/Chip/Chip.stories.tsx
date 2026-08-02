import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip, type ChipTone } from './Chip'

const TONES: ChipTone[] = ['success', 'warn', 'danger', 'neutral']

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          'Small tonal label for inline metadata. Tone drives fill and text together — do not recolour ' +
          'a chip by overriding the fill alone, pick the Tone. Distinct from Status pill, which carries ' +
          'workflow state and a leading dot.',
      },
    },
  },
  args: { children: '+8.2%', tone: 'success' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {TONES.map((tone) => (
        <Chip key={tone} {...args} tone={tone}>
          {tone === 'success'
            ? '+8.2%'
            : tone === 'warn'
              ? 'Due in 3 days'
              : tone === 'danger'
                ? '−12.4%'
                : '4 projects'}
        </Chip>
      ))}
    </div>
  ),
}

/** In context: chips sit inline beside a figure, never on their own line. */
export const Inline: Story = {
  render: (args) => (
    <p className="text-body text-foreground">
      Billed this month{' '}
      <span className="font-mono tabular-nums">£11,400.00</span>{' '}
      <Chip {...args} tone="success">
        +8.2%
      </Chip>{' '}
      against June.
    </p>
  ),
}

/** Longest realistic label and a single character. Neither may clip. */
export const EdgeContent: Story = {
  render: (args) => (
    <div className="flex max-w-[280px] flex-wrap items-center gap-3">
      <Chip {...args} tone="neutral">
        Pemberton Clarke — programme delivery
      </Chip>
      <Chip {...args} tone="danger">
        !
      </Chip>
      <Chip {...args} tone="warn">
        {''}
      </Chip>
    </div>
  ),
}
