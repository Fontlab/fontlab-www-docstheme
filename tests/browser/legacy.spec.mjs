// this_file: tests/browser/legacy.spec.mjs
import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.route('https://i.fontlab.com/fltheme26/**', route => route.fulfill({
    path: resolve('dist', new URL(route.request().url()).pathname.split('/fltheme26/')[1]),
  }));
});

test('GetGo preserves font specimens, illustrations, downloads and search', async ({ page }) => {
  await page.goto('http://127.0.0.1:8423/getgo-fonts/docs/pixa/');
  const specimen = page.locator('[contenteditable=true]').first();
  await expect(specimen).toBeVisible();
  await specimen.fill('Hamburgefontsiv 123');
  await expect(specimen).toHaveText('Hamburgefontsiv 123');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('24px "GG Pixa"'))).toBe(true);
  await page.locator('.md-content img').evaluateAll(es => Promise.all(es.map(e => e.decode())));
  expect(await page.locator('.md-content img').evaluateAll(es => es.every(e => e.naturalWidth > 0))).toBe(true);
  await expect(page.getByRole('link', { name: 'Download FontLab VFJ' })).toHaveAttribute('href', /getgo-fonts\/cc0\/pixa\/pixa.vfj/);
  await page.screenshot({ path: 'review/getgo-desktop.png', animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'review/getgo-mobile.png', animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1505, height: 1045 });
  await expect(page.locator('.md-search-result__meta')).not.toContainText('Initializing', { timeout: 20000 });
  await page.getByRole('textbox', { name: 'Search' }).pressSequentially('Pixa', { delay: 80 });
  await expect(page.locator('.md-search-result__list')).toContainText('GG Pixa');
});

test('Extend preserves extension routes and working image carousel', async ({ page }) => {
  await page.goto('http://127.0.0.1:8423/extend-fontlab/docs/');
  await expect(page.locator('.md-content')).toContainText('TypeRig');
  await page.screenshot({ path: 'review/extend-desktop.png', animations: 'disabled' });
  await page.goto('http://127.0.0.1:8423/extend-fontlab/docs/typerig/');
  await expect(page.locator('.du-carousel')).toBeVisible();
  expect(await page.locator('.du-carousel img').evaluateAll(es => es.every(e => e.complete && e.naturalWidth > 0))).toBe(true);
  await page.locator('a[href="#contours"]').click();
  await expect(page).toHaveURL(/#contours$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'review/extend-mobile.png', animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
