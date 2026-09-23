// this_file: scripts/deploy.mjs
import { cp, mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const target = '../img/docs/fltheme26';
const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
for (const [path, expected] of Object.entries(manifest.files)) {
  const bytes = await readFile(`dist/${path}`);
  if (createHash('sha256').update(bytes).digest('hex') !== expected.sha256) throw new Error(`Stale build: ${path}`);
}
await mkdir(target, { recursive: true });
await cp('dist', target, { recursive: true });
for (const [path, expected] of Object.entries(manifest.files)) {
  const bytes = await readFile(`${target}/${path}`);
  if (createHash('sha256').update(bytes).digest('hex') !== expected.sha256) throw new Error(`Copy mismatch: ${path}`);
}
console.log(`Staged and hash-verified ${Object.keys(manifest.files).length} files at ${target}`);
