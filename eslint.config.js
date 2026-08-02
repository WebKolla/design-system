import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'

/**
 * Matches a CSS hex colour: #abc, #abcd, #aabbcc, #aabbccdd.
 * Deliberately anchored on a word boundary so it does not fire on things like
 * `#16` in a Figma node id (`15:53`) or an anchor href (`#pricing`).
 */
const HEX_COLOUR = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/

const NO_HEX_MESSAGE =
  'Hardcoded hex colour. Components must reference semantic tokens (e.g. `bg-primary`, `var(--color-primary)`). ' +
  'Raw colour values belong in src/tokens/ only, and are generated from the Figma variables.'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'storybook-static',
      'node_modules',
      '.archive',
      'docs',
      'coverage',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  /**
   * The no-raw-hex rule.
   *
   * Phase 0 requirement: a hardcoded hex anywhere outside src/tokens/ is a
   * build failure. This covers plain strings, template literals and JSX
   * attribute values, which is every way a colour realistically leaks into a
   * component.
   */
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/tokens/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${HEX_COLOUR}]`,
          message: NO_HEX_MESSAGE,
        },
        {
          selector: `TemplateElement[value.raw=${HEX_COLOUR}]`,
          message: NO_HEX_MESSAGE,
        },
        {
          selector: `JSXAttribute > Literal[value=${HEX_COLOUR}]`,
          message: NO_HEX_MESSAGE,
        },
      ],
    },
  },

  /**
   * Components must not carry external margin — spacing between components is
   * the parent's job (§7.5). Caught here as a Tailwind class-name check.
   */
  {
    files: ['src/components/**/*.tsx'],
    ignores: ['**/*.stories.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${HEX_COLOUR}]`,
          message: NO_HEX_MESSAGE,
        },
        {
          selector: `TemplateElement[value.raw=${HEX_COLOUR}]`,
          message: NO_HEX_MESSAGE,
        },
        {
          selector:
            'Literal[value=/(?:^|\\s)-?m[trblxy]?-(?!auto)[0-9]/]',
          message:
            'External margin on a component. Spacing between components is the parent\'s job (§7.5) — use internal padding or let the consumer space it.',
        },
      ],
    },
  },
)
