// this_file: tests/browser/consumers.spec.mjs
import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';

for (const [name, path] of [
  ['fontlab', 'www.fontlab.com/public/legal/'],
  ['marketing', 'Marketing/docs/fl1992mk/'],
]) {
  test(`${name} loads the shared theme in a real MaterialX page`, async ({ page }) => {
    const missing = [];
    await page.route('https://i.fontlab.com/fltheme26/**', async route => {
      const relative = new URL(route.request().url()).pathname.split('/fltheme26/')[1];
      await route.fulfill({ path: resolve('dist', relative) });
    });
    page.on('response', response => {
      if (response.url().includes('/fltheme26/') && response.status() !== 200) missing.push(response.url());
    });
    await page.goto(`http://127.0.0.1:8423/${path}`);
    await expect(page.locator('main')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.FLTheme?.version)).toBe('1.0.0');
    if (name === 'marketing') {
      await page.waitForLoadState('load');
      await expect(page.locator('body > .fl-local-search')).toHaveCount(1);
      const toc = page.locator('[data-fl-toc-toggle]');
      await toc.click();
      await expect(toc).toHaveAttribute('aria-expanded', 'true');
      await toc.click();
    }
    await page.locator('.md-content__inner').evaluate(el => {
      const specimen = document.createElement('div');
      specimen.className = 'fltheme-components';
      specimen.innerHTML = '<button class="btn">Basecoat test</button> <button class="du-btn du-btn-primary">daisyUI test</button>';
      el.prepend(specimen);
      window.FLTheme.refresh();
    });
    for (const label of ['Basecoat test', 'daisyUI test']) {
      const button = page.getByRole('button', { name: label });
      await expect(button).toBeVisible();
      expect(await button.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(28);
      await expect(button).toHaveCSS('background-color', 'rgb(36, 36, 36)');
      await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)');
    }
    await page.screenshot({ path: `review/${name}-desktop.png`, fullPage: false, animations: 'disabled' });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({ path: `review/${name}-mobile.png`, fullPage: false, animations: 'disabled' });
    for (const overlay of await page.locator('.md-overlay').all()) await expect(overlay).toHaveCSS('opacity', '0');
    expect(missing).toEqual([]);
  });
}
