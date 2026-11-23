// this_file: src_docs/md/assets/javascripts/component-mode.js
// Basecoat and daisyUI (fly/latest/components.css) switch to their dark colours with a
// `dark` class on the .fltheme-components root; MaterialX's palette toggle sets
// data-md-color-scheme="slate" on <body>. This keeps every component root in step with the
// scheme of its nearest [data-md-color-scheme] ancestor and tells Basecoat (charts) when
// it changed. The Marketing site did this in fltheme26's theme.js, which fly replaces.
(() => {
  const sync = () => {
    let changed = false;
    for (const root of document.querySelectorAll('.fltheme-components')) {
      const dark = root.closest('[data-md-color-scheme]')?.getAttribute('data-md-color-scheme') === 'slate';
      if (root.classList.contains('dark') !== dark) {
        root.classList.toggle('dark', dark);
        changed = true;
      }
    }
    if (changed) document.dispatchEvent(new Event('basecoat:themechange'));
  };
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'], subtree: true });
  sync();
})();
