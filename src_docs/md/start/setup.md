---
this_file: src_docs/md/start/setup.md
---

# Theme and setup

This site is built with ProperDocs and MaterialX on the fly-january theme, which
also ships the component bundle the specimens use: Basecoat 1.0.2 and daisyUI 5.7.44
(`du-` prefix), both scoped to `.fltheme-components`, so one component area can mix
them without sharing their button, card or input class names.

## MkDocs and ProperDocs sites

Install the theme in the environment that builds the site. Until its first
release is on PyPI, install it from a checkout of
[fontlab-www-docstheme](https://github.com/Fontlab/fontlab-www-docstheme):

```sh
uv pip install fly-january              # once released
uv pip install -e ../fontlab-www-docstheme   # until then, from a checkout
```

Then turn it on in `mkdocs.yml` and load the component bundle from the theme's
CDN tree. Replace `<version>` with the release on the [assets page](../theme/assets.md):

```yaml
theme:
  name: fly-january
plugins:
  - fly
extra:
  fly:
    chrome: fontlab
extra_css:
  - https://fontlab.dev/fontlab-www-docstheme/fly/<version>/components.css
extra_javascript:
  - https://fontlab.dev/fontlab-www-docstheme/fly/<version>/basecoat.js
```

Every `extra.fly` key, the page front matter and the global bar choices are on the
[configuration](../theme/configuration.md) and [chrome](../theme/chrome.md) pages. The
theme provides the page shell, fonts, palette toggle and dark mode; it does not provide
every Tailwind utility (`extra.fly.utilities` loads the prefixed set).

## Pages outside MkDocs

A Webflow page, landing page or other HTML loads the same files from
`https://fontlab.dev/fontlab-www-docstheme/fly/<version>/`, each listed with its
sha256 in [`manifest.json`](https://fontlab.dev/fontlab-www-docstheme/fly/manifest.json).
`fly-tokens.css` gives the colours, type roles and grid as custom properties; the
[assets page](../theme/assets.md) shows how to use them with the component bundle.

Layout recipes in this guide name their FontLab CSS classes; copy those styles with a
recipe when the target page does not already load them. This site's
`component-reference.css` keeps closed Basecoat dialogs hidden and stops MaterialX
disclosure styles from restyling component controls; copy it too when the target page
uses MaterialX.

The previous bundle, [fltheme26](https://i.fontlab.com/fltheme26/), stays published for
the sites that still load it.

## Scope a component area

<!-- specimen:setup-scope html -->
<div class="fltheme-components">
  <a class="btn" href="https://www.fontlab.com/font-converter/">Font converters</a>
  <a class="du-btn du-btn-outline" href="https://www.fontlab.com/font-editor/">Font editors</a>
</div>
<!-- /specimen -->

Keep Basecoat's `.btn` name and prefix every daisyUI component class with `du-`.
Do not add `du-` to ordinary utilities or FontLab's own layout helpers.
The shared reset stays inside `.fltheme-components`.

## Test light and dark content

Component areas follow the page's palette: the theme's `fly.js` gives each
`.fltheme-components` root the bundle's `dark` class when the page (or the nearest
element with `data-md-color-scheme`) is dark, including areas inserted later. An
isolated area can pin its mode with `data-fltheme-mode`. This changes component
colours, not the surrounding article's typography.

<!-- specimen:setup-modes html -->
<div class="fl-pattern-grid">
  <div class="fltheme-components" data-fltheme-mode="light">
    <div class="card"><header><h3 style="color: inherit;">Light component area</h3></header><section><p>Check labels against a light surface.</p></section></div>
  </div>
  <div class="fltheme-components" data-fltheme-mode="dark">
    <div class="card"><header><h3 style="color: inherit;">Dark component area</h3></header><section><p>Check labels against a dark surface.</p></section></div>
  </div>
</div>
<!-- /specimen -->

Explicit light and dark modes set the component surface and ink independently
of the surrounding page. Omit the attribute to inherit the host palette.
The headings inherit the card's colour explicitly because the host also styles
headings independently of body text.

The `fl-pattern-grid` layout belongs to this guide's `field-guide.css`.

## Preserve runtime ownership

Load `basecoat.js` once: it discovers widgets inside component areas, also those added
later. Let the host page own theme choice and persistence; do not add a second global
theme switcher inside a specimen. Native HTML controls keep their browser behaviour,
while application actions still need your handlers.

The upstream contracts are [Basecoat installation](https://basecoatui.com/installation/),
[daisyUI configuration](https://daisyui.com/docs/config/) and
[Markdown in HTML](https://python-markdown.github.io/extensions/md_in_html/).

## Theme controller · daisyUI { #daisyui-theme-controller }

The page owns theme state. This control changes only its enclosing component area by setting its `data-fltheme-mode`, which the theme applies at once. Keep the attribute when you copy it; the host page retains its own theme and preference.

<!-- specimen:daisyui-theme-controller html -->
<div class="fltheme-components" data-fltheme-mode="light">
<label><input class="du-toggle du-theme-controller" onchange="this.closest('.fltheme-components').dataset.flthemeMode=this.checked?'dark':'light'" type="checkbox" value="dark"> Dark example</label><p style="color:var(--foreground);background:var(--background);padding:1rem">Only this component area changes.</p>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/theme-controller/)

## Theme switcher · Basecoat { #basecoat-theme-switcher }

The page owns theme state. This control changes only its enclosing component area by setting its `data-fltheme-mode`, which the theme applies at once. Keep the attribute when you copy it; the host page retains its own theme and preference.

<!-- specimen:basecoat-theme-switcher html -->
<div class="fltheme-components" data-fltheme-mode="light">
<button class="btn" onclick="const area=this.closest('.fltheme-components');area.dataset.flthemeMode=area.dataset.flthemeMode==='dark'?'light':'dark'" type="button">Change example appearance</button><p style="color:var(--foreground);background:var(--background);padding:1rem">Only this component area changes.</p>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/theme-switcher/)

## MaterialX authoring { #materialx-overview }

MaterialX supplies the Markdown renderer, navigation, search and content patterns. Find its recipes alongside related components in Text, Structure, Images and Data.
