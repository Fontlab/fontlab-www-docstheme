// this_file: tests/artifacts.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('CDN includes prefixed daisyUI components beyond the specimen', async () => {
  const css = await readFile('dist/1.0.0/components.css', 'utf8');
  for (const name of ['btn', 'badge', 'steps', 'collapse', 'timeline', 'chat', 'menu', 'input', 'modal']) {
    assert.ok(css.includes(`.du-${name}`), `Missing daisyUI component: ${name}`);
  }
  assert.ok(css.includes('var(--du-border)'), 'daisyUI border width must have a separate token');
});
