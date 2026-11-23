// this_file: tests/check-links.test.mjs
// scripts/check-links.mjs: which links count as internal, and that a broken one is reported.
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { SITE_URL, checkLinks, target } from '../scripts/check-links.mjs';

test('external, page-local and special links are skipped; site URLs map into the root', () => {
  const page = '/r/a/index.html';
  for (const link of ['https://example.com/x', '//cdn.example/x.js', '#top', 'mailto:a@b', 'data:image/png;base64,x', '?q=1']) {
    assert.equal(target('/r', page, link), null, link);
  }
  assert.equal(target('/r', page, '../b/?v=1#k'), '/r/b');
  assert.equal(target('/r', page, `${SITE_URL}fly/latest/fly.css`), '/r/fly/latest/fly.css');
  assert.equal(target('/r', page, '/fontlab-www-docstheme/x/'), '/r/x/');
  assert.match(target('/r', page, '/elsewhere/'), /__outside_site__/);
});

test('missing files, directories without index.html and srcset entries are broken; code is not', async () => {
  const root = await mkdtemp(join(tmpdir(), 'check-links-'));
  try {
    await mkdir(join(root, 'a'), { recursive: true });
    await mkdir(join(root, 'empty'));
    await writeFile(join(root, 'ok.css'), '');
    await writeFile(
      join(root, 'a/index.html'),
      '<link href="../ok.css?v=1"><a href="../a/">self</a><a href="../empty/">e</a>' +
        '<img srcset="../ok.css 1x, ../gone.png 2x"><pre><a href="../nope/">n</a></pre>',
    );
    const { pages, links, broken } = await checkLinks(root);
    assert.equal(pages, 1);
    assert.equal(links, 5);
    assert.deepEqual(broken, ['a/index.html: ../empty/', 'a/index.html: ../gone.png']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
