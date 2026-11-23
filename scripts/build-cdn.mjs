// this_file: scripts/build-cdn.mjs
// Publishes the theme assets as the CDN tree served by GitHub Pages (SPEC 7):
//   docs/fly/<FLY_VERSION>/ and docs/fly/latest/: the fly assets (theme/fly_january/assets/fly,
//   built by build-fly.mjs), the Basecoat/daisyUI component bundle (dist/1.0.0/components.css
//   and basecoat.js, built by build.mjs) and licenses/;
//   docs/fly/manifest.json: size and sha256 of every file under docs/fly/.
// Other version directories already in docs/fly/ are left as they are (published versions
// are immutable); only <FLY_VERSION>/ and latest/ are rewritten. Also writes docs/.nojekyll.
// Run by build.mjs after buildFly(); ../build.sh then syncs the demo site around docs/fly/.
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUT, SCRIPTS } from './build-fly.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// The release version of the fly-january package. hatch-vcs reads the version from git
// tags and there is none yet; Task 12 tags v0.1.0. After that, bump this together with the
// tag (one place: the CDN path, the manifest and the demo pages all follow it).
export const FLY_VERSION = '0.1.0';
export const CDN = join(ROOT, 'docs/fly');
export const FLY_FILES = ['fly.css', 'fly-tokens.css', 'fly-utilities.css', ...SCRIPTS];
export const BUNDLE_FILES = ['components.css', 'basecoat.js'];
// Basecoat, daisyUI and Tailwind (dist/1.0.0/licenses) plus the theme's own licence.
const LICENSES = { 'fly-january.txt': join(ROOT, 'LICENSE') };

async function filesUnder(dir, prefix = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) out.push(...(await filesUnder(join(dir, entry.name), `${path}/`)));
    else out.push(path);
  }
  return out.sort();
}

/** Copy one release into docs/fly/<dir>/. */
async function writeRelease(dir) {
  const target = join(CDN, dir);
  await rm(target, { recursive: true, force: true });
  await mkdir(join(target, 'licenses'), { recursive: true });
  for (const name of FLY_FILES) await copyFile(join(OUT, name), join(target, name));
  for (const name of BUNDLE_FILES) await copyFile(join(ROOT, 'dist/1.0.0', name), join(target, name));
  for (const name of await readdir(join(ROOT, 'dist/1.0.0/licenses'))) {
    await copyFile(join(ROOT, 'dist/1.0.0/licenses', name), join(target, 'licenses', name));
  }
  for (const [name, source] of Object.entries(LICENSES)) await copyFile(source, join(target, 'licenses', name));
}

export async function buildCdn() {
  for (const dir of [FLY_VERSION, 'latest']) await writeRelease(dir);
  const files = {};
  for (const path of await filesUnder(CDN)) {
    if (path === 'manifest.json') continue;
    const bytes = await readFile(join(CDN, path));
    files[path] = { size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
  }
  await writeFile(join(CDN, 'manifest.json'), `${JSON.stringify({ version: FLY_VERSION, latest: FLY_VERSION, files }, null, 2)}\n`);
  await writeFile(join(ROOT, 'docs/.nojekyll'), '');
  console.log(`Built CDN tree docs/fly/{${FLY_VERSION},latest} (${Object.keys(files).length} files)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await buildCdn();
