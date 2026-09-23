// this_file: tests/browser/cascade.spec.mjs
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const markup = `<div class="fltheme-components">
  <button class="btn">Basecoat</button><button class="du-btn du-btn-primary">Daisy</button>
  <span class="du-badge du-badge-info du-badge-outline">Badge</span>
  <div class="du-collapse du-collapse-open"><div class="du-collapse-content">Open</div></div>
  <details class="du-collapse" open><summary class="du-collapse-title">Title</summary><div class="du-collapse-content">Details</div></details>
  <details class="du-dropdown" open><summary>Drop</summary><div>Menu</div></details>
  <ul class="du-menu du-menu-vertical"><li><details open><summary>More</summary><ul><li>Item</li></ul></details></li></ul>
  <div class="du-drawer du-drawer-open"><input class="du-drawer-toggle" type="checkbox" checked><div class="du-drawer-side">Sidebar</div></div>
  <input class="du-validator" aria-invalid="true"><p class="du-validator-hint">Invalid</p>
</div>`;
const cases = [
  ['.btn', ['backgroundColor', 'color', 'borderRadius', 'height']],
  ['.du-btn', ['backgroundColor', 'color', 'borderRadius', 'height']],
  ['.du-badge', ['borderWidth', 'borderColor', 'height']],
  ['.du-collapse-open .du-collapse-content', ['overflow', 'visibility']],
  ['details.du-collapse .du-collapse-content', ['overflow', 'visibility']],
  ['.du-dropdown', ['overflow']],
  ['.du-menu details ul', ['backgroundColor', 'borderRadius', 'boxShadow', 'animationName', 'transitionProperty']],
  ['.du-drawer-side', ['scrollbarColor']],
  ['.du-validator-hint', ['display', 'visibility']],
];

test('compiled component appearance matches native cascade layers', async ({ browser }) => {
  const reference = await browser.newPage();
  const compiled = await browser.newPage();
  await reference.setContent(markup);
  await compiled.setContent(markup);
  await reference.addStyleTag({ content: await readFile('.cache/native.css', 'utf8') });
  for (const path of ['components.css', 'theme.css']) {
    await compiled.addStyleTag({ content: await readFile(`dist/1.0.0/${path}`, 'utf8') });
  }
  await reference.screenshot({ animations: 'disabled' });
  await compiled.screenshot({ animations: 'disabled' });
  for (const [selector, properties] of cases) {
    const values = async page => page.locator(selector).first().evaluate((el, props) => {
      const style = getComputedStyle(el);
      return Object.fromEntries(props.map(prop => [prop, style[prop]]));
    }, properties);
    expect.soft(await values(compiled), selector).toEqual(await values(reference));
  }
  await reference.close();
  await compiled.close();
});
