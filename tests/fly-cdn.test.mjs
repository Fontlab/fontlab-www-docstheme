// this_file: tests/fly-cdn.test.mjs
// Checks the CDN tree npm run build writes into docs/fly/ (SPEC 7): both release
// directories hold the same complete file set, byte-equal to the built theme assets and
// component bundle; the manifest lists every file with its size and sha256; no old prefix
// in docs/fly/ or src_docs/.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { test } from 'node:test';
import { BUNDLE_FILES, CDN, FLY_FILES, FLY_VERSION } from '../scripts/build-cdn.mjs';
import { OUT } from '../scripts/build-fly.mjs';

const root = new URL('..', import.meta.url).pathname;
const LICENSES = ['basecoat-css.txt', 'daisyui.txt', 'fly-january.txt', 'tailwindcss.txt'];

async function files(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries.filter((e) => e.isFile()).map((e) => relative(dir, join(e.parentPath, e.name))).sort();
}

const manifest = JSON.parse(await readFile(join(CDN, 'manifest.json'), 'utf8'));

test('the version is a release number and the manifest names it', () => {
  assert.match(FLY_VERSION, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.version, FLY_VERSION);
  assert.equal(manifest.latest, FLY_VERSION);
});

test('<version>/ and latest/ hold the fly assets, the component bundle and the licences', async () => {
  const expected = [...FLY_FILES, ...BUNDLE_FILES, ...LICENSES.map((name) => `licenses/${name}`)].sort();
  for (const dir of [FLY_VERSION, 'latest']) assert.deepEqual(await files(join(CDN, dir)), expected, dir);
});

test('released files are byte-equal to their build sources', async () => {
  const sources = [...FLY_FILES.map((name) => [name, join(OUT, name)]), ...BUNDLE_FILES.map((name) => [name, join(root, 'dist/1.0.0', name)])];
  for (const [name, source] of sources) {
    const built = await readFile(source);
    for (const dir of [FLY_VERSION, 'latest']) assert.ok(built.equals(await readFile(join(CDN, dir, name))), `${dir}/${name}`);
  }
});

test('the manifest lists every file under docs/fly with its size and sha256', async () => {
  const onDisk = (await files(CDN)).filter((path) => path !== 'manifest.json');
  assert.deepEqual(Object.keys(manifest.files).sort(), onDisk);
  for (const path of onDisk) {
    const bytes = await readFile(join(CDN, path));
    assert.equal(manifest.files[path].size, bytes.length, path);
    assert.equal(manifest.files[path].sha256, createHash('sha256').update(bytes).digest('hex'), path);
  }
});

test('docs/.nojekyll exists so Pages serves the tree verbatim', async () => {
  assert.ok((await stat(join(root, 'docs/.nojekyll'))).isFile());
});

test('no fl27 or fltheme27 in docs/fly or src_docs', async () => {
  const paths = [...(await files(CDN)).map((p) => join(CDN, p)), ...(await files(join(root, 'src_docs'))).filter((p) => !p.startsWith('site/')).map((p) => join(root, 'src_docs', p))];
  assert.ok(paths.length > 50);
  for (const path of paths) assert.doesNotMatch(await readFile(path, 'utf8'), /fl27|fltheme27/i, path);
});
