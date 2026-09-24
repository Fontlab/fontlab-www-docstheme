// this_file: tests/browser/guide.spec.mjs
import { test, expect } from '@playwright/test';

test('setup guide has working section links and a downloadable starter', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Setup and MaterialX integration/);
  const broken = await page.locator('main a[href^="#"]').evaluateAll(nodes => nodes
    .filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
  expect(broken).toEqual([]);
  for (const id of ['quick-start', 'materialx', 'global-menu', 'controls', 'authoring',
    'appearance', 'static', 'keyboard', 'troubleshooting', 'publishing']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download the MaterialX starter', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('starter.zip');
  await page.getByText('Use the Marketing / writing-styleguide editorial design', { exact: true }).click();
  await expect(page.locator('.guide-details')).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
