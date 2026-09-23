// this_file: scripts/build.mjs
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { scopeCSS } from './scope.mjs';
import { compileCascade } from './cascade.mjs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
await rm('dist', { recursive: true, force: true });
await mkdir('dist/1.0.0/licenses', { recursive: true });
execFileSync('node', ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'src/components.css', '-o', 'dist/components.raw.css', '--minify'], { stdio: 'inherit' });
const css = await scopeCSS(await readFile('dist/components.raw.css', 'utf8'));
// A CDN library must include components not yet used by the specimen.
const classes = new Set();
postcss.parse(await readFile('node_modules/daisyui/daisyui.css', 'utf8')).walkRules(rule => {
  selectorParser(selectors => selectors.walkClasses(node => classes.add(`du-${node.value}`))).processSync(rule.selector);
});
const daisyInput = await readFile('src/daisy.css', 'utf8');
await writeFile('src/daisy.generated.css', `${daisyInput}\n@source inline("${[...classes].sort().join(' ')}");\n`);
try {
  execFileSync('node', ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'src/daisy.generated.css', '-o', 'dist/daisy.raw.css', '--minify'], { stdio: 'inherit' });
} finally {
  await rm('src/daisy.generated.css');
}
const daisy = postcss.parse(await readFile('dist/daisy.raw.css', 'utf8'));
// Basecoat uses --border as a color; daisyUI uses it as a width.
daisy.walkDecls(decl => {
  if (decl.prop === '--border') decl.prop = '--du-border';
  decl.value = decl.value.replace(/var\(--border\b/g, 'var(--du-border');
});
await mkdir('.cache', { recursive: true });
await writeFile('.cache/native.css', `${css}\n${await scopeCSS(daisy.toString())}\n${await readFile('src/theme.css', 'utf8')}`);
daisy.walkDecls(decl => {
  // daisyUI 5.7.44's reset fallbacks, checked against native layers in Chromium.
  // collapse-open rolls back to the lower collapse-content layer (overflow:clip);
  // the remaining fallbacks use browser defaults. Fail on new reset properties.
  if (decl.value === 'revert-layer') {
    const supported = ['overflow', 'background-color', 'border-radius', 'animation', 'box-shadow', 'transition', 'scrollbar-color', '--du-page-scroll-lock', 'visibility', 'display'];
    if (!supported.includes(decl.prop)) throw new Error(`Unreviewed layer fallback: ${decl.prop}`);
    decl.value = decl.parent.selector === '.du-collapse-open>.du-collapse-content' ? 'clip' : 'revert';
  }
});
const styles = await compileCascade({
  '1.0.0/components.css': `${css}\n${await scopeCSS(daisy.toString())}`,
  '1.0.0/theme.css': await readFile('src/theme.css', 'utf8'),
  'specimen.css': await readFile('examples/specimen.css', 'utf8'),
});
await rm('dist/components.raw.css');
await rm('dist/daisy.raw.css');
await cp('src/theme.js', 'dist/1.0.0/theme.js');
for (const folder of ['editorial', 'chrome']) await cp(`src/${folder}`, `dist/1.0.0/${folder}`, { recursive: true });

const vendor = 'node_modules/basecoat-css/dist/js';
const scripts = [await readFile(`${vendor}/basecoat.min.js`, 'utf8'), await readFile('src/register.js', 'utf8')];
for (const name of ['accordion', 'combobox', 'command', 'drawer', 'dropdown-menu', 'popover', 'range', 'select', 'sidebar', 'tabs', 'toast']) {
  scripts.push(await readFile(`${vendor}/${name}.min.js`, 'utf8'));
}
await writeFile('dist/1.0.0/basecoat.js', scripts.join('\n;\n'));
for (const name of ['basecoat-css', 'daisyui', 'tailwindcss']) {
  const filename = name === 'basecoat-css' ? 'LICENSE.md' : 'LICENSE';
  await cp(`node_modules/${name}/${filename}`, `dist/1.0.0/licenses/${name}.txt`);
}
await cp('examples', 'dist', { recursive: true });
for (const [path, css] of Object.entries(styles)) await writeFile(`dist/${path}`, css);
const files = {};
for (const path of (await readdir('dist', { recursive: true })).sort()) {
  if (!/\.(css|js|html|txt)$/.test(path)) continue;
  const bytes = await readFile(`dist/${path}`);
  files[path] = { size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
}
await writeFile('dist/manifest.json', `${JSON.stringify({ version: '1.0.0', files }, null, 2)}\n`);
console.log(`Built ${Object.keys(files).length} files in dist/`);
