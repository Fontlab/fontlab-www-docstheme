// this_file: src/keyboard.js
// Page-order shortcuts for ProperDocs/MaterialX and the shared theme specimen.
(() => {
  const pageKey = href => {
    const url = new URL(href, document.baseURI);
    return url.origin + url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  };
  const adjacent = direction => {
    const declared = document.querySelector(`head link[rel="${direction}"]`);
    if (declared) return declared.href;
    const pages = [...new Map([...document.querySelectorAll('.md-nav--primary a.md-nav__link[href]')]
      .filter(link => link.origin === location.origin && !link.hash)
      .map(link => [pageKey(link.href), link.href])).values()];
    const index = pages.findIndex(href => pageKey(href) === pageKey(location.href));
    return index < 0 ? null : pages[index + (direction === 'next' ? 1 : -1)];
  };
  document.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!document.querySelector('[data-md-component="main"], [data-fl-page-navigation]')) return;
    const controls = 'input, textarea, select, button, summary, audio, video, [role="tablist"], [role="listbox"], [role="menu"], [role="menubar"], [role="tree"], [role="grid"], [role="slider"], [role="combobox"], [role="spinbutton"], [role="textbox"], [role="radiogroup"]';
    if (event.composedPath().some(node => node instanceof Element && (node.isContentEditable || node.matches(controls)))) return;
    if (document.querySelector('dialog[open], [aria-modal="true"], #__search:checked, #__drawer:checked') || getSelection()?.isCollapsed === false) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.repeat) return;
    if (event.key === 'ArrowLeft' && !event.altKey) {
      history.back();
      return;
    }
    const href = adjacent(event.key === 'ArrowRight' ? 'next' : 'prev');
    if (href) location.assign(href);
  }, true);
})();
