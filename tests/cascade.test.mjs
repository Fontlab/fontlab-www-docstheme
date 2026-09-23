// this_file: tests/cascade.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compileCascade } from '../scripts/cascade.mjs';

test('compiles nested layers and overrides together without mixing delivery files', async () => {
  const result = await compileCascade({
    'vendor.css': '@layer reset,components; @layer reset{button{color:red}} @layer components{.btn{color:blue;&:hover{color:green}}}',
    'theme.css': '.btn{color:purple}',
  });
  assert.doesNotMatch(result['vendor.css'], /@layer|&:hover|purple/);
  assert.match(result['vendor.css'], /\.btn:hover:not/);
  assert.match(result['theme.css'], /\.btn:not\(#\\#\):not\(#\\#\)/);
  assert.match(result['theme.css'], /color:purple/);
});
