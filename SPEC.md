---
this_file: SPEC.md
---

# fly-january: specification

Source brief: `issues/401.md`. This file is the binding authority; `PLAN.md` argues from it.

## 1. Scope in one sentence

Turn the ad-hoc `fltheme27` override (Marketing/src/whats-new-fontlab-9) into `fly-january`,
an installable ProperDocs theme that extends MaterialX, with a coherent `--fly-*` token
system, published assets on fontlab.dev/fontlab-www-docstheme/, companion Vexy plugins, and
adoption by every FontLab and Vexy documentation site listed in the brief.

## 2. Deliverables

| # | Deliverable | Home |
|---|---|---|
| D1 | Python package `fly-january` (theme + `fly` plugin) | this repo, `theme/fly_january/`, PyPI `fly-january` |
| D2 | CSS/JS sources in a layered structure | this repo, `src/fly/` |
| D3 | Demo site + mini-CDN | this repo, `src_docs/` → `docs/` → https://fontlab.dev/fontlab-www-docstheme/ |
| D4 | `vexy-mkdocs-page-import` plugin | new repo `vexyart/vexy-mkdocs-page-import`, PyPI same name |
| D5 | Markdown extension(s) `vexy-python-markdown-*`, only where §9 says one is needed | new repo(s) under `vexyart/` |
| D6 | `fontlab-www-toolkit` using D1 + D4 | existing repo |
| D7 | Migrated `whats-new-fontlab-9` with chapter hues | Marketing repo |
| D8 | Adoption in all listed sites | their repos |

The existing fltheme26 bundle (`i.fontlab.com/fltheme26/1.0.0/`, Basecoat + daisyUI
components, navigation and keyboard bridges) keeps working unchanged until a site has moved.

## 3. Theme package (D1)

- Layout: `pyproject.toml` at repo root; importable package `theme/fly_january/` containing
  `__init__.py`, `mkdocs_theme.yml` (`extends: materialx`), `main.html`, `partials/`,
  `assets/fly/` (built CSS/JS), `plugin.py` and helpers.
- Build backend hatchling + hatch-vcs; version from git tags (`vX.Y.Z`); generated
  `theme/fly_january/__version__.py` is git-ignored.
- Entry points: `properdocs.themes` and `mkdocs.themes` → `fly-january = fly_january`;
  `mkdocs.plugins` → `fly = fly_january.plugin:FlyPlugin`.
- Dependencies: `mkdocs-materialx>=10.1.8`, `properdocs>=1.6.7`. Python >=3.12.
- Consumer contract:

  ```yaml
  theme:
    name: fly-january
  plugins:
    - fly
  ```

  `custom_dir` stays available for site-specific templates. The theme must build with
  `properdocs build --strict`. No Node at site build time: all CSS is prebuilt and shipped in
  the wheel (fltheme27 compiled Tailwind on every build; that goes away. Sites that need
  Tailwind utilities get a prebuilt utility file, see §7).
- No hooks file in consumers. Everything `fltheme27/hooks.py` did moves into the `fly`
  plugin or a D5 extension, with its tests.

## 4. Token system (`--fly-*`)

No `--fl27-*` name survives. Tokens live in `src/fly/tokens/` and are declared in cascade
layer `fly.tokens`. Naming is `--fly-<group>-<name>[-<variant>]`.

### 4.1 Grid

- `1rem` is the half-line of the baseline grid, not the font size. `html { font-size: 90% }`
  (99% from 100em, 108% from 125em), preserving the reader's setting.
- `--fly-line: 2rem` is the body line. Every line-height and vertical space in flowing
  content is a multiple of `1rem`. Asides, captions and other `xs` text may leave the grid.
- MaterialX's own rem values are rescaled at build time by the plugin (factor 20/14.4), as
  fltheme27 did in `on_post_build`.
- Block heights snap to whole lines where the browser supports `calc-size()`; other browsers
  get the documented fallback.

### 4.2 Sizes

Continuous text and navigation use exactly three sizes:

| Token | Use |
|---|---|
| `--fly-size-xs` | captions, `th`, navigation, footers |
| `--fly-size-sm` | body text, tables |
| `--fly-size-md` | lead paragraphs, blockquotes |

Headings use fluid display sizes `--fly-size-h1` … `--fly-size-h6`, each a `clamp()` of a
rem floor, a viewport-relative slope and a rem ceiling, multiplied by the role's unitless
`--fly-<role>-scale` (default 1). A browser test asserts the computed sizes at 390, 1024,
1440 and 1920 px. Techniques are taken from Marketing/src/gav0zux (per-role stepped scales set
by custom properties, `em ± rem` spacing) and fontlab-9-zvx (`clamp(floor, base + vw, ceil)`).

### 4.3 Typographic roles

Roles: `h1 h2 h3 h4 h5 h6 body lead nav table caption code`. Each role has

`-family -weight -stretch -features -variation -size -leading -tracking -scale`

e.g. `--fly-h2-family`, `--fly-nav-stretch`, `--fly-table-features`. Inline roles
`em strong mono` have `-family`, `-weight` and `-adjust`: a unitless em multiplier
(e.g. 1.05 or 0.95) that compensates for a different x-height when families are mixed.
Rules consume roles only through these variables.

### 4.4 Colour

- Twelve perceptually spaced hues, defined in OKLCH with sRGB fallbacks, named
  `cherry tangerine amber lime emerald teal sky cobalt indigo violet magenta rose`.
- Per hue: `--fly-<hue>` (lead), `--fly-<hue>-soft` (lighter), `--fly-<hue>-deep` (darker),
  `--fly-<hue>-tint` (surface wash). Values differ for light and dark schemes.
- Greys: `--fly-gray-1` … `--fly-gray-9`; surfaces `--fly-paper-1/2/3`, `--fly-ink`,
  `--fly-quiet`, `--fly-edge`, `--fly-bar`.
- Semantic tokens map strictly onto the hues: `--fly-accent` (page hue), `--fly-primary`,
  `--fly-link`, `--fly-success`, `--fly-warning`, `--fly-danger`, `--fly-info`, and one hue
  per admonition type. Primary buttons, alerts, marks and focus rings use semantic tokens only.
- Lead colours must be saturated and modern, neither primary-school nor fashion-trend.
  Acceptance: text set in `-deep` on `--fly-paper-3` (light) and `-soft` on dark canvas
  reaches WCAG 4.5:1; adjacent hues differ by ΔE(OK) ≥ 0.08. A Node test checks both.
- MaterialX `--md-*` colour tokens are bridged from the fly tokens for both
  `[data-md-color-scheme]` values.

## 5. Site and page configuration

All configuration is under `extra.fly` in `mkdocs.yml`, validated by the plugin at
`on_config` (unknown keys and unknown names are build errors):

```yaml
extra:
  fly:
    chrome: fontlab            # fontlab | vexy | none | {script, header, footer}
    hue: cobalt                # site accent
    fonts:
      sources:                 # loaded on every page
        - typekit:gav0zux
        - google:Outfit:wght@100..900
        - https://example.com/fonts.css
      roles:
        h1: {family: "'newsserif-huge-variable', serif", weight: 700}
        h2: {family: "'quire-sans', sans-serif", weight: 300}
    presets:                   # named bundles a page can pick
      fl9-color:
        fonts: {sources: [google:Blaka+Ink], roles: {h1: {family: "'Blaka Ink'", weight: 400, scale: 1.1}}}
        hue: magenta
```

Page frontmatter may set `fly: {preset:, hue:, fonts: {sources:, roles:}}`. Order of
precedence: page `fonts`/`hue` > page `preset` > site. The legacy `subtheme: name` key is
read as `fly.preset: name`.

The plugin emits, in `<head>`: one `<link>` per distinct font source (with preconnects), and
one `<style>` setting the role variables for that page. `typekit:<id>` expands to
`https://use.typekit.net/<id>.css`; `google:<spec>` to a `css2?family=<spec>&display=swap`
URL; anything starting `https://` is used as is. A hue sets `data-fly-hue` on `<body>`.

### 5.1 Global header and footer

`chrome` picks the global bars: `fontlab` loads `https://i.fontlab.com/menu/fontlab.js` and
renders `<fontlab-menu>`/`<fontlab-footer>`; `vexy` loads `https://i.vexy.art/menu/vexy.js`
and renders `<vexy-menu>`/`<vexy-footer>`; `none` renders MaterialX's own header and footer
with no company logo or name; a mapping names a custom script URL and element tags. Menu
attributes (`site-label`, `mobile-menu`, `mobile-search`, `search-from`) are set under
`extra.fly.chrome_options`. Unofficial sites use `none`.

## 6. CSS and JS structure (D2)

`src/fly/` replaces the stacked patches (bridge CSS loaded first, `!important` overrides,
"owner feedback" one-offs) with ordered cascade layers:

`@layer fly.tokens, fly.base, fly.layout, fly.components, fly.chrome, fly.utilities;`

One directory per layer, one file per concern. `!important` is allowed only to beat
MaterialX rules that are themselves `!important`, each with a comment naming the rule.
JS: `fly.js` (lightbox, sheet state), `fly-bridge.js` (global menu ↔ MaterialX drawer and
search, keyboard paging), `fly-debug.js` (preset switcher, only when `extra.fly.debug`).
`scripts/build.mjs` builds them into the package and into the CDN tree.

## 7. Published assets (D3)

`docs/` is build output served by GitHub Pages (`main:/docs`):

- `docs/` — the demo site.
- `docs/fly/<version>/` and `docs/fly/latest/` — `fly.css`, `fly-tokens.css` (tokens only,
  usable by non-MkDocs pages), `fly-utilities.css`, `fly.js`, `fly-bridge.js`, plus the
  Basecoat/daisyUI component bundle, each listed with sha256 in `manifest.json`.

Versioned directories are immutable once published. Webflow-overlaid pages and other
non-theme pages load `https://fontlab.dev/fontlab-www-docstheme/fly/<version>/…`.

Demo site: `src_docs/mkdocs.yml`, Markdown in `src_docs/md/`, theme `fly-january`. It
documents the tokens (live palette, type roles, grid), every configuration key, and carries
the design-pattern pages migrated from Marketing/src_docs (field guide, showcase, brand-asset
pages, the `compiled_examples` specimen hook, includes, nav).

Ruling: the 189 MB of brand-asset binaries (`md/assets/design-assets/`) stay in the Marketing
repo at their current URLs; migrated pages link to them absolutely. Marketing/src_docs
becomes a one-page minisite that keeps serving those files and points at the new site.

## 8. Page-import plugin (D4)

`vexy-mkdocs-page-import`, plugin name `page-import`. Frontmatter on a Markdown page:

| Key | Behaviour |
|---|---|
| `import-url: <url>` | fetch the URL; its HTML replaces the page's rendered output |
| `webflow-import-url: <url>` | as above, then Webflow post-processing: remove the badge, split multi-family Google Fonts links, optional Cloudinary rewriting, `data-cfasync="false"` on scripts |
| `copy-file: <path>` | copy a local precompiled HTML file (relative to the config file) in place of the page |

At most one key per page; two is a build error. The page keeps its place in navigation and
search. Fetches use a timeout, at most 3 attempts, and an on-disk cache
(`cache_dir`, default `.cache/page-import`); `offline: true` builds from cache only and
fails on a miss. Options: `inject_head` (HTML appended before `</head>`, used for theme
assets), `webflow` options mirroring the toolkit's current ones. hatch-vcs, git-ignored
`__version__.py`, `src/` layout, pytest, house conventions of `vexy-mkdocs-image-sizes`.

## 9. Markdown extensions (D5)

A function from `fltheme27/hooks.py` becomes a `vexy-python-markdown-*` extension only if it
transforms Markdown/HTML content independently of the theme (candidate: grouping margin
figures with their paragraphs). Theme-specific behaviour stays in the `fly` plugin. The
decision per function is recorded in `WORK.md`.

## 10. Toolkit (D6)

`fontlab-www-toolkit` delegates page import to D4 (its own pull/overlay code path is removed
once the three sites build with the plugin), injects the fly CDN assets instead of fltheme26,
and exposes the `chrome` choice. Its CLI commands keep their names.

## 11. Site adoption (D7, D8)

- Every listed `mkdocs.yml` switches to `theme.name: fly-january` + `plugins: fly`, drops
  fltheme26 `extra_css`/`extra_javascript` where the theme now provides them, and sets
  `extra.fly.chrome`: `fontlab` for official FontLab sites, `vexy` for official Vexy sites,
  `none` for unofficial ones (no FontLab logo; no Vexy icon or VEXY name).
- whats-new-fontlab-9: the previous build is kept as reference. Chapters 1–12 each get one
  hue as a subtle accent including the H1 colour; chapter 13 (Bug fixes) and the index use
  grey. Screenshots of old and new at 1440 and 390 px, light and dark, are compared page by
  page; nothing may break.
- www.fontlab.com, www.vexy.art and blog.fontlab.com are rebuilt locally and checked in a
  browser before anything is published.
- Ruling: `razem-demo/vendor/pycrdt` is a vendored third-party checkout (`y-crdt/pycrdt`)
  and is not modified.
- Repos with uncommitted owner edits are changed in clean worktrees; owner edits are never
  discarded. For Marketing, the working-tree state of `whats-new-fontlab-9` is the source.

## 12. Verification

- Python: pytest for plugin and theme (config validation, font-link emission, precedence,
  chrome selection, rem rescale, strict fixture build).
- Node: token tests (contrast, hue spacing, no `fl27` anywhere, layer order), build manifest.
- Browser (Playwright): baseline grid (line-heights are multiples of 1rem in flowing
  content), the three text sizes, heading sizes per viewport, light/dark, chrome variants,
  keyboard paging, no page errors.
- Each adopted site: strict build passes; representative pages screenshot-checked.

## 13. Release

Tag and publish `fly-january` and `vexy-mkdocs-page-import` to PyPI, push all repos, let
Pages publish `docs/`, then verify live bytes against `manifest.json`. Live deploys of
www.fontlab.com and www.vexy.art (rsync with delete to the production host) are run only
with the owner's go-ahead at that point.

## 14. Out of scope

Redesigning the global menu components; changing site content; new component libraries;
analytics, monitoring or caching layers beyond the page-import cache.
