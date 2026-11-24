// this_file: tests/fly-tokens.test.mjs
// Checks the --fly-* token CSS in src/fly/tokens against SPEC 4 and DESIGN-TOKENS.md:
// file and layer shape, documented tokens, typographic roles, the palette's contrast and
// hue spacing (self-contained OKLCH -> sRGB, WCAG contrast and OKLab distance), the
// semantic mapping and the MaterialX bridge.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const tokensDir = join(root, 'src/fly/tokens');
const FILES = ['grid.css', 'size.css', 'type.css', 'color.css', 'semantic.css', 'layout.css', 'materialx.css', 'components.css'];
const HUES = ['cherry', 'tangerine', 'amber', 'lime', 'emerald', 'teal', 'sky', 'cobalt', 'indigo', 'violet', 'magenta', 'rose'];
const VARIANTS = ['', '-soft', '-deep', '-tint'];
const ROLES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'lead', 'nav', 'table', 'caption', 'code'];
const ROLE_PROPS = ['family', 'weight', 'stretch', 'features', 'variation', 'size', 'leading', 'tracking', 'scale'];
const INLINE_ROLES = ['em', 'strong', 'mono'];
const LIGHT = ":root, [data-md-color-scheme='default']";
const DARK = "[data-md-color-scheme='slate']";
const NO_OKLCH = '@supports not (color: oklch(0% 0 0))';
const MIN_CONTRAST = 4.5;
const MIN_HUE_DISTANCE = 0.08;
const MAX_FALLBACK_DISTANCE = 0.005;
const SIZE_TOLERANCE_PX = 0.5;

const sources = Object.fromEntries(
  await Promise.all(FILES.map(async (name) => [name, await readFile(join(tokensDir, name), 'utf8')])),
);
const rules = Object.fromEntries(FILES.map((name) => [name, parseCss(sources[name])]));
const allRules = Object.values(rules).flat();
const designDoc = await readFile(join(root, 'DESIGN-TOKENS.md'), 'utf8');

/** Rules of a small CSS subset: at-rule blocks nest, style rules hold declarations. */
function parseCss(text) {
  const css = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const walk = (start, context) => {
    let i = start;
    let prelude = '';
    while (i < css.length) {
      const ch = css[i];
      if (ch === '}') return i + 1;
      if (ch === '{') {
        const head = prelude.trim().replace(/\s+/g, ' ');
        prelude = '';
        if (head.startsWith('@')) {
          i = walk(i + 1, [...context, head]);
          continue;
        }
        const end = css.indexOf('}', i);
        out.push({ selector: head.replace(/\s*,\s*/g, ', '), context, decls: parseDecls(css.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
      prelude += ch;
      i += 1;
    }
    return i;
  };
  walk(0, []);
  return out;
}

function parseDecls(body) {
  const decls = {};
  let depth = 0;
  let current = '';
  for (const ch of body + ';') {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ';' && depth === 0) {
      const colon = current.indexOf(':');
      if (colon > 0) decls[current.slice(0, colon).trim()] = current.slice(colon + 1).trim().replace(/\s+/g, ' ');
      current = '';
    } else current += ch;
  }
  return decls;
}

/** The value a selector declares for a property: outside any @supports-not fallback block, or inside the given context. */
function valueOf(ruleList, selector, prop, context = null) {
  const matches = ruleList.filter(
    (rule) =>
      rule.selector === selector &&
      prop in rule.decls &&
      (context === null ? !rule.context.some((at) => at.startsWith('@supports not')) : rule.context.includes(context)),
  );
  return matches.at(-1)?.decls[prop];
}

const declared = new Set(allRules.flatMap((rule) => Object.keys(rule.decls)));

// ---------- colour maths (OKLab: Björn Ottosson; contrast: WCAG 2.x) ----------
function parseOklch(value) {
  const match = value.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  assert.ok(match, 'not an oklch() colour: ' + value);
  const lightness = Number(match[1]) / (match[2] ? 100 : 1);
  const hue = (Number(match[4]) * Math.PI) / 180;
  return [lightness, Number(match[3]) * Math.cos(hue), Number(match[3]) * Math.sin(hue)];
}

function oklabToLinearSrgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearSrgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363037357 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function hexToLinearSrgb(value) {
  const match = value.match(/^#([0-9a-f]{6})$/i);
  assert.ok(match, 'not a #rrggbb colour: ' + value);
  return [0, 2, 4].map((i) => {
    const channel = parseInt(match[1].slice(i, i + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
}

/** Linear sRGB of any colour literal used in the token files. */
function linear(value) {
  return value.startsWith('oklch(') ? oklabToLinearSrgb(parseOklch(value)) : hexToLinearSrgb(value);
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const contrast = (x, y) => {
  const [hi, lo] = [luminance(linear(x)), luminance(linear(y))].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};
const okDistance = (x, y) => {
  const [p, q] = [linearSrgbToOklab(linear(x)), linearSrgbToOklab(linear(y))];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};
const inGamut = (value) => linear(value).every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4);

const colour = (scheme, name) => valueOf(rules['color.css'], scheme, name);
const fallback = (scheme, name) => valueOf(rules['color.css'], scheme, name, NO_OKLCH);

// ---------- tests ----------
test('token files carry this_file and declare every rule inside @layer fly.tokens', () => {
  for (const name of FILES) {
    assert.ok(
      sources[name].startsWith('/* this_file: src/fly/tokens/' + name + ' */'),
      name + ' must start with its this_file record',
    );
    const body = sources[name].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    assert.match(body, /^@layer fly\.tokens \{[\s\S]*\}$/, name + ' must be one @layer fly.tokens block');
    assert.ok(rules[name].length > 0, name + ' declares no rules');
    for (const rule of rules[name]) {
      assert.equal(rule.context[0], '@layer fly.tokens', name + ': ' + rule.selector + ' is outside the layer');
    }
  }
});

test('no fl27 or fltheme27 name in src/fly (except RENAMES.md), theme or DESIGN-TOKENS.md', async () => {
  const files = [join(root, 'DESIGN-TOKENS.md')];
  for (const dir of ['src/fly', 'theme']) {
    const entries = await readdir(join(root, dir), { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && !entry.parentPath.includes('__pycache__') && entry.name !== 'RENAMES.md') files.push(join(entry.parentPath, entry.name));
    }
  }
  for (const path of files) {
    assert.doesNotMatch(await readFile(path, 'utf8'), /fl27|fltheme27/i, path + ' mentions the old prefix');
  }
});

test('every token named in DESIGN-TOKENS.md is declared, and every colour token is documented', () => {
  const documented = new Set(
    [...designDoc.matchAll(/--fly-[a-z0-9<>-]*[a-z0-9>]/g)].map((match) => match[0]).filter((name) => !/[<>]/.test(name)),
  );
  assert.ok(documented.size > 100, 'DESIGN-TOKENS.md documents too few tokens: ' + documented.size);
  for (const name of documented) assert.ok(declared.has(name), name + ' is documented but not declared');
  for (const file of ['grid.css', 'size.css', 'color.css', 'semantic.css', 'layout.css', 'components.css']) {
    for (const rule of rules[file]) {
      for (const name of Object.keys(rule.decls)) {
        if (name.startsWith('--fly-')) assert.ok(documented.has(name), name + ' (' + file + ') is not documented');
      }
    }
  }
});

test('component outlines contrast with their adjacent paper in both schemes', () => {
  const selector = ':where(:root, [data-md-color-scheme], [data-fly-hue])';
  for (const [name, minimum, papers] of [
    ['--fly-control-border', 3, ['--fly-paper-3', '--fly-paper-2']],
    ['--fly-card-border', 1.5, ['--fly-paper-3']],
  ]) {
    const value = valueOf(rules['components.css'], selector, name);
    const [, percentage] = /^color-mix\(in srgb, var\(--fly-ink\) (\d+)%, var\(--fly-paper-3\)\)$/.exec(value);
    for (const scheme of [LIGHT, DARK]) {
      const ink = colour(scheme, '--fly-ink');
      const canvas = colour(scheme, '--fly-paper-3');
      const channels = ink.slice(1).match(/../g).map((hex, i) => {
        const start = Number.parseInt(canvas.slice(1 + 2 * i, 3 + 2 * i), 16);
        const end = Number.parseInt(hex, 16);
        return Math.round(start + (percentage / 100) * (end - start)).toString(16).padStart(2, '0');
      });
      for (const paper of papers) {
        const ratio = contrast('#' + channels.join(''), colour(scheme, paper));
        assert.ok(ratio >= minimum, `${name} against ${paper} in ${scheme} is ${ratio.toFixed(2)}:1`);
      }
    }
  }
});

test('grid: 1rem half-line, 2rem body line, 90/99/108% root', () => {
  assert.equal(valueOf(rules['grid.css'], ':root', '--fly-line'), '2rem');
  assert.equal(valueOf(rules['grid.css'], ':root', '--fly-half'), '1rem');
  const sizes = rules['grid.css'].filter((rule) => rule.selector === 'html').map((rule) => [rule.context.slice(1).join(' '), rule.decls['font-size']]);
  assert.deepEqual(sizes, [
    ['', '90%'],
    ['@media screen and (min-width: 100em)', '99%'],
    ['@media screen and (min-width: 125em)', '108%'],
  ]);
});

test('every role declares every property and every inline role its three', () => {
  for (const role of ROLES) {
    for (const prop of ROLE_PROPS) {
      const value = valueOf(rules['type.css'], ':root', '--fly-' + role + '-' + prop);
      assert.ok(value, '--fly-' + role + '-' + prop + ' is missing');
    }
    assert.equal(valueOf(rules['type.css'], ':root', '--fly-' + role + '-scale'), '1', role + ' scale defaults to 1');
  }
  for (const role of INLINE_ROLES) {
    for (const prop of ['family', 'weight', 'adjust']) {
      assert.ok(valueOf(rules['type.css'], ':root', '--fly-' + role + '-' + prop), '--fly-' + role + '-' + prop + ' is missing');
    }
    assert.match(valueOf(rules['type.css'], ':root', '--fly-' + role + '-adjust'), /^\d+(\.\d+)?$/, role + ' adjust is unitless');
  }
});

test('text roles use the three sizes; headings use clamp() times their scale', () => {
  const expected = { body: 'sm', table: 'sm', nav: 'xs', caption: 'xs', lead: 'md' };
  for (const [role, size] of Object.entries(expected)) {
    assert.equal(
      valueOf(rules['type.css'], ':root', '--fly-' + role + '-size'),
      'calc(var(--fly-size-' + size + ') * var(--fly-' + role + '-scale))',
    );
  }
  for (const size of ['xs', 'sm', 'md']) assert.match(valueOf(rules['size.css'], ':root', '--fly-size-' + size), /^[\d.]+rem$/);
  for (let level = 1; level <= 6; level += 1) {
    assert.match(
      valueOf(rules['type.css'], ':root', '--fly-h' + level + '-size'),
      new RegExp('^calc\\(clamp\\([\\d.]+rem, [^)]*vw, [\\d.]+rem\\) \\* var\\(--fly-h' + level + '-scale\\)\\)$'),
    );
  }
});

test('flowing-text leadings are whole multiples of 1rem; tables keep the prototype 1.3', () => {
  assert.equal(valueOf(rules['type.css'], ':root', '--fly-table-leading'), '1.3', 'tables may leave the grid (SPEC 4.1)');
  for (const role of ['body', 'lead', 'h6']) {
    assert.equal(valueOf(rules['type.css'], ':root', '--fly-' + role + '-leading'), 'var(--fly-line)');
  }
  for (const role of ['h1', 'h2', 'h3', 'h4', 'h5']) {
    assert.match(valueOf(rules['type.css'], ':root', '--fly-' + role + '-leading'), /^round\(up, [\d.]+em, 1rem\)$/);
  }
});

function headingSize(level, width) {
  const rem = width >= 2000 ? 17.28 : width >= 1600 ? 15.84 : 14.4;
  const length = (expr) => expr.split('+').reduce((sum, term) => {
    const value = parseFloat(term);
    if (term.trim().endsWith('rem')) return sum + value * rem;
    if (term.trim().endsWith('vw')) return sum + value * width / 100;
    throw new Error('unexpected length ' + term);
  }, 0);
  const token = valueOf(rules['type.css'], ':root', `--fly-h${level}-size`);
  const [min, preferred, max] = token.match(/clamp\(([^)]*)\)/)[1].split(',').map(length);
  return Math.max(min, Math.min(preferred, max));
}

test('article heading sizes decrease from h1 through h4 at phone to desktop widths', () => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const sizes = [1, 2, 3, 4, 5, 6].map(level => headingSize(level, width));
    const [h1, h2, h3, h4] = sizes;
    assert.ok(h1 > h2 && h2 > h3 && h3 > h4, `${width}px: ${sizes.join(', ')}`);
  }
});

test('the heading-size table in DESIGN-TOKENS.md matches the clamp() values', () => {
  const widths = [390, 1024, 1440, 1920];
  for (let level = 1; level <= 6; level += 1) {
    const row = designDoc.match(new RegExp('^\\| h' + level + ' \\|(.*)$', 'm'));
    assert.ok(row, 'DESIGN-TOKENS.md has no size row for h' + level);
    const documented = row[1].split('|').slice(0, 4).map((cell) => parseFloat(cell));
    widths.forEach((width, i) => {
      const px = headingSize(level, width);
      assert.ok(Math.abs(px - documented[i]) <= SIZE_TOLERANCE_PX, 'h' + level + ' at ' + width + 'px: ' + px + ' vs ' + documented[i]);
    });
  }
});

test('every hue has four OKLCH variants per scheme, in gamut, with matching hex fallbacks', () => {
  for (const scheme of [LIGHT, DARK]) {
    for (const hue of HUES) {
      for (const variant of VARIANTS) {
        const name = '--fly-' + hue + variant;
        const value = colour(scheme, name);
        assert.ok(value?.startsWith('oklch('), name + ' in ' + scheme + ' must be oklch(): ' + value);
        assert.ok(inGamut(value), name + ' ' + value + ' is outside sRGB');
        const hex = fallback(scheme, name);
        assert.ok(hex, name + ' has no sRGB fallback in ' + scheme);
        assert.ok(okDistance(value, hex) <= MAX_FALLBACK_DISTANCE, name + ': fallback ' + hex + ' differs from ' + value);
      }
      const lightness = (variant) => parseOklch(colour(scheme, '--fly-' + hue + variant))[0];
      assert.ok(lightness('-soft') > lightness(''), hue + ' soft must be lighter than the lead in ' + scheme);
      assert.ok(lightness('') > lightness('-deep'), hue + ' deep must be darker than the lead in ' + scheme);
    }
  }
  for (const hue of HUES) {
    for (const variant of VARIANTS) {
      const name = '--fly-' + hue + variant;
      assert.notEqual(colour(LIGHT, name), colour(DARK, name), name + ' must differ between schemes');
    }
  }
});

test('deep text on light paper and soft text on dark paper reach WCAG 4.5:1', () => {
  const lightPaper = colour(LIGHT, '--fly-paper-3');
  const darkPaper = colour(DARK, '--fly-paper-3');
  assert.ok(lightPaper && darkPaper, 'paper-3 must be declared for both schemes');
  for (const hue of HUES) {
    for (const [text, paper, scheme] of [
      [colour(LIGHT, '--fly-' + hue + '-deep'), lightPaper, 'light'],
      [fallback(LIGHT, '--fly-' + hue + '-deep'), lightPaper, 'light fallback'],
      [colour(DARK, '--fly-' + hue + '-soft'), darkPaper, 'dark'],
      [fallback(DARK, '--fly-' + hue + '-soft'), darkPaper, 'dark fallback'],
    ]) {
      const ratio = contrast(text, paper);
      assert.ok(ratio >= MIN_CONTRAST, hue + ' (' + scheme + ') ' + text + ' on ' + paper + ' is ' + ratio.toFixed(2) + ':1');
    }
  }
});

test('the hr rule reads on the canvas (1.3:1) and footer text on the footer strip (4.5:1)', () => {
  for (const [scheme, name] of [[LIGHT, 'light'], [DARK, 'dark']]) {
    const ratio = contrast(colour(scheme, '--fly-rule'), colour(scheme, '--fly-paper-3'));
    assert.ok(ratio >= 1.3, '--fly-rule on paper-3 (' + name + ') is ' + ratio.toFixed(2) + ':1');
  }
  const bar = contrast(colour(LIGHT, '--fly-bar-ink'), colour(LIGHT, '--fly-bar-drop'));
  assert.ok(bar >= MIN_CONTRAST, '--fly-bar-ink on --fly-bar-drop is ' + bar.toFixed(2) + ':1');
});

test('adjacent lead hues differ by at least 0.08 in OKLab, both schemes, wrapping round', () => {
  for (const scheme of [LIGHT, DARK]) {
    HUES.forEach((hue, i) => {
      const next = HUES[(i + 1) % HUES.length];
      const distance = okDistance(colour(scheme, '--fly-' + hue), colour(scheme, '--fly-' + next));
      assert.ok(distance >= MIN_HUE_DISTANCE, hue + '/' + next + ' in ' + scheme + ': ΔE ' + distance.toFixed(3));
    });
  }
});

test('greys and surfaces exist for both schemes', () => {
  const names = [...Array.from({ length: 9 }, (_, i) => '--fly-gray-' + (i + 1)), '--fly-paper-1', '--fly-paper-2', '--fly-paper-3', '--fly-ink', '--fly-quiet', '--fly-edge'];
  for (const scheme of [LIGHT, DARK]) for (const name of names) assert.ok(colour(scheme, name), name + ' missing in ' + scheme);
  assert.ok(colour(LIGHT, '--fly-bar'), '--fly-bar missing');
});

test('semantic tokens map onto hues through var() only', () => {
  const css = sources['semantic.css'].replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|oklch\(|rgba?\(|hsla?\(|color-mix\(/i, 'semantic.css must not hold colour literals');
  for (const rule of rules['semantic.css']) {
    for (const [name, value] of Object.entries(rule.decls)) {
      assert.match(value, /^var\(--fly-[a-z0-9-]+\)$/, name + ' must be a single var(--fly-*) reference');
    }
  }
  const base = ':where(:root, [data-md-color-scheme], [data-fly-hue])';
  const expected = {
    '--fly-accent': 'cobalt', '--fly-info': 'cobalt', '--fly-success': 'emerald', '--fly-warning': 'amber', '--fly-danger': 'cherry',
    '--fly-admonition-question': 'violet', '--fly-admonition-example': 'indigo', '--fly-admonition-abstract': 'teal',
  };
  for (const [name, hue] of Object.entries(expected)) assert.equal(valueOf(rules['semantic.css'], base, name), 'var(--fly-' + hue + ')', name);
  for (const name of ['--fly-primary', '--fly-link', '--fly-focus', '--fly-mark']) {
    assert.match(valueOf(rules['semantic.css'], base, name), /^var\(--fly-accent/, name + ' follows the accent');
  }
  const admonitions = { note: 'info', info: 'info', tip: 'success', success: 'success', warning: 'warning', danger: 'danger', failure: 'danger', bug: 'danger', quote: 'gray-5' };
  for (const [type, target] of Object.entries(admonitions)) {
    assert.equal(valueOf(rules['semantic.css'], base, '--fly-admonition-' + type), 'var(--fly-' + target + ')', type);
  }
  for (const hue of HUES) {
    for (const variant of VARIANTS) {
      assert.equal(valueOf(rules['semantic.css'], "[data-fly-hue='" + hue + "']", '--fly-accent' + variant), 'var(--fly-' + hue + variant + ')');
    }
  }
});

test('MaterialX colour and typeset variables are bridged from fly tokens', () => {
  const selector = ':root, [data-md-color-scheme], [data-fly-hue]';
  const required = [
    '--md-text-font', '--md-code-font', '--md-default-fg-color', '--md-default-fg-color--light', '--md-default-bg-color',
    '--md-primary-fg-color', '--md-primary-bg-color', '--md-accent-fg-color', '--md-typeset-color', '--md-typeset-a-color',
    '--md-typeset-mark-color', '--md-code-fg-color', '--md-code-bg-color', '--md-admonition-fg-color',
    ...['note', 'abstract', 'info', 'tip', 'success', 'question', 'warning', 'failure', 'danger', 'bug', 'example', 'quote'].map((type) => '--md-admonition-color--' + type),
    '--md-footer-fg-color', '--md-footer-bg-color',
  ];
  for (const name of required) {
    const value = valueOf(rules['materialx.css'], selector, name);
    assert.ok(value?.includes('var(--fly-'), name + ' must be set from a fly token: ' + value);
  }
  for (const rule of rules['materialx.css']) {
    for (const [name, value] of Object.entries(rule.decls)) {
      assert.ok(name.startsWith('--md-'), name + ' is not a MaterialX variable');
      assert.doesNotMatch(value, /#[0-9a-f]{3,8}\b|oklch\(|rgba?\(/i, name + ' holds a colour literal');
    }
  }
  const slate = "[data-md-color-scheme='slate'], [data-md-color-scheme='slate'] [data-fly-hue]";
  assert.equal(valueOf(rules['materialx.css'], slate, '--md-code-hl-keyword-color'), 'var(--fly-cobalt-soft)');
  assert.equal(valueOf(rules['materialx.css'], selector, '--md-code-hl-keyword-color'), 'var(--fly-cobalt-deep)');
});
