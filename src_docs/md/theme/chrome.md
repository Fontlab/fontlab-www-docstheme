---
this_file: src_docs/md/theme/chrome.md
---

# Chrome

`extra.fly.chrome` picks the global bars above and below every page. The theme keeps
MaterialX's own search, navigation drawer and palette toggle; the FontLab and Vexy menus
hand those controls over to MaterialX on small screens (`mobile-menu`, `mobile-search`).

## FontLab

The default. Loads `https://i.fontlab.com/menu/fontlab.js` and renders
`<fontlab-menu>` above the page and `<fontlab-footer>` below it. This site uses it.

```yaml title="mkdocs.yml"
extra:
  fly:
    chrome: fontlab
    chrome_options:
      site-label: Design system
      search-from: docstheme
```

The menu gets `mode="dark"`, `site-label` (default: `site_name`), `site-url`
(`site_url`), `mobile-menu="materialx"` and `mobile-search="materialx"`, then the
`chrome_options` you set. `site-url` there takes an absolute http(s) URL or a root-relative
path such as `/docs/`, for a label that links somewhere other than `site_url`. `search-from` names the site in searches sent to
search.fontlab.com.

## Vexy

Loads `https://i.vexy.art/menu/vexy.js` and renders `<vexy-menu>` and `<vexy-footer>`
with the same attributes.

```yaml title="mkdocs.yml"
extra:
  fly:
    chrome: vexy
    chrome_options:
      site-label: Vexy Lines
```

## None

No company bars: MaterialX's own header (site name, search, palette toggle, drawer button)
and footer. Use it for unofficial sites.

```yaml title="mkdocs.yml"
extra:
  fly:
    chrome: none
```

## Custom

Any script that defines two custom elements. The theme loads the script (deferred) and
renders the header element before the page and the footer element after it, with the menu
attributes above. MaterialX's header stays, so search and the palette toggle keep working.

```yaml title="mkdocs.yml"
extra:
  fly:
    chrome:
      script: https://example.com/acme-menu.js
      header: acme-menu
      footer: acme-footer
    chrome_options:
      site-label: Acme docs
```

`script` must be an `https://` URL; `header` and `footer` must be custom element names
(with a hyphen).

```yaml title="Invalid: custom chrome without a footer element"
extra:
  fly:
    chrome:
      script: https://example.com/acme-menu.js
      header: acme-menu
```

## Body classes

The plugin marks `<body>` with `fly-chrome-fontlab`, `fly-chrome-vexy`, `fly-chrome-none`
or `fly-chrome-custom`. The theme hides MaterialX's header only under the FontLab and Vexy
bars.
