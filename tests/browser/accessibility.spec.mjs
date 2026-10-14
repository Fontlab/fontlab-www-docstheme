// this_file: tests/browser/accessibility.spec.mjs
import { test, expect } from '@playwright/test';

async function fixture(page, native) {
  await page.route('**/fltheme26/1.0.0/**', route => route.fulfill({
    path: `dist/1.0.0/${new URL(route.request().url()).pathname.split('/1.0.0/')[1]}`,
  }));
  await page.route('**/menu/fontlab.js', route => route.fulfill({ path: '../img/docs/menu/fontlab.js' }));
  if (native) await page.route('**/materialx/', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace(/<fontlab-menu\b[^>]*><\/fontlab-menu>/g, '') });
  });
  await page.goto('/materialx/');
  await page.waitForFunction(() => window.FLTheme);
  await expect(page.locator('[data-md-component="palette"] .md-option:checked')).toHaveCount(1);
}
async function cannotFocus(panel) {
  expect(await panel.evaluate(el => {
    const stops = [...el.querySelectorAll('a[href], button, input, [tabindex]')];
    return stops.length > 0 && stops.every(node => {
      node.focus();
      return document.activeElement !== node;
    });
  })).toBe(true);
}
async function ring(node) {
  await node.focus();
  await expect(node).toBeFocused();
  expect(await node.evaluate(el => {
    const s = getComputedStyle(el);
    return el.matches(':focus-visible') && s.outlineStyle === 'solid'
      && parseFloat(s.outlineWidth) >= 3 && s.outlineColor !== 'rgba(0, 0, 0, 0)'
      && s.visibility === 'visible' && Number(s.opacity) > 0;
  })).toBe(true);
}

for (const native of [true, false]) for (const width of [1280, 375]) for (const scheme of ['default', 'slate']) {
  test(`accessible panels and focus: native=${native}, ${width}, ${scheme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 800 });
    await fixture(page, native);
    await page.locator('body').evaluate((el, scheme) => el.dataset.mdColorScheme = scheme, scheme);
    const drawer = page.locator('.md-sidebar--primary');
    const search = page.locator('.md-search');
    if (width === 375) {
      await cannotFocus(drawer);
      await cannotFocus(page.locator('.md-sidebar--secondary'));
      await page.locator('input.md-toggle[data-md-toggle="toc"]').evaluate(el => {
        el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      const tocLink = page.locator('.md-sidebar--secondary a[href]').first();
      await tocLink.focus();
      await expect(tocLink).toBeFocused();
      await expect(tocLink).toBeInViewport();
      await page.locator('input.md-toggle[data-md-toggle="toc"]').evaluate(el => {
        el.checked = false; el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await cannotFocus(page.locator('.md-sidebar--secondary'));
    }
    const top = page.locator('.md-top');
    await top.evaluate(el => el.hidden = true);
    await cannotFocus(top);
    await expect(top).toBeHidden();
    await cannotFocus(native && width === 1280 ? search.locator('.md-search__output') : search);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(mobile => {
        const el = document.activeElement;
        return !el.closest('[inert]') && (!mobile || !el.closest('.md-sidebar--primary, .md-search'));
      }, width === 375)).toBe(true);
    }
    if (width === 375) {
      const opener = native ? page.locator('.md-header label[for="__drawer"]') : page.locator('fontlab-menu [part="mobile-menu"]');
      await opener.click();
      await expect(drawer).not.toHaveAttribute('inert', '');
      // Opening moves focus to the drawer's first visible stop (its close button under global chrome).
      await expect.poll(() => drawer.evaluate(el => el.contains(document.activeElement) && document.activeElement.checkVisibility())).toBe(true);
      const link = drawer.locator('a[href]').filter({ visible: true }).first();
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(opener).toBeFocused();
      await cannotFocus(drawer);
    }
    const opener = native ? page.locator('.md-header label.md-header__button[for="__search"]')
      : page.locator('fontlab-menu [data-search-toggle]').filter({ visible: true });
    if (native && width === 1280) await page.locator('.md-search__input').focus();
    else await opener.click();
    await ring(page.locator('.md-search__input'));
    await page.keyboard.press('Escape');
    const palette = page.locator('[data-md-component="palette"] .md-option:checked');
    if (width === 1280) {
      await palette.focus();
      await expect(palette).toBeFocused();
      await expect(palette).toHaveCSS('opacity', '1');
      expect((await palette.boundingBox()).width).toBeGreaterThan(20);
      await ring(palette);
      const nextScheme = await palette.getAttribute('data-md-color-scheme') === 'default' ? 'slate' : 'default';
      await palette.press('Enter');
      await expect(page.locator('body')).toHaveAttribute('data-md-color-scheme', nextScheme);
      await expect(palette).toHaveAttribute('data-md-color-scheme', nextScheme);
      await ring(palette);
    }
    const button = page.locator('.md-clipboard, .md-code__button').first();
    await button.scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab'); // Ensure keyboard modality before focusing a button.
    await ring(button);
    // Earlier MaterialX builds use md-clipboard instead of md-code__button.
    await button.evaluate(el => {
      const legacy = document.createElement('button');
      legacy.className = 'md-clipboard'; legacy.textContent = 'Copy legacy code';
      el.parentElement.append(legacy);
    });
    const legacy = page.getByRole('button', { name: 'Copy legacy code', exact: true });
    await expect(legacy).not.toHaveCSS('outline-style', 'solid');
    await ring(legacy);
    await top.evaluate(el => el.hidden = false);
    await ring(top.locator('button').first());
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(drawer).not.toHaveAttribute('inert', '');
  });
}

test('dark text accents meet 4.5:1 on every audited surface', async ({ page }) => {
  await fixture(page, false);
  await page.locator('body').evaluate(el => {
    el.dataset.mdColorScheme = 'slate';
    el.dataset.mdColorPrimary = 'indigo';
    document.querySelector('article').insertAdjacentHTML('beforeend', `
      <div id="a11y-pairs">
        <div class="api-hero"><p class="api-kicker">FontLab · Python · Qt</p></div>
        <a href="#">Link</a><a href="#"><code>Linked code</code></a>
        <div class="highlight"><pre><code><span class="mi">123</span><span class="kc">True</span></code></pre></div>
        <div class="admonition note"><p class="admonition-title">Note</p><p>Body</p></div>
      </div>`);
    const footer = document.createElement('footer');
    footer.className = 'md-footer';
    footer.innerHTML = '<div class="md-copyright">Secondary <a href="#">link</a></div>';
    el.append(footer);
  });
  await page.addStyleTag({ content: '.md-typeset .api-kicker { color: var(--md-primary-fg-color); }' });
  const ratios = await page.evaluate(() => {
    const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    const contrast = (color, bg) => {
      const rgba = color.match(/[\d.]+/g).map(Number);
      const fg = rgba.slice(0, 3).map((v, i) => v * (rgba[3] ?? 1) + bg[i] * (1 - (rgba[3] ?? 1)));
      const a = luminance(fg), b = luminance(bg);
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    };
    const color = selector => getComputedStyle(document.querySelector(selector)).color;
    const pairs = [
      ['link table', color('#a11y-pairs > a'), [36.3, 39.24, 47.09]],
      ['linked code', color('#a11y-pairs a code'), [39, 42, 53]],
      ['number', color('#a11y-pairs .mi'), [39, 42, 53]],
      ['constant', color('#a11y-pairs .kc'), [39, 42, 53]],
      ['secondary', color('.md-copyright'), [53.52, 56.4, 64.04]],
      ['secondary link', color('.md-copyright a'), [53.52, 56.4, 64.04]],
      ['active nav', color('.md-nav__link--active'), [33.4, 37.8, 55]],
      ['API kicker', color('#a11y-pairs .api-kicker'), [30, 33, 41]],
      ['note title', color('#a11y-pairs .admonition-title'), [30, 33, 41]],
      ['note body', color('#a11y-pairs .admonition > p:last-child'), [30, 33, 41]],
    ];
    return pairs.map(([name, fg, bg]) => ({ name, fg, ratio: contrast(fg, bg) }));
  });
  for (const { name, fg, ratio } of ratios) expect(ratio, `${name}: ${fg}`).toBeGreaterThanOrEqual(4.5);
});

for (const scheme of ['default', 'slate']) test(`native mobile toggles are reachable by Tab: ${scheme}`, async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await fixture(page, true);
  await page.locator('body').evaluate((el, scheme) => el.dataset.mdColorScheme = scheme, scheme);
  const drawer = page.locator('.md-header label.md-header__button[for="__drawer"]');
  const search = page.locator('.md-header label.md-header__button[for="__search"]');
  async function tabTo(control) {
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      if (await control.evaluate(el => el === document.activeElement)) return;
    }
    await expect(control).toBeFocused();
  }
  await tabTo(drawer);
  await expect(drawer).toHaveAttribute('role', 'button');
  await expect(drawer).toHaveAttribute('aria-controls', 'fl-native-navigation');
  await page.keyboard.press('Enter');
  await expect(drawer).toHaveAttribute('aria-expanded', 'true');
  const firstLink = page.locator('.md-sidebar--primary a[href]').first();
  await expect(firstLink).toBeFocused();
  await expect(firstLink).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeFocused();
  await expect(drawer).toHaveAttribute('aria-expanded', 'false');
  await tabTo(search);
  await expect(search).toHaveAttribute('role', 'button');
  await page.keyboard.press('Enter');
  await expect(page.locator('.md-search__input')).toBeFocused();
  await expect(search).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(page.locator('.md-search__input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();
  await search.press('Shift+Tab');
  // Palette controls may sit between the two toggles; use actual Tab traversal.
  await drawer.focus();
  await page.keyboard.press('Space');
  await expect(firstLink).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeFocused();
});
