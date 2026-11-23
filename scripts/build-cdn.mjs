// this_file: scripts/build-cdn.mjs
// Publishes the theme assets as the CDN tree served by GitHub Pages (SPEC 7):
//   docs/fly/<FLY_VERSION>/ and docs/fly/latest/: the fly assets (theme/fly_january/assets/fly,
//   built by build-fly.mjs), the Basecoat/daisyUI component bundle (dist/1.0.0/components.css
//   and basecoat.js, built by build.mjs) and licenses/;
//   docs/fly/manifest.json: size and sha256 of every file under docs/fly/.
// Other version directories already in docs/fly/ are left as they are. A published version
// directory never changes: before writing, the new <FLY_VERSION>/ files are compared with the
// manifest on origin/main (what GitHub Pages serves), and the build stops if that version is
// published there with different files. The guard fails closed: when origin/main cannot be
// read (no such ref, a git error), an existing docs/fly/<FLY_VERSION>/ is not rewritten
// unless FLY_CDN_ALLOW_UNPUBLISHED=1 says it was never published. latest/ is rewritten every time. Also writes
// docs/.nojekyll. Run by build.mjs after buildFly(); ../build.sh then syncs the demo site
// around docs/fly/.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUT, SCRIPTS } from './build-fly.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// The version comes from the same source as the Python package's (hatch-vcs): the git tag
// vX.Y.Z when HEAD carries exactly one, else NEXT_VERSION, the release being prepared. This
// constant is the one place to bump after a release (README "Release"); npm run
// check:release verifies tag, package and CDN agree.
export const NEXT_VERSION = '0.2.1';
const RELEASE_TAG = /^v(\d+\.\d+\.\d+)$/;

/** X.Y.Z from the release tags on HEAD (none: null; several: an error). */
export function tagVersion(tags) {
  const versions = tags.map((tag) => RELEASE_TAG.exec(tag.trim())?.[1]).filter(Boolean);
  if (versions.length > 1) throw new Error(`HEAD has several release tags: ${versions.join(', ')}`);
  return versions[0] ?? null;
}

function git(...args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

export const FLY_VERSION = tagVersion((git('tag', '--points-at', 'HEAD') ?? '').split('\n')) ?? NEXT_VERSION;

/**
 * Differences between a published version and a new build of it: paths (relative to the
 * version directory) whose sha256 changed, that were added or that were removed. `published`
 * is the manifest served from origin/main (null when there is none); `fresh` maps paths to
 * sha256 of the files about to be written. An empty list means the build may write.
 */
export function publishedConflicts(published, version, fresh) {
  const prefix = `${version}/`;
  const old = Object.fromEntries(
    Object.entries(published?.files ?? {})
      .filter(([path]) => path.startsWith(prefix))
      .map(([path, entry]) => [path.slice(prefix.length), entry.sha256]),
  );
  if (!Object.keys(old).length) return [];
  const paths = [...new Set([...Object.keys(old), ...Object.keys(fresh)])].sort();
  return paths.flatMap((path) => {
    if (!(path in old)) return [`added ${path}`];
    if (!(path in fresh)) return [`removed ${path}`];
    return old[path] === fresh[path] ? [] : [`changed ${path}`];
  });
}

/**
 * What origin/main publishes: {resolved: false} when the ref or its manifest cannot be read,
 * else {resolved: true, manifest} (manifest null when origin/main has no docs/fly/ yet).
 */
function publishedState() {
  if (git('fetch', '--quiet', 'origin', 'main') === null) return { resolved: false };
  const main = git('rev-parse', '--verify', 'FETCH_HEAD^{commit}')?.trim();
  if (!main) return { resolved: false };
  const listed = git('ls-tree', '--name-only', main, 'docs/fly/manifest.json');
  if (listed === null) return { resolved: false };
  if (!listed.trim()) return { resolved: true, manifest: null };
  const text = git('show', `${main}:docs/fly/manifest.json`);
  return text === null ? { resolved: false } : { resolved: true, manifest: JSON.parse(text) };
}

/**
 * Why docs/fly/<version>/ must not be written, or null when it may. `state` is
 * publishedState(); `exists`: docs/fly/<version>/ is already on disk; `allow`:
 * FLY_CDN_ALLOW_UNPUBLISHED=1. Unknown publication state refuses an existing directory.
 */
export function cdnRefusal({ state, version, fresh, exists, allow }) {
  if (!state.resolved) {
    if (!exists || allow) return null;
    return (
      `origin/main cannot be read, so it is unknown whether docs/fly/${version}/ is published; ` +
      'run git fetch origin main, or set FLY_CDN_ALLOW_UNPUBLISHED=1 if this version was never published.'
    );
  }
  const conflicts = publishedConflicts(state.manifest, version, fresh);
  if (!conflicts.length) return null;
  return (
    `docs/fly/${version}/ is published on origin/main with different files (${conflicts.join(', ')}). ` +
    'A published version never changes: bump NEXT_VERSION in scripts/build-cdn.mjs (or tag the new release).'
  );
}
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

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** Release path -> source file for one version directory. */
async function releaseSources() {
  const sources = {};
  for (const name of FLY_FILES) sources[name] = join(OUT, name);
  for (const name of BUNDLE_FILES) sources[name] = join(ROOT, 'dist/1.0.0', name);
  for (const name of await readdir(join(ROOT, 'dist/1.0.0/licenses'))) {
    sources[`licenses/${name}`] = join(ROOT, 'dist/1.0.0/licenses', name);
  }
  for (const [name, source] of Object.entries(LICENSES)) sources[`licenses/${name}`] = source;
  return sources;
}

/** Copy one release into docs/fly/<dir>/. */
async function writeRelease(dir, sources) {
  const target = join(CDN, dir);
  await rm(target, { recursive: true, force: true });
  await mkdir(join(target, 'licenses'), { recursive: true });
  for (const [path, source] of Object.entries(sources)) await copyFile(source, join(target, path));
}

export async function buildCdn() {
  const sources = await releaseSources();
  const fresh = {};
  for (const [path, source] of Object.entries(sources)) fresh[path] = sha256(await readFile(source));
  const refusal = cdnRefusal({
    state: publishedState(),
    version: FLY_VERSION,
    fresh,
    exists: existsSync(join(CDN, FLY_VERSION)),
    allow: process.env.FLY_CDN_ALLOW_UNPUBLISHED === '1',
  });
  if (refusal) throw new Error(refusal);
  for (const dir of [FLY_VERSION, 'latest']) await writeRelease(dir, sources);
  const files = {};
  for (const path of await filesUnder(CDN)) {
    if (path === 'manifest.json') continue;
    const bytes = await readFile(join(CDN, path));
    files[path] = { size: bytes.length, sha256: sha256(bytes) };
  }
  await writeFile(join(CDN, 'manifest.json'), `${JSON.stringify({ version: FLY_VERSION, latest: FLY_VERSION, files }, null, 2)}\n`);
  await writeFile(join(ROOT, 'docs/.nojekyll'), '');
  console.log(`Built CDN tree docs/fly/{${FLY_VERSION},latest} (${Object.keys(files).length} files)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await buildCdn();
