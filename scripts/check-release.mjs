// this_file: scripts/check-release.mjs
// Release check (npm run check:release; README "Release"): on a tagged release commit the
// git tag, the Python package version (hatch-vcs, read with setuptools-scm as hatch-vcs does,
// no local part), NEXT_VERSION and the built CDN tree (docs/fly/manifest.json and
// docs/fly/<version>/) must all name the same X.Y.Z. Exits 1 and lists every mismatch.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CDN, FLY_VERSION, NEXT_VERSION, tagVersion } from './build-cdn.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Mismatches between the versions a release must agree on (empty: release is consistent). */
export function releaseProblems({ tag, python, cdn, next, manifest, built }) {
  if (!tag) return ['HEAD has no release tag vX.Y.Z'];
  const problems = [];
  if (python !== tag) problems.push(`Python package version ${python} is not the tag ${tag}`);
  if (cdn !== tag) problems.push(`CDN version ${cdn} is not the tag ${tag}`);
  if (next !== tag) problems.push(`NEXT_VERSION ${next} is not the tag ${tag} (tag the version NEXT_VERSION names)`);
  if (manifest !== tag) problems.push(`docs/fly/manifest.json names ${manifest}, not ${tag} (run ./build.sh)`);
  if (!built) problems.push(`docs/fly/${tag}/ is missing (run ./build.sh)`);
  return problems;
}

function pythonVersion() {
  const code = "from setuptools_scm import get_version; print(get_version(local_scheme='no-local-version'))";
  const args = ['run', '--no-project', '--python', '3.13', '--with', 'setuptools-scm', 'python', '-c', code];
  return execFileSync('uv', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const tags = execFileSync('git', ['tag', '--points-at', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).split('\n');
  const tag = tagVersion(tags);
  const manifestPath = join(CDN, 'manifest.json');
  const problems = releaseProblems({
    tag,
    python: pythonVersion(),
    cdn: FLY_VERSION,
    next: NEXT_VERSION,
    manifest: existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')).version : null,
    built: tag !== null && existsSync(join(CDN, tag)),
  });
  for (const problem of problems) console.error(`release check: ${problem}`);
  if (problems.length) process.exit(1);
  console.log(`release check: tag, package, NEXT_VERSION and CDN all ${tag}`);
}
