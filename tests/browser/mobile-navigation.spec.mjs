// this_file: tests/browser/mobile-navigation.spec.mjs
import { test, expect } from '@playwright/test';

async function fixture(page, originalTrigger = false) {
  await page.goto('/');
  await page.setContent(`<style>
    body { margin:0; font-size:16px; }
    fontlab-menu { display:block; height:56px; position:sticky; top:0; }
    .md-header { display:none !important; }
    main { min-height:2000px; }
  </style>
  <input type="checkbox" id="__drawer" hidden>
  <header class="md-header" aria-hidden="true">${originalTrigger ? '<nav class="md-header__inner"><label for="__drawer"><svg viewBox="0 0 24 24"></svg></label><span>Title</span></nav>' : ''}</header>
  <fontlab-menu>Global navigation</fontlab-menu>
  <main><aside class="md-sidebar md-sidebar--primary"><a href="#content">Local destination</a></aside><p id="content">Page content</p></main>`);
  await page.addStyleTag({ url: '/1.0.0/theme.css' });
  // Emulate MaterialX's document-level Enter activation, which must not
  // double-toggle the local label after the shared keyboard handler runs.
  await page.evaluate(() => {
    delete window.FLTheme;
    document.addEventListener('keydown', event => {
      if (event.key === 'Enter' && event.target.tagName === 'LABEL') event.target.click();
    });
  });
  await page.addScriptTag({ url: '/1.0.0/theme.js' });
}

for (const originalTrigger of [false, true]) {
  test(`small sticky navigation with ${originalTrigger ? 'native' : 'legacy missing'} trigger`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await fixture(page, originalTrigger);
    const trigger = page.locator('.fl-local-nav-toggle');
    await expect(trigger).toBeVisible();
    await page.evaluate(() => { FLTheme.refresh(); FLTheme.refresh(); });
    await expect(trigger).toHaveCount(1);
    await page.evaluate(() => scrollTo(0, 600));
    expect((await trigger.boundingBox()).y).toBe(0);
    expect(await page.locator('fontlab-menu').evaluate(e => e.getBoundingClientRect().bottom)).toBeLessThan(0);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#__drawer')).toBeChecked();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.locator('#__drawer')).not.toBeChecked();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('#__drawer')).toBeChecked();
    await trigger.click();
    await expect(page.locator('#__drawer')).not.toBeChecked();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(trigger).not.toBeVisible();
    expect(await page.locator('fontlab-menu').evaluate(e => getComputedStyle(e).position)).toBe('sticky');
  });
}

test('Webflow pages without a MaterialX drawer keep their global menu', async ({ page }) => {
  await page.goto('/');
  await page.setContent('<fontlab-menu>Global navigation</fontlab-menu><main>Webflow page</main>');
  await page.evaluate(() => { delete window.FLTheme; });
  await page.addScriptTag({ url: '/1.0.0/theme.js' });
  await expect(page.locator('.fl-local-nav-toggle')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/fl-local-navigation/);
});
