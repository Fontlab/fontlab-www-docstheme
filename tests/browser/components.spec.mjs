// this_file: tests/browser/components.spec.mjs
import { test, expect } from '@playwright/test';

test('Basecoat tabs, form and daisyUI disclosure work together', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tabs')).toHaveAttribute('data-tabs-initialized', 'true');
  await page.getByRole('tab', { name: 'Markup' }).click();
  await expect(page.locator('#markup')).toBeVisible();
  await expect(page.locator('#preview')).toBeHidden();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#preview')).toBeVisible();
  await page.getByLabel('Project name').fill('Vernacular');
  await page.getByRole('button', { name: 'Save project' }).click();
  await expect(page.locator('#saved')).toHaveText('Saved “Vernacular” for this session.');
  await page.getByText('How do the libraries coexist?').click();
  await expect(page.locator('.du-collapse')).not.toHaveAttribute('open', '');
});

test('dark mode follows the host and mobile does not overflow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Dark mode' }).click();
  await expect(page.locator('.fltheme-components').first()).toHaveClass(/dark/);
  await expect(page.locator('.input')).toHaveCSS('color', 'rgb(244, 244, 245)');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.getByRole('button', { name: 'Save project' })).toBeVisible();
});

test('vendor reset and runtime leave unrelated host components untouched', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const host = document.createElement('div');
    host.id = 'host-fixture';
    host.innerHTML = '<button class="btn" style="font-size:23px;background:rgb(3,4,5)">Host</button><div class="tabs"><div role="tablist"><button role="tab" aria-selected="false" aria-controls="host-panel">Host tab</button></div><div id="host-panel" role="tabpanel">Host panel</div></div>';
    document.body.append(host);
    window.FLTheme.refresh();
  });
  await expect(page.locator('#host-fixture .tabs')).not.toHaveAttribute('data-tabs-initialized', 'true');
  await expect(page.locator('#host-fixture .btn')).toHaveCSS('font-size', '23px');
  await expect(page.locator('#host-fixture .btn')).toHaveCSS('background-color', 'rgb(3, 4, 5)');
});

test('capture desktop and mobile specimens with no browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'review/desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Dark mode' }).click();
  await expect(page.locator('.input')).toHaveCSS('color', 'rgb(244, 244, 245)');
  await page.screenshot({ path: 'review/dark.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Light mode' }).click();
  await expect(page.locator('.input')).toHaveCSS('color', 'rgb(36, 36, 36)');
  await page.screenshot({ path: 'review/mobile.png', fullPage: true, animations: 'disabled' });
  expect(errors).toEqual([]);
});

test('nested palette changes and custom light schemes remain consistent', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const host = document.createElement('section');
    host.id = 'nested-host';
    host.dataset.mdColorScheme = 'custom-light';
    host.innerHTML = '<div class="fltheme-components"><button class="btn">Nested</button></div>';
    document.body.append(host);
  });
  const root = page.locator('#nested-host .fltheme-components');
  await expect(root).not.toHaveClass(/dark/);
  await page.locator('#nested-host').evaluate(el => { delete el.dataset.mdColorScheme; el.dataset.theme = 'dark'; });
  await expect(root).toHaveClass(/dark/);
  await page.locator('#nested-host').evaluate(el => { el.dataset.theme = 'light'; });
  await expect(root).not.toHaveClass(/dark/);
});

test('instant-navigation subscription initializes replacement content', async ({ page }) => {
  await page.addInitScript(() => { window.document$ = { subscribe(fn) { window.navigateTheme = fn; } }; });
  await page.goto('/');
  await page.evaluate(() => {
    const replacement = document.createElement('div');
    replacement.className = 'fltheme-components';
    replacement.innerHTML = '<div id="new-tabs" class="tabs"><div role="tablist"><button role="tab" aria-controls="new-panel">New tab</button></div><div id="new-panel" role="tabpanel">New content</div></div>';
    document.querySelector('main').replaceChildren(replacement);
    window.navigateTheme();
  });
  await expect(page.locator('#new-tabs')).toHaveAttribute('data-tabs-initialized', 'true');
  await expect(page.getByRole('tab', { name: 'New tab' })).toHaveAttribute('aria-selected', 'true');
});
