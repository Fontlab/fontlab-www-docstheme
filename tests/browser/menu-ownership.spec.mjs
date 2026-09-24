// this_file: tests/browser/menu-ownership.spec.mjs
import { test, expect } from '@playwright/test';

for (const [brand, script] of [['fontlab', 'img/docs/menu/fontlab.js'], ['vexy', 'i.vexy.art/docs/menu/vexy.js']]) {
  for (const menu of ['global', 'materialx']) for (const search of ['global', 'materialx']) {
    test(`${brand}: mobile ${menu} menu / ${search} search has one control each`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.route('**/menu/fontlab.js', route => route.fulfill({ path: '../img/docs/menu/fontlab.js' }));
      await page.goto('/');
      await page.evaluate(({ brand, menu, search }) => {
        document.body.innerHTML = `<${brand}-menu mobile-menu="${menu}" mobile-search="${search}"></${brand}-menu>`;
        window.requests = [];
        document.addEventListener(`${brand}-menu:mobile-control`, event => {
          if (event.detail.owner !== 'materialx') return;
          window.requests.push(event.detail.control);
          event.preventDefault();
        });
      }, { brand, menu, search });
      await page.addScriptTag({ url: `http://127.0.0.1:8423/${script}` });
      const host = page.locator(`${brand}-menu`);
      const hamburger = host.locator('[part="mobile-menu"]');
      const loupe = host.locator('[part="mobile-search"] [data-search-toggle]');
      await expect(hamburger).toBeVisible();
      await expect(loupe).toBeVisible();
      expect((await loupe.boundingBox()).x).toBeLessThan((await hamburger.boundingBox()).x);
      await hamburger.click();
      expect(await page.evaluate(() => window.requests)).toEqual(menu === 'materialx' ? ['menu'] : []);
      await loupe.click();
      expect(await page.evaluate(() => window.requests)).toEqual([
        ...(menu === 'materialx' ? ['menu'] : []), ...(search === 'materialx' ? ['search'] : []),
      ]);
      await page.setViewportSize({ width: 1488, height: 1000 });
      await expect(host.locator('[part="mobile-controls"]')).toBeHidden();
    });
  }
}
