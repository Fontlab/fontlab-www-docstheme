// this_file: scripts/verify-mobile-navigation.mjs
import { chromium, expect } from '@playwright/test';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';

const local = process.argv.includes('--local');
const sites = [
  ['ornotto', 'https://fontlab.org/ornotto/'],
  ['marketing', 'https://fontlab.dev/Marketing/fl1992mk/showcase/'],
  ['styleguide', 'https://fontlab.dev/vexy-fontlab-writing-styleguide/fl1992mk/'],
  ['partners', 'https://partners.fontlab.com/'],
  ['fontlab', 'https://www.fontlab.com/legal/'],
  ['vexy', 'https://vexy.art/about/'],
  ['blog', 'https://blog.fontlab.com/'],
];
const selected = process.env.SITES?.split(',');
const out = `review/menu-integration-${local ? 'candidate' : 'live'}`;
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
        for (const asset of ['theme.css', 'theme.js', 'editorial/fontlab-theme.js']) {
          const body = await readFile(`dist/1.0.0/${asset}`);
          await page.route(`**/fltheme26/1.0.0/${asset}`, route => route.fulfill({
            body, contentType: asset.endsWith('.css') ? 'text/css' : 'text/javascript',
          }));
        }
      }
      if (local) for (const [brand, folder] of [['fontlab', 'img'], ['vexy', 'i.vexy.art']]) {
        await page.route(`**/menu/${brand}.js`, route => route.fulfill({ contentType: 'text/javascript', path: `../${folder}/docs/menu/${brand}.js` }));
      }
      if (local && name === 'partners') {
        await page.context().route('https://partners.fontlab.com/**', async route => {
          const url = new URL(route.request().url());
          const path = `../fontlab-partners/docs${url.pathname}${url.pathname.endsWith('/') ? 'index.html' : ''}`;
          if (await stat(path).then(s => s.isFile()).catch(() => false)) await route.fulfill({path});
          else await route.continue();
        });
        row.sourceOverlay = 'fontlab-partners/docs (search plugin enabled)';
      }
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      expect(response.status()).toBe(200);
      await page.getByRole('button', { name: 'Reject All', exact: true }).click({ timeout: 10000 }).catch(() => {});
      await page.waitForFunction(() => window.FLTheme?.version === '1.0.0');
      const global = page.locator('fontlab-menu, vexy-menu').first();
      const toggle = global.locator('[part="mobile-menu"]');
      const loupe = global.locator('[part="mobile-search"] [data-search-toggle]');
      const drawer = page.locator('#__drawer');
      const sidebar = page.locator('.md-sidebar--primary');
      const auxiliary = ['fontlab', 'vexy'].includes(name);
      if (local && auxiliary) await global.evaluate(menu => {
        menu.setAttribute('mobile-menu', 'global');
        menu.setAttribute('mobile-search', 'global');
      });
      for (const width of [390, 800, 1100]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(() => scrollTo(0, 0));
        await expect(toggle).toBeVisible();
        await expect(loupe).toBeVisible();
        expect((await loupe.boundingBox()).x).toBeLessThan((await toggle.boundingBox()).x);
        await toggle.focus();
        await page.keyboard.press('Enter');
        if (auxiliary) {
          await expect(drawer).not.toBeChecked();
          await expect(global.locator('.fl-drawer, .vx-drawer')).toHaveClass(/is-open/);
        } else {
          await expect(drawer).toBeChecked();
          await expect(toggle).toHaveAttribute('aria-expanded', 'true');
          await expect(sidebar).toBeVisible();
          await expect.poll(async () => { const box = await sidebar.boundingBox(); return Math.abs(box.x + box.width - width); }).toBeLessThan(2);
          const box = await sidebar.boundingBox();
          expect(Math.abs(box.x + box.width - width)).toBeLessThan(2);
          await expect(sidebar.locator('a[href]').filter({visible:true}).first()).toBeVisible();
        }
        await page.screenshot({ path: `${out}/${name}-${width}-open.png`, animations: 'disabled' });
        await page.keyboard.press('Escape');
        await expect(drawer).not.toBeChecked();
        await loupe.click();
        if (auxiliary) {
          await expect(global.locator('[part="mobile-search"] input[type="search"]')).toBeVisible();
          await expect(page.locator('#__search')).not.toBeChecked();
        } else {
          await expect(page.locator('#__search')).toBeChecked();
          await expect(page.locator('.fl-mobile-search input')).toBeVisible();
          await expect(page.locator('.fl-mobile-search .md-search__inner')).toHaveCSS('opacity', '1');
          await page.locator('.fl-mobile-search input').fill('');
          await page.locator('.fl-mobile-search input').pressSequentially('font');
          await expect(page.locator('.md-search-result__list a').first()).toBeVisible({timeout:15000});
        }
        await page.screenshot({ path: `${out}/${name}-${width}-search.png`, animations: 'disabled' });
        await page.keyboard.press('Escape');
        await expect(page.locator('body')).not.toHaveAttribute('data-md-scrolllock', '');
        await page.evaluate(() => scrollTo(0, 700));
        row.stage = `scroll ${width}`;
        await page.waitForFunction(() => scrollY > 100);
        const globalBottom = await global.evaluate(el => el.getBoundingClientRect().bottom);
        expect(globalBottom).toBeLessThan(0);
        if (!auxiliary) {
          await expect.poll(async () => (await toggle.boundingBox()).y).toBeLessThan(2);
          await toggle.click();
          await expect(drawer).toBeChecked();
          await page.keyboard.press('Escape');
        }
        row.stage = `horizontal overflow ${width}`;
        await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth + 1);
        await page.screenshot({ path: `${out}/${name}-${width}-scrolled.png`, animations: 'disabled' });
        row.checks.push({ width, globalBottom, trigger: await toggle.boundingBox(), keyboard: true });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${out}/${name}-desktop.png`, animations: 'disabled' });
      await expect(global).toBeVisible();
      await expect(toggle).not.toBeVisible();
      expect(row.errors).toEqual([]);
      row.passed = true;
    } catch (error) {
      row.failure = error.message;
      row.state = await page.evaluate(() => ({ y:scrollY, html:document.documentElement.className, drawer:document.querySelector('#__drawer')?.checked, search:document.querySelector('#__search')?.checked, body:document.body.getAttribute('data-md-scrollfix'), overflow:getComputedStyle(document.body).overflow, height:document.body.scrollHeight, style:document.body.getAttribute('style') }));
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
