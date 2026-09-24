// this_file: tests/browser/mobile-navigation.spec.mjs
import { test, expect } from '@playwright/test';

async function fixture(page, brand = 'fontlab') {
  await page.route('**/fltheme26/1.0.0/**', route => route.fulfill({
    path: `dist/1.0.0/${new URL(route.request().url()).pathname.split('/1.0.0/')[1]}`,
  }));
  await page.route('**/menu/fontlab.js', route => route.fulfill({ path: '../img/docs/menu/fontlab.js' }));
  await page.goto('/materialx/');
  if (brand === 'vexy') {
    await page.evaluate(() => document.querySelector('fontlab-menu').replaceWith(document.createElement('vexy-menu')));
    await page.addScriptTag({ url: 'http://127.0.0.1:8423/i.vexy.art/docs/menu/vexy.js' });
  }
}

for (const brand of ['fontlab', 'vexy']) for (const menu of ['global', 'materialx']) for (const search of ['global', 'materialx']) {
  test(`${brand}: vanilla MaterialX with ${menu} navigation and ${search} search`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await fixture(page, brand);
    const host = page.locator(`${brand}-menu`);
    await host.evaluate((el, owners) => {
      el.setAttribute('mobile-menu', owners.menu);
      el.setAttribute('mobile-search', owners.search);
      el.setAttribute('site-label', 'A documentation site with a deliberately long title');
    }, { menu, search });
    const hamburger = host.locator('[part="mobile-menu"]');
    const loupe = host.locator('[part="mobile-search"] button');
    const sidebar = page.locator('.md-sidebar--primary');
    const palette = page.locator('[data-md-component="palette"]');
    for (const width of [390, 800, 1100]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => scrollTo(0, 0));
      await expect(hamburger).toBeVisible();
      await expect(loupe).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      expect((await hamburger.boundingBox()).x + (await hamburger.boundingBox()).width).toBeLessThanOrEqual(width);
      expect((await loupe.boundingBox()).x).toBeLessThan((await hamburger.boundingBox()).x);
      await hamburger.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#__drawer')).toBeChecked({ checked: menu === 'materialx' });
      if (menu === 'materialx') {
        await expect(sidebar).toBeVisible();
        await expect(palette).toBeVisible();
        const box = await sidebar.boundingBox();
        expect(box.x + box.width).toBeCloseTo(width, 0);
        expect((await palette.boundingBox()).y).toBeGreaterThan(650);
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          expect(await sidebar.evaluate(el => el.contains(document.activeElement))).toBe(true);
        }
        await sidebar.locator('.fl-nav-close').focus();
        await page.keyboard.press('Shift+Tab');
        expect(await sidebar.evaluate(el => el.contains(document.activeElement))).toBe(true);
      }
      if (menu === 'global') {
        const panel = host.locator('.fl-drawer, .vx-drawer');
        await expect(panel).toBeVisible();
        if (brand === 'fontlab') await panel.locator('button').filter({visible:true}).first().click();
        await expect(panel.locator('a[href]').filter({visible:true}).first()).toBeVisible();
      }
      await page.keyboard.press('Escape');
      await expect(hamburger).toBeFocused();
      await loupe.click();
      await expect(page.locator('#__search')).toBeChecked({ checked: search === 'materialx' });
      if (search === 'materialx') {
        await expect(page.locator('.md-search__inner')).toHaveCSS('opacity', '1');
        await page.locator('.md-search__input').fill('');
        await page.locator('.md-search__input').pressSequentially('specimen');
        await expect(page.locator('.md-search-result__list a').first()).toBeVisible();
      } else await expect(host.locator('[part="mobile-search"] input[type="search"]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('body')).not.toHaveAttribute('data-md-scrolllock', '');
      await page.evaluate(() => scrollTo(0, 500));
      if (menu === 'materialx' || search === 'materialx') {
        await expect.poll(async () => (await hamburger.boundingBox()).y).toBeLessThan(2);
        await hamburger.click();
        if (menu === 'global') expect((await host.locator('.fl-drawer, .vx-drawer').boundingBox()).y).toBeGreaterThanOrEqual(0);
        await page.keyboard.press('Escape');
        await loupe.click();
        if (search === 'global') expect((await host.locator('[part="mobile-search"] input[type="search"]').boundingBox()).width).toBeGreaterThan(250);
        await page.keyboard.press('Escape');
        await expect(page.locator('body')).not.toHaveAttribute('data-md-scrolllock', '');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.setViewportSize({ width: 1488, height: 1000 });
    await expect(hamburger).toBeHidden();
    await expect(page.locator('.md-header .md-search')).toHaveCount(1);
    await expect(page.locator('.md-header [data-md-component="palette"]')).toHaveCount(1);
  });
}
