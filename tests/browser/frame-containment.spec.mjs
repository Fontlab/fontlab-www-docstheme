// this_file: tests/browser/frame-containment.spec.mjs
import {test, expect} from '@playwright/test';
import {specimen, visit} from './harmony-support.mjs';

test('terminal rows and their text stay inside the mockup at phone widths', async ({page}) => {
  await visit(page,'images/frames');
  const frame=specimen(page,'daisyui-mockup-code').locator('.du-mockup-code');
  for(const width of [1440,390,320]) {
    await page.setViewportSize({width,height:1000});
    const bounds=await frame.boundingBox();
    for(const row of await frame.locator('pre').all()) {
      const line=await row.boundingBox();
      expect(line.x+line.width).toBeLessThanOrEqual(bounds.x+bounds.width+1);
      expect(await row.locator('code').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    }
  }
});
