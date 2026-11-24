// this_file: tests/fly-build.test.mjs
// Checks the fly-january layer sources in src/fly and the built theme assets: the entry's
// layer statement and import order, layer wrappers per directory, no old prefix, every
// --fly-* reference defined, !important only with a reason, and the committed assets
// matching a fresh build.
import assert from 'node:assert/strict';
import postcss from 'postcss';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { test } from 'node:test';
import { LAYER_STATEMENT, LAYERS, OUT, SCRIPTS, buildFlyCss, entryImports } from '../scripts/build-fly.mjs';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'src/fly');
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
// Element-local working variables: declared and read per element in the layer files,
// not tokens. Every other --fly-* reference must be declared in src/fly/tokens.
const LOCALS = [
  '--fly-mt', '--fly-mb', '--fly-gbox', '--fly-gmb', '--fly-float-top', '--fly-float-mb',
  '--fly-alert-accent', '--fly-button-height', '--fly-button-label-size',
];

async function files(dir, ext) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith(ext) && !e.parentPath.includes('__pycache__')).map((e) => join(e.parentPath, e.name));
}

const cssFiles = await files(src, '.css');
const sources = Object.fromEntries(await Promise.all(cssFiles.map(async (path) => [relative(src, path), await readFile(path, 'utf8')])));

test('the entry declares the six layers first, in SPEC 6 order', async () => {
  const entry = strip(sources['fly.css']).trim();
  assert.equal(LAYER_STATEMENT, '@layer fly.tokens, fly.base, fly.layout, fly.components, fly.chrome, fly.utilities;');
  assert.ok(entry.startsWith(LAYER_STATEMENT), 'src/fly/fly.css must open with the layer statement');
  assert.ok(sources['fly.css'].startsWith('/* this_file: src/fly/fly.css */'));
});

test('the entry imports every layer file once, grouped in layer order', async () => {
  const imports = await entryImports();
  const layerFiles = Object.keys(sources).filter((path) => path !== 'fly.css').sort();
  assert.deepEqual([...imports].sort(), layerFiles, 'every CSS file under src/fly is imported exactly once');
  const order = imports.map((path) => LAYERS.indexOf('fly.' + path.split('/')[0]));
  assert.ok(order.every((index) => index >= 0), 'imports come from the layer directories');
  assert.deepEqual(order, [...order].sort((a, b) => a - b), 'imports follow the layer order');
});

test('each layer file carries this_file and is one block of its directory layer', () => {
  for (const [path, css] of Object.entries(sources)) {
    if (path === 'fly.css') continue;
    assert.ok(css.startsWith('/* this_file: src/fly/' + path + ' */'), path + ' must start with its this_file record');
    const layer = 'fly.' + path.split('/')[0];
    assert.match(strip(css).trim(), new RegExp('^@layer ' + layer.replace('.', '\\.') + ' \\{[\\s\\S]*\\}$'), path + ' must be one @layer ' + layer + ' block');
  }
});

test('no fl27 or fltheme27 in src/fly (except RENAMES.md), theme or the built assets', async () => {
  const paths = [...(await files(src, '')).filter((p) => !p.endsWith('RENAMES.md')), ...(await files(join(root, 'theme'), ''))];
  assert.ok(paths.some((p) => p.startsWith(OUT)), 'built assets are scanned');
  for (const path of paths) assert.doesNotMatch(await readFile(path, 'utf8'), /fl27|fltheme27/i, path);
});

test('every var(--fly-*) used in src/fly is declared in the tokens', () => {
  const tokens = new Set();
  const locals = new Set();
  for (const [path, css] of Object.entries(sources)) {
    for (const [, name] of strip(css).matchAll(/(--fly-[a-z0-9-]+)\s*:/g)) (path.startsWith('tokens/') ? tokens : locals).add(name);
  }
  assert.deepEqual([...locals].filter((name) => !tokens.has(name)).sort(), [...LOCALS].sort(), 'only the listed working variables are declared outside tokens');
  for (const [path, css] of Object.entries(sources)) {
    for (const [, name] of strip(css).matchAll(/var\((--fly-[a-z0-9-]+)/g)) {
      assert.ok(tokens.has(name) || LOCALS.includes(name), path + ' uses undefined ' + name);
    }
  }
});

test('!important appears only with a comment naming what it beats', () => {
  for (const [path, css] of Object.entries(sources)) {
    postcss.parse(css).walkDecls(decl => {
      if (!decl.important) return;
      if (decl.next()?.type === 'comment' && decl.next().text.includes('MaterialX')) return;
      assert.match(decl.parent.selector, /^\.md-typeset\b/, `${path}: independent bundle overrides must stay inside the article`);
      assert.match(css.split('\n')[1], /\/\* Basecoat and daisyUI .+\*\//, `${path}: name the independent rules the override beats`);
    });
  }
});

test('committed fly.css and fly-tokens.css match a fresh build and are flat', async () => {
  for (const [name, css] of Object.entries(await buildFlyCss())) {
    assert.equal(await readFile(join(OUT, name), 'utf8'), css, name + ' is stale: run npm run build');
    assert.doesNotMatch(strip(css), /@layer|@import|&/, name + ' must be flattened and inlined');
  }
  // @property rules register token types; their descriptors are not declarations.
  const tokens = strip(await readFile(join(OUT, 'fly-tokens.css'), 'utf8')).replace(/@property\s+--fly-[a-z0-9-]+\s*\{[^{}]*\}/g, '');
  for (const [, block] of tokens.matchAll(/\{([^{}]*)\}/g)) {
    for (const decl of block.split(';').map((d) => d.trim()).filter(Boolean)) {
      assert.match(decl, /^(--fly-|--md-|font-size:)/, 'fly-tokens.css holds tokens only: ' + decl);
    }
  }
});

test('documented ID boost and copyable override match the maximum in built fly.css', async () => {
  const boost = String.raw`:not(#\#)`;
  const css = postcss.parse(await readFile(join(OUT, 'fly.css'), 'utf8'));
  let max = 0;
  css.walkRules(rule => {
    for (const selector of rule.selectors) max = Math.max(max, selector.split(boost).length - 1);
  });
  assert.ok(max > 0, 'flattened CSS must have ID boosts');
  for (const path of ['SPEC.md', 'README.md']) {
    const doc = await readFile(join(root, path), 'utf8');
    assert.ok(doc.includes(`maximum of ${max} ID boosts`), `${path}: update documented boost count`);
    assert.ok(doc.includes(`.md-typeset${boost.repeat(max)} `), `${path}: update example selector`);
  }
});

test('the built CSS registers the typed line pitch (@property --fly-line)', async () => {
  for (const name of ['fly.css', 'fly-tokens.css']) {
    const css = await readFile(join(OUT, name), 'utf8');
    assert.match(css, /@property --fly-line \{\s*syntax: '<length>';\s*inherits: true;\s*initial-value: 0px;\s*\}/, name);
  }
});

test('committed scripts equal their sources; utilities are the layered tw: subset', async () => {
  for (const name of SCRIPTS) {
    assert.equal(await readFile(join(OUT, name), 'utf8'), await readFile(join(src, 'js', name), 'utf8'), name);
  }
  const utilities = await readFile(join(OUT, 'fly-utilities.css'), 'utf8');
  assert.match(utilities, /@layer fly\.utilities\{/);
  assert.match(utilities, /\.tw\\:mt-8\{[^}]*!important/);
  assert.match(utilities, /\.tw\\:p-4\{/);
  assert.doesNotMatch(utilities, /\.tw\\:mask-/, 'mask-* utilities are left out');
  for (const name of ['sm:flex-row', 'sm:w-auto', 'sm:items-start', 'sm:justify-start', 'sm:text-left', 'md:flex-row', 'md:w-auto', 'md:justify-start']) {
    const escaped = 'tw\\:' + name.replace(':', '\\:');
    assert.ok(utilities.includes('.' + escaped + '{'), 'responsive utility .' + escaped + ' is generated');
  }
});

test('main.html loads the theme assets from its own path', async () => {
  const html = await readFile(join(root, 'theme/fly_january/main.html'), 'utf8');
  for (const name of ['fly.css', 'fly-utilities.css', 'fly-bridge.js', 'fly.js']) {
    assert.ok(html.includes("'assets/fly/" + name + "' | url"), 'main.html must load assets/fly/' + name);
  }
  assert.ok(html.indexOf('fly.css') < html.indexOf('fly-utilities.css'), 'utilities load after fly.css');
  assert.match(html, /\{%- if fly\.utilities %\}\s*<link[^>]*fly-utilities\.css/, 'utilities only when extra.fly.utilities');
  for (const part of ['fly.head.links', 'fly.head.style', 'fly.chrome.script', 'fly.chrome.header', 'fly.chrome.footer']) {
    assert.ok(html.includes(part), 'main.html renders the plugin-provided ' + part);
  }
});
