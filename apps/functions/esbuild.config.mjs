import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'lib/index.js',
  // firebase-admin and firebase-functions are provided by the Firebase runtime
  external: ['firebase-admin', 'firebase-functions'],
})
