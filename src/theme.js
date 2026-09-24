// this_file: src/theme.js
(() => {
  if (window.FLTheme) return;
  // Reuse MaterialX's checkbox and drawer, including older custom templates
  // that retained the search host but omitted its navigation trigger.
  const localNavigation = () => {
    const menu = document.querySelector('fontlab-menu, vexy-menu');
    const header = document.querySelector('.md-header');
    const drawer = document.querySelector('#__drawer');
    const navigation = document.querySelector('.md-sidebar--primary');
    if (!menu || !header || !drawer || !navigation || header.dataset.flLocalNavigation) return;
    header.dataset.flLocalNavigation = 'true';
    header.classList.add('fl-local-header');
    header.removeAttribute('aria-hidden');
    document.documentElement.classList.add('fl-local-navigation');
    if (menu.parentElement === header.parentElement) menu.after(header);
    let trigger = header.querySelector('[for="__drawer"]');
    if (!trigger) {
      trigger = document.createElement('label');
      trigger.className = 'md-header__button md-icon';
      trigger.htmlFor = '__drawer';
      trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>';
      header.prepend(trigger);
    }
    if (!navigation.id) navigation.id = 'fl-local-navigation';
    trigger.classList.add('fl-local-nav-toggle');
    trigger.setAttribute('role', 'button');
    trigger.tabIndex = 0;
    trigger.setAttribute('aria-controls', navigation.id);
    const announce = () => {
      trigger.setAttribute('aria-expanded', String(drawer.checked));
      trigger.setAttribute('aria-label', drawer.checked ? 'Close site navigation' : 'Open site navigation');
    };
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation(); // MaterialX also activates labels at document level.
        trigger.click();
      }
    });
    drawer.addEventListener('change', announce);
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !drawer.checked) return;
      drawer.checked = false;
      drawer.dispatchEvent(new Event('change', { bubbles: true }));
      trigger.focus();
    });
    announce();
  };
  const refresh = () => {
    localNavigation();
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
