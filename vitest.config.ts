import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
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
        /**
         * `tailwindcss()` is NOT optional and NOT inherited.
         *
         * Vitest reads this file *instead of* `vite.config.ts`, so the plugin
         * list here is the whole plugin list. Without Tailwind, the
         * `@import "tailwindcss"` at the top of `globals.css` is left as a bare
         * CSS import that resolves to nothing: the token custom properties load
         * (~18kB) and not one utility class does. Every story then mounts
         * unstyled, and axe's colour-contrast rule silently measures browser
         * defaults instead of the design system.
         *
         * The Storybook dev server does not have this problem — react-vite
         * merges `vite.config.ts` — which is exactly why it went unnoticed.
         */
        plugins: [tailwindcss(), storybookTest({ configDir: '.storybook' })],
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
