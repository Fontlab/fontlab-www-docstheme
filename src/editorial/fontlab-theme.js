// this_file: src/editorial/fontlab-theme.js

(function () {
  const SUBTHEME_KEY = "fontlab-docs-subtheme";
  const TOC_KEY = "fontlab-docs-toc";
  const DESKTOP = "(min-width: 76.25em)";
  const desktopQuery = window.matchMedia(DESKTOP);
  let tocPositionFrame = 0;

  const themes = {
    // menu treatments: "dark" = opaque dark band; "light" = transparent bar,
    // dark text; "flat-dark" = transparent bar, light text (uniform dark page).
    "material-light": {
      daisy: "light", scheme: "default", menu: "dark", footer: { mode: "dark", bg: null },
    },
    "material-dark": {
      daisy: "dark", scheme: "slate", menu: "flat-dark", footer: { mode: "dark", bg: "transparent" },
    },
    miller: {
      daisy: "light", scheme: "default", menu: "light", footer: { mode: "light", bg: "transparent" },
    },
    retro: {
      daisy: "retro", scheme: "default", menu: "light", footer: { mode: "light", bg: "transparent" },
    },
    lines: {
      daisy: "light", scheme: "default", menu: "light", footer: { mode: "light", bg: "transparent" },
    },
  };

  // In light (paper) themes, make the FontLab menu's top bar transparent so the
  // page colour shows through and the menu reads as part of the page. The menu
  // uses an open shadow root; patch it there. Dark themes keep the menu default.
  function applyMenuTreatment(treatment) {
    const menuEl = document.querySelector("fontlab-menu");
    if (!menuEl) return;
    // "light" uses the menu's light mode (dark text); the others keep dark mode
    // (light text). "light" and "flat-dark" both make the bar transparent so the
    // page colour shows through and the header reads as one with the page.
    const menuMode = treatment === "light" ? "light" : "dark";
    const transparent = treatment !== "dark";
    if (menuEl.getAttribute("mode") !== menuMode) menuEl.setAttribute("mode", menuMode);
    function patch() {
      const sr = menuEl.shadowRoot;
      if (!sr) {
        window.setTimeout(patch, 200);
        return;
      }
      let style = sr.getElementById("fl-menu-patch");
      if (!style) {
        style = document.createElement("style");
        style.id = "fl-menu-patch";
        sr.appendChild(style);
      }
      style.textContent = transparent
        ? ".fl-menu{background:transparent !important;box-shadow:none !important;}"
        : "";
    }
    patch();
    window.setTimeout(patch, 250); // survive the component's re-render on mode change
  }

  function storedTheme() {
    try {
      const name = localStorage.getItem(SUBTHEME_KEY);
      return themes[name] ? name : "material-light";
    } catch (_error) {
      return "material-light";
    }
  }

  function applyTheme(name) {
    const normalized = themes[name] ? name : "material-light";
    const theme = themes[normalized];
    const root = document.documentElement;
    root.dataset.theme = theme.daisy;
    root.dataset.flSubtheme = normalized;
    root.dataset.flMenu = theme.menu;
    if (document.body) {
      document.body.setAttribute("data-md-color-scheme", theme.scheme);
    }
    // Unify the header: the FontLab menu and the tabs bar share one treatment.
    applyMenuTreatment(theme.menu);
    const footerEl = document.querySelector("fontlab-footer");
    if (footerEl) {
      footerEl.setAttribute("mode", theme.footer.mode);
      if (theme.footer.bg === null) footerEl.removeAttribute("bg");
      else footerEl.setAttribute("bg", theme.footer.bg);
    }
    try {
      localStorage.setItem(SUBTHEME_KEY, normalized);
    } catch (_error) {
      /* ignore persistence failures */
    }
    document.querySelectorAll(".fl-theme__opt").forEach(function (opt) {
      opt.setAttribute("aria-pressed", String(opt.dataset.theme === normalized));
    });
  }

  // Subtheme switcher: subtle icon + popup, hosted in the tabs nav on desktop
  // and in the left sidebar when the tabs bar is hidden.
  function setupThemeMenu() {
    const template = document.querySelector("#fl-theme-menu-template");
    if (!template || document.querySelector(".fl-theme")) return;
    const node = template.content.firstElementChild.cloneNode(true);
    const btn = node.querySelector(".fl-theme__btn");
    const pop = node.querySelector(".fl-theme__pop");
    const tabs = document.querySelector(".md-tabs > .md-grid");
    const sidebar = document.querySelector(".md-sidebar--primary .md-sidebar__inner");

    function place() {
      const desktop = desktopQuery.matches;
      const target = desktop ? tabs : sidebar;
      if (target && node.parentElement !== target) {
        if (desktop) target.appendChild(node);
        else target.insertBefore(node, target.firstChild);
      }
    }
    place();
    desktopQuery.addEventListener("change", place);

    function close(returnFocus) {
      pop.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (returnFocus) btn.focus();
    }
    function open() {
      pop.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      const current = pop.querySelector('[aria-pressed="true"]') || pop.querySelector(".fl-theme__opt");
      if (current) current.focus();
    }
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (pop.hidden) open();
      else close(false);
    });
    pop.addEventListener("click", function (event) {
      const opt = event.target.closest(".fl-theme__opt");
      if (!opt) return;
      applyTheme(opt.dataset.theme);
      close(true);
    });
    document.addEventListener("click", function (event) {
      if (!node.contains(event.target)) close(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !pop.hidden) {
        event.preventDefault();
        close(true);
      }
    });

    applyTheme(storedTheme());
  }

  function setTocOpen(open) {
    document.documentElement.classList.toggle("fl-toc-collapsed", !open);
    const button = document.querySelector(".fl-toc-toggle");
    if (button) button.setAttribute("aria-expanded", String(open));
    try {
      localStorage.setItem(TOC_KEY, open ? "open" : "collapsed");
    } catch (_error) {
      /* ignore persistence failures */
    }
  }

  // Right in-page contents: collapsed by default, toggled by a slim handle.
  function setupTocToggle() {
    const template = document.querySelector("#fl-toc-toggle-template");
    const inner = document.querySelector(".md-sidebar--secondary .md-sidebar__inner");
    if (!template || !inner || inner.querySelector(".fl-toc-toggle")) return;
    const node = template.content.firstElementChild.cloneNode(true);
    inner.insertBefore(node, inner.firstChild);
    const open = !document.documentElement.classList.contains("fl-toc-collapsed");
    node.setAttribute("aria-expanded", String(open));
    node.addEventListener("click", function () {
      setTocOpen(document.documentElement.classList.contains("fl-toc-collapsed"));
    });
  }

  function setupHrefCards() {
    const api = window.vexyHrefc || window.VexyHrefc;
    if (api && typeof api.init === "function") api.init();
  }

  function setupTocPosition() {
    window.addEventListener("scroll", scheduleTocPosition, { passive: true });
    window.addEventListener("resize", scheduleTocPosition);
    desktopQuery.addEventListener("change", scheduleTocPosition);
  }

  function scheduleTocPosition() {
    if (tocPositionFrame) return;
    tocPositionFrame = window.requestAnimationFrame(function () {
      tocPositionFrame = 0;
      const root = document.documentElement;
      if (!desktopQuery.matches) {
        root.style.removeProperty("--fl-toc-top");
        return;
      }

      const search = document.querySelector(".md-sidebar--primary .md-search");
      if (search) {
        root.style.setProperty("--fl-toc-top", `${Math.max(0, search.getBoundingClientRect().top)}px`);
        return;
      }

      const gap = Number.parseFloat(getComputedStyle(root).getPropertyValue("--fl-space-4")) || 16;
      const visibleHeaderBottom = Array.from(document.querySelectorAll("fontlab-menu, .md-tabs"))
        .reduce(function (bottom, element) {
          return Math.max(bottom, element.getBoundingClientRect().bottom);
        }, 0);
      root.style.setProperty("--fl-toc-top", `${Math.max(0, visibleHeaderBottom) + gap}px`);
    });
  }

  // MaterialX initializes search inside the header; move the live node (with
  // its listeners intact) to the top of the left rail.
  function relocateSearch() {
    const search = document.querySelector(".md-search");
    const inner = document.querySelector(".md-sidebar--primary .md-sidebar__inner");
    if (search && inner && !inner.contains(search)) inner.insertBefore(search, inner.firstChild);
  }

  function finishLoad() {
    relocateSearch();
    scheduleTocPosition();
    setupTocPosition();
  }

  function boot() {
    setupThemeMenu();
    setupTocToggle();
    setupHrefCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Relocate search only after MaterialX has wired it up inside the header.
  if (document.readyState === "complete") {
    finishLoad();
  } else {
    window.addEventListener("load", finishLoad);
  }
})();
