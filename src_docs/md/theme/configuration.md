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
| `chrome_options` | none | menu attributes: `site-label`, `mobile-menu`, `mobile-search`, `search-from` |
| `hue` | `cobalt` | the accent: `cherry`, `tangerine`, `amber`, `lime`, `emerald`, `teal`, `sky`, `cobalt`, `indigo`, `violet`, `magenta`, `rose` or `gray` |
| `fonts.sources` | none | stylesheets loaded on every page: `typekit:<kit>`, `google:<css2 family spec>` or an `https://` URL |
| `fonts.roles` | theme defaults | per-role overrides, `{<role>: {<property>: <value>}}`; see [tokens](tokens.md#type-roles) |
| `presets` | none | named `{fonts, hue}` bundles a page can pick |
| `margin_side` | `left` | where margin figures sit: `left` or `right` |
| `utilities` | `false` | `true` loads `fly-utilities.css`, every Tailwind utility with the `tw:` prefix (1.9 MB) |
| `debug` | `false` | `true` adds a preset switcher (`fly-debug.js`) for trying looks in the browser |

A complete site block:

```yaml title="mkdocs.yml"
extra:
  fly:
    chrome: fontlab
    chrome_options:
      site-label: Design system
      mobile-menu: materialx
      mobile-search: materialx
      search-from: docstheme
    hue: cobalt
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

Role properties: block roles (`h1`–`h6`, `body`, `lead`, `nav`, `table`, `caption`,
`code`) take `family`, `weight`, `stretch`, `features`, `variation`, `size`, `leading`,
`tracking` and `scale`; inline roles (`em`, `strong`, `mono`) take `family`, `weight`
and `adjust`. Values are plain CSS: a value that could end its declaration (`;`, braces,
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
