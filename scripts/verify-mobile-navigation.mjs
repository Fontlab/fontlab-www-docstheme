// this_file: scripts/verify-mobile-navigation.mjs
import { chromium, expect } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const local = process.argv.includes('--local');
const sites = [
  ['ornotto', 'https://fontlab.org/ornotto/'],
  ['marketing', 'https://fontlab.dev/Marketing/fl1992mk/'],
  ['styleguide', 'https://fontlab.dev/vexy-fontlab-writing-styleguide/fl1992mk/'],
  ['partners', 'https://partners.fontlab.com/'],
  ['fontlab', 'https://www.fontlab.com/legal/'],
  ['vexy', 'https://vexy.art/about/'],
  ['blog', 'https://blog.fontlab.com/'],
];
const selected = process.env.SITES?.split(',');
const out = `review/mobile-navigation-${local ? 'candidate' : 'live'}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
try {
  for (const [name, url] of sites.filter(([name]) => !selected || selected.includes(name))) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const row = { name, url, checks: [], errors: [], passed: false };
    page.on('pageerror', error => row.errors.push(error.message));
    try {
      if (local) {
        for (const asset of ['theme.css', 'theme.js']) {
          const body = await readFile(`dist/1.0.0/${asset}`);
          await page.route(`**/fltheme26/1.0.0/${asset}`, route => route.fulfill({
            body, contentType: asset.endsWith('.css') ? 'text/css' : 'text/javascript',
          }));
        }
      }
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      expect(response.status()).toBe(200);
      await page.getByRole('button', { name: 'Reject All', exact: true }).click({ timeout: 10000 }).catch(() => {});
      await page.waitForFunction(() => window.FLTheme?.version === '1.0.0');
      const toggle = page.locator('.fl-local-nav-toggle');
      const drawer = page.locator('#__drawer');
      const sidebar = page.locator('.md-sidebar--primary');
      for (const width of [390, 800]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(() => scrollTo(0, 0));
        await expect(toggle).toBeVisible();
        const atTop = await toggle.boundingBox();
        expect(atTop.width).toBeGreaterThanOrEqual(44);
        expect(atTop.height).toBeGreaterThanOrEqual(44);
        await page.evaluate(() => scrollTo(0, 700));
        await page.waitForFunction(() => scrollY > 100);
        await expect.poll(async () => (await toggle.boundingBox()).y).toBeLessThan(2);
        const globalBottom = await page.locator('fontlab-menu, vexy-menu').first()
          .evaluate(el => el.getBoundingClientRect().bottom);
        expect(globalBottom).toBeLessThan(0);
        await toggle.focus();
        await expect(toggle).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(drawer).toBeChecked();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(sidebar).toBeVisible();
        const link = sidebar.locator('a[href]').filter({ visible: true }).first();
        await expect(link).toBeVisible();
        await expect.poll(async () => (await link.boundingBox()).x).toBeGreaterThanOrEqual(0);
        const linkBox = await link.boundingBox();
        expect(linkBox.x).toBeGreaterThanOrEqual(0);
        expect(linkBox.x).toBeLessThan(width);
        await page.screenshot({ path: `${out}/${name}-${width}-open.png`, animations: 'disabled' });
        await page.keyboard.press('Escape');
        await expect(drawer).not.toBeChecked();
        await expect(toggle).toBeFocused();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth + 1);
        await page.screenshot({ path: `${out}/${name}-${width}-scrolled.png`, animations: 'disabled' });
        row.checks.push({ width, globalBottom, trigger: await toggle.boundingBox(), keyboard: true });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${out}/${name}-desktop.png`, animations: 'disabled' });
      expect(await page.locator('fontlab-menu, vexy-menu').first().isVisible()).toBe(true);
      if (name !== 'ornotto') await expect(toggle).not.toBeVisible();
      expect(row.errors).toEqual([]);
      row.passed = true;
    } catch (error) {
      row.failure = error.message;
    } finally {
      await page.close();
    }
    results.push(row);
    await writeFile(`${out}/report.json`, JSON.stringify(results, null, 2) + '\n');
    console.log(`${row.passed ? 'PASS' : 'FAIL'} ${name}: ${row.failure || 'scroll, drawer, keyboard, desktop'}`);
  }
} finally {
  await browser.close();
}
if (results.some(row => !row.passed)) process.exitCode = 1;
