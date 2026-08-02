/**
 * Checks that `dist` is actually consumable.
 *
 * Each of these has a silent failure mode. An unresolved `@/` specifier builds
 * fine here and only explodes in the application. A missing `.d.ts` degrades to
 * `any` rather than erroring. An `exports` entry pointing at a file that was
 * never emitted fails at the consumer's import, not at our build.
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const dist = join(root, 'dist')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

const failures = []

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

if (!existsSync(dist)) {
  console.error('dist/ does not exist. Run `npm run build` first.')
  process.exit(1)
}

const files = await walk(dist)

// 1. No unresolved `@/` alias in anything the consumer executes or type-checks.
//    Sourcemaps are exempt: `sourcesContent` embeds the original source, alias
//    and all, which is the point of a sourcemap.
const javascript = files.filter((f) => ['.js', '.mjs', '.cjs'].includes(extname(f)))
const declarations = files.filter((f) => f.endsWith('.d.ts'))
for (const file of [...javascript, ...declarations]) {
  if (/(from|import)\s*\(?\s*['"]@\//.test(readFileSync(file, 'utf8'))) {
    failures.push(`unresolved @/ alias in ${file.replace(root, '')}`)
  }
}

// 2. Declarations exist, and in quantity — one missing barrel would otherwise
//    pass a single spot check.
if (declarations.length < 50) {
  failures.push(`only ${declarations.length} .d.ts files emitted; expected one per module`)
}

// 3. Every path named in `exports` resolves to a non-empty file.
function targets(value, path = '.') {
  if (typeof value === 'string') return [[path, value]]
  return Object.entries(value).flatMap(([k, v]) => targets(v, `${path} → ${k}`))
}
for (const [where, target] of targets(pkg.exports)) {
  const resolved = join(root, target)
  if (!existsSync(resolved) || statSync(resolved).size === 0) {
    failures.push(`exports ${where} points at ${target}, which is missing or empty`)
  }
}

// 4. React must not be a runtime dependency, or the consumer gets two copies.
for (const name of ['react', 'react-dom']) {
  if (pkg.dependencies?.[name]) failures.push(`${name} is a dependency; it must be a peer`)
  if (!pkg.peerDependencies?.[name]) failures.push(`${name} is missing from peerDependencies`)
}

if (failures.length) {
  console.error('Package verification failed:')
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}

console.log(
  `Package verified: ${javascript.length} modules, ${declarations.length} declarations, ` +
    `${targets(pkg.exports).length} export targets, no unresolved aliases.`,
)
