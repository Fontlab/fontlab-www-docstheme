---
this_file: README.md
---

# FontLab theme 2026

Shared customizations for ProperDocs + MaterialX and FontLab/Vexy hybrid sites.
Source for `https://i.fontlab.com/fltheme26/`; deployment files are staged in
the sibling `img/docs/fltheme26/` repository.

## Build and verify

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
npm run deploy
```

`deploy` stages and hash-verifies the CDN tree; publishing requires committing
and pushing `img`, then checking its Pages deployment and live asset hashes.
It does not publish consumer sites. `consumers.json` tracks the full rollout.

## Add components to a site

Keep `theme.name: materialx` and any site-specific template overrides. Add:

```yaml
extra_css:
  - https://i.fontlab.com/fltheme26/1.0.0/components.css
  - https://i.fontlab.com/fltheme26/1.0.0/theme.css
extra_javascript:
  - https://i.fontlab.com/fltheme26/1.0.0/basecoat.js
  - https://i.fontlab.com/fltheme26/1.0.0/theme.js
```

For static/Webflow HTML, use stylesheet links and deferred scripts in that order.
The shared toolkit must inject them after all overlays, including cached pages.

Wrap component markup in `.fltheme-components`:

```html
<div class="fltheme-components">
  <button class="btn">Basecoat button</button>
  <button class="du-btn du-btn-primary">daisyUI button</button>
</div>
```

Use [Basecoat 1.0 markup](https://basecoatui.com/installation/) and
[daisyUI markup](https://daisyui.com/components/) with every daisyUI component
class prefixed `du-`. Both libraries and the reset are scoped to that wrapper.
The bundle includes all daisyUI component classes, not just specimen classes.
It includes utilities used by the specimen, not every possible Tailwind utility;
use your own CSS for page layout or add deliberate sources in the shared build.

The Basecoat runtime uses its public registration API to scope discovery and
leave other `.tabs`, `.select` and `.accordion` elements alone. Chart is optional
upstream and is not bundled: it also needs Chart.js. Do not load another copy of
Basecoat on the same page. MaterialX instant navigation is supported; call
`FLTheme.refresh()` after manually inserting or restoring component containers.

The host remains responsible for theme choice and persistence. Component colors
follow MaterialX's scheme or the host's dark appearance. Override one component
area with `data-fltheme-mode="light"` or `"dark"`, then call `FLTheme.refresh()`.
Component overrides belong in `src/theme.css`, `src/harmony-forms.css` and
`src/harmony-display.css` (or the specimen stylesheet),
then run the shared build. The build transforms all three stylesheets together
to preserve layer precedence against unlayered MaterialX/Webflow CSS; editing
the generated stylesheets independently bypasses that contract.

The generated daisyUI stylesheet renames its border-width token to `--du-border`
because Basecoat's `--border` token is a color. Countdown values use the familiar
`--value` and `--digits` properties; the theme maps them to daisyUI's prefixed tokens.
The shared styles harmonize fields, choices, tabs, frames, hints and data displays.
MaterialX keycaps, captions, admonitions and tooltips use the same scale; its content
has `25vh` bottom padding. Key labels retain their text alongside keyboard symbols.
Changing the host's light/dark mode also refreshes optional Basecoat charts.

## Responsive navigation

MaterialX pages default to local navigation and local search. The global bar
shows one search icon immediately left of one hamburger. The local drawer
opens on the right, with the theme switcher at the bottom. Below 76.25em the
branding scrolls away; the compact controls stay at the top right while either
control serves the local site. Escape closes an open panel and restores focus.

Choose each control independently, using the same API for both brands:

```html
<fontlab-menu mobile-menu="materialx" mobile-search="materialx"></fontlab-menu>
<vexy-menu mobile-menu="global" mobile-search="global"></vexy-menu>
```

JavaScript `.config` accepts `mobileMenu` and `mobileSearch` with the same
values; explicit attributes take precedence. Keep existing configuration fields
when updating it. FontLab and Vexy auxiliary pages select `global` for both.
Plain Webflow pages without a MaterialX drawer retain the global controls.
If a requested local target is absent, its global equivalent remains available.

Load the menu script together with the shared `theme.css` and `theme.js` above.
Keep MaterialX's native `#__drawer`, `.md-sidebar--primary`, `#__search` and
`.md-search` markup; enable its search plugin. Older search-only custom headers
are supported. Desktop restores the palette position; the global loupe opens
the selected search at every width. Local search uses the native MaterialX index
in a centered desktop dialog and a full-screen mobile panel. Despite the legacy
`mobile-search` / `mobileSearch` names, that search choice now applies at all sizes.
Local ownership also restores the loupe on legacy `no-search` pages.

The menu exposes `mobileControls` and emits cancelable
`fontlab-menu:mobile-control` / `vexy-menu:mobile-control` events with
`{control, owner, trigger}`. Search events fire from the desktop loupe too.
The shared adapter handles local controls by
preventing the default global action. Re-render events reconnect accessibility
state after configuration or brand changes. Internal `data-*` flags are owned
by the adapter; consumers configure only the public attributes or `.config`.

The [MaterialX integration specimen](https://i.fontlab.com/fltheme26/materialx/)
uses the vanilla template and provides both ownership selectors. The build uses
`uv`, Python 3.13, ProperDocs 1.6.7 and MaterialX 10.1.8 to compile this fixture.
Run `node scripts/verify-mobile-navigation.mjs --local` to test candidate assets
on published sites; omit `--local` to check the published CDN.

## Keyboard navigation

While reading a page, **Right** or **Alt+Right** opens the next page in the
documentation navigation; **Alt+Left** opens the previous page. **Left** goes
back in browser history. Next/previous use ProperDocs' generated `rel` links,
with the primary navigation as a fallback. At either end, they do not wrap.
The CDN component and authoring pages provide the same controls.

Search, editable fields, interactive widgets, open dialogs, selected text and
other modifier combinations retain their normal keyboard behavior. Held keys
do not repeatedly navigate. Plain Webflow pages are unaffected.

## Existing customizations

`src/chrome/` centralizes the existing FontLab chrome. `src/editorial/` contains
the shared Marketing/styleguide typography, layout and theme controls, plus the
small styleguide variant. The legacy vendor CSS preserves existing unprefixed
authoring on those two sites; new component examples use the isolated Basecoat
and prefixed daisyUI bundle. `provenance.json` records the original source hashes.
Site-specific content, fonts, menu configuration and templates stay with their
sites. Shared design changes belong here.

Run the specimen with `python3 -m http.server --directory dist 8422`, then open
`http://localhost:8422/`. The form demonstrates in-memory state only.

## Release evidence

See `PLAN.md`, `TODO.md`, `WORK.md`, `CHANGELOG.md` and `review/`. Task422 is complete: 33 consumer configurations (including ornotto), 18 live browser checks and
an independent review score of 96/100. Run `npm run verify:live` to refresh
the desktop/mobile screenshots and published-site checks. The existing fldoc
tooltipster error is documented in `review/baseline-limitations.json`.
