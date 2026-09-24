// this_file: src/navigation.js
// Bridge the global menu's public controls to MaterialX's existing UI.
(() => {
  const mobile = matchMedia('(max-width: 76.234375em)');
  const placements = new Map();
  const roles = new WeakMap();
  let menu, drawer, navigation, searchToggle, search, trigger;
  const setChecked = (input, checked) => {
    if (!input || input.checked === checked) return;
    input.checked = checked;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const place = (node, target) => {
    if (!node) return;
    if (target) {
      if (!placements.has(node)) {
        const marker = document.createComment('MaterialX desktop position');
        node.before(marker);
        placements.set(node, marker);
      }
      if (node.parentElement !== target) target.append(node);
    } else if (placements.has(node)) {
      placements.get(node).replaceWith(node);
      placements.delete(node);
    }
  };
  const stateClass = (name, enabled) => {
    const html = document.documentElement;
    if (html.classList.contains(name) !== enabled) html.classList.toggle(name, enabled);
  };
  const sync = () => {
    const open = mobile.matches && !!drawer?.checked;
    stateClass('fl-drawer-open', open);
    stateClass('fl-search-open', !!searchToggle?.checked);
    if (navigation) {
      if (!roles.has(navigation)) roles.set(navigation, navigation.getAttribute('role'));
      if (open) {
        navigation.setAttribute('role', 'dialog');
        navigation.setAttribute('aria-modal', 'true');
        navigation.setAttribute('aria-label', 'Site navigation');
      } else {
        const role = roles.get(navigation);
        if (role) navigation.setAttribute('role', role);
        else navigation.removeAttribute('role');
        navigation.removeAttribute('aria-modal');
        navigation.removeAttribute('aria-label');
      }
    }
    trigger = menu?.shadowRoot?.querySelector('[part="mobile-menu"]');
    if (trigger && menu.mobileControls.menu === 'materialx') {
      trigger.removeAttribute('aria-controls'); // A shadow-root ID cannot reference the document drawer.
      trigger.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');
      trigger.setAttribute('aria-expanded', String(open));
    }
  };
  const dock = () => {
    if (!menu) return;
    const local = Object.values(menu.mobileControls || {}).includes('materialx');
    menu.toggleAttribute('data-fl-docked', mobile.matches && local && menu.getBoundingClientRect().bottom <= 0);
  };
  const request = event => {
    const { control, owner } = event.detail;
    if (control === 'menu' && !mobile.matches) return;
    if (owner !== 'materialx') {
      setChecked(drawer, false);
      setChecked(searchToggle, false);
      return;
    }
    if (control === 'menu' && drawer && navigation) {
      event.preventDefault();
      setChecked(searchToggle, false);
      setChecked(drawer, !drawer.checked);
      if (drawer.checked) navigation.querySelector('button, a[href]')?.focus();
    } else if (control === 'search' && searchToggle && search) {
      event.preventDefault();
      setChecked(drawer, false);
      setChecked(searchToggle, !searchToggle.checked);
      if (searchToggle.checked) requestAnimationFrame(() => search.querySelector('input')?.focus());
    }
    sync();
  };
  const refresh = () => {
    const candidate = document.querySelector('fontlab-menu, vexy-menu');
    drawer = document.querySelector('#__drawer');
    navigation = document.querySelector('.md-sidebar--primary');
    searchToggle = document.querySelector('#__search');
    search = document.querySelector('.md-search');
    // A plain Webflow page continues using the global menu alone.
    if (!candidate || !drawer || !navigation || !candidate.mobileControls) return;
    if (candidate !== menu) {
      menu = candidate;
      menu.addEventListener(`${menu.localName}:mobile-control`, request);
      menu.addEventListener(`${menu.localName}:render`, refresh);
    }
    menu.dataset.mobileMenuDefault = 'materialx';
    const searchDefault = search && searchToggle ? 'materialx' : 'global';
    if (menu.dataset.mobileSearchDefault !== searchDefault) menu.dataset.mobileSearchDefault = searchDefault;
    menu.toggleAttribute('data-materialx-mobile', true);
    const owners = menu.mobileControls;
    const html = document.documentElement;
    stateClass('fl-mobile-navigation', true);
    html.dataset.flMobileMenu = owners.menu;
    html.dataset.flMobileSearch = owners.search;
    const inner = navigation.querySelector('.md-sidebar__inner') || navigation;
    let close = inner.querySelector('.fl-nav-close');
    if (!close) {
      close = document.createElement('button');
      close.className = 'fl-nav-close';
      close.type = 'button';
      close.textContent = '×';
      close.setAttribute('aria-label', 'Close site navigation');
      close.addEventListener('click', () => { setChecked(drawer, false); trigger?.focus(); });
      inner.prepend(close);
    }
    const small = mobile.matches;
    place(search, owners.search === 'materialx' ? document.body : null);
    search?.classList.toggle('fl-local-search', owners.search === 'materialx');
    for (const node of document.querySelectorAll('.fl-theme, [data-md-component="palette"]')) {
      place(node, small && owners.menu === 'materialx' ? inner : null);
    }
    if (!small || owners.menu !== 'materialx') setChecked(drawer, false);
    if (owners.search !== 'materialx') setChecked(searchToggle, false);
    sync();
    dock();
  };
  document.addEventListener('change', event => {
    if (menu) {
      if (mobile.matches && event.target === drawer && menu.mobileControls.menu !== 'materialx') setChecked(drawer, false);
      if (event.target === searchToggle && menu.mobileControls.search !== 'materialx') setChecked(searchToggle, false);
    }
    if (event.target === drawer || event.target === searchToggle) sync();
  });
  document.addEventListener('keydown', event => {
    if (!menu && !mobile.matches) return;
    const panel = searchToggle?.checked ? search : mobile.matches && drawer?.checked ? navigation : null;
    if (panel && event.key === 'Tab') {
      const stops = [...panel.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
        .filter(node => node.tabIndex >= 0 && !node.disabled && node.getClientRects().length && getComputedStyle(node).visibility === 'visible')
        .filter(node => node.type !== 'radio' || node === ([...panel.querySelectorAll('input[type="radio"]')].filter(radio => radio.name === node.name).find(radio => radio.checked) || panel.querySelector(`input[type="radio"][name="${CSS.escape(node.name)}"]`)));
      const next = event.shiftKey ? stops.at(-1) : stops[0];
      const edge = event.shiftKey ? stops[0] : stops.at(-1);
      if (next && (document.activeElement === edge || !panel.contains(document.activeElement))) {
        event.preventDefault();
        next.focus();
      }
    }
    if (event.key !== 'Escape') return;
    if (mobile.matches && drawer?.checked) { setChecked(drawer, false); trigger?.focus(); }
    if (searchToggle?.checked) {
      setChecked(searchToggle, false);
      [...(menu?.shadowRoot?.querySelectorAll('[data-search-toggle]') || [])].find(button => button.getClientRects().length)?.focus();
    }
  });
  mobile.addEventListener('change', refresh);
  addEventListener('scroll', dock, { passive: true });
  for (const name of ['fontlab-menu', 'vexy-menu']) customElements.whenDefined(name).then(refresh);
  window.FLNavigation = { refresh };
})();
