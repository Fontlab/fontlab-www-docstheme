<!-- this_file: README.md -->
# fly-january

fly-january is a ProperDocs/MkDocs theme built on MaterialX. It adds a baseline grid, per-page typography and colour, margin figures, and a choice of FontLab, Vexy or native MaterialX navigation. The Python package includes the compiled CSS and JavaScript. A documentation site can build with Python alone.

## Installation

With Python 3.12 or later, install the package using either command.

```sh
pip install fly-january
# or
uv add fly-january
```

A minimal `mkdocs.yml` enables both the theme and its plugin.

```yaml
site_name: My documentation
theme:
  name: fly-january
plugins: [search, fly]
```

Create `docs/index.md` and run `properdocs build --strict`.

## Adopting fly-january in an existing MaterialX site

1. Change `theme.name` to `fly-january` and add `fly` to your plugin list. Keep your existing features and bare plugin names such as `search`, `blog` and `tags`. The theme registers MaterialX’s implementations and makes them available to its templates.
2. Remove old menu/footer overrides and fltheme26 styles or scripts that duplicate the new theme. Keep site-specific templates. Choose `extra.fly.chrome` and set the control ownership described below.
3. Move site typography and colours into roles and options. Use `links: accent` for coloured article links, `h1: accent` for site-wide accent titles, and `fonts.roles.em: {style: italic}` for italic emphasis. See **Customising** for component links and direct CSS overrides.
4. Check your own rem lengths. The default MaterialX root is 20px. Fly’s normal root is 14.4px and grows on wide displays. The plugin rescales the CSS shipped by the installed MaterialX theme by 20/14.4. Site and third-party plugin stylesheets keep their original values. The plugin logs the names of other CSS files it finds under `assets/stylesheets/`. To preserve the old dimensions at the normal root, multiply your rem values by 20/14.4.
5. Enable `extra.fly.utilities: true` if your markup uses the prebuilt `tw:` utilities. With the default `false`, the consumer site omits the utility sheet.

## Configuration

Body paragraphs and lists use Sole Serif Small at weight 400. H1 uses Polymath Display at 900 with `-0.01em` letter-spacing. H2 uses Polymath at 500 with zero letter-spacing. The lead paragraph follows the H2 family. Navigation, H3–H6 and inline strong and emphasis use Grtsk. Use `extra.fly.fonts.roles` to override a role’s family, weight or heading tracking.

`extra.fly` is optional. Site defaults include FontLab chrome that scrolls with the page, ink titles, inherited article link colour and a left margin. Set a site hue, define reusable font/hue presets, or override individual type roles. Pages select a preset with `fly.preset` in their front matter. Page settings take precedence over preset settings, which take precedence over site settings. A page hue colours its H1 unless the page sets `fly.h1: ink`.

```yaml
extra:
  fly:
    chrome: fontlab
    chrome_options:
      site-label: Product manual
      site-url: /manual/
      mobile-menu: materialx
      mobile-search: materialx
      sticky: false
    hue: cobalt
    links: accent
    fonts:
      roles:
        em: {style: italic}
```

| Chrome option | Behaviour |
| --- | --- |
| `site-label`, `site-url` | Menu label and destination. Defaults come from `site_name` and `site_url`. Supply an absolute HTTP(S) URL or a root-relative path. |
| `mobile-menu` | `materialx` (default) opens the documentation drawer. `global` selects the brand menu. |
| `mobile-search` | `materialx` (default) opens the local documentation search. `global` selects the brand search. This setting also applies on desktop. |
| `search-from` | Identifies the originating site to the brand search. |
| `sticky` | A YAML boolean. `true` pins the brand bar. Defaults to `false`. |

Use `chrome: vexy` for Vexy branding or `chrome: none` for MaterialX’s native header and footer. A custom chrome takes an HTTPS `script` URL and `header` and `footer` custom-element names. The demo documents every site and page key with examples. [Configuration](https://fontlab.dev/fontlab-www-docstheme/theme/configuration/) · [Chrome](https://fontlab.dev/fontlab-www-docstheme/theme/chrome/)

## Customising

Prefer `extra.fly` options and `fonts.roles`, or set a `--fly-*` variable on the element that consumes it. For example, add a stylesheet to `extra_css` and adjust heading tracking with an ordinary selector.

```css
.md-typeset h2 { --fly-h2-tracking: 0.02em; }
```

Fly leaves component link styling to MaterialX, Basecoat and daisyUI. Its article-link rule excludes library buttons, tabs and badges inside `.fltheme-components`, MaterialX classes starting with `md-`, permalink links and links with `data-fly-plain` on themselves or an ancestor. Put `data-fly-plain` on a site-owned component to style its links with ordinary CSS such as `.md-typeset .signup-link`. Theme cards, headings and tables also supply their own contextual styles. To override those properties inside a theme component, use its tokens or the selector technique below.

Inside the article, the Basecoat and daisyUI bundles use Fly control and surface tokens. Keep Basecoat and `du-` markup inside `.fltheme-components`. Use `.fly-form` for native fields and `dialog.fly-dialog` for a native modal in a MaterialX page. The Compare section in the demo includes matched HTML and Markdown examples.

For direct overrides of fly-styled properties, source order alone is insufficient. The build flattens cascade layers to beat MaterialX’s unlayered rules. Each generated selector has a maximum of 10 ID boosts. Copy this prefix into your site stylesheet and change the target and declaration as needed.

```css
.md-typeset:not(#\#):not(#\#):not(#\#):not(#\#):not(#\#):not(#\#):not(#\#):not(#\#):not(#\#):not(#\#) h2 {
  text-align: center;
}
```

Match the competing rule’s ID specificity and at least its remaining specificity. At equal specificity the later declaration wins. Normal declarations still yield to `!important`. [Design tokens](https://github.com/Fontlab/fontlab-www-docstheme/blob/main/DESIGN-TOKENS.md) · [Theme specification](https://github.com/Fontlab/fontlab-www-docstheme/blob/main/SPEC.md)

## Privacy and external assets

A reader’s browser sends its IP address to each host it contacts. These are the theme’s external resources and the controls for serving a local-only site.

| Host | Resource and how to avoid the request |
| --- | --- |
| `use.typekit.net`, `p.typekit.net` | The default Adobe kits supply Polymath Display and Polymath (`xht3uat`), Sole Serif Small (`cna4jfp`) and Grtsk (`wck5koo`). Set `extra.fly.fonts.sources: []` and omit Typekit sources from presets and pages to use system stacks or your own licensed fonts. Setting only roles keeps the kits. |
| `fonts.googleapis.com`, `fonts.gstatic.com` | Fly requests the Material Symbols stylesheet and font for arrows and the palette toggle. MaterialX can also request Roboto and Roboto Mono, and the brand menus request Work Sans. For a Google-free page, use `theme.font: false`, omit `google:` font sources, use `chrome: none` and override the symbols partial below. The native SVG icons remain available. |
| `cdn.jsdelivr.net` | PhotoSwipe 5.4.4 supplies the lightbox stylesheet on every page. Its two scripts load on pages with `.md-content a.lightbox`. All three files have SHA-384 integrity checks and anonymous CORS. Override the PhotoSwipe partial below to use ordinary image links. |
| `i.fontlab.com`, optionally `i.vexy.art` | The default FontLab chrome loads `/menu/fontlab.js` and brand assets. Vexy chrome selects `/menu/vexy.js` on the Vexy host and uses `res.cloudinary.com` for its logo. The unversioned menu scripts are trusted first-party code served without SRI. Use `chrome: none` or your own audited chrome to avoid these requests. |

To omit Material Symbols or PhotoSwipe, set `theme.custom_dir: overrides` and create an empty `overrides/partials/fly-symbols.html` or `overrides/partials/fly-photoswipe.html`, respectively. Site-authored embeds, plugins and additional font sources can introduce other hosts.

## Development

The package sources are in `theme/fly_january/`. Edit CSS and browser code in `src/fly/`. The demo sources are in `src_docs/`.

```sh
npm ci
npm run build
npm test
uv run --python 3.13 pytest tests/py
./build.sh
npm run verify:fly
```

The browser check uses the agent-browser CLI and a locally installed Chrome. The strict demo build checks internal links and writes the Pages site, its versioned CDN directories and their SHA-256 manifest under `docs/`. [Demo](https://fontlab.dev/fontlab-www-docstheme/) · [CDN asset reference](https://fontlab.dev/fontlab-www-docstheme/theme/assets/)

## Release

1. Set `NEXT_VERSION` in `scripts/build-cdn.mjs`. Publish the required figure-groups dependency first, remove its local uv source, and refresh the lock. Run `./build.sh` and the test gates.
2. Commit the verified sources and generated `docs/` (including `docs/fly/<version>/`, `latest/` and `manifest.json`).
3. Tag **that commit** `vX.Y.Z`, using the same version as `NEXT_VERSION`.
4. Run `npm run check:release`. It requires a clean worktree, fetches main, and checks the tag, package version and CDN tree.
5. From the tagged commit, choose an empty output directory, for example `release-dist`. Run `uv build --out-dir release-dist` and `uvx twine check --strict release-dist/*`.
6. Publish the checked distributions, push the release commit and tag, then verify Pages and the public manifest hashes.

The CDN builder fetches main before writing. A version already published there must match its manifest byte for byte. If publication state is unknown, rebuilding an existing version directory requires confirmation that it was never published (`FLY_CDN_ALLOW_UNPUBLISHED=1`). Bump `NEXT_VERSION` to prepare the next release.

## Legacy fltheme26 bundle

`npm run build` also produces the fltheme26 bundle in `dist/` for existing consumers. Its legacy Playwright suite is retained and is not run in this project. [Legacy setup guide and starter](https://i.fontlab.com/fltheme26/)
