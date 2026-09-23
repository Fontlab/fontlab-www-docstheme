// this_file: tests/scope.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import postcss from 'postcss';
import { scopeCSS } from '../scripts/scope.mjs';

test('scopes resets, theme roots and components without changing keyframes', async () => {
  const css = await scopeCSS(':root{--x:red}html,body{margin:0}.btn{color:red}@keyframes spin{to{rotate:360deg}}');
  const rules = [];
  postcss.parse(css).walkRules(rule => rules.push(rule.selector));
  assert.deepEqual(rules, ['.fltheme-components', '.fltheme-components,.fltheme-components', '.fltheme-components .btn', 'to']);
});

test('preserves nested selectors and scopes dark tokens onto the wrapper', async () => {
  const css = await scopeCSS('.dark{--x:black}.card{&>header{color:red} button{color:blue}}');
  assert.match(css, /\.fltheme-components\.dark/);
  assert.match(css, /\.fltheme-components \.card\{&>header/);
  assert.doesNotMatch(css, /\.fltheme-components button/);
});

test('empty stylesheet stays empty', async () => {
  assert.equal(await scopeCSS(''), '');
});
