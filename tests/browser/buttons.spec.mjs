// this_file: tests/browser/buttons.spec.mjs
import { test, expect } from '@playwright/test';
import { visit } from './harmony-support.mjs';

for (const width of [390, 1440]) {
  test(`standard buttons share geometry and typography at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await visit(page, 'start');
    const buttons = page.getByRole('link', { name: 'Explore FontLab', exact: true });
    await expect(buttons).toHaveCount(3);
    const metrics = await buttons.evaluateAll(nodes => nodes.map(el => {
      const css = getComputedStyle(el), rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height,
        ...Object.fromEntries(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
          'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'borderWidth'].map(key => [key, css[key]])) };
    }));
    for (const metric of metrics) expect(metric).toEqual(metrics[0]);
    expect(parseFloat(metrics[0].paddingLeft)).toBeGreaterThan(0);
    expect(metrics[0].fontWeight).toBe('600');
    await buttons.nth(1).evaluate(el => el.dataset.size = 'default');
    expect((await buttons.nth(1).boundingBox()).height).toBe(metrics[0].height);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute('href', 'https://www.fontlab.com/font-editor/fontlab/');
      await button.focus();
      await expect(button).toBeFocused();
    }
  });
}

test('explicit small, large and icon button sizes remain available', async ({ page }) => {
  await visit(page, 'start');
  await page.evaluate(() => {
    const area = document.createElement('div');
    area.className = 'fltheme-components';
    area.id = 'button-sizes';
    area.innerHTML = '<button class="btn">Default</button><button class="btn" data-size="sm">Small</button><button class="btn" data-size="lg">Large</button><button class="btn" data-size="icon">+</button><button class="du-btn du-btn-sm">Small</button><button class="du-btn du-btn-lg">Large</button><button class="du-btn du-btn-square">+</button>';
    document.body.append(area);
  });
  const sizes = await page.locator('#button-sizes button').evaluateAll(nodes => nodes.map(el => ({ width: el.offsetWidth, height: el.offsetHeight })));
  for (const index of [1, 4]) expect(sizes[index].height).toBeLessThan(sizes[0].height);
  for (const index of [2, 5]) expect(sizes[index].height).toBeGreaterThanOrEqual(sizes[0].height);
  for (const index of [3, 6]) expect(sizes[index].width).toBe(sizes[index].height);
});
