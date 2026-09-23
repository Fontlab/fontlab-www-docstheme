// this_file: scripts/verify-live.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

let sites = JSON.parse(await readFile('review/live-http.json', 'utf8'));
sites.push(
  { name: 'python-api', url: 'https://fontlabcom.github.io/fontlab-python-docs/' },
  { name: 'pythonqt-api', url: 'https://fontlabcom.github.io/fontlab-python-docs/pythonqt/' },
  { name: 'help-vi', url: 'https://help.fontlab.com/fontlab-vi/' },
  { name: 'help-7', url: 'https://help.fontlab.com/fontlab/7/manual/' },
  { name: 'help-8', url: 'https://help.fontlab.com/fontlab/8/' },
  { name: 'specimen', url: 'https://i.fontlab.com/fltheme26/' },
);
if (process.env.SITES) sites = sites.filter(site => process.env.SITES.split(',').includes(site.name));
const browser = await chromium.launch();
const results = [];
await mkdir('review/live', { recursive: true });
try {
  for (const site of sites) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const row = { name: site.name, url: site.url, errors: [], assetFailures: [] };
    page.on('pageerror', e => row.errors.push(e.message));
    page.on('response', r => {
      if (r.url().includes('/fltheme26/') && r.status() >= 400) row.assetFailures.push(r.url());
    });
    try {
      const response = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      row.status = response.status();
      await page.getByText('Reject All', { exact: true }).click({ timeout: 3000 }).catch(() => {});
      await page.waitForFunction(() => window.FLTheme?.version === '1.0.0', null, { timeout: 20000 });
      await page.locator('main, [role=main], .main-wrapper, .page-wrapper, body').first().waitFor({ state: 'visible' });
      if (site.name === 'partners') await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1');
      await page.screenshot({ path: `review/live/${site.name}-desktop.png`, animations: 'disabled' });
      row.title = await page.title();
      row.theme = await page.evaluate(() => window.FLTheme.version);
      row.assetCounts = await page.evaluate(() => Object.fromEntries(['components.css', 'theme.css', 'basecoat.js', 'theme.js'].map(name => [name, [...document.querySelectorAll("link[href], script[src]")].filter(el => (el.href || el.src).endsWith(`/fltheme26/1.0.0/${name}`)).length])));
      row.search = await page.locator('[data-md-component="search"]').count();
      if (row.search && await page.locator('[data-md-component="search-query"]').isVisible()) {
        await page.locator('[data-md-component="search-query"]').click();
        const queries = { 'pythonqt-api': 'QAbstractButton', getgo: 'Pixa', extend: 'TypeRig', styleguide: 'FontLab', 'vexy-docs': 'Vexy' };
        await page.waitForFunction(() => !document.querySelector('.md-search-result__meta')?.textContent.includes('Initializing'), null, { timeout: 60000 });
        const query = queries[site.name] || 'FontLab';
        await page.locator('[data-md-component="search-query"]').pressSequentially(query, { delay: 80 });
        await page.waitForFunction(() => document.querySelectorAll('.md-search-result__item').length > 0, null, { timeout: 60000 });
        row.searchResults = await page.locator('.md-search-result__item').count();
        await page.locator('[data-md-component="search-query"]').fill('');
        await page.keyboard.press('Escape');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.FLTheme?.version === '1.0.0');
      await page.waitForFunction(() => document.documentElement.scrollWidth <= 392, null, { timeout: 5000 }).catch(() => {});
      if (site.name === 'partners') await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1');
      await page.screenshot({ path: `review/live/${site.name}-mobile.png`, animations: 'disabled' });
      row.mobileWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      row.bodyVisible = await page.locator('main, [role=main], .main-wrapper, .page-wrapper, body').first().isVisible();
      row.baselineErrors = site.name === 'fldoc' ? row.errors.filter(e => e === '$(...).tooltipster is not a function') : [];
      row.passed = row.errors.length === row.baselineErrors.length && row.mobileWidth <= 392 && row.status === 200 && row.theme === '1.0.0' && row.assetFailures.length === 0 && Object.values(row.assetCounts).every(n => n === 1);
    } catch (error) {
      row.failure = error.message;
      row.passed = false;
    } finally {
      await page.close();
    }
    results.push(row);
    await writeFile('review/live-browser.json', JSON.stringify(results, null, 2) + '\n');
    console.log(`${row.passed ? 'PASS' : 'FAIL'} ${site.name}: ${row.failure || row.title}`);
  }
} finally {
  await browser.close();
}
if (results.some(row => !row.passed)) process.exitCode = 1;
