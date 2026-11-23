---
this_file: src_docs/md/start/setup.md
---

# Theme and setup

This site uses ProperDocs with MaterialX for document rendering and the shared
FontLab theme for components. Basecoat and prefixed daisyUI can appear in one
component area without sharing their button, card or input class names.

## Load the shared components

```html
<link rel="stylesheet" href="https://i.fontlab.com/fltheme26/1.0.0/components.css">
<link rel="stylesheet" href="https://i.fontlab.com/fltheme26/1.0.0/theme.css">
<script defer src="https://i.fontlab.com/fltheme26/1.0.0/basecoat.js"></script>
<script defer src="https://i.fontlab.com/fltheme26/1.0.0/theme.js"></script>
```

These files come from `fontlab-www-docstheme`. The shared bundle provides
Basecoat 1.0.2 and daisyUI 5.7.44. It does not provide the MaterialX page shell,
Markdown renderer, or every possible Tailwind utility. Layout recipes identify
their FontLab CSS classes; copy those styles with a recipe when your target
page does not already load them.

When a destination also uses this site’s legacy editorial CSS, include
`component-reference.css` after it. That compatibility stylesheet keeps closed
Basecoat dialogs hidden and prevents document disclosure styles from changing
component controls. The examples below use both stylesheets.

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

The page theme controls the default appearance. An isolated area can override
the component mode with `data-fltheme-mode`. This changes component colours,
not the surrounding article's typography.

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
`FLTheme.refresh()` applies the light/dark class and discovers Basecoat widgets.
The bridge also observes component insertion and host theme changes.

## Preserve runtime ownership

Load Basecoat once. The shared bridge scopes its discovery to component areas.
Let the host page own theme choice and persistence; do not add a second global
theme switcher inside a specimen. Native HTML controls keep their browser
behaviour, while application actions still need your handlers.

The upstream contracts are [Basecoat installation](https://basecoatui.com/installation/),
[daisyUI configuration](https://daisyui.com/docs/config/) and
[Markdown in HTML](https://python-markdown.github.io/extensions/md_in_html/).

## Theme controller · daisyUI { #daisyui-theme-controller }

The FontLab bridge owns theme state. This control changes only its enclosing component area and calls `FLTheme.refresh()`. Keep the `data-fltheme-mode` attribute when you copy it; the host page retains its own theme and preference.

<!-- specimen:daisyui-theme-controller html -->
<div class="fltheme-components" data-fltheme-mode="light">
<label><input class="du-toggle du-theme-controller" onchange="this.closest('.fltheme-components').dataset.flthemeMode=this.checked?'dark':'light';window.FLTheme.refresh()" type="checkbox" value="dark"> Dark example</label><p style="color:var(--foreground);background:var(--background);padding:1rem">Only this component area changes.</p>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/theme-controller/)

## Theme switcher · Basecoat { #basecoat-theme-switcher }

The FontLab bridge owns theme state. This control changes only its enclosing component area and calls `FLTheme.refresh()`. Keep the `data-fltheme-mode` attribute when you copy it; the host page retains its own theme and preference.

<!-- specimen:basecoat-theme-switcher html -->
<div class="fltheme-components" data-fltheme-mode="light">
<button class="btn" onclick="const area=this.closest('.fltheme-components');area.dataset.flthemeMode=area.dataset.flthemeMode==='dark'?'light':'dark';window.FLTheme.refresh()" type="button">Change example appearance</button><p style="color:var(--foreground);background:var(--background);padding:1rem">Only this component area changes.</p>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/theme-switcher/)

## MaterialX authoring { #materialx-overview }

MaterialX supplies the Markdown renderer, navigation, search and content patterns. Find its recipes alongside related components in Text, Structure, Images and Data.
