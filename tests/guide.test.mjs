// this_file: tests/guide.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

test('public configuration and template examples match the downloadable starter', async () => {
  const guide = await readFile('examples/index.html', 'utf8');
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  for (const path of ['mkdocs.yml', 'overrides/main.html']) {
    const source = await readFile(`examples/starter/${path}`, 'utf8');
    assert.ok(guide.includes(escape(source.trim())), `Guide must include the complete current ${path}`);
  }
});

test('release manifest covers the downloadable starter and its source files', async () => {
  const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
  for (const path of ['starter.zip', 'starter/mkdocs.yml', 'starter/requirements.txt',
    'starter/README.md', 'starter/overrides/main.html', 'starter/docs/index.md', 'starter/docs/next.md']) {
    const bytes = await readFile(`dist/${path}`);
    assert.equal(manifest.files[path]?.sha256, createHash('sha256').update(bytes).digest('hex'), path);
  }
});
