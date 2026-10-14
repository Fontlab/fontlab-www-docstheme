// this_file: tests/accessibility.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile('src/navigation.js', 'utf8');
function nativeFixture(mobile, local = false, paletteIndex = 0) {
  const listeners = {};
  const focused = [];
  const label = htmlFor => ({
    htmlFor, attributes: {}, matches: () => true,
    closest() { return this; },
    hasAttribute(name) { return name === 'tabindex' || name in this.attributes; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { focused.push(this); },
  });
  const drawerLabel = label('__drawer'), searchLabel = label('__search');
  const navLink = { focus() { focused.push(this); }, checkVisibility: () => true };
  const field = { focus() { focused.push(this); }, checkVisibility: () => true };
  const output = { toggleAttribute(name, value) { this[name] = value; } };
  const search = { classList: { contains: () => local }, querySelector: selector => selector === 'input' ? field : output, querySelectorAll: () => [field] };
  const navigation = {
    getAttribute: () => null, setAttribute() {}, removeAttribute() {}, querySelector: () => navLink, querySelectorAll: () => [navLink],
  };
  const drawer = { checked: false }, toggle = { checked: false };
  for (const input of [drawer, toggle]) input.dispatchEvent = () => listeners.change({ target: input });
  const secondary = {}, toc = { checked: false, id: '__toc' };
  const nestedToc = { checked: true, id: '__toc' };
  const palette = [{ checked: false }, { checked: false }];
  const nodes = { '#__toc': nestedToc, 'input.md-toggle[data-md-toggle="toc"]': toc, '#__drawer': drawer, '#__search': toggle, '.md-search': search, '.md-sidebar--primary': navigation };
  const media = { matches: mobile, addEventListener(name, fn) { this.change = fn; } };
  const window = {};
  runInNewContext(source, {
    window, matchMedia: () => media, addEventListener() {},
    Event: class {}, requestAnimationFrame: fn => fn(),
    customElements: { whenDefined: () => new Promise(() => {}) },
    document: {
      querySelector: selector => nodes[selector],
      querySelectorAll: selector => selector === '.md-sidebar--secondary' ? [secondary]
        : selector === '[data-md-component="palette"] .md-option:has(+ label:not([hidden]))' ? [palette[paletteIndex]]
        : selector.startsWith('.md-header label') ? [drawerLabel, searchLabel] : [],
      addEventListener: (name, fn, capture) => { listeners[name + (capture ? 'Capture' : '')] = fn; },
      documentElement: { classList: { contains: () => false, toggle() {} } },
    },
  });
  window.FLNavigation.refresh();
  return { palette, nestedToc, drawerLabel, searchLabel, navLink, field, focused, secondary, toc, media, search, output, navigation, drawer, toggle, window, listeners };
}

test('palette initializes the radio associated with the visible native label', () => {
  for (const index of [0, 1]) {
    const f = nativeFixture(false, false, index);
    assert.equal(f.palette[index].checked, true, 'Active palette needs a checked radio for keyboard focus');
    assert.equal(f.palette[1 - index].checked, false, 'Inactive palette must not acquire the focus box');
  }
});

test('native panels exclude closed focus stops and restore them on open and resize', () => {
  const f = nativeFixture(true);
  assert.equal(f.navigation.inert, true, 'Closed mobile drawer must be inert');
  assert.equal(f.search.inert, true, 'Closed mobile search must be inert');
  assert.equal(f.output.inert, true, 'Closed results must be inert');
  f.drawer.checked = f.toggle.checked = true;
  f.listeners.change({ target: f.toggle });
  assert.equal(f.navigation.inert, false, 'Open drawer must be reachable');
  assert.equal(f.search.inert, false, 'Open search must be reachable');
  assert.equal(f.output.inert, false, 'Open results must be reachable');
  f.drawer.checked = f.toggle.checked = false;
  f.media.matches = false;
  f.media.change();
  assert.equal(f.navigation.inert, false, 'Desktop navigation must be reachable');
  assert.equal(f.search.inert, false, 'Native desktop search field remains usable');
  assert.equal(f.output.inert, true, 'Closed desktop results remain excluded');
});

test('relocated desktop search excludes its field until opened', () => {
  const f = nativeFixture(false, true);
  assert.equal(f.search.inert, true, 'Closed relocated desktop search must be inert');
  f.toggle.checked = true;
  f.listeners.change({ target: f.toggle });
  assert.equal(f.search.inert, false, 'Open relocated desktop search must be reachable');
});

const css = await readFile('src/theme.css', 'utf8');
const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
  .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
const contrast = (fg, bg) => {
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};
const hex = value => value.match(/../g).map(v => parseInt(v, 16));
test('shared dark palette has a contrast margin on audited surfaces', () => {
  for (const [token, bg] of [
    ['md-typeset-a-color', [36.3, 39.24, 47.09]],
    ['md-typeset-a-color', [39, 42, 53]],
    ['md-code-hl-number-color', [39, 42, 53]],
    ['md-code-hl-constant-color', [39, 42, 53]],
  ]) {
    const value = css.match(new RegExp(`--${token}: #([a-f0-9]{6})`))?.[1];
    assert.ok(value, `Missing dark token ${token}`);
    assert.ok(contrast(hex(value), bg) >= 4.6, `${token} must reach 4.6:1`);
  }
  const alpha = Number(css.match(/--md-default-fg-color--light: hsla\(var\(--md-hue\), 15%, 90%, ([.\d]+)\)/)?.[1]);
  const bg = [53.52, 56.4, 64.04];
  const fg = [226, 228, 233].map((v, i) => v * alpha + bg[i] * (1 - alpha));
  assert.ok(contrast(fg, bg) >= 4.6, 'Secondary text must reach 4.6:1 after alpha compositing');
});

test('independent TOC drawer excludes closed links and restores open and desktop access', () => {
  const f = nativeFixture(true);
  assert.equal(f.nestedToc.checked, true, 'Nested navigation may reuse __toc with a different state');
  assert.equal(f.secondary.inert, true, 'Closed compact TOC must be inert');
  f.toc.checked = true;
  f.listeners.change({ target: f.toc });
  assert.equal(f.secondary.inert, false, 'Open TOC must be reachable');
  f.toc.checked = false;
  f.listeners.change({ target: f.toc });
  assert.equal(f.secondary.inert, true, 'Closed TOC must exclude focus again');
  f.media.matches = false;
  f.window.FLNavigation.refresh();
  assert.equal(f.secondary.inert, false, 'Desktop TOC must remain reachable');
});

for (const mobile of [true, false]) test(`native toggles support activation and focus return (mobile=${mobile})`, () => {
  const f = nativeFixture(mobile);
  const event = (target, key) => ({ target, key, preventDefault() { this.prevented = true; }, stopImmediatePropagation() { this.stopped = true; } });
  for (const control of [f.drawerLabel, f.searchLabel]) {
    assert.equal(control.tabIndex, 0, 'Visible native labels must join Tab order');
    assert.equal(control.attributes.role, 'button', 'Native labels need button semantics');
    assert.ok(control.attributes['aria-label'], 'Native labels need accessible names');
    assert.ok(control.attributes['aria-controls'], 'Native labels must reference their panel');
  }
  const open = event(f.searchLabel, 'Enter');
  f.listeners.keydownCapture(open);
  assert.ok(open.prevented && open.stopped, 'Activation must prevent duplicate native handlers');
  assert.equal(f.toggle.checked, true, 'Enter must open search');
  assert.equal(f.search.inert, false, 'Opened search must be reachable');
  assert.equal(f.focused.at(-1), f.field, 'Search activation must focus the query field');
  assert.equal(f.searchLabel.attributes['aria-expanded'], 'true', 'Expanded state must follow checkbox');
  f.listeners.keydownCapture({ ...event(f.searchLabel, 'Enter'), repeat: true });
  assert.equal(f.toggle.checked, true, 'Held keys must not toggle twice');
  f.listeners.keydownCapture(event(f.field, 'Escape'));
  assert.equal(f.toggle.checked, false, 'Escape must close search');
  assert.equal(f.focused.at(-1), f.searchLabel, 'Escape must restore the actual search opener');
  const close = event(f.searchLabel, ' ');
  f.listeners.keydownCapture(close);
  assert.equal(f.toggle.checked, true, 'Space must open search');
  f.listeners.clickCapture(event(f.searchLabel));
  assert.equal(f.toggle.checked, false, 'Pointer activation must toggle once');
  if (mobile) {
    f.listeners.keydownCapture(event(f.drawerLabel, 'Enter'));
    assert.equal(f.drawer.checked, true, 'Enter must open navigation');
    assert.equal(f.focused.at(-1), f.navLink, 'Drawer activation must focus its first link');
    f.listeners.keydownCapture(event(f.navLink, 'Escape'));
    assert.equal(f.drawer.checked, false, 'Escape must close navigation');
    assert.equal(f.focused.at(-1), f.drawerLabel, 'Escape must restore the drawer opener');
  }
});
