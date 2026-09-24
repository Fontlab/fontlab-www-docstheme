// this_file: tests/browser/harmony-layout.spec.mjs
import { test, expect } from '@playwright/test';
import {specimen, style, visit} from './harmony-support.mjs';
const gapAfter = node => node.evaluate(el=>el.nextElementSibling.getBoundingClientRect().top-el.getBoundingClientRect().bottom);

test('action rows and badge groups have breathing room',async({page})=>{
  await visit(page,'text/links');
  for(const id of ['links-semantic-buttons','links-button-variants']){
    const area=specimen(page,id);
    expect(await gapAfter(area.locator('label'))).toBeGreaterThanOrEqual(8);
    expect(await gapAfter(area.locator('input'))).toBeGreaterThanOrEqual(10);
  }
  await visit(page,'images/marks');
  expect(await gapAfter(specimen(page,'daisyui-badge').locator('.fl-ui-row').first())).toBeGreaterThanOrEqual(10);
});

test('daisyUI tabs match MaterialX geometry and still switch panels with arrow keys',async({page})=>{
  await visit(page,'structure/disclosure');
  const mx=specimen(page,'materialx-content-tabs').locator('.tabbed-labels label').first();
  const du=specimen(page,'daisyui-tab').locator('.du-tab').first();
  expect(parseFloat(await style(du,'fontSize'))).toBeCloseTo(parseFloat(await style(mx,'fontSize')),1);
  expect((await du.boundingBox()).height).toBeCloseTo((await mx.boundingBox()).height,0);
  await du.focus();await page.keyboard.press('ArrowRight');
  await expect(specimen(page,'daisyui-tab').getByText('Inspect sidebearings and representative pairs.')).toBeVisible();
  await expect(specimen(page,'daisyui-tab').getByText('Inspect curves and contour direction.')).toBeHidden();
});

test('figure captions are small upright and aligned with the reading edge',async({page})=>{
  await visit(page,'images/pictures');
  const caption=specimen(page,'materialx-images').locator('figcaption');
  await expect(caption).toHaveCSS('font-style','normal');
  expect(await style(caption,'textAlign')).toMatch(/start|left/);
  expect(parseFloat(await style(caption,'fontSize'))).toBeLessThan(parseFloat(await style(page.locator('.md-content__inner'),'fontSize')));
});

test('all four frames contain readable content without overflowing the page',async({page})=>{
  await visit(page,'images/frames');
  for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const phone=specimen(page,'daisyui-mockup-phone');
    const display=await phone.locator('.du-mockup-phone-display').boundingBox();
    const text=await phone.locator('article').boundingBox();
    expect(text.y).toBeGreaterThanOrEqual(display.y);
    expect(text.y+text.height).toBeLessThanOrEqual(display.y+display.height);
    expect(display.height).toBeLessThan(600);
    expect((await phone.locator('.du-mockup-phone').boundingBox()).height-display.height).toBeLessThan(30);
    for (const row of await specimen(page,'daisyui-mockup-code').locator('pre').all()) {
      const line=await row.boundingBox(),code=await row.locator('code').boundingBox();
      expect(code.y-line.y).toBeLessThan(10);
      expect(code.x-line.x).toBeGreaterThan(20);
    }
  }
});

test('pagination marks the current page with a pill and retains plain destination links',async({page})=>{
  await visit(page,'navigation/location');
  const area=specimen(page,'basecoat-pagination');
  const current=area.locator('[aria-current=page]');await expect(current).toHaveText('2 · Location');
  expect(await style(current,'backgroundColor')).not.toBe('rgba(0, 0, 0, 0)');
  for(const link of await area.locator('a').all()) await expect(link).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
});

test('dropdown chevron is neutral centered and toggles with its menu',async({page})=>{
  await visit(page,'navigation/menus');
  const summary=specimen(page,'daisyui-dropdown').locator('summary');
  expect(await style(summary,'borderBottomColor','::after')).toBe(await summary.evaluate(el=>getComputedStyle(el).getPropertyValue('--muted-foreground').trim()==='#62626b'?'rgb(98, 98, 107)':'rgb(176, 176, 186)'));
  await summary.click();await expect(summary.locator('..')).toHaveAttribute('open','');
  await summary.press('Enter');await expect(summary.locator('..')).not.toHaveAttribute('open','');
});

test('select and combobox open select values and preserve native-select chevrons',async({page})=>{
  await visit(page,'forms/choices');
  const base=specimen(page,'basecoat-native-select').locator('select');
  const daisy=specimen(page,'daisyui-select').locator('select').first();
  expect(await style(daisy,'backgroundImage')).toBe(await style(base,'backgroundImage'));
  await base.selectOption({label:'TTF'});await expect(base).toHaveValue('TTF');
  await daisy.selectOption('pl');await expect(daisy).toHaveValue('pl');
  const custom=specimen(page,'basecoat-select');await custom.getByRole('button').click();
  await custom.getByRole('option',{name:'Bold',exact:true}).click();
  await expect(custom.locator('input[type=hidden]')).toHaveValue('bold');
  const combo=specimen(page,'basecoat-combobox');expect(await gapAfter(combo.locator('label'))).toBeGreaterThanOrEqual(8);
  await combo.getByRole('combobox').fill('Serif');await combo.getByRole('option',{name:'Studio Serif'}).click();
  await expect(combo.locator('input[type=hidden]')).toHaveValue('serif');
});

test('date and range fields have space and both slider styles retain native values',async({page})=>{
  await visit(page,'forms/ranges');
  for(const id of ['daisyui-calendar','daisyui-range','basecoat-slider']) expect(await gapAfter(specimen(page,id).locator('label'))).toBeGreaterThanOrEqual(8);
  const a=specimen(page,'basecoat-slider').locator('input'),b=specimen(page,'daisyui-range').locator('input');
  expect(await style(a,'height')).toBe(await style(b,'height'));
  for(const node of [a,b]){await node.focus();await node.press('ArrowRight');await expect(node).toHaveValue('49');}
  await expect(specimen(page,'daisyui-range').locator('output')).toHaveText('49 px');
});

test('MaterialX admonitions are unboxed, colored and align body text with headings',async({page})=>{
  await visit(page,'feedback/notes');
  const preview=specimen(page,'materialx-admonitions');
  const tip=preview.locator('details');
  await tip.locator('summary').click();await expect(tip).toHaveAttribute('open','');
  for(const note of await preview.locator('.admonition, details').all()) {
    const title=note.locator(':scope > .admonition-title, :scope > summary');
    const body=note.locator(':scope > p:not(.admonition-title)');
    for(const node of [note,title]) {
      expect(await style(node,'backgroundColor')).toBe('rgba(0, 0, 0, 0)');
      expect(await style(node,'boxShadow')).toBe('none');
      for(const edge of ['Top','Right','Bottom','Left'])expect(await style(node,`border${edge}Width`)).toBe('0px');
    }
    const color=await style(title,'color');
    expect(await style(body,'color')).toBe(color);
    expect(await style(title,'backgroundColor','::before')).toBe(color);
    expect(await style(title,'maskImage','::before')).not.toBe('none');
    expect(await style(title,'overflow')).toBe('visible');
    if(await title.evaluate(el=>el.tagName==='SUMMARY'))expect(await style(title,'backgroundColor','::after')).toBe(color);
    const textLeft=async node=>node.evaluate(el=>{
      const range=document.createRange();range.selectNodeContents(el);return range.getBoundingClientRect().left;
    });
    expect(Math.abs(await textLeft(title)-await textLeft(body))).toBeLessThanOrEqual(1);
    expect(await textLeft(body)-(await note.boundingBox()).x).toBeGreaterThan(20);
  }
  await tip.locator('summary').press('Enter');await expect(tip).not.toHaveAttribute('open','');
});

test('progress tracks match and table headings and captions align left',async({page})=>{
  await visit(page,'feedback/progress');
  const base=specimen(page,'basecoat-progress').locator('.progress'),daisy=specimen(page,'daisyui-progress').locator('progress');
  for(const prop of ['height','backgroundColor','borderRadius']) expect(await style(base,prop)).toBe(await style(daisy,prop));
  await visit(page,'data/tables');
  for(const node of await page.locator('#example-basecoat-table caption, #example-daisyui-table th').all())expect(await style(node,'textAlign')).toMatch(/left|start/);
});

test('hero paragraphs and action have visible vertical separation',async({page})=>{
  await visit(page,'layouts/products');
  const nodes=await specimen(page,'daisyui-hero').locator('.du-hero-content > *').all();
  for(const node of nodes.slice(0,-1))expect(await gapAfter(node)).toBeGreaterThanOrEqual(14);
});

test('all tooltip libraries and annotations share the Basecoat scale and surface',async({page})=>{
  await visit(page,'feedback/hints');
  const base=specimen(page,'basecoat-tooltip').locator('a');await base.hover();
  const props=['fontSize','lineHeight','padding','backgroundColor','color','borderRadius'];
  const expected=await Promise.all(props.map(p=>style(base,p,'::before')));
  await page.keyboard.press('Tab');await base.focus();await page.mouse.move(0,0);
  await expect.poll(()=>style(base,'opacity','::before')).toBe('1');
  const daisy=specimen(page,'daisyui-tooltip').locator('a');await daisy.focus();
  await expect.poll(()=>style(daisy,'opacity','::before')).toBe('1');
  expect(await Promise.all(props.map(p=>style(daisy,p,'::before')))).toEqual(expected);
  const mx=specimen(page,'materialx-tooltips').locator('a');await mx.hover();
  const tooltip=page.locator('.md-tooltip2--active .md-tooltip2__inner');await expect(tooltip).toBeVisible();
  expect(await Promise.all(props.map(p=>style(tooltip,p)))).toEqual(expected);
  await page.mouse.move(0,0);
  await specimen(page,'materialx-annotations').locator('.md-annotation__index').click();
  const annotation=page.locator('.md-tooltip--active .md-tooltip__inner');await expect(annotation).toBeVisible();
  expect(await style(annotation,'fontSize')).toBe(expected[0]);
  expect(await style(annotation,'lineHeight')).toBe(expected[1]);
});
