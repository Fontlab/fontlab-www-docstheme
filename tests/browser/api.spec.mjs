// this_file: tests/browser/api.spec.mjs
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const [path, query] of [['', 'FontLab'], ['pythonqt/', 'QAbstractButton']]) {
  test(`API search works at ${path || 'root'} with preserved project error routes`, async ({ page }) => {
    test.setTimeout(90000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const html = await readFile(`../fontlab-python-docs/docs/${path}404.html`, 'utf8');
    expect(html).not.toMatch(/(?:href|src)="\/(?:assets|style|index\.html)/);
    expect(html).toContain(`/fontlab-python-docs/${path}assets/stylesheets/`);
    await page.goto(`http://127.0.0.1:8423/fontlab-python-docs/docs/${path}`);
    await page.getByRole('textbox', { name: 'Search' }).click();
    await expect(page.locator('.md-search-result__meta')).not.toContainText('Initializing', { timeout: 60000 });
    await page.getByRole('textbox', { name: 'Search' }).pressSequentially(query, { delay: 80 });
    await expect(page.locator('.md-search-result__list')).toContainText(query, { timeout: 60000 });
    expect(errors).toEqual([]);
  });
}
