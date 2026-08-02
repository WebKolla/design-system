import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import pkg from './package.json' with { type: 'json' }

const src = fileURLToPath(new URL('./src', import.meta.url))

/**
 * Every runtime dependency is external. A component library that bundles Radix
 * or lucide-react hands the consumer a second copy of each, and in Radix's case
 * a second set of context objects, which breaks composition silently.
 *
 * The regexes catch subpath imports too (`react/jsx-runtime`, `radix-ui/*`).
 */
const externals = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
].map((name) => new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|/)`))

/**
 * Ship `globals.css` verbatim.
 *
 * It is a Tailwind v4 source file — `@theme`, `@custom-variant`, layer
 * declarations — and must reach the consumer unprocessed so their Tailwind
 * build interprets it. Compiling it here would resolve it against this repo's
 * content, which is exactly the wrong scope.
 */
function emitTokens(): Plugin {
  return {
    name: 'timesubmit-emit-tokens',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'tokens/globals.css',
        source: readFileSync(new URL('./src/tokens/globals.css', import.meta.url), 'utf8'),
      })
    },
  }
}

// `--mode lib` selects the library build. Storybook and Vitest consume this
// same file and must not inherit `build.lib`, so the two configurations stay
// disjoint rather than merged.
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      react(),
      // Tailwind is for Storybook and the test runner. The published package
      // ships the token source, not a compiled stylesheet.
      ...(isLib
        ? [
            emitTokens(),
            dts({
              tsconfigPath: './tsconfig.lib.json',
              // Mirrors `preserveModules`: one `.d.ts` per source module,
              // rooted at `src`, so declarations sit beside their JavaScript.
              entryRoot: 'src',
              // The `@/` alias is read from tsconfig `paths` and rewritten to
              // relative specifiers in the emitted declarations. Verified after
              // every build — see the `no @/ in dist` check.
            }),
          ]
        : [tailwindcss()]),
    ],
    resolve: {
      alias: {
        '@': src,
      },
    },
    ...(isLib
      ? {
          build: {
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: true,
            // Minifying a library is the consumer's job, and it destroys the
            // readability of anything they have to debug through.
            minify: false,
            lib: {
              entry: {
                index: `${src}/index.ts`,
                shells: `${src}/shells.ts`,
              },
              formats: ['es' as const],
            },
            rollupOptions: {
              external: externals,
              output: {
                // Preserve the module graph. A single bundled file would make
                // every import of Button carry all 54 components; one file per
                // module lets the consumer's bundler drop what is unused.
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
              },
            },
          },
        }
      : {}),
  }
})
