// this_file: tests/fly-photoswipe.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/fly/js/fly.js', import.meta.url), 'utf8');
const dist = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/';

function loadPage({ stylesheet = true, gallery = true } = {}) {
  const scripts = [], warnings = [], initialized = [];
  class Lightbox {
    constructor(options) { this.options = options; }
    on() {}
    init() { initialized.push(this.options.pswpModule); }
  }
  class PhotoSwipe {}
  const document = {
    head: { append: script => scripts.push(script) },
    body: { classList: { contains: () => false } },
    documentElement: {},
    createElement: tag => ({ tag }),
    querySelector: selector => selector === 'link[data-fly-photoswipe]'
      ? stylesheet && { href: dist + 'photoswipe.css' }
      : gallery,
    querySelectorAll: () => [],
  };
  runInNewContext(source, {
    URL, document, window: { PhotoSwipe, PhotoSwipeLightbox: Lightbox },
    console: { warn: (...args) => warnings.push(args) },
    matchMedia: () => ({ addEventListener() {} }), addEventListener() {},
    MutationObserver: class { observe() {} },
  });
  return { scripts, warnings, initialized, PhotoSwipe };
}

test('PhotoSwipe checks both scripts before attaching gallery controls', async () => {
  const { scripts, warnings, initialized, PhotoSwipe } = loadPage();
  assert.deepEqual(scripts.map(({ tag, src, integrity, crossOrigin }) => [tag, src, integrity, crossOrigin]), [
    ['script', dist + 'umd/photoswipe-lightbox.umd.min.js',
      'sha384-IiBVbUz6+U+Tbm/ijO2P0XRwcVzNfrMzloNLkrqHkbi6w5H0v6ie4fI9BIO4SwdK', 'anonymous'],
    ['script', dist + 'umd/photoswipe.umd.min.js',
      'sha384-k8EKyYcONphQ7zH4cQ0888JapXwrLTXQl/Ue1/jYgjVYahln1NWpnt2S4IC56LNh', 'anonymous'],
  ]);
  scripts[1].onload();
  await new Promise(setImmediate);
  assert.equal(initialized.length, 0);
  scripts[0].onload();
  await new Promise(setImmediate);
  assert.deepEqual(initialized, [PhotoSwipe]);
  assert.equal(warnings.length, 0);
});

test('PhotoSwipe leaves ordinary image links on opt-out, missing gallery, or load failure', async () => {
  assert.equal(loadPage({ stylesheet: false }).scripts.length, 0);
  assert.equal(loadPage({ gallery: false }).scripts.length, 0);
  const { scripts, warnings, initialized } = loadPage();
  scripts[0].onload();
  scripts[1].onerror();
  await new Promise(setImmediate);
  assert.equal(initialized.length, 0);
  assert.equal(warnings.length, 1);
});
