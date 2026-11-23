#!/usr/bin/env node
// this_file: scripts/verify-fly-components.mjs
// Browser checks on the demo site (src_docs/) that the fixture checks in verify-fly.mjs do
// not cover: the component bundle's dark mode follows the palette toggle (fly.js), rails
// without links collapse, mid-desktop L1 labels end with an ellipsis and carry a title,
// short inline code is never split across lines. Builds the site into a temp dir (needs
// docs/fly/ from npm run build), serves it with agent-browser (never Playwright).
// One line per assertion, "ok|FAIL <name> <detail>"; exit 1 on any FAIL.
// Usage: node scripts/verify-fly-components.mjs (part of npm run verify:fly)
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2'};

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'ok' : 'FAIL'} ${name} ${detail}`.trimEnd());
};

const serve = (site, cdn) => new Promise(resolve => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const base = url.startsWith('/fly/') ? cdn : site;
    let file = path.join(base, url.startsWith('/fly/') ? url.slice(5) : url);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!file.startsWith(base) || !fs.existsSync(file)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, {'content-type': MIME[path.extname(file)] || 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  server.listen(0, '127.0.0.1', () => resolve(server));
});

const session = `fly-components-${process.pid}`;
const ab = async (...args) => (await run('agent-browser', ['--session', session, ...args], {encoding: 'utf8', timeout: 90000})).stdout;
const evaluate = async js => {
  const raw = (await ab('eval', '-b', Buffer.from(`JSON.stringify((() => { ${js} })())`).toString('base64'))).trim();
  const value = JSON.parse(raw);
  return typeof value === 'string' ? JSON.parse(value) : value;
};

const cdn = path.join(ROOT, 'docs/fly');
if (!fs.existsSync(path.join(cdn, 'latest/components.css'))) throw new Error('docs/fly/ missing: run npm run build');
const site = fs.mkdtempSync(path.join(os.tmpdir(), 'fly-components-'));
await run('uv', ['run', '--python', '3.13', '--locked', '--group', 'site', 'properdocs', 'build', '-f', 'src_docs/mkdocs.yml', '--strict', '-d', site],
  {cwd: ROOT, maxBuffer: 1 << 24});
const server = await serve(site, cdn);
const origin = `http://127.0.0.1:${server.address().port}`;
const open = async (page, width = 1440) => {
  await ab('set', 'viewport', String(width), '900');
  await ab('open', `${origin}/${page}`);
  await ab('wait', '--load', 'load');
  await ab('wait', '800');
};

try {
  await ab('open', 'about:blank');

  // Component bundle follows the palette toggle (fly.js), both ways.
  await open('data/statistics/');
  await evaluate("localStorage.clear(); return 0");
  await open('data/statistics/');
  const toggle = "const label = [...document.querySelectorAll('[data-md-component=palette] label')].find(l => l.offsetParent); label.click(); return 0";
  const state = "const roots = [...document.querySelectorAll('.fltheme-components')]; return {scheme: document.body.dataset.mdColorScheme, roots: roots.length, dark: roots.filter(r => r.classList.contains('dark')).length}";
  const before = await evaluate(state);
  check('components.light', before.roots > 0 && before.scheme === 'default' && before.dark === 0, JSON.stringify(before));
  await evaluate(toggle);
  await ab('wait', '300');
  const dark = await evaluate(state);
  check('components.toggle-dark', dark.scheme === 'slate' && dark.dark === dark.roots, JSON.stringify(dark));
  await evaluate(toggle);
  await ab('wait', '300');
  const light = await evaluate(state);
  check('components.toggle-light', light.scheme === 'default' && light.dark === 0, JSON.stringify(light));

  // A page with no section navigation and no headings: no blank rails; L1 no wider than
  // the palette toggle plus its margin.
  for (const width of [1440, 1920]) {
    await open('', width);
    const rails = await evaluate(`
      const rail = document.querySelector('.md-sidebar--primary').getBoundingClientRect();
      const toggle = document.querySelector('[data-md-component=palette]').getBoundingClientRect();
      const paper = getComputedStyle(document.querySelector('.md-main__inner'), '::before');
      const l2 = document.querySelector('.md-sidebar--secondary');
      const canvas = document.querySelector('.md-content').getBoundingClientRect();
      return {rail: Math.round(rail.width), toggleRight: Math.round(toggle.right), paper: paper.display,
        l2: getComputedStyle(l2).display, canvasLeft: Math.round(canvas.left)};`);
    check(`rails.empty-collapse@${width}`, rails.paper === 'none' && rails.l2 === 'none' && rails.rail <= rails.toggleRight + 24 && rails.canvasLeft <= rails.toggleRight + 24,
      JSON.stringify(rails));
  }

  // A section page keeps both rails.
  await open('theme/tokens/');
  const both = await evaluate("return {paper: getComputedStyle(document.querySelector('.md-main__inner'), '::before').display, l2: getComputedStyle(document.querySelector('.md-sidebar--secondary')).display}");
  check('rails.section-page-keeps-l2', both.paper !== 'none' && both.l2 !== 'none', JSON.stringify(both));

  // Mid-desktop L1: labels cut with an ellipsis and titled; L1 hovered or focused shows
  // them whole (focus here: the pointer path is the same :is(:hover, :focus-within) rule).
  await open('theme/configuration/');
  const label = "const span = [...document.querySelectorAll('.md-sidebar--primary .md-nav__link .md-ellipsis')].find(s => s.textContent.trim() === 'Configuration' && s.getClientRects().length); return {title: span.title, overflow: getComputedStyle(span).textOverflow, cut: span.scrollWidth > span.clientWidth, width: span.clientWidth}";
  const cut = await evaluate(label);
  check('l1.ellipsis', cut.title === 'Configuration' && cut.overflow === 'ellipsis' && cut.cut, JSON.stringify(cut));
  await evaluate("document.querySelector('.md-sidebar--primary a.md-nav__link--active').focus(); return 0");
  await ab('wait', '400');
  const whole = await evaluate(label);
  check('l1.reveal-shows-label', !whole.cut, JSON.stringify(whole));

  // Short inline code moves to the next line whole.
  for (const width of [1440, 390]) {
    await open('', width);
    const split = await evaluate("return [...document.querySelectorAll('.md-typeset li code, .md-typeset p code')].filter(c => c.textContent.length < 20 && c.getClientRects().length > 1).map(c => c.textContent)");
    check(`code.not-split@${width}`, split.length === 0, JSON.stringify(split));
  }
} finally {
  try { await ab('close'); } catch {}
  server.close();
  fs.rmSync(site, {recursive: true, force: true});
}
if (failures) process.exit(1);
console.log('all assertions ok');
