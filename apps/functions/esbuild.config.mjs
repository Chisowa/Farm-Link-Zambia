import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// Works correctly regardless of which directory this script is invoked from
const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [resolve(__dirname, 'src/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: resolve(__dirname, 'lib/index.js'),
  // firebase-admin and firebase-functions are provided by the Firebase runtime
  external: ['firebase-admin', 'firebase-functions'],
})
