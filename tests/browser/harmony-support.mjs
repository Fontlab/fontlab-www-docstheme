// this_file: tests/browser/harmony-support.mjs
import { resolve } from 'node:path';
export const specimen = (page, id) => page.locator(`#example-${id} .fl-example-preview`);
export const style = (node, property, pseudo) => node.evaluate((el, [p, ps]) => getComputedStyle(el, ps)[p], [property, pseudo]);
export async function visit(page, path) {
  if(!process.env.HARMONY_LIVE) await page.route('https://i.fontlab.com/fltheme26/**', route => route.fulfill({
    path: resolve('dist', new URL(route.request().url()).pathname.split('/fltheme26/')[1]),
  }));
  const base=process.env.HARMONY_LIVE ? 'https://fontlab.dev/Marketing/fl1992mk/' : 'http://127.0.0.1:8423/Marketing/docs/fl1992mk/';
  await page.goto(`${base}${path}/`);
  await page.waitForFunction(() => window.FLTheme);
  await page.waitForLoadState('networkidle');
  const consent=page.getByRole('button',{name:'Reject All',exact:true});if(await consent.isVisible())await consent.click();
  if(process.env.HARMONY_THEME) {
    await page.locator(`.fl-theme__opt[data-theme="${process.env.HARMONY_THEME}"]`).evaluate(el=>el.click());
    await page.evaluate(async()=>{
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      await Promise.all(document.getAnimations().filter(animation=>animation instanceof CSSTransition).map(animation=>animation.finished.catch(()=>{})));
    });
  }
  if(process.env.HARMONY_WIDTH) await page.setViewportSize({width:Number(process.env.HARMONY_WIDTH),height:1000});
}
