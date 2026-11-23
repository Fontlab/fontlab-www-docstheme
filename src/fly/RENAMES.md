---
this_file: src/fly/RENAMES.md
---

# fltheme27 to fly-january renames

The one file under `src/fly/` allowed to name the old prefix. The migration task (Marketing
`whats-new-fontlab-9` and the sites that copied fltheme27) rewrites content, site CSS and
hook output with this table. It is not part of the built assets.

## Classes and body classes

| fltheme27 | fly-january | Set by |
|---|---|---|
| `fl27-no-l2` | `fly-no-l2` | plugin (body, `hide: [toc]`) |
| `margin-left`, `margin-right` | `fly-margin-left`, `fly-margin-right` | plugin (body, `margin_side`) |
| `fl27-aside` | `fly-aside` | plugin (margin-figure groups) |
| `fl27-cut` | `fly-cut` | plugin (img-cut groups) |
| `fl27-msym` | `fly-msym` | main.html (html, icon font loaded) |
| `fl27-toc-scroll` | `fly-toc-scroll` | fly.js (html, one frame) |
| `fl27-arrow`, `fl27-arrow--back`, `fl27-arrow--forward` | `fly-arrow`, `fly-arrow--back`, `fly-arrow--forward` | partials/footer.html |
| `fl27-debug` | `fly-debug` | fly-debug.js |

Unchanged author and plugin contracts: `to-left`, `to-right`, `to-main`, `goto`,
`full-bleed`, `img-wide`, `img-tall`, `img-small`, `img-cut`, `img-tiny`,
`edge-all-light`, `edge-top-light`, `edge-left-light`, `subtheme-<name>`, `--rows`.
The `fl-` names (`fl-mobile-navigation`, `fl-drawer-open`, `fl-search-open`,
`fl-local-search`, `fl-nav-close`, `data-fl-mobile-menu`, `data-fl-mobile-search`,
`data-fl-key-symbol`, `--fl-bg`, `--fl-dropdown-bg`, `--fl-focus-color`) belong to the
global menu components and fltheme26 and stay.

## Attributes, ids, storage keys, layers, containers

| fltheme27 | fly-january |
|---|---|
| `html[data-fl27-l2]` (`dataset.fl27L2`) | `html[data-fly-l2]` (`dataset.flyL2`) |
| sessionStorage `fl27-l2` | sessionStorage `fly-l2` |
| localStorage `fl27-debug-subtheme` | localStorage `fly-debug-subtheme` |
| `#fl27-debug-data` | `#fly-debug-data` |
| `data-fl27-sub`, `data-fl27-default` | `data-fly-sub`, `data-fly-default` |
| container `fl27-canvas` | container `fly-canvas` |
| layer `fl27-tailwind` | layer `fly.utilities` |
| `extra.fltheme27` | `extra.fly` (Task 4) |
| env `FL27_TAILWIND` | none: Tailwind is prebuilt by `scripts/build-fly.mjs` |
| `assets/fltheme27/fltheme27.css` + `fltheme27-bridge.css` | `assets/fly/fly.css` |
| `assets/fltheme27/fltheme27.js`, `-bridge.js`, `-debug.js` | `assets/fly/fly.js`, `fly-bridge.js`, `fly-debug.js` |
| `tailwind-base.css` | `assets/fly/fly-utilities.css` |

## Custom properties

| fltheme27 | fly-january |
|---|---|
| `--fl27-lh` | `--fly-line` |
| `--fl27-body` | `--fly-body-family` |
| `--fl27-head`, `--fl27-h1-head` | `--fly-h1-family` |
| `--fl27-h2-head` | `--fly-h2-family` (h5 and the lead follow it) |
| `--fl27-h1-weight`, `--fl27-h2-weight` | `--fly-h1-weight`, `--fly-h2-weight` |
| `--fl27-h1-tracking`, `--fl27-h2-tracking` | `--fly-h1-tracking`, `--fly-h2-tracking` |
| `--fl27-h1-variation`, `--fl27-h2-variation` | `--fly-h1-variation`, `--fly-h2-variation` |
| `--fl27-h1-size`, `--fl27-h2-size` (unitless multipliers) | `--fly-h1-scale`, `--fly-h2-scale` |
| `--fl27-h1-measure`, `--fl27-h2-measure` | `--fly-h1-measure`, `--fly-h2-measure` |
| `--fl27-h34-size` | `--fly-h3-size`, `--fly-h4-size`, `--fly-table-size` |
| `--fl27-nav` | `--fly-nav-family` |
| `--fl27-nav-size` | `--fly-nav-size` |
| `--fl27-nav-stretch` | `--fly-nav-stretch` (variation `--fly-nav-variation`) |
| `--fl27-sans-font` | `--fly-sans-family` |
| `--fl27-sans-size` (.95em) | `--fly-sans-adjust` (0.95), `--fly-strong-adjust`, `--fly-em-adjust` |
| `--fl27-sans-stretch` | `--fly-sans-stretch` |
| `--fl27-geo` | `--fly-button-family` |
| `--fl27-ink`, `--fl27-quiet`, `--fl27-edge`, `--fl27-hover` | `--fly-ink`, `--fly-quiet`, `--fly-edge`, `--fly-hover` |
| `--fl27-paper-1`, `-2`, `-3` | `--fly-paper-1`, `-2`, `-3` |
| `--fl27-bar`, `--fl27-bar-drop` | `--fly-bar`, `--fly-bar-drop` |
| `--fl27-shadow`, `--fl27-shadow-down`, `--fl27-shadow-up` | `--fly-shadow`, `--fly-shadow-down`, `--fly-shadow-up` |
| `--fl27-shadow-ink` | `--fly-shadow-ink` |
| `--fl27-shadow-offset`, `--fl27-shadow-blur` | folded into `--fly-shadow-down` / `-up` |
| `--fl27-scrollbar` | `--fly-scrollbar` |
| `--fl-key-bg` (bridge) | `--fly-key` |
| `--fl27-rail`, `--fl27-part-rail`, `--fl27-sliver` | `--fly-rail`, `--fly-part-rail`, `--fly-sliver` |
| `--fl27-l1`, `--fl27-l1-label`, `--fl27-l1-reveal` | `--fly-l1`, `--fly-l1-label`, `--fly-l1-reveal` |
| `--fl27-notch` | `--fly-notch` |
| `--fl27-mt`, `--fl27-mb` | `--fly-mt`, `--fly-mb` (per heading) |
| `--fl27-gbox`, `--fl27-gmb` | `--fly-gbox`, `--fly-gmb` (per heading) |
| `--fl27-float-top`, `--fl27-float-mb` | `--fly-float-top`, `--fly-float-mb` (per margin item) |
