// this_file: tests/browser/markdown.spec.mjs
import { test, expect } from '@playwright/test';

test('Markdown extensions render keys, marks, notes, tabs and tasks', async ({ page }) => {
  await page.route('**/fltheme26/1.0.0/**', route => route.fulfill({
    path: `dist/1.0.0/${new URL(route.request().url()).pathname.split('/1.0.0/')[1]}`,
  }));
  await page.goto('/materialx/');
  const article = page.locator('article.md-typeset');
  await expect(article.locator('.keys .key-control')).toHaveText('Ctrl');
  await expect(article.locator('.keys .key-s')).toHaveText('S');
  await expect(article.locator('mark')).toHaveText('Marked text');
  await expect(article.locator('div.highlight').first()).toBeAttached();
  await expect(article.locator('code.highlight')).toHaveText('print("FontLab")');
  await expect(article.locator('.task-list-item input')).toBeChecked();
  await article.locator('details summary').click();
  await expect(article.locator('details')).toHaveAttribute('open', '');
  await article.locator('.tabbed-labels label').filter({ hasText: 'Windows' }).click();
  await expect(article.getByText('Windows instructions.', { exact: true })).toBeVisible();

  for (const width of [1440, 390]) for (const scheme of ['default', 'slate']) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('body').evaluate((el, scheme) => el.dataset.mdColorScheme = scheme, scheme);
    // Exercise the optional editorial layer too: it must not restore colored marks.
    for (const editorial of [false, true]) {
      if (editorial) await page.addStyleTag({ url: '/1.0.0/editorial/fontlab-layout.css' });
      const mark = article.locator('mark');
      await expect(mark).toHaveCSS('color', 'rgb(0, 0, 0)');
      await expect(mark).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      expect(await mark.evaluate(el => getComputedStyle(el).getPropertyValue('--md-typeset-mark-color').trim())).toBe('transparent');
    }
  }
});
