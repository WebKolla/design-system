import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) }

export default defineConfig({
  test: {
    projects: [
      /**
       * Every story, mounted in a real browser.
       *
       * This is what makes `parameters.a11y.test: 'error'` in preview.tsx
       * actually gate: axe runs against each rendered story and a violation
       * fails the run. Until this existed the parameter was inert.
       */
      {
        resolve: {
          alias,
          /**
           * Without this, Vite pre-bundles `radix-ui` against its own copy of
           * React and every hook inside Slot reads `null` —
           * "Cannot read properties of null (reading 'useCallback')".
           */
          dedupe: ['react', 'react-dom'],
        },
        plugins: [storybookTest({ configDir: '.storybook' })],
        /**
         * These are CJS and reach the browser through the a11y addon's axe
         * pipeline. Without explicit pre-bundling Vite serves them raw and the
         * named exports are missing (`does not provide an export named
         * 'elementRoles'`), and it also reloads mid-run, which vitest warns
         * causes flaky or duplicated tests.
         */
        optimizeDeps: {
          include: [
            'aria-query',
            'dom-accessibility-api',
            'axe-core',
            'lz-string',
            'pretty-format',
            'radix-ui',
            '@testing-library/dom',
            '@testing-library/user-event',
            'react/jsx-dev-runtime',
          ],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },

      /** Behaviour that a story cannot express — jsdom + Testing Library. */
      {
        resolve: { alias },
        plugins: [react()],
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./src/test/setup.ts'],
        },
      },
    ],
  },
})
