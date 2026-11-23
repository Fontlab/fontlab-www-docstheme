// this_file: tests/release-version.test.mjs
// The CDN version rules (scripts/build-cdn.mjs) and the release check (scripts/check-release.mjs):
// tag parsing, the refusal to rewrite a published version, and version agreement.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publishedConflicts, tagVersion } from '../scripts/build-cdn.mjs';
import { releaseProblems } from '../scripts/check-release.mjs';

const manifest = {
  version: '0.1.0',
  files: {
    '0.1.0/fly.css': { size: 3, sha256: 'aaa' },
    '0.1.0/licenses/x.txt': { size: 1, sha256: 'bbb' },
    'latest/fly.css': { size: 9, sha256: 'zzz' },
  },
};

test('a release tag on HEAD gives the version; other tags do not; two release tags fail', () => {
  assert.equal(tagVersion(['v1.2.3', '']), '1.2.3');
  assert.equal(tagVersion(['', 'nightly', 'v1.2']), null);
  assert.throws(() => tagVersion(['v1.0.0', 'v1.0.1']), /several release tags/);
});

test('an unpublished version may be written', () => {
  assert.deepEqual(publishedConflicts(null, '0.1.0', { 'fly.css': 'new' }), []);
  assert.deepEqual(publishedConflicts(manifest, '0.2.0', { 'fly.css': 'new' }), []);
});

test('a published version rebuilt byte for byte may be written; latest/ is not compared', () => {
  assert.deepEqual(publishedConflicts(manifest, '0.1.0', { 'fly.css': 'aaa', 'licenses/x.txt': 'bbb' }), []);
});

test('a published version with changed, added or removed files is refused', () => {
  const fresh = { 'fly.css': 'ccc', 'fly.js': 'ddd' };
  assert.deepEqual(publishedConflicts(manifest, '0.1.0', fresh), ['changed fly.css', 'added fly.js', 'removed licenses/x.txt']);
});

test('the release check passes only when tag, package, NEXT_VERSION and CDN agree', () => {
  const ok = { tag: '0.1.0', python: '0.1.0', cdn: '0.1.0', next: '0.1.0', manifest: '0.1.0', built: true };
  assert.deepEqual(releaseProblems(ok), []);
  assert.deepEqual(releaseProblems({ ...ok, tag: null }), ['HEAD has no release tag vX.Y.Z']);
  const bad = releaseProblems({ ...ok, python: '0.1.1.dev3', next: '0.2.0', manifest: '0.0.9', built: false });
  assert.equal(bad.length, 4);
  assert.match(bad[0], /Python package version 0\.1\.1\.dev3/);
});
