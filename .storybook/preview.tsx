import type { Preview, Decorator } from '@storybook/react-vite'
import * as React from 'react'

/**
 * Webfonts are loaded here, not in globals.css, so that the token file stays
 * portable back into the product app — which loads Geist its own way. The
 * variable builds cover the 400/500/600 weights the ramp uses.
 */
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'

import '../src/tokens/globals.css'

/**
 * Theme decorator.
 *
 * Light/dark is a `.dark` class scope on a wrapper, matching how the product
 * applies it — never two sets of Tailwind classes. `both` renders the same
 * story twice side by side, which is the fastest way to review a component
 * against its Figma node in either mode.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals['theme'] as 'light' | 'dark' | 'both'

  const Pane = ({ mode }: { mode: 'light' | 'dark' }) => (
    <div
      className={mode === 'dark' ? 'dark' : undefined}
      style={{ colorScheme: mode }}
    >
      <div className="bg-background text-foreground min-h-24 p-6">
        <Story />
      </div>
    </div>
  )

  if (theme === 'both') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Pane mode="light" />
        <Pane mode="dark" />
      </div>
    )
  }

  return <Pane mode={theme} />
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour mode',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'both', title: 'Side by side' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: {
      // Fail the story on any violation rather than reporting quietly.
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Foundations', 'Atoms', 'Molecules', 'Organisms'],
      },
    },
  },
}

export default preview
