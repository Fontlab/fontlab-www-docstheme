---
this_file: src_docs/md/theme/assets.md
---

# Assets

The theme's stylesheets and scripts are also published as a small CDN on this site, for
pages that are not built with MkDocs: Webflow pages, landing pages, emails with a web
view. MkDocs sites do not need it; the `fly-january` package ships the same files.

## URLs

Each release has its own directory, `fly/<version>/`, which does not change once
published; `fly/latest/` always holds the newest release. Pin a version in production.
This release is `0.2.0`.

| File | What it is |
|---|---|
| [`fly.css`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly.css) | the whole theme: tokens, base, layout, components, chrome |
| [`fly-tokens.css`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly-tokens.css) | the `--fly-*` tokens alone, no rules on elements |
| [`fly-utilities.css`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly-utilities.css) | every Tailwind utility with the `tw:` prefix, in layer `fly.utilities` |
| [`fly.js`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly.js) | lightbox and sheet state |
| [`fly-bridge.js`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly-bridge.js) | global menu to MaterialX drawer and search, keyboard paging |
| [`fly-debug.js`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly-debug.js) | the preset switcher (`extra.fly.debug`) |
| [`components.css`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/components.css) | Basecoat 1.0.2 and daisyUI 5.7.44 (`du-` prefix), scoped to `.fltheme-components` |
| [`basecoat.js`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/basecoat.js) | Basecoat's interactive components |
| [`licenses/`](https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/licenses/fly-january.txt) | the theme's licence and those of Basecoat, daisyUI and Tailwind CSS |

[`manifest.json`](https://fontlab.dev/fontlab-www-docstheme/fly/manifest.json) lists every file of every release with its size
and sha256, so a consumer can check what it loads:

```text
{
  "version": "0.2.0",
  "latest": "0.2.0",
  "files": {
    "0.2.0/fly-tokens.css": { "size": <bytes>, "sha256": "<hex digest>" },
    …
  }
}
```

## Use the tokens on any page

`fly-tokens.css` declares the palette, greys, type roles, sizes and grid as custom
properties, light values on `:root` and dark values under
`[data-md-color-scheme="slate"]`. The one rule it applies is the root size (`html` at
90% of the browser's font size, 99% from 100em, 108% from 125em), which makes `1rem` half
a body line; it styles nothing else:

```html
<link rel="stylesheet" href="https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly-tokens.css">
<style>
  .note { color: var(--fly-ink); background: var(--fly-cobalt-tint);
          font: var(--fly-body-weight) var(--fly-size-sm) / var(--fly-line) var(--fly-body-family); }
  .note a { color: var(--fly-cobalt-deep); }
</style>
```

The type roles name families from the FontLab Typekit kit; load the fonts as well:

```html
<link rel="stylesheet" href="https://use.typekit.net/gav0zux.css">
```

## fly.css and the components outside MkDocs

`fly.css` is written for MaterialX's markup (`.md-typeset`, `.md-sidebar`, …) and sits on
top of MaterialX's own stylesheets. A fly-january build also rescales MaterialX's rem
lengths to the smaller root (the plugin's 20/14.4 post-build step), which a page loading
MaterialX's CSS from elsewhere does not get. Outside a fly-january build, use
`fly-tokens.css` with your own rules, and the components bundle for Basecoat and daisyUI
markup inside an element with the class `fltheme-components`:

```html
<link rel="stylesheet" href="https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/fly-tokens.css">
<link rel="stylesheet" href="https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/components.css">
<script defer src="https://fontlab.dev/fontlab-www-docstheme/fly/0.2.0/basecoat.js"></script>

<div class="fltheme-components">
  <button class="btn">Basecoat button</button>
  <button class="du-btn du-btn-primary">daisyUI button</button>
</div>
```

This site loads the components bundle the same way, from `fly/latest/`, for the
[field guide](../start/index.md) pages.
