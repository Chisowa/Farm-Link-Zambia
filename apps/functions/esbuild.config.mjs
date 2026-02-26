import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync } from 'fs'

// Works correctly regardless of which directory this script is invoked from
const __dirname = dirname(fileURLToPath(import.meta.url))
const libDir = resolve(__dirname, 'lib')
mkdirSync(libDir, { recursive: true })

await build({
  entryPoints: [resolve(__dirname, 'src/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: resolve(libDir, 'index.js'),
  // firebase-admin and firebase-functions are provided by the Firebase runtime
  external: ['firebase-admin', 'firebase-functions'],
})

// Write a minimal package.json into lib/ so Firebase deploys from there.
// Avoids pnpm workspace:* deps that npm on the Firebase build server can't resolve.
writeFileSync(
  resolve(libDir, 'package.json'),
  JSON.stringify(
    {
      name: '@repo/functions',
      version: '0.0.0',
      main: 'index.js',
      engines: { node: '>=20' },
      dependencies: {
        'firebase-admin': '^12.1.0',
        'firebase-functions': '^6.0.0',
      },
    },
    null,
    2
  ) + '\n'
)

console.log('✓ lib/index.js and lib/package.json written')
