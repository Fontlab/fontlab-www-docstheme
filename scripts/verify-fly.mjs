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
const CONFIGS = {fontlab: 'mkdocs.yml', vexy: 'mkdocs-vexy.yml', none: 'mkdocs-none.yml', custom: 'mkdocs-custom.yml', nohue: 'mkdocs-nohue.yml'};
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
  // Paragraphs, lists and items nested in blockquotes, admonitions and list items.
  const nested = [...art.querySelectorAll(':is(blockquote, .admonition, li) :is(p, ul, ol, li)')].map(el => {
    const cs = getComputedStyle(el);
    const box = el.parentElement.closest('blockquote, .admonition, li');
    const boxTag = box.tagName.toLowerCase() + (box.classList.contains('admonition') ? '.admonition' + (getComputedStyle(box).float !== 'none' ? '.aside' : '') : '');
    return {tag: el.tagName.toLowerCase() + '<' + boxTag, sides: Object.fromEntries(sides.map(s => [s, parseFloat(cs[s])]))};
  });
  const gaps = [...art.querySelectorAll(':scope > p + p')].map(p => p.getBoundingClientRect().top - p.previousElementSibling.getBoundingClientRect().top);
  return {rem, items: items.concat(nested), gaps};
})())`;

// Text-bearing elements of the article, navigation and footer, classed by role. Headings,
// code and keys, sup/sub/small, permalinks and icons are outside flowing text (SPEC 4.2) and
// skipped; inline runs (a, strong, em, mark, code in the article) are measured against their
// parent instead, since they carry an -adjust multiplier.
const PROBE_SIZES = `JSON.stringify((() => {
  const token = name => { const p = document.createElement('i'); p.style.fontSize = 'var(' + name + ')'; document.body.append(p); const v = parseFloat(getComputedStyle(p).fontSize); p.remove(); return v; };
  const rootVar = n => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n));
  // .fl-nav-close is the drawer's x glyph button, an icon control rather than text.
  const SKIP = 'h1, h2, h3, h4, h5, h6, code, pre, kbd, sup, sub, small, svg, script, style, .headerlink, .md-nav__icon, .fl-nav-close, .md-button'; // buttons have their own face and size (--fly-button-size)
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
    return el.closest('.md-typeset') ? 'body' : 'unclassified';
  };
  const out = {xs: token('--fly-size-xs'), sm: token('--fly-size-sm'), md: token('--fly-size-md'), items: [], inline: []};
  const scope = document.querySelectorAll('.md-content *, .md-sidebar *, .md-footer *');
  for (const el of scope) {
    const inArticle = !!el.closest('.md-content .md-typeset');
    const isInline = inArticle && !el.closest('.md-button') && (el.tagName in INLINE || (el.tagName === 'CODE' && !el.closest('pre') && !el.closest('h1, h2, h3, h4, h5, h6')));
    if (isInline && !el.closest('.headerlink')) {
      const parent = el.parentElement;
      const adjust = el.tagName === 'CODE' ? rootVar('--fly-mono-adjust') : rootVar(INLINE[el.tagName]);
      out.inline.push({tag: el.tagName.toLowerCase(), inCell: !!el.closest('td, th'), nested: !!parent.closest('a, strong, em, mark'), inLead: !!el.closest('.md-typeset > h1 + p'), size: size(el), parent: size(parent), adjust});
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

// The chrome script is a third-party CDN file: when the network cannot fetch it, say so.
const probeDefined = tag => `(async () => {
  const script = document.querySelector('script[src*="/menu/"]');
  let reachable = !!script;
  try { await fetch(script.src, {mode: 'no-cors'}); } catch { reachable = false; }
  if (reachable) await Promise.race([customElements.whenDefined('${tag}'), new Promise(r => setTimeout(r, 6000))]);
  return JSON.stringify({reachable, src: script && script.src, defined: !!customElements.get('${tag}')});
})()`;

// The admonition icon is a ::before box: its centre (top + height / 2 + translate) against the
// title bar's, and the bar being one line tall.
const PROBE_ADMONITION = `JSON.stringify((() => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return {rem, bars: [...document.querySelectorAll('.md-typeset .admonition-title, .md-typeset summary')].map(el => {
    const before = getComputedStyle(el, '::before');
    const t = before.translate === 'none' ? '0px' : before.translate.split(' ')[1] || '0px';
    const ty = t.endsWith('%') ? parseFloat(t) / 100 * parseFloat(before.height) : parseFloat(t);
    return {bar: el.getBoundingClientRect().height, centre: parseFloat(before.top) + parseFloat(before.height) / 2 + ty,
      aside: getComputedStyle(el.parentElement).float !== 'none'};
  })};
})())`;

// Colour helpers shared by the contrast probes: text over the nearest opaque background,
// translucent layers composited (WCAG ratio).
const COLOUR_LIB = `
  const cv = document.createElement('canvas').getContext('2d', {willReadFrequently: true});
  const rgba = c => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, under) => top.slice(0, 3).map((v, i) => v * top[3] + under[i] * (1 - top[3]));
  const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const backdrop = el => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] >= 0.995) break; }
    let bg = [255, 255, 255];
    for (const layer of layers.reverse()) bg = over(layer, bg);
    return bg;
  };
  const measure = el => {
    const bg = backdrop(el);
    const fg = over(rgba(getComputedStyle(el).color), bg);
    const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  };
  const token = name => { const p = document.createElement('i'); p.style.color = 'var(' + name + ')'; document.body.append(p); const v = getComputedStyle(p).color; p.remove(); return v; };
`;

const PROBE_FOOTER_CONTRAST = `JSON.stringify((() => {${COLOUR_LIB}
  return [...document.querySelectorAll('.md-footer .md-copyright__highlight, .md-footer .md-footer__title')].map(el => ({text: el.textContent.trim(), ratio: measure(el)}));
})())`;

// Switch the palette (motion off first) before reading colours.
// Transitions and animations are switched off on the probe page, so colours are read settled.
const NO_MOTION = `(() => { if (!document.getElementById('verify-no-motion')) { const s = document.createElement('style'); s.id = 'verify-no-motion'; s.textContent = '*{transition:none!important;animation:none!important}'; document.head.append(s); } return 1; })()`;
const settle = async () => { await ev(NO_MOTION); await ab('wait', '150'); };
const setScheme = async name => { await ev(NO_MOTION); await ev(`document.body.setAttribute('data-md-color-scheme', '${name}'); 1`); await ab('wait', '150'); };

// Titles: h1 colour, its contrast on the canvas, ink, h2 colour, and a mark inside the h1.
const probeTitles = name => `JSON.stringify((() => {${COLOUR_LIB}
  const h1 = document.querySelector('.md-typeset h1'), h2 = document.querySelector('.md-typeset h2');
  const mark = h1.querySelector('mark');
  return {h1: getComputedStyle(h1).color, ratio: measure(h1), ink: token('--fly-ink'), h2: h2 && getComputedStyle(h2).color,
    mark: mark && getComputedStyle(mark).color, hue: document.body.dataset.flyHue || null};
})())`;

// Buttons: fill, label, outline, underline and contrast of the primary and the outlined one.
const probeButtons = name => `JSON.stringify((() => {${COLOUR_LIB}
  const info = el => { const cs = getComputedStyle(el); return {bg: cs.backgroundColor, bgAlpha: rgba(cs.backgroundColor)[3], color: cs.color, ring: cs.boxShadow,
    line: cs.textDecorationLine, ratio: measure(el), outline: cs.outlineStyle, outlineWidth: parseFloat(cs.outlineWidth)}; };
  return {ink: token('--fly-ink'), paper: token('--fly-paper-3'), quiet: token('--fly-quiet'), hue: document.body.dataset.flyHue || null,
    primary: info(document.querySelector('.md-typeset .md-button--primary')),
    outlined: info(document.querySelector('.md-typeset .md-button:not(.md-button--primary)'))};
})())`;

// Keyboard focus on a button: the ring (outline) and its contrast against the page behind the button.
const probeFocus = selector => `JSON.stringify((() => {${COLOUR_LIB}
  const el = document.activeElement, cs = getComputedStyle(el);
  const ring = rgba(cs.outlineColor), page = backdrop(el.parentElement);
  const [hi, lo] = [lum(over(ring, page)), lum(page)].sort((a, b) => b - a);
  return {on: el.matches('${selector}'), visible: el.matches(':focus-visible'), outline: cs.outlineStyle, width: parseFloat(cs.outlineWidth),
    offset: parseFloat(cs.outlineOffset), ringRatio: (hi + 0.05) / (lo + 0.05), bg: cs.backgroundColor};
})())`;

// Active navigation links (L1 and the in-page list) against their own row background.
const probeActiveNav = name => `JSON.stringify((() => {${COLOUR_LIB}
  return [...document.querySelectorAll('.md-nav__link--active')].filter(el => el.getBoundingClientRect().width > 0)
    .map(el => ({text: el.textContent.trim().slice(0, 20), ratio: measure(el)}));
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
    if (GRID_EXEMPT[tag] || GRID_EXEMPT[tag.split('<')[1]]) continue;
    for (const [side, px] of Object.entries(sides)) {
      if (!(Math.abs(px - Math.round(px / blocks.rem) * blocks.rem) <= GRID_TOLERANCE)) off.push(`${tag}.${side}=${px}`);
    }
  }
  const tags = new Set(blocks.items.map(i => i.tag));
  const missing = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'blockquote', 'table', 'figure', 'hr', 'p<blockquote', 'p<div.admonition', 'li<li'].filter(t => !tags.has(t));
  if (![...tags].some(t => t.startsWith('div.admonition'))) missing.push('admonition');
  check(`grid.block-spacing@${width}`, off.length === 0 && missing.length === 0,
    off.length ? `off-grid: ${off.join(' ')} rem=${blocks.rem}` : missing.length ? `not exercised: ${missing}` : `${blocks.items.length} blocks`);
  const gapBad = blocks.gaps.filter(g => !(Math.abs(g - Math.round(g / blocks.rem) * blocks.rem) <= GRID_TOLERANCE));
  check(`grid.paragraph-pitch@${width}`, blocks.gaps.length >= 1 && gapBad.length === 0, `tops of adjacent paragraphs ${blocks.gaps.join(',')} rem=${blocks.rem}`);
};

// Size token per element class (SPEC 4.2, 4.3). Asides (margin admonitions, wide screens only)
// are xs; in the flow, admonitions are body text.
const verifyAdmonitions = async (base, width) => {
  await open(`${base}/fontlab/`, width);
  const {rem, bars} = await ev(PROBE_ADMONITION);
  const off = bars.filter(b => Math.abs(b.centre - b.bar / 2) > 1.5 || (!b.aside && Math.abs(b.bar - 2 * rem) > 0.5)); // a margin aside is xs text and off the grid (SPEC 4.1)
  check(`admonition.icon-centred@${width}`, bars.length >= 2 && off.length === 0,
    off.length ? off.map(b => `bar ${b.bar}px icon centre ${b.centre}px`).join('; ') : `${bars.length} title bars, ${2 * rem}px tall`);
};

const verifyFooterContrast = async base => {
  for (const name of Object.keys(CONFIGS)) {
    for (const scheme of ['default', 'slate']) {
      await open(`${base}/${name}/guide/`, 1440);
      await setScheme(scheme);
      const got = await ev(PROBE_FOOTER_CONTRAST);
      const low = got.filter(g => g.ratio < 4.5);
      check(`footer.contrast.${name}.${scheme}`, got.length >= 3 && low.length === 0,
        `${got.map(g => `${g.text}=${g.ratio.toFixed(1)}`).join(' ')}`);
    }
  }
};

const verifyTitles = async base => {
  for (const [label, url] of [['preset-hue', `${base}/fontlab/guide/`]]) {
    await open(url, 1440);
    for (const name of ['default', 'slate']) {
      await setScheme(name);
      const t = await ev(probeTitles(name));
      check(`h1.${label}.${name}`, t.h1 !== t.ink && t.ratio >= 4.5 && t.h2 === t.ink,
        `hue ${t.hue}: h1 ${t.h1} (${t.ratio.toFixed(1)}:1) ink ${t.ink} h2 ${t.h2}`);
      if (label === 'preset-hue') check(`mark.inherits.${name}`, t.mark !== null && t.mark === t.h1, `mark ${t.mark} h1 ${t.h1}`); // the guide page has a <mark> in its h1
    }
  }
  await open(`${base}/nohue/`, 1440);
  for (const name of ['default', 'slate']) {
    await setScheme(name);
    const t = await ev(probeTitles(name));
    check(`h1.no-hue.${name}`, t.hue === null && t.h1 === t.ink, `hue ${t.hue}: h1 ${t.h1} ink ${t.ink}`);
  }
};

const verifyButtons = async base => {
  await open(`${base}/fontlab/`, 1440);
  const primary = '.md-typeset .md-button--primary';
  const outlined = '.md-typeset .md-button:not(.md-button--primary)';
  const park = () => ab('mouse', 'move', '5', '5');
  for (const name of ['default', 'slate']) {
    await setScheme(name);
    await park();
    const b = await ev(probeButtons(name));
    check(`button.primary.paper-on-ink.${name}`, b.primary.bg === b.ink && b.primary.color === b.paper && b.primary.ratio >= 4.5,
      `hue ${b.hue}: bg ${b.primary.bg} want ink ${b.ink}, label ${b.primary.color} want ${b.paper}, ${b.primary.ratio.toFixed(1)}:1`);
    check(`button.outlined.ink-outline.${name}`, b.outlined.bgAlpha === 0 && b.outlined.color === b.ink && b.outlined.ring.includes(b.ink) && b.outlined.ring.includes('inset') && b.outlined.ratio >= 4.5,
      `bg alpha ${b.outlined.bgAlpha} label ${b.outlined.color} ring ${b.outlined.ring} ink ${b.ink} ${b.outlined.ratio.toFixed(1)}:1`);
    check(`button.no-underline.${name}`, b.primary.line === 'none' && b.outlined.line === 'none', `primary ${b.primary.line} outlined ${b.outlined.line}`);
    await ab('hover', primary);
    await settle();
    const hp = (await ev(probeButtons(name))).primary;
    check(`button.primary.hover.${name}`, hp.bg !== b.primary.bg && hp.bg === b.quiet && hp.ratio >= 4.5, `bg ${hp.bg} want quiet ${b.quiet}, ${hp.ratio.toFixed(1)}:1`);
    await ab('hover', outlined);
    await settle();
    const ho = (await ev(probeButtons(name))).outlined;
    check(`button.outlined.hover.${name}`, ho.bgAlpha > 0 && ho.bg !== b.outlined.bg && ho.color === b.ink && ho.ratio >= 4.5, `bg ${ho.bg} (was ${b.outlined.bg}) label ${ho.color} ${ho.ratio.toFixed(1)}:1`);
    await park();
    // Keyboard focus: Tab from a button placed just before the target. The ring is outside
    // (offset 2px, 2px wide), at least 3:1 against the page, and focus is not the hover look.
    for (const [label, selector, rest] of [['primary', primary, b.primary.bg], ['outlined', outlined, b.outlined.bg]]) {
      await ev(`(() => { document.getElementById('verify-pre')?.remove(); const t = document.querySelector('${selector}'); const pre = document.createElement('button'); pre.id = 'verify-pre'; pre.textContent = 'pre'; t.before(pre); pre.focus(); return 1; })()`);
      await ab('press', 'Tab');
      await settle();
      const f = await ev(probeFocus(selector));
      check(`button.${label}.focus-ring.${name}`, f.on && f.visible && f.outline === 'solid' && f.width >= 2 && f.offset >= 2 && f.ringRatio >= 3,
        `focused ${f.on} visible ${f.visible} outline ${f.outline} ${f.width}px offset ${f.offset}px ring ${f.ringRatio.toFixed(1)}:1`);
      check(`button.${label}.focus-not-hover.${name}`, f.bg === rest, `focused fill ${f.bg} resting fill ${rest} (hover fills, focus rings)`);
    }
    // A pointer focus (not :focus-visible) leaves no ring and no fill.
    const stuck = await ev(`JSON.stringify((() => { const el = document.querySelector('${primary}'); el.focus({focusVisible: false}); const cs = getComputedStyle(el); return {visible: el.matches(':focus-visible'), outline: cs.outlineStyle, bg: cs.backgroundColor}; })())`);
    check(`button.primary.pointer-focus.${name}`, !stuck.visible && stuck.outline === 'none' && stuck.bg === b.primary.bg, `visible ${stuck.visible} outline ${stuck.outline} bg ${stuck.bg}`);
  }
};

// The current page's link on the rails (and in the phone drawer, opened here), every chrome.
const verifyActiveNav = async base => {
  for (const [site, width] of [['fontlab', 1440], ['vexy', 1440], ['none', 1440], ['fontlab', 390], ['vexy', 390], ['none', 390]]) {
    await open(`${base}/${site}/`, width);
    if (width < 1000) await ev("(() => { const d = document.getElementById('__drawer'); d.checked = true; d.dispatchEvent(new Event('change', {bubbles: true})); return 1; })()");
    for (const name of ['default', 'slate']) {
      await setScheme(name);
      const links = await ev(probeActiveNav(name));
      const low = links.filter(l => l.ratio < 4.5);
      check(`nav.active-contrast.${site}.${name}@${width}`, links.length >= 1 && low.length === 0, links.map(l => `${l.text}=${l.ratio.toFixed(1)}`).join(' '));
    }
  }
};

const SIZE_OF = {th: 'xs', figcaption: 'xs', footer: 'xs', nav: 'xs', lead: 'md', quote: 'md',
  table: 'sm', list: 'sm', body: 'sm', admonition: 'sm', 'admonition-title': 'sm', aside: 'xs', 'aside-title': 'xs'};
const WIDE_ONLY = new Set(['aside', 'aside-title']);

const verifySizes = async (base, width, site = 'fontlab') => {
  await open(`${base}/${site}/`, width);
  const at = `${site === 'fontlab' ? '' : site + '.'}sizes`;
  const s = await ev(PROBE_SIZES);
  const tokens = {xs: s.xs, sm: s.sm, md: s.md};
  for (const kind of Object.keys(SIZE_OF)) {
    if (width < 1000 && WIDE_ONLY.has(kind)) continue; // no margin asides on a phone
    const items = s.items.filter(i => i.kind === kind);
    const bad = items.filter(i => !near(i.size, tokens[SIZE_OF[kind]], 0.05));
    check(`${at}.${kind}@${width}`, items.length > 0 && bad.length === 0,
      bad.length ? `want --fly-size-${SIZE_OF[kind]}=${tokens[SIZE_OF[kind]]}px: ${bad.map(b => `${b.tag}[${b.text}]=${b.size}`).join(' ')}` : `${items.length} elements at ${tokens[SIZE_OF[kind]]}px`);
  }
  const unknown = s.items.filter(i => !(i.kind in SIZE_OF));
  const distinct = [...new Set(s.items.map(i => i.size.toFixed(2)))].sort();
  const want = [s.xs, s.sm, s.md].map(v => v.toFixed(2)).sort();
  check(`${at}.exactly-three@${width}`, unknown.length === 0 && distinct.join() === want.join(), `distinct ${distinct} want ${want} over ${s.items.length} elements`);
  const inlineBad = s.inline.filter(r => !near(r.size, r.parent * (r.tag !== 'code' && (r.inCell || r.nested) ? 1 : r.adjust), 0.05));
  check(`${at}.inline-adjust@${width}`, s.inline.length > 0 && inlineBad.length === 0,
    inlineBad.length ? inlineBad.map(r => `${r.tag} ${r.size}px parent ${r.parent}px adjust ${r.adjust}`).join('; ') : `${s.inline.length} runs`);
  // Runs must be exercised in every context the ratio rules distinguish.
  const ctx = {cell: s.inline.some(r => r.inCell && r.tag !== 'code'), nested: s.inline.some(r => r.nested && r.tag !== 'code'), lead: s.inline.some(r => r.inLead), code: s.inline.some(r => r.tag === 'code')};
  check(`${at}.inline-contexts@${width}`, Object.values(ctx).every(Boolean), JSON.stringify(ctx));
};

// MaterialX's own footer (chrome none): previous and next titles and the copyright, all xs.
const verifyFooterSizes = async base => {
  await open(`${base}/none/guide/`, 1440);
  const s = await ev(PROBE_SIZES);
  const footer = s.items.filter(i => i.kind === 'footer');
  const bad = footer.filter(i => !near(i.size, s.xs, 0.05));
  check('none.footer.sizes', footer.length >= 3 && bad.length === 0,
    `${footer.length} footer elements [${footer.map(f => f.text).join(' | ')}] want ${s.xs}px, off: ${bad.map(b => b.size)}`);
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
    if (menu && name !== 'custom') {
      const d = await ev(probeDefined(menu));
      if (typeof d !== 'object') check(`chrome.${name}.defined`, false, `probe returned ${String(d).slice(0, 80)}`);
      else if (!d.reachable) console.log(`skipped chrome.${name}.defined: CDN unreachable (${d.src})`);
      else check(`chrome.${name}.defined`, d.defined, `<${menu}> customElements.get from ${d.src}`);
    }
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


// --- task 11c: titles, links, em, sans, sticky, defaults, blog ------------------------------
const EXTRA = {accent: 'mkdocs-accent.yml', sticky: 'mkdocs-sticky.yml', minimal: 'mkdocs-minimal.yml', blog: 'mkdocs-blog.yml'};

const probeAccent = () => `JSON.stringify((() => {${COLOUR_LIB}
  const art = document.querySelector('.md-content .md-typeset');
  const a = art.querySelector(':scope > p a:not([class])'), em = art.querySelector('em'), strong = art.querySelector('strong');
  const text = getComputedStyle(art.querySelector(':scope > p'));
  return {link: getComputedStyle(a).color, linkRatio: measure(a), body: text.color, linkToken: token('--fly-link'),
    emStyle: getComputedStyle(em).fontStyle, strongStyle: getComputedStyle(strong).fontStyle,
    emFamily: getComputedStyle(em).fontFamily, linkSize: parseFloat(getComputedStyle(a).fontSize) / parseFloat(text.fontSize),
    links: document.body.dataset.flyLinks || null};
})())`;

const verifyAccent = async base => {
  // Which pages colour the H1: a page-level hue (front matter or preset) or h1: accent; links inherit unless links: accent.
  const cases = [['site-hue-only', `${base}/fontlab/`, false], ['preset-hue', `${base}/fontlab/guide/`, true],
    ['page-hue', `${base}/fontlab/hue-page/`, true], ['page-h1-ink', `${base}/fontlab/reference/`, false],
    ['site-h1-accent', `${base}/accent/`, true], ['no-hue', `${base}/nohue/`, false]];
  for (const [label, url, accent] of cases) {
    await open(url, 1440);
    for (const name of ['default', 'slate']) {
      await setScheme(name);
      const t = await ev(probeTitles(name));
      check(`h1.accent-rule.${label}.${name}`, accent ? t.h1 !== t.ink && t.ratio >= 4.5 : t.h1 === t.ink,
        `h1 ${t.h1} (${t.ratio.toFixed(1)}:1) ink ${t.ink} want ${accent ? 'accent' : 'ink'}`);
    }
  }
  await open(`${base}/fontlab/`, 1440);
  const plain = await ev(probeAccent());
  check('links.default-inherit', plain.links === null && plain.link === plain.body && plain.emStyle === 'normal',
    `link ${plain.link} body ${plain.body} em ${plain.emStyle}`);
  await open(`${base}/accent/`, 1440);
  for (const name of ['default', 'slate']) {
    await setScheme(name);
    const t = await ev(probeAccent());
    check(`links.accent.${name}`, t.links === 'accent' && t.link === t.linkToken && t.link !== t.body && t.linkRatio >= 4.5,
      `link ${t.link} want ${t.linkToken} body ${t.body} ${t.linkRatio.toFixed(1)}:1`);
    check(`em.style-italic.${name}`, t.emStyle === 'italic' && t.strongStyle === 'normal', `em ${t.emStyle} strong ${t.strongStyle}`);
    check(`sans.role-applied.${name}`, /system-ui/.test(t.emFamily) && Math.abs(t.linkSize - 1) < 0.01, `em family ${t.emFamily}, link size ratio ${t.linkSize.toFixed(3)} (sans adjust 1)`);
  }
};

const PROBE_STICKY = `JSON.stringify((() => {
  const bar = document.querySelector('fontlab-menu');
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const barH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fly-bar-h')) * rem;
  const rails = [...document.querySelectorAll('.md-sidebar__scrollwrap, .md-sidebar--secondary')].map(el => el.getBoundingClientRect().top);
  return {cls: document.body.classList.contains('fly-sticky'), attr: !!bar && bar.hasAttribute('sticky'), defined: !!customElements.get('fontlab-menu'),
    barTop: bar && bar.getBoundingClientRect().top, barHeight: bar && bar.getBoundingClientRect().height, barH,
    scrollPad: getComputedStyle(document.documentElement).scrollPaddingTop, railTops: rails};
})())`;

const verifySticky = async base => {
  await open(`${base}/sticky/`, 1440);
  await ab('wait', '500');
  const t = await ev(PROBE_STICKY);
  check('sticky.attribute-and-class', t.cls && t.attr, `class ${t.cls} attr ${t.attr}`);
  check('sticky.scroll-padding-clears-bar', parseFloat(t.scrollPad) >= t.barH, `scroll-padding-top ${t.scrollPad} bar ${t.barH}px`);
  await ev('scrollTo(0, 600), 1');
  await settle();
  const s = await ev(PROBE_STICKY);
  if (!t.defined) console.log('ok sticky.bar-pinned skipped: <fontlab-menu> is not defined (the component CDN is unreachable)');
  else {
    check('sticky.bar-pinned', Math.abs(s.barTop) < 1 && Math.abs(s.barHeight - t.barH) <= 2, `bar top ${s.barTop} height ${s.barHeight} want ${t.barH}`);
    check('sticky.rails-below-bar', s.railTops.every(top => top >= t.barH - 1), `rail tops ${s.railTops.map(Math.round)} bar ${t.barH}`);
  }
  await open(`${base}/fontlab/`, 1440);
  await ab('wait', '500');
  await ev('scrollTo(0, 600), 1');
  await settle();
  const d = await ev(PROBE_STICKY);
  check('sticky.default-scrolls-away', !d.cls && !d.attr && (!d.defined || d.barTop < -1), `class ${d.cls} attr ${d.attr} bar top ${d.barTop}`);
};

const verifyMinimal = async base => {
  await open(`${base}/minimal/`, 1440);
  const t = await ev(`(async () => {
    await document.fonts.ready;
    const out = {};
    for (const [k, sel] of [['h1', '.md-typeset h1'], ['body', '.md-typeset p'], ['nav', '.md-nav__link']]) {
      const f = getComputedStyle(document.querySelector(sel)).fontFamily;
      out[k] = {family: f, loaded: document.fonts.check('16px ' + f.split(',')[0].trim())};
    }
    out.sheets = document.querySelectorAll('link[data-fly-font]').length;
    out.search = !!document.querySelector('[data-md-component=search]');
    return JSON.stringify(out);
  })()`);
  const got = typeof t === 'string' ? JSON.parse(t) : t;
  check('minimal.default-font-sources', got.sheets === 5, `${got.sheets} font stylesheets`);
  // Offline the kits cannot load; each role's stack then ends in a system face, so the page still reads.
  for (const k of ['h1', 'body', 'nav']) {
    check(`minimal.font.${k}`, got[k].loaded || /(Arial|serif|sans-serif|system-ui)/.test(got[k].family), `${got[k].family} loaded ${got[k].loaded}`);
  }
  check('minimal.search-present', got.search, 'MaterialX search form');
  await open(`${base}/minimal/guide/`, 1440);
  const w = await ev('document.documentElement.scrollWidth - innerWidth');
  check('minimal.no-overflow', w <= 0, `overflow ${w}px`);
};

const PROBE_BLOG_INDEX = `JSON.stringify((() => {
  const r = el => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom]; };
  const posts = [...document.querySelectorAll('.md-post--excerpt')].map(post => {
    const h = post.querySelector('.md-post__content :is(h1, h2)'), thumb = post.querySelector('.thumb'), box = post.querySelector('.md-post__content');
    const hr = r(h), br = r(box), tr = thumb && r(thumb);
    return {title: h.textContent.trim().slice(0, 30), h: hr, box: br, thumb: tr, align: getComputedStyle(h).textAlign,
      inside: hr[0] >= br[0] - 1 && hr[2] <= br[2] + 1,
      overlap: !!tr && !(hr[2] <= tr[0] || hr[0] >= tr[2] || hr[3] <= tr[1] || hr[1] >= tr[3])};
  });
  return {posts, overflow: document.documentElement.scrollWidth - innerWidth};
})())`;

const PROBE_POST = `JSON.stringify((() => {
  const art = document.querySelector('.md-content__inner .md-typeset');
  const p = art.querySelector('p');
  const plain = art.querySelector('a:not([class])'), cta = art.querySelector('a.site-cta');
  const style = el => el && ({color: getComputedStyle(el).color, line: getComputedStyle(el).textDecorationLine});
  return {overflow: document.documentElement.scrollWidth - innerWidth, text: p.getBoundingClientRect().width,
    plain: style(plain), cta: style(cta), body: getComputedStyle(p).color};
})())`;

const verifyBlog = async base => {
  await open(`${base}/blog/blog/`, 1440);
  const idx = await ev(PROBE_BLOG_INDEX);
  check('blog.excerpts-present', idx.posts.length >= 2, `${idx.posts.length} excerpts`);
  for (const p of idx.posts) {
    check(`blog.excerpt-title.${p.title}`, p.inside && /^(left|start)$/.test(p.align) && !p.overlap,
      `h ${p.h.map(Math.round)} box ${p.box.map(Math.round)} thumb ${p.thumb && p.thumb.map(Math.round)} align ${p.align} overlap ${p.overlap}`);
  }
  await open(`${base}/blog/blog/a-plain-post/`, 1440);
  const post = await ev(PROBE_POST);
  check('blog.component-link-keeps-colour', post.cta.color === 'rgb(200, 26, 39)' && post.cta.line === 'none',
    `cta ${JSON.stringify(post.cta)}`);
  check('blog.classless-link-restyled', post.plain.color === post.body && post.plain.line !== 'none', `plain ${JSON.stringify(post.plain)} body ${post.body}`);
  await open(`${base}/blog/`, 1440);
  const page = await ev(PROBE_POST);
  check('blog.post-text-column', Math.abs(post.text - page.text) / page.text <= 0.1, `post ${post.text.toFixed(0)}px page ${page.text.toFixed(0)}px`);
  await open(`${base}/blog/blog/a-post-with-a-wide-table/`, 390);
  const wide = await ev(PROBE_POST);
  check('blog.mobile-no-overflow', wide.overflow <= 0, `overflow ${wide.overflow}px at 390`);
  await open(`${base}/blog/blog/`, 390);
  const mi = await ev(PROBE_BLOG_INDEX);
  check('blog.mobile-index-no-overflow', mi.overflow <= 0, `overflow ${mi.overflow}px at 390`);
};

// --- main ----------------------------------------------------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-fly-'));
let server;
try {
  const table = parseHeadingTable(fs.readFileSync(path.join(ROOT, 'DESIGN-TOKENS.md'), 'utf8'));
  const sites = {};
  await Promise.all(Object.entries({...CONFIGS, ...EXTRA}).map(async ([name, config]) => {
    sites[name] = path.join(tmp, name);
    await build(config, sites[name]);
  }));
  server = await serve(sites);
  const base = `http://127.0.0.1:${server.address().port}`;
  session = (await run('agent-browser', ['session', 'id', '--scope', 'worktree', '--prefix', 'verify'], {cwd: ROOT, encoding: 'utf8'})).stdout.trim();
  await ab('open', 'about:blank');
  for (const width of [1440, 390]) await verifyGrid(base, width);
  for (const width of [1440, 390]) await verifySizes(base, width);
  await verifySizes(base, 1440, 'none');
  await verifyFooterSizes(base);
  for (const width of [1440, 390]) await verifyAdmonitions(base, width);
  await verifyFooterContrast(base);
  await verifyTitles(base);
  await verifyAccent(base);
  await verifySticky(base);
  await verifyMinimal(base);
  await verifyBlog(base);
  await verifyButtons(base);
  await verifyActiveNav(base);
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
