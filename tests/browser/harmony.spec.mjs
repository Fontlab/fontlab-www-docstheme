// this_file: tests/browser/harmony.spec.mjs
import { test, expect } from '@playwright/test';
import {specimen, style, visit} from './harmony-support.mjs';

test('keycaps share sizing and symbols across all three libraries', async ({ page }) => {
  await visit(page, 'text/code');
  const keys = page.locator('#example-code-materialx-keys kbd, #example-basecoat-kbd kbd, #example-daisyui-kbd kbd');
  const sizes = await keys.evaluateAll(nodes => nodes.map(el => {
    const css = getComputedStyle(el); return [css.fontSize, css.fontFamily, css.borderRadius, css.borderBottomWidth];
  }));
  for (const value of sizes) expect(value).toEqual(sizes[0]);
  for (const key of await keys.all()) {
    expect(await style(key,'content','::after')).toBe('none');
    expect(await style(key,'content','::before')).toMatch(/⇥|⇧/);
  }
  await expect(page.locator('#example-basecoat-kbd kbd')).toHaveClass(/key-tab/);
});

test('standalone field labels have spacing and grouped labels sit nearer their field', async ({ page }) => {
  await visit(page, 'forms/fields');
  for (const id of ['basecoat-label', 'basecoat-input', 'daisyui-label']) {
    const gap = await specimen(page, id).evaluate(el => {
      const label=el.querySelector('label'), input=el.querySelector('input');
      return input.getBoundingClientRect().top-label.getBoundingClientRect().bottom;
    });
    expect(gap, id).toBeGreaterThanOrEqual(8);
  }
  for (const [path,id] of [['forms/fields','daisyui-input'],['forms/fields','daisyui-textarea'],['forms/choices','daisyui-select']]) {
  await visit(page,path);
  const gaps = await specimen(page, id).evaluate(el => {
    const labels=[...el.querySelectorAll('label[for]')];
    return labels.slice(1).map(label => ({above:label.getBoundingClientRect().top-label.previousElementSibling.getBoundingClientRect().bottom,below:document.getElementById(label.htmlFor).getBoundingClientRect().top-label.getBoundingClientRect().bottom}));
  });
  for(const gap of gaps) expect(gap.above).toBeGreaterThan(gap.below);
  }
});

test('switch toggles its value and keeps the thumb inside its track', async ({page}) => {
  await visit(page,'forms/choices');
  const area=specimen(page,'basecoat-switch'),input=area.getByRole('switch');
  for(const checked of [false,true]) {
    await input.setChecked(checked);
    const bounds=await input.evaluate(el=>{
      const track=getComputedStyle(el),thumb=getComputedStyle(el,'::before');
      const shift=new DOMMatrixReadOnly(thumb.transform).m41;
      return {right:parseFloat(track.paddingLeft)+parseFloat(track.borderLeftWidth)+parseFloat(thumb.width)+shift,width:el.getBoundingClientRect().width};
    });
    expect(bounds.right).toBeLessThan(bounds.width);
    await expect(area.locator('output')).toHaveText(checked?'Guidelines on':'Guidelines off');
  }
});

test('choice controls share dimensions, clear radio dots and an unclipped reset', async ({ page }) => {
  await visit(page, 'forms/choices');
  const checkbox=specimen(page,'basecoat-checkbox').locator('input');
  const daisy=specimen(page,'daisyui-checkbox').locator('input').first();
  expect((await checkbox.boundingBox()).width).toBeCloseTo((await daisy.boundingBox()).width, 0);
  await checkbox.check();await daisy.check();
  for(const prop of ['clipPath','rotate','translate','width','height','backgroundColor']) {
    await expect.poll(()=>style(daisy,prop,'::before')).toBe(await style(checkbox,prop,'::before'));
  }
  for(const id of ['basecoat-radio-group','daisyui-radio']) {
    const radio=specimen(page,id).locator('input:checked');
    expect(await style(radio,'backgroundColor','::before')).toBe('rgb(0, 0, 0)');
  }
  const filter=specimen(page,'daisyui-filter');
  await filter.getByRole('radio',{name:'Text',exact:true}).check();
  const reset=filter.getByRole('radio',{name:'All categories',exact:true});
  await expect(reset).toBeVisible();
  expect(await style(reset,'content','::after')).toBe('"×"');
  await reset.check();
  await expect(filter.getByRole('radio',{name:'Images',exact:true})).toBeVisible();
});

test('drawer content remains above its backdrop with uniform native panel padding', async ({ page }) => {
  await visit(page, 'navigation/drawers');
  const sample=specimen(page,'daisyui-drawer');
  await sample.locator('.du-drawer-button').click();
  const menu=sample.locator('.du-drawer-side > :not(.du-drawer-overlay)');
  await menu.scrollIntoViewIfNeeded();
  expect(await style(menu,'backgroundColor')).not.toBe('rgba(0, 0, 0, 0)');
  await expect.poll(()=>menu.evaluate(el => {const b=el.getBoundingClientRect();return el.contains(document.elementFromPoint(b.x+20,b.y+20));})).toBe(true);
  const overlay=sample.locator('.du-drawer-overlay');
  await overlay.click({position:{x:(await overlay.boundingBox()).width-10,y:20}});
  await specimen(page,'basecoat-drawer').getByRole('button',{name:'Open sample panel'}).click();
  const paddings=await page.locator('dialog[open] > div > :is(header,section,footer)').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).paddingLeft));
  expect(new Set(paddings).size).toBe(1);
  expect(parseFloat(paddings[0])).toBeGreaterThan(12);
});

test('chart fits its container and stays above its accessible table', async ({ page }) => {
  await visit(page, 'data/statistics');
  const canvas=specimen(page,'basecoat-chart').locator('canvas');
  await expect(canvas).toBeVisible();
  const bounds=await canvas.evaluate(el=>({chart:el.getBoundingClientRect().bottom,container:el.closest('.fltheme-components').firstElementChild.getBoundingClientRect().bottom,table:el.closest('.fltheme-components').querySelector('table').getBoundingClientRect().top}));
  expect(bounds.chart).toBeLessThanOrEqual(bounds.container+1);
  expect(bounds.table).toBeGreaterThan(bounds.chart);
  for (const theme of ['material-dark', 'material-light']) {
    await page.locator(`.fl-theme__opt[data-theme="${theme}"]`).evaluate(el=>el.click());
    await expect.poll(()=>canvas.evaluate(el=>{
      const probe=document.createElement('span');probe.style.color='var(--muted-foreground)';el.parentElement.append(probe);
      const expected=getComputedStyle(probe).color;probe.remove();
      return window.Chart.getChart(el).options.scales.x.ticks.color === expected;
    })).toBe(true);
  }
});

test('countdown displays its actual authored value without overlapping its label', async ({ page }) => {
  await visit(page, 'data/states');
  const value=specimen(page,'daisyui-countdown').locator('.du-countdown > span');
  expect((await value.boundingBox()).width).toBeGreaterThan(35);
  expect(parseFloat(await style(value,'top','::after'))).toBeLessThan(-100);
  await value.evaluate(el=>el.style.setProperty('--value','34'));
  expect(parseFloat(await style(value,'top','::after'))).toBeLessThan(-500);
});

test('skeletons have real dimensions and page content reserves a quarter viewport', async ({ page }) => {
  await visit(page,'feedback/progress');
  for(const node of await specimen(page,'daisyui-skeleton').locator('.du-skeleton').all()) {
    const box=await node.boundingBox(); expect(box.width).toBeGreaterThan(20);expect(box.height).toBeGreaterThan(8);
  }
  const padding=parseFloat(await style(page.locator('.md-content'),'paddingBottom'));
  expect(padding).toBeCloseTo(page.viewportSize().height/4,0);
});
