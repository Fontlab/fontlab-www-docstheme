// this_file: tests/browser/range-alignment.spec.mjs
import { test, expect } from '@playwright/test';
import { visit, specimen } from './harmony-support.mjs';

// Read Chromium's rendered native parts: getComputedStyle on a slider pseudo
// element reports the input's box rather than the actual painted thumb geometry.
async function sliderCenters(page, selector) {
  const session = await page.context().newCDPSession(page);
  try {
    const { root } = await session.send('DOM.getDocument');
    const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    const { node } = await session.send('DOM.describeNode', { nodeId, depth: -1, pierce: true });
    const descendants = node => [node, ...[...(node.children || []), ...(node.shadowRoots || [])].flatMap(descendants)];
    const center = async id => {
      const part = descendants(node).find(node => node.attributes?.some((value, index, attrs) => value === 'id' && attrs[index + 1] === id));
      expect(part, `native slider ${id} exists`).toBeTruthy();
      const { model } = await session.send('DOM.getBoxModel', { backendNodeId: part.backendNodeId });
      return (model.border[1] + model.border[5]) / 2;
    };
    return { track: await center('track'), thumb: await center('thumb') };
  } finally { await session.detach(); }
}

for (const width of [1440, 390]) test(`slider thumbs remain centered on their tracks at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await visit(page, 'forms/ranges');
  for (const id of ['daisyui-range', 'basecoat-slider']) {
    const input = specimen(page, id).locator('input[type=range]');
    await input.scrollIntoViewIfNeeded();
    for (const value of ['12', '48', '96']) {
      await input.fill(value);
      const centers = await sliderCenters(page, `#example-${id} input[type=range]`);
      expect(Math.abs(centers.thumb - centers.track), `${id} thumb centered at value ${value}`).toBeLessThanOrEqual(0.5);
    }
    await input.fill('48');
    await input.press('ArrowRight');
    await expect(input).toHaveValue('49');
    await expect(specimen(page, id).locator('output')).toHaveText('49 px');
  }
});
