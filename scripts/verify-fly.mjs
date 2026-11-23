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
  const header = /^\| Heading \| 390px \| 1024px \| 1440px \| 1920px \|/m.exec(text);
  if (!header) throw new Error('DESIGN-TOKENS.md: heading table header is not Heading | 390px | 1024px | 1440px | 1920px');
  for (const m of text.slice(header.index).matchAll(/^\| (h[1-6]) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \|/gm)) {
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

// Vertical margins and paddings of flowing blocks, and the tops of adjacent body paragraphs.
const PROBE_BLOCKS = `JSON.stringify((() => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const art = document.querySelector('.md-content .md-typeset');
  const blocks = [...art.querySelectorAll(':scope > :is(p, ul, ol, h1, h2, h3, h4, blockquote, table, figure, hr, .admonition, .md-typeset__scrollwrap), :scope > :is(ul, ol) > li, :scope > .md-typeset__scrollwrap table')];
  const sides = ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'];
  const items = blocks.map(el => {
    const cs = getComputedStyle(el);
    return {tag: el.tagName.toLowerCase() + (el.classList.contains('admonition') ? '.admonition' + (getComputedStyle(el).float !== 'none' ? '.aside' : '') : '') + (el.matches('h1 + p') ? '.lead' : ''),
      sides: Object.fromEntries(sides.map(s => [s, parseFloat(cs[s])]))};
  });
  const gaps = [...art.querySelectorAll(':scope > p + p')].map(p => p.getBoundingClientRect().top - p.previousElementSibling.getBoundingClientRect().top);
  return {rem, items, gaps};
})())`;

// Text-bearing elements of the article, navigation and footer, classed by role. Headings,
// code and keys, sup/sub/small, permalinks and icons are outside flowing text (SPEC 4.2) and
// skipped; inline runs (a, strong, em, mark, code in the article) are measured against their
// parent instead, since they carry an -adjust multiplier.
const PROBE_SIZES = `JSON.stringify((() => {
  const token = name => { const p = document.createElement('i'); p.style.fontSize = 'var(' + name + ')'; document.body.append(p); const v = parseFloat(getComputedStyle(p).fontSize); p.remove(); return v; };
  const rootVar = n => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n));
  // .fl-nav-close is the drawer's x glyph button, an icon control rather than text.
  const SKIP = 'h1, h2, h3, h4, h5, h6, code, pre, kbd, sup, sub, small, svg, script, style, .headerlink, .md-nav__icon, .fl-nav-close';
  // An admonition floated into the margin is an aside (SPEC 4.1: asides are xs text); in the
  // flow it is body text.
  const aside = el => { const a = el.closest('.admonition, details'); return a && getComputedStyle(a).float !== 'none'; };
  const INLINE = {A: '--fly-sans-adjust', STRONG: '--fly-strong-adjust', EM: '--fly-em-adjust', MARK: '--fly-sans-adjust'};
  const size = el => parseFloat(getComputedStyle(el).fontSize);
  const kindOf = el => {
    if (el.closest('th')) return 'th';
    if (el.closest('figcaption')) return 'figcaption';
    if (el.closest('.md-footer')) return 'footer';
    if (el.closest('.md-sidebar, .md-nav')) return 'nav';
    if (el.closest('blockquote')) return 'quote';
    if (el.closest('.md-typeset > h1 + p')) return 'lead';
    if (el.closest('td')) return 'table';
    if (el.closest('li')) return 'list';
    if (el.closest('.admonition-title, summary')) return aside(el) ? 'aside-title' : 'admonition-title';
    if (el.closest('.admonition, details')) return aside(el) ? 'aside' : 'admonition';
    return 'body';
  };
  const out = {xs: token('--fly-size-xs'), sm: token('--fly-size-sm'), md: token('--fly-size-md'), items: [], inline: []};
  const scope = document.querySelectorAll('.md-content .md-typeset *, .md-sidebar *, .md-footer *');
  for (const el of scope) {
    const inArticle = !!el.closest('.md-content .md-typeset');
    const isInline = inArticle && (el.tagName in INLINE || (el.tagName === 'CODE' && !el.closest('pre') && !el.closest('h1, h2, h3, h4, h5, h6')));
    if (isInline && !el.closest('.headerlink')) {
      const parent = el.parentElement;
      const adjust = el.tagName === 'CODE' ? rootVar('--fly-mono-adjust') : rootVar(INLINE[el.tagName]);
      out.inline.push({tag: el.tagName.toLowerCase(), inCell: !!el.closest('td, th'), nested: !!parent.closest('a, strong, em, mark'), size: size(el), parent: size(parent), adjust});
      continue;
    }
    if (el.closest(SKIP)) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    out.items.push({kind: kindOf(el), tag: el.tagName.toLowerCase(), text: el.textContent.trim().slice(0, 24), size: size(el)});
  }
  return out;
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
  const brand = /fontlab|vexy/i;
  const bars = [header, document.querySelector('.md-footer')].filter(Boolean);
  return {
    tags: ['fontlab-menu', 'fontlab-footer', 'vexy-menu', 'vexy-footer', 'acme-menu', 'acme-footer'].filter(t => document.querySelector(t)),
    headerVisible: !!header && cs.display !== 'none' && cs.visibility !== 'hidden' && header.getBoundingClientRect().height > 0,
    brandIn: bars.filter(b => brand.test(b.outerHTML)).map(b => b.className.split(' ')[0]),
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
// SPEC 4.1 lets asides, captions and other xs text leave the grid. Blocks named here are
// checked for the reason given and nothing else: key is the probe's tag name.
const GRID_EXEMPT = {
  // A margin note floats beside the text with em margins of its own xs size (SPEC 4.1).
  'div.admonition.aside': 'admonition floated into the margin',
};

const verifyGrid = async (base, width) => {
  await open(`${base}/fontlab/`, width);
  const {rem, items} = await ev(PROBE_GRID);
  const bad = items.filter(({lh}) => !(Math.abs(lh - Math.round(lh / rem) * rem) <= GRID_TOLERANCE));
  check(`grid.multiples@${width}`, items.length >= 10 && bad.length === 0,
    bad.length ? `off-grid: ${bad.map(b => `${b.tag}=${b.lh}`).join(' ')} rem=${rem}` : `${items.length} elements, rem=${rem}`);
  const body = items.filter(i => i.tag === 'p');
  check(`grid.body-line@${width}`, body.length > 0 && body.every(i => near(i.lh, 2 * rem)),
    `body line-heights ${[...new Set(body.map(i => i.lh))].join(',')} want ${2 * rem}`);
  const blocks = await ev(PROBE_BLOCKS);
  const off = [];
  for (const {tag, sides} of blocks.items) {
    if (GRID_EXEMPT[tag]) continue;
    for (const [side, px] of Object.entries(sides)) {
      if (!(Math.abs(px - Math.round(px / blocks.rem) * blocks.rem) <= GRID_TOLERANCE)) off.push(`${tag}.${side}=${px}`);
    }
  }
  const tags = new Set(blocks.items.map(i => i.tag));
  const missing = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'blockquote', 'table', 'figure', 'hr'].filter(t => !tags.has(t));
  if (![...tags].some(t => t.startsWith('div.admonition'))) missing.push('admonition');
  check(`grid.block-spacing@${width}`, off.length === 0 && missing.length === 0,
    off.length ? `off-grid: ${off.join(' ')} rem=${blocks.rem}` : missing.length ? `not exercised: ${missing}` : `${blocks.items.length} blocks`);
  const gapBad = blocks.gaps.filter(g => !(Math.abs(g - Math.round(g / blocks.rem) * blocks.rem) <= GRID_TOLERANCE));
  check(`grid.paragraph-pitch@${width}`, blocks.gaps.length >= 1 && gapBad.length === 0, `tops of adjacent paragraphs ${blocks.gaps.join(',')} rem=${blocks.rem}`);
};

// Size token per element class (SPEC 4.2, 4.3). Asides (margin admonitions, wide screens only)
// are xs; in the flow, admonitions are body text.
const SIZE_OF = {th: 'xs', figcaption: 'xs', footer: 'xs', nav: 'xs', lead: 'md', quote: 'md',
  table: 'sm', list: 'sm', body: 'sm', admonition: 'sm', 'admonition-title': 'sm', aside: 'xs', 'aside-title': 'xs'};
const WIDE_ONLY = new Set(['aside', 'aside-title']);
const NARROW_ONLY = new Set(['admonition', 'admonition-title']);

const verifySizes = async (base, width) => {
  await open(`${base}/fontlab/`, width);
  const s = await ev(PROBE_SIZES);
  const tokens = {xs: s.xs, sm: s.sm, md: s.md};
  for (const kind of Object.keys(SIZE_OF)) {
    if ((width < 1000 ? WIDE_ONLY : NARROW_ONLY).has(kind)) continue;
    const items = s.items.filter(i => i.kind === kind);
    const bad = items.filter(i => !near(i.size, tokens[SIZE_OF[kind]], 0.05));
    check(`sizes.${kind}@${width}`, items.length > 0 && bad.length === 0,
      bad.length ? `want --fly-size-${SIZE_OF[kind]}=${tokens[SIZE_OF[kind]]}px: ${bad.map(b => `${b.tag}[${b.text}]=${b.size}`).join(' ')}` : `${items.length} elements at ${tokens[SIZE_OF[kind]]}px`);
  }
  const unknown = s.items.filter(i => !(i.kind in SIZE_OF));
  const distinct = [...new Set(s.items.map(i => i.size.toFixed(2)))].sort();
  const want = [s.xs, s.sm, s.md].map(v => v.toFixed(2)).sort();
  check(`sizes.exactly-three@${width}`, unknown.length === 0 && distinct.join() === want.join(), `distinct ${distinct} want ${want} over ${s.items.length} elements`);
  const inlineBad = s.inline.filter(r => !near(r.size, r.parent * (r.tag !== 'code' && (r.inCell || r.nested) ? 1 : r.adjust), 0.05));
  check(`sizes.inline-adjust@${width}`, s.inline.length > 0 && inlineBad.length === 0,
    inlineBad.length ? inlineBad.map(r => `${r.tag} ${r.size}px parent ${r.parent}px adjust ${r.adjust}`).join('; ') : `${s.inline.length} runs`);
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
  // [menu, footer, MaterialX header hidden, brand text allowed in header/footer]
  const want = {fontlab: ['fontlab-menu', 'fontlab-footer', true], vexy: ['vexy-menu', 'vexy-footer', true],
    none: [null, null, false], custom: ['acme-menu', 'acme-footer', false]};
  for (const [name, [menu, footer, hidden]] of Object.entries(want)) {
    await open(`${base}/${name}/`, 1440);
    const c = await ev(PROBE_CHROME);
    const menus = c.tags.filter(t => t.endsWith('-menu'));
    const footers = c.tags.filter(t => t.endsWith('-footer'));
    // custom chrome keeps MaterialX's header visible; fontlab and vexy hide it; none has no bars.
    check(`chrome.${name}.menu`, menu ? menus.length === 1 && menus[0] === menu : menus.length === 0, `menus [${menus}]`);
    check(`chrome.${name}.footer`, footer ? footers.length === 1 && footers[0] === footer : footers.length === 0, `footers [${footers}]`);
    check(`chrome.${name}.header`, c.headerVisible === !hidden, `MaterialX header visible=${c.headerVisible}`);
    if (name === 'none' || name === 'custom') {
      check(`chrome.${name}.no-brand`, c.tags.every(t => name === 'custom' ? t.startsWith('acme-') : false) && c.brandIn.length === 0,
        `FontLab/Vexy text in ${c.brandIn}; elements [${c.tags}]`);
    }
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
  const guide = `${base}/fontlab/guide/`;
  const reference = `${base}/fontlab/reference/`;
  const url = async () => (await ab('get', 'url')).trim();
  const arrives = async pattern => { try { await ab('wait', '--url', pattern); return true; } catch { return false; } };
  const stays = async (key, where, setup = '') => {
    await open(where, 1440);
    if (setup) await ev(setup);
    await ab('press', key);
    await ab('wait', '800');
    return url();
  };
  // Right (fly-bridge.js): next page.
  await open(index, 1440);
  await ab('press', 'ArrowRight');
  check('keyboard.arrow-right-next', await arrives('**/fontlab/guide/'), `url ${await url()}`);
  // Left: browser history back (we came from index).
  await ab('press', 'ArrowLeft');
  check('keyboard.arrow-left-history-back', await arrives('**/fontlab/'), `url ${await url()}`);
  // Alt+Right: next page; Alt+Left: previous page in navigation (not history: reference came before).
  await open(index, 1440);
  await ab('press', 'Alt+ArrowRight');
  check('keyboard.alt-right-next', await arrives('**/fontlab/guide/'), `url ${await url()}`);
  await open(reference, 1440);
  await open(guide, 1440);
  await ab('press', 'Alt+ArrowLeft');
  check('keyboard.alt-left-previous', await arrives('**/fontlab/'), `url ${await url()}`);
  // Guards: focus in a text field, a plain textarea or a select keeps the keys; Shift is not a page key.
  const focus = tag => `(() => { const i = document.createElement('${tag}'); i.className = 'md-search__input'; document.body.prepend(i); i.focus(); return 1; })()`;
  for (const [name, setup] of [['input', focus('input')], ['textarea', focus('textarea')], ['select', focus('select')]]) {
    const at = await stays('ArrowRight', index, setup);
    check(`keyboard.arrow-right-in-${name}`, at === index, `url ${at}`);
  }
  const shifted = await stays('Shift+ArrowRight', index);
  check('keyboard.shift-arrow-right-ignored', shifted === index, `url ${shifted}`);
};

// --- console, page errors and failed local requests -------------------------------------------
// agent-browser's errors and console buffers persist across navigations, so they are read
// and cleared after every page. They do not see failed resource loads (a 404 image or fetch
// logs nothing there), so local failures are read from the Resource Timing entries too.
const THIRD_PARTY = /use\.typekit\.net|fonts\.googleapis\.com|fonts\.gstatic\.com|i\.fontlab\.com|i\.vexy\.art|cdn\.jsdelivr\.net|menu\.example\.com/;
const PROBE_FAILED = `JSON.stringify([
  ...performance.getEntriesByType('navigation').filter(e => e.responseStatus >= 400),
  ...performance.getEntriesByType('resource').filter(e => e.name.startsWith(location.origin) && (e.responseStatus >= 400 || e.responseStatus === 0)),
].map(e => e.name + ' ' + e.responseStatus))`;

const collect = async () => {
  const errors = JSON.parse(await ab('errors', '--json')).data.errors.map(e => e.text.split('\n')[0]);
  const logged = JSON.parse(await ab('console', '--json')).data.messages.filter(m => m.type === 'error').map(m => m.text);
  const failed = await ev(PROBE_FAILED);
  await ab('errors', '--clear');
  await ab('console', '--clear');
  // Only a line naming a third-party host and not the local origin is network noise.
  const real = logged.filter(t => t.includes('127.0.0.1') || !THIRD_PARTY.test(t));
  return {errors, logged: real, failed};
};

const CANARY = 'verify-fly-canary';
const verifyNoErrors = async base => {
  // Prove the capture works: a console error, an uncaught exception and a local 404 fetch.
  await open(`${base}/fontlab/`, 1440);
  await collect();
  await ev(`(() => { console.error('${CANARY}'); fetch('/${CANARY}-404'); setTimeout(() => { throw new Error('${CANARY}-throw'); }, 0); return 1; })()`);
  await ab('wait', '600');
  const seen = await collect();
  check('errors.canary-console', seen.logged.includes(CANARY), `console errors ${seen.logged}`);
  check('errors.canary-exception', seen.errors.some(e => e.includes(`${CANARY}-throw`)), `page errors ${seen.errors}`);
  check('errors.canary-local-404', seen.failed.some(f => f.includes(`${CANARY}-404 404`)), `failed ${seen.failed}`);
  // The real sweep starts from clean buffers on fresh page loads, so the canaries are gone.
  const problems = [];
  for (const name of Object.keys(CONFIGS)) {
    for (const page of ['', 'guide/', 'reference/']) {
      await open(`${base}/${name}/${page}`, 1440);
      await ab('wait', '300');
      const got = await collect();
      for (const t of [...got.errors, ...got.logged, ...got.failed]) problems.push(`${name}/${page}: ${t}`);
    }
  }
  check('errors.page-console-local', problems.length === 0, problems.slice(0, 4).join(' | '));
};

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
  for (const width of [1440, 390]) await verifySizes(base, width);
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
