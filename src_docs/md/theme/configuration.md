---
this_file: src_docs/md/theme/configuration.md
---

# Configuration

A site turns the theme on with two entries in `mkdocs.yml` and configures it under
`extra.fly`. The `fly` plugin validates that block when the build starts: an unknown
key, an unknown hue or preset, or a malformed value stops the build with a message that
names the key. Every YAML example on this page goes through the same validation in the
theme's tests (`tests/py/test_demo_site.py`).

## Turn the theme on

```yaml title="mkdocs.yml"
theme:
  name: fly-january
plugins:
  - fly
```

`custom_dir` stays available for site-specific templates. A template override named
`main.html` replaces the theme's own and drops its stylesheets and scripts, so prefer a
hook or a partial for additions.

## Site keys: `extra.fly`

| Key | Default | Value |
|---|---|---|
| `chrome` | `fontlab` | `fontlab`, `vexy`, `none` or `{script, header, footer}`; see [chrome](chrome.md) |
| `chrome_options` | none | menu attributes: `site-label`, `site-url` (an absolute http(s) URL or a root-relative path; defaults to the site URL), `mobile-menu`, `mobile-search`, `search-from`, and `sticky` (true pins the bar to the top; default false) |
| `hue` | none (accent `cobalt`) | the accent: `cherry`, `tangerine`, `amber`, `lime`, `emerald`, `teal`, `sky`, `cobalt`, `indigo`, `violet`, `magenta`, `rose` or `gray` |
| `fonts.sources` | the theme's three small kits (below) | stylesheets loaded on every page: `typekit:<kit>`, `google:<css2 family spec>` or an `https://` URL; setting it replaces the defaults, `[]` loads none |
| `fonts.roles` | theme defaults | per-role overrides, `{<role>: {<property>: <value>}}`; see [tokens](tokens.md#type-roles) |
| `h1` | `ink` | `ink` or `accent`: whether every page title takes the hue's text colour; a page whose hue comes from its own front matter or preset always does, unless it sets `h1: ink` |
| `links` | `inherit` | `inherit` or `accent`: article links keep the text colour, or take the accent's text colour (contrast-safe in both schemes) |
| `presets` | none | named `{fonts, hue}` bundles a page can pick |
| `margin_side` | `left` | where margin figures sit: `left` or `right` |
| `utilities` | `false` | `true` loads `fly-utilities.css`, every Tailwind utility with the `tw:` prefix (1.9 MB) |
| `debug` | `false` | `true` adds a preset switcher (`fly-debug.js`) for trying looks in the browser |

The default sources are three small Typekit kits, about 6 KB of CSS in all: `cmv5add` (News
Serif, the h1), `cna4jfp` (Sole Serif Small, body) and `wck5koo` (Grtsk: h2, lead, navigation,
tables, the inline sans and buttons). A site with no `extra.fly` is set in them. Rules, exactly:
a site that sets `fonts.sources` gets only those sources, the defaults are not loaded, so it
names every face its roles use; a site that sets `fonts.roles` without `fonts.sources` still gets
the defaults; `fonts.sources: []` loads nothing and the roles fall back to their system stacks.
The prototype's Quire Sans exists only in an all-families kit (`gav0zux`, 654 KB), which the
theme never loads by default: add it to `sources` and set the `h2` family to use it.

A complete site block:

```yaml title="mkdocs.yml"
extra:
  fly:
    chrome: fontlab
    chrome_options:
      site-label: Design system
      site-url: https://design.example/
      mobile-menu: materialx
      mobile-search: materialx
      search-from: docstheme
      sticky: false
    hue: cobalt
    h1: ink
    links: inherit
    fonts:
      sources:
        - typekit:gav0zux
        - google:Outfit:wght@100..900
        - https://example.com/fonts.css
      roles:
        h1: {family: "'newsserif-huge-variable', serif", weight: 700}
        h2: {family: "'quire-sans', sans-serif", weight: 300, scale: 1.1}
        body: {family: "'Outfit', sans-serif", features: '"onum" 1'}
        strong: {weight: 600}
        em: {style: italic}
        sans: {family: "'Outfit', sans-serif", stretch: normal, variation: normal, adjust: 1}
    presets:
      fl9-color:
        fonts:
          sources: [google:Blaka+Ink]
          roles: {h1: {family: "'Blaka Ink'", weight: 400, scale: 1.1}}
        hue: magenta
      plain:
        hue: gray
    margin_side: right
    utilities: false
    debug: false
```

`typekit:gav0zux` loads `https://use.typekit.net/gav0zux.css`; `google:Outfit:wght@100..900`
loads `https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap`. Join
several Google families into one stylesheet with `&family=`:

```yaml title="mkdocs.yml"
extra:
  fly:
    fonts:
      sources:
        - google:Outfit:wght@100..900&family=REM:wght@100..900
```

Role properties: block roles (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body`, `lead`, `nav`,
`table`, `caption`, `code`) take `family`, `weight`, `stretch`, `features`, `variation`, `size`, `leading`,
`tracking` and `scale`; `h1` and `h2` also take `measure` (a length in `ch`, `rem`, `em`, `px` or `%`, or `none`); inline roles: `em` takes `family`, `weight`, `adjust` and `style` (`normal` or `italic`); `strong` and `mono` take `family`, `weight`
and `adjust`; `sans` (the face of links, marks and h6) takes `family`, `stretch`, `variation` and `adjust`. Values are plain CSS: a value that could end its declaration (`;`, braces,
`<`, a comment or an unbalanced quote) is rejected.

These blocks fail the build:

```yaml title="Invalid: unknown hue"
extra:
  fly:
    hue: crimson
```

```yaml title="Invalid: unknown key"
extra:
  fly:
    colour: cobalt
```

```yaml title="Invalid: font source without a scheme"
extra:
  fly:
    fonts:
      sources: [fonts.example.com/a.css]
```

```yaml title="Invalid: role value that ends the declaration"
extra:
  fly:
    fonts:
      roles:
        h1: {family: "serif; color: red"}
```

## Page keys: front matter

A page can change its look. Precedence: page `fonts` and `hue` over the page's preset
over the site. Font sources accumulate (each loaded once); roles merge property by
property. These examples assume the site block above.

```yaml title="Page front matter"
fly:
  preset: fl9-color
```

```yaml title="Page front matter"
fly:
  preset: plain
  hue: teal
  h1: ink
  fonts:
    sources: [typekit:abc1def]
    roles:
      h1: {weight: 300}
      body: {features: '"onum" 1'}
```

The legacy key `subtheme` is read as `fly.preset` and also adds `subtheme-<name>` to
`<body>`:

```yaml title="Page front matter"
subtheme: fl9-color
```

Other page keys the plugin reads:

```yaml title="Page front matter"
classes:
  body: [wide-page]
  main: ref-main
  article: [specimen]
margin_side: left
hide: [toc]
```

`classes` adds classes to the first `<body>`, `<main>` and `<article>`; `margin_side`
overrides `extra.fly.margin_side` (`fly-margin-left` or `fly-margin-right` on `<body>`);
`hide: [toc]` removes the page's table of contents (`fly-no-l2`).

These page blocks fail the build:

```yaml title="Invalid page: unknown preset"
fly:
  preset: newspaper
```

```yaml title="Invalid page: subtheme and preset disagree"
subtheme: plain
fly:
  preset: fl9-color
```
