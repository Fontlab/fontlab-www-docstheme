#!/usr/bin/env node
// this_file: scripts/verify-fly.mjs
// Browser verification of the fly-january theme: builds each fixture config, serves it and
// drives it with the agent-browser CLI (Playwright's Chromium crashes on the owner's
// machine, so it is never launched). One line per assertion, "ok|FAIL <name> <detail>";
// exit 1 on any FAIL. Usage: node scripts/verify-fly.mjs
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';

// Async execFile only: a sync call would block the event loop that serves the pages.
const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIGS = {fontlab: 'mkdocs.yml', vexy: 'mkdocs-vexy.yml', none: 'mkdocs-none.yml', custom: 'mkdocs-custom.yml'};
const WIDTHS = [390, 1024, 1440, 1920];
const GRID_TOLERANCE = 0.5; // px
const MIME = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.json': 'application/json', '.xml': 'application/xml', '.woff2': 'font/woff2'};

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'ok' : 'FAIL'} ${name} ${detail}`.trimEnd());
};

// --- heading table parsed from DESIGN-TOKENS.md (never duplicated here) -------------------
const parseHeadingTable = text => {
  const table = {};
  for (const m of text.matchAll(/^\| (h[1-6]) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \|/gm)) {
    table[m[1]] = {390: +m[2], 1024: +m[3], 1440: +m[4], 1920: +m[5]};
  }
  if (Object.keys(table).length !== 6) throw new Error('DESIGN-TOKENS.md: heading size table not found');
  return table;
};

// --- build and serve -----------------------------------------------------------------------
const build = async (config, out) => {
  const cfg = path.join(ROOT, 'fixtures/fly', config);
  await run('uv', ['run', '--python', '3.13', 'properdocs', 'build', '-f', cfg, '-d', out, '--strict'],
    {cwd: ROOT, maxBuffer: 1 << 24});
};

const serve = sites => new Promise(resolve => {
  const server = http.createServer((req, res) => {
    const [, site, ...rest] = decodeURIComponent(req.url.split('?')[0]).split('/');
    let file = sites[site] && path.join(sites[site], ...rest);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!file || !file.startsWith(sites[site]) || !fs.existsSync(file)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, {'content-type': MIME[path.extname(file)] || 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  server.listen(0, '127.0.0.1', () => resolve(server));
});

// --- agent-browser -------------------------------------------------------------------------
let session = '';
const ab = async (...args) => (await run('agent-browser', ['--session', session, ...args],
  {encoding: 'utf8', timeout: 60000, maxBuffer: 1 << 24})).stdout;
const ev = async js => {
  let out = (await ab('eval', '-b', Buffer.from(js).toString('base64'))).trim();
  for (let i = 0; i < 2 && typeof out === 'string'; i += 1) {
    try { out = JSON.parse(out); } catch { break; }
  }
  return out;
};
const open = async (url, width = 1440) => {
  await ab('set', 'viewport', String(width), '900');
  await ab('open', url);
  await ab('wait', '--load', 'load');
};

// --- in-page probes ------------------------------------------------------------------------
const PROBE_GRID = `JSON.stringify((() => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const flow = document.querySelectorAll('.md-content .md-typeset > :is(p, h1, h2, h3, h4), .md-content .md-typeset > :is(ul, ol) > li');
  return {rem, items: [...flow].map(el => ({
    tag: el.tagName.toLowerCase() + (el.matches('h1 + p') ? '.lead' : ''),
    lh: parseFloat(getComputedStyle(el).lineHeight),
  }))};
})())`;

const PROBE_SIZES = `JSON.stringify((() => {
  const px = (sel, prop = 'fontSize') => { const el = document.querySelector(sel); return el ? parseFloat(getComputedStyle(el)[prop]) : null; };
  const token = name => { const p = document.createElement('i'); p.style.fontSize = 'var(' + name + ')'; document.body.append(p); const v = parseFloat(getComputedStyle(p).fontSize); p.remove(); return v; };
  return {
    xs: token('--fly-size-xs'), sm: token('--fly-size-sm'), md: token('--fly-size-md'),
    body: px('.md-typeset > p:not(h1 + p)'), lead: px('.md-typeset > h1 + p'), table: px('.md-typeset td'),
    th: px('.md-typeset th'), caption: px('.md-typeset figcaption'), nav: px('.md-nav--primary .md-nav__link'),
  };
})())`;

const PROBE_HEADINGS = `JSON.stringify(Object.fromEntries(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(t => [t, parseFloat(getComputedStyle(document.querySelector('.md-content .md-typeset ' + t)).fontSize)])))`;

const probeScheme = scheme => `JSON.stringify((() => {
  document.body.setAttribute('data-md-color-scheme', '${scheme}');
  const p = document.createElement('i'); document.body.append(p);
  const color = v => { p.style.color = ''; p.style.color = 'var(' + v + ')'; return getComputedStyle(p).color; };
  const out = {bg: color('--md-default-bg-color'), paper: color('--fly-paper-3'), fg: color('--md-default-fg-color'), ink: color('--fly-ink')};
  p.remove();
  return out;
})())`;

const PROBE_CHROME = `JSON.stringify((() => {
  const header = document.querySelector('.md-header');
  const cs = header && getComputedStyle(header);
  return {
    tags: ['fontlab-menu', 'fontlab-footer', 'vexy-menu', 'vexy-footer', 'acme-menu', 'acme-footer'].filter(t => document.querySelector(t)),
    headerVisible: !!header && cs.display !== 'none' && cs.visibility !== 'hidden' && header.getBoundingClientRect().height > 0,
  };
})())`;

const PROBE_PRESET = `JSON.stringify((() => {
  const h1 = getComputedStyle(document.querySelector('.md-typeset h1'));
  return {
    rootFamily: getComputedStyle(document.documentElement).getPropertyValue('--fly-h1-family').trim(),
    h1Family: h1.fontFamily, h1Weight: h1.fontWeight, hue: document.body.dataset.flyHue,
  };
})())`;

const PROBE_HUE = `JSON.stringify((() => {
  const val = n => getComputedStyle(document.body).getPropertyValue(n).trim();
  const before = val('--fly-accent');
  const was = document.body.dataset.flyHue;
  document.body.setAttribute('data-fly-hue', 'magenta');
  const after = {accent: val('--fly-accent'), magenta: val('--fly-magenta')};
  document.body.setAttribute('data-fly-hue', was);
  return {was, before, cobalt: val('--fly-cobalt'), ...after};
})())`;

const near = (a, b, tol = GRID_TOLERANCE) => a !== null && Math.abs(a - b) <= tol;

// --- assertion groups ----------------------------------------------------------------------
const verifyGrid = async (base, width) => {
  await open(`${base}/fontlab/`, width);
  const {rem, items} = await ev(PROBE_GRID);
  const bad = items.filter(({lh}) => !(Math.abs(lh - Math.round(lh / rem) * rem) <= GRID_TOLERANCE));
  check(`grid.multiples@${width}`, items.length >= 10 && bad.length === 0,
    bad.length ? `off-grid: ${bad.map(b => `${b.tag}=${b.lh}`).join(' ')} rem=${rem}` : `${items.length} elements, rem=${rem}`);
  const body = items.filter(i => i.tag === 'p');
  check(`grid.body-line@${width}`, body.length > 0 && body.every(i => near(i.lh, 2 * rem)),
    `body line-heights ${[...new Set(body.map(i => i.lh))].join(',')} want ${2 * rem}`);
};

const verifySizes = async base => {
  await open(`${base}/fontlab/`, 1440);
  const s = await ev(PROBE_SIZES);
  const roles = {body: 'sm', table: 'sm', lead: 'md', nav: 'xs', caption: 'xs', th: 'xs'};
  for (const [role, token] of Object.entries(roles)) {
    check(`sizes.${role}`, near(s[role], s[token], 0.05), `${s[role]}px want --fly-size-${token}=${s[token]}px`);
  }
  const distinct = [...new Set(Object.keys(roles).map(r => s[r]?.toFixed(2)))];
  check('sizes.three-distinct', distinct.length === 3 && new Set([s.xs, s.sm, s.md].map(v => v.toFixed(2))).size === 3,
    `sizes ${distinct.join(',')}`);
};

const verifyHeadings = async (base, table) => {
  for (const width of WIDTHS) {
    await open(`${base}/fontlab/`, width);
    const got = await ev(PROBE_HEADINGS);
    for (const tag of Object.keys(table)) {
      check(`headings.${tag}@${width}`, near(got[tag], table[tag][width]), `${got[tag]}px want ${table[tag][width]}px`);
    }
  }
};

const verifySchemes = async base => {
  await open(`${base}/fontlab/`, 1440);
  const light = await ev(probeScheme('default'));
  const dark = await ev(probeScheme('slate'));
  for (const [name, v] of [['light', light], ['dark', dark]]) {
    check(`scheme.${name}.bg`, v.bg === v.paper, `--md-default-bg-color ${v.bg} want paper-3 ${v.paper}`);
    check(`scheme.${name}.fg`, v.fg === v.ink, `--md-default-fg-color ${v.fg} want ink ${v.ink}`);
  }
  check('scheme.differ', light.paper !== dark.paper && light.ink !== dark.ink, `paper ${light.paper}/${dark.paper} ink ${light.ink}/${dark.ink}`);
};

const verifyChrome = async base => {
  const want = {fontlab: ['fontlab-menu', true], vexy: ['vexy-menu', true], none: [null, false], custom: ['acme-menu', false]};
  for (const [name, [tag, hidden]] of Object.entries(want)) {
    await open(`${base}/${name}/`, 1440);
    const c = await ev(PROBE_CHROME);
    const menus = c.tags.filter(t => t.endsWith('-menu'));
    // custom chrome keeps MaterialX's header visible; fontlab and vexy hide it; none has no menu.
    check(`chrome.${name}.menu`, tag ? menus.length === 1 && menus[0] === tag : menus.length === 0, `menus [${menus}]`);
    check(`chrome.${name}.header`, c.headerVisible === !hidden, `MaterialX header visible=${c.headerVisible}`);
  }
};

const verifyPresets = async base => {
  await open(`${base}/fontlab/`, 1440);
  const site = await ev(PROBE_PRESET);
  await open(`${base}/fontlab/guide/`, 1440);
  const page = await ev(PROBE_PRESET);
  check('preset.site-h1', !site.rootFamily.includes('Blaka Ink') && site.rootFamily.includes('newsserif'), `index :root h1 family ${site.rootFamily}`);
  check('preset.page-h1', page.rootFamily.includes('Blaka Ink') && page.h1Family.includes('Blaka Ink'),
    `guide :root ${page.rootFamily} h1 ${page.h1Family} weight ${page.h1Weight}`);
  check('preset.page-hue', page.hue === 'magenta' && site.hue === 'cobalt', `index ${site.hue} guide ${page.hue}`);
  await open(`${base}/fontlab/`, 1440);
  const hue = await ev(PROBE_HUE);
  check('hue.attribute-changes-accent', hue.before === hue.cobalt && hue.accent === hue.magenta && hue.before !== hue.accent,
    `cobalt page accent ${hue.before}; data-fly-hue=magenta accent ${hue.accent}`);
};

const verifyKeyboard = async base => {
  const index = `${base}/fontlab/`;
  await open(index, 1440);
  await ab('press', 'ArrowRight');
  let moved = true;
  try { await ab('wait', '--url', '**/fontlab/guide/'); } catch { moved = false; }
  check('keyboard.arrow-right-next', moved, `url ${(await ab('get', 'url')).trim()}`);
  // Focus in a text input (the search field is one) must keep the arrow keys.
  await open(index, 1440);
  await ev("(() => { const i = document.createElement('input'); i.type = 'text'; i.className = 'md-search__input'; document.body.prepend(i); i.focus(); return 1; })()");
  await ab('press', 'ArrowRight');
  await ab('wait', '800');
  const url = (await ab('get', 'url')).trim();
  check('keyboard.arrow-right-in-input', url === index, `url ${url}`);
};

const verifyNoErrors = async base => {
  await ab('errors', '--clear');
  await ab('console', '--clear');
  for (const name of Object.keys(CONFIGS)) {
    for (const page of ['', 'guide/', 'reference/']) {
      await open(`${base}/${name}/${page}`, 1440);
      await ab('wait', '300');
    }
  }
  const errors = (await ab('errors')).trim();
  const consoleErrors = (await ab('console')).split('\n').filter(l => /\b(error)\b/i.test(l) && !EXTERNAL.test(l));
  check('errors.page', errors === '', errors.slice(0, 300));
  check('errors.console', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
};
// Resources fetched from third-party hosts (fonts, CDN menu scripts) may fail offline or on a
// blocked network; that says nothing about the theme.
const EXTERNAL = /net::ERR|Failed to load resource|use\.typekit|fonts\.g|i\.fontlab\.com|i\.vexy\.art|menu\.example\.com|jsdelivr/i;

// --- main ----------------------------------------------------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-fly-'));
let server;
try {
  const table = parseHeadingTable(fs.readFileSync(path.join(ROOT, 'DESIGN-TOKENS.md'), 'utf8'));
  const sites = {};
  await Promise.all(Object.entries(CONFIGS).map(async ([name, config]) => {
    sites[name] = path.join(tmp, name);
    await build(config, sites[name]);
  }));
  server = await serve(sites);
  const base = `http://127.0.0.1:${server.address().port}`;
  session = (await run('agent-browser', ['session', 'id', '--scope', 'worktree', '--prefix', 'verify'], {cwd: ROOT, encoding: 'utf8'})).stdout.trim();
  await ab('open', 'about:blank');
  for (const width of [1440, 390]) await verifyGrid(base, width);
  await verifySizes(base);
  await verifyHeadings(base, table);
  await verifySchemes(base);
  await verifyChrome(base);
  await verifyPresets(base);
  await verifyKeyboard(base);
  await verifyNoErrors(base);
} catch (error) {
  check('verify-fly.run', false, String(error?.stack || error).split('\n').slice(0, 4).join(' / '));
} finally {
  if (session) await ab('close').catch(() => {});
  server?.close();
  fs.rmSync(tmp, {recursive: true, force: true});
}
console.log(failures ? `${failures} assertion(s) FAILED` : 'all assertions ok');
process.exit(failures ? 1 : 0);
