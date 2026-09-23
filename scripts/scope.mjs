// this_file: scripts/scope.mjs
import postcss from 'postcss';
import prefixer from 'postcss-prefix-selector';

/** Isolate vendor selectors while preserving nesting and animation steps. */
export async function scopeCSS(css) {
  const result = await postcss([prefixer({
    prefix: '.fltheme-components',
    transform(prefix, selector, prefixed, file, rule) {
      for (let parent = rule.parent; parent; parent = parent.parent) {
        if (parent.type === 'rule') return selector;
      }
      if (selector === '.dark') return `${prefix}.dark`;
      if (/^(:root|:host|html|body)(?=$|[\s:[.#])/.test(selector)) {
        return selector.replace(/^(:root|:host|html|body)/, prefix);
      }
      return prefixed;
    },
  })]).process(css, { from: undefined, map: false });
  return result.root.toString();
}
