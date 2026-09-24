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
Component overrides belong in `src/theme.css` (or the specimen stylesheet),
then run the shared build. The build transforms all three stylesheets together
to preserve layer precedence against unlayered MaterialX/Webflow CSS; editing
the generated stylesheets independently bypasses that contract.

The generated daisyUI stylesheet renames its border-width token to `--du-border`
because Basecoat's `--border` token is a color.

## Responsive navigation

On MaterialX pages with a `fontlab-menu` or `vexy-menu`, the global menu scrolls
with the page below MaterialX's 76.25em drawer breakpoint. A 44px local hamburger
stays at the top edge and opens MaterialX's existing navigation drawer. Enter
and Space open it; Escape closes it and returns focus. Desktop navigation keeps
the site's existing layout. Webflow pages without a MaterialX drawer are unchanged.

This is the default in `theme.css` and `theme.js`; consumers already loading
the shared assets need no extra stylesheet. Older templates with an empty
MaterialX header receive the missing drawer label automatically. Keep the
`#__drawer`, `.md-header` and `.md-sidebar--primary` elements in custom templates.
Run `node scripts/verify-mobile-navigation.mjs --local` against published pages
with candidate assets, or omit `--local` to check the published CDN.

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

See `PLAN.md`, `TODO.md`, `WORK.md`, `CHANGELOG.md` and `review/`. Task422 is complete: 32 consumer configurations, 18 live browser checks and
an independent review score of 96/100. Run `npm run verify:live` to refresh
the desktop/mobile screenshots and published-site checks. The existing fldoc
tooltipster error is documented in `review/baseline-limitations.json`.
