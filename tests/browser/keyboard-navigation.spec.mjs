// this_file: tests/browser/keyboard-navigation.spec.mjs
import {test, expect} from '@playwright/test';

const base = 'http://127.0.0.1:8422/keyboard-test/';
test.beforeEach(async ({page}) => {
  await page.route('**/keyboard-test/*', route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1);
    const pages = ['first', 'middle', 'last'];
    const index = pages.indexOf(name);
    const relations = [index > 0 ? `<link rel="prev" href="${pages[index - 1]}">` : '',
      index >= 0 && index < 2 ? `<link rel="next" href="${pages[index + 1]}">` : ''].join('');
    return route.fulfill({contentType:'text/html', body:`<!doctype html><html><head>${relations}
      <script src="/1.0.0/theme.js" defer></script></head><body><main data-md-component="main">
      <h1>${name}</h1><nav class="md-nav--primary">${pages.map(p => `<a class="md-nav__link" href="${p}">${p}</a>`).join('')}</nav>
      <input aria-label="Text" value="abc"><div contenteditable="true">editable text</div>
      <div role="tablist"><button role="tab">Tab</button></div><dialog><button>Close</button></dialog>
      </main></body></html>`});
  });
});

test('right and Alt+right follow nav order; Alt+left follows nav instead of history', async ({page}) => {
  await page.goto(`${base}history`);
  await page.goto(`${base}middle`);
  await page.keyboard.press('Alt+ArrowLeft');
  await expect(page).toHaveURL(`${base}first`);
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(`${base}middle`);
  await page.keyboard.press('Alt+ArrowRight');
  await expect(page).toHaveURL(`${base}last`);
});

test('plain left follows actual history rather than previous nav page', async ({page}) => {
  await page.goto(`${base}history`);
  await page.goto(`${base}middle`);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(`${base}history`);
});

test('nav fallback works without head relations and boundaries do not wrap', async ({page}) => {
  await page.goto(`${base}first`);
  await page.locator('head link').evaluateAll(nodes => nodes.forEach(node => node.remove()));
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(`${base}middle`);
  await page.goto(`${base}last`);
  const prevented = await page.evaluate(() => !document.body.dispatchEvent(new KeyboardEvent('keydown', {key:'ArrowRight',altKey:true,bubbles:true,cancelable:true})));
  expect(prevented).toBe(true);
  await expect(page).toHaveURL(`${base}last`);
});

test('editing, widgets, dialogs, modifier keys and key repeats do not change pages', async ({page}) => {
  await page.goto(`${base}middle`);
  await page.getByLabel('Text').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  expect(await page.getByLabel('Text').evaluate(el => el.selectionStart)).toBe(1);
  for (const selector of ['[contenteditable]', '[role="tab"]']) {
    await page.locator(selector).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(`${base}middle`);
  }
  await page.locator('dialog').evaluate(el => el.showModal());
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(`${base}middle`);
  await page.locator('dialog').evaluate(el => el.close());
  const unhandled = await page.evaluate(() => {
    document.activeElement.blur();
    getSelection().removeAllRanges();
    return ['shiftKey','ctrlKey','metaKey','isComposing'].map(modifier => document.body.dispatchEvent(new KeyboardEvent('keydown', {key:'ArrowRight',[modifier]:true,bubbles:true,cancelable:true})));
  });
  expect(unhandled).toEqual([true,true,true,true]);
  const repeatPrevented = await page.evaluate(() => !document.body.dispatchEvent(new KeyboardEvent('keydown', {key:'ArrowRight',repeat:true,bubbles:true,cancelable:true})));
  expect(repeatPrevented).toBe(true);
  await expect(page).toHaveURL(`${base}middle`);
});

test('static CDN specimen participates in the same page order', async ({page}) => {
  await page.goto('/');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/authoring.html$/);
  await page.waitForFunction(() => window.FLTheme);
  await page.keyboard.press('Alt+ArrowLeft');
  await expect(page).toHaveURL(/\/$/);
});
