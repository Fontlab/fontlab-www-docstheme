// this_file: tests/browser/vexy-search-background.spec.mjs
import { test, expect } from '@playwright/test';

for (const width of [390, 800, 1100]) for (const mode of ['dark', 'light']) {
  test(`Vexy mobile search uses panel colours: ${mode}, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const dark = mode === 'dark';
    await page.setContent(`<vexy-menu bg="transparent" mode="${mode}"
      panel-bg="${dark ? '#252525' : '#ffffff'}"
      panel-fg="${dark ? '#f5f5f5' : '#111213'}" data-materialx-mobile></vexy-menu>`);
    await page.addScriptTag({ path: '../i.vexy.art/docs/menu/vexy.js' });
    const controls = page.locator('vexy-menu .vx-mobile-controls');
    const toggle = controls.locator('[data-search-toggle]');
    const input = controls.locator('input[name="q"]');
    await toggle.click();
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await expect(input).toHaveCSS('background-color', dark ? 'rgb(37, 37, 37)' : 'rgb(255, 255, 255)');
    await expect(input).toHaveCSS('color', dark ? 'rgb(245, 245, 245)' : 'rgb(17, 18, 19)');
    await expect(controls.locator('form')).toHaveAttribute('action', 'https://search.fontlab.com/');
    await input.press('Escape');
    await expect(input).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.setViewportSize({ width: 1488, height: 1000 });
    await expect(controls).toBeHidden();
  });
}
