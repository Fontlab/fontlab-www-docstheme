// this_file: src/theme.js
(() => {
  if (window.FLTheme) return;
  const refresh = () => {
    document.querySelectorAll('.fltheme-components').forEach(root => {
      const host = root.parentElement.closest('[data-md-color-scheme], [data-theme]') || document.documentElement;
      const scheme = host.getAttribute('data-md-color-scheme');
      const dark = root.dataset.flthemeMode
        ? root.dataset.flthemeMode === 'dark'
        : scheme === 'slate' ? true : scheme === 'default' ? false
          : getComputedStyle(host).colorScheme === 'dark' || host.classList.contains('dark') || host.dataset.theme === 'dark';
      root.classList.toggle('dark', dark);
    });
    window.basecoat?.initAll();
    window.basecoat?.start();
  };
  window.FLTheme = { version: '1.0.0', refresh };
  const start = () => {
    refresh();
    const observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList'
        ? [...record.addedNodes].some(node => node.nodeType === 1 && (node.matches('.fltheme-components') || node.querySelector('.fltheme-components')))
        : record.attributeName !== 'class' || record.target === document.documentElement || record.target === document.body || record.target.matches('[data-theme], [data-md-color-scheme]'))) refresh();
    });
    observer.observe(document.documentElement, {
      attributes: true, childList: true, subtree: true,
      attributeFilter: ['data-md-color-scheme', 'data-theme', 'data-fltheme-mode', 'class'],
    });
    // MaterialX instant navigation replaces content without another page load.
    if (typeof document$ !== 'undefined') document$.subscribe(refresh);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
