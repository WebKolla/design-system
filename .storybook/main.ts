import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-mcp'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      /**
       * Most components here wrap a Radix or lucide primitive, so their props
       * interfaces transitively declare the entire SVG / HTML attribute surface
       * from node_modules. Without this filter docgen enumerates all of it and
       * Storybook synthesises junk args from the result — see BUG-001.
       *
       * Keep a prop only if it is declared in our own source, or is explicitly
       * redeclared on the component's own interface.
       */
      propFilter: (prop) => {
        if (prop.declarations && prop.declarations.length > 0) {
          return prop.declarations.some(
            (decl) => !decl.fileName.includes('node_modules'),
          )
        }
        return true
      },
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    },
  },
}

export default config
