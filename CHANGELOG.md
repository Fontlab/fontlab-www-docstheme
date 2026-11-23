---
this_file: CHANGELOG.md
---

# Changelog

## 0.2.0 — unreleased

- H1 now uses Polymath Display at weight 900 with `-0.01em` tracking. H2 uses Polymath at 500 with zero tracking. The lead follows the H2 family. H3–H6 keep Grtsk.
- The default Typekit sources are `typekit:xht3uat` (Polymath), `typekit:cna4jfp` (Sole) and `typekit:wck5koo` (Grtsk). Sites can still request News Serif with `typekit:cmv5add`.

## 0.1.1 — 2026-11-23

- Nav titles (`label.md-nav__title`: the drawer title and the page title above the
  in-page links) always have the L2 rail's background, `--fly-paper-2`, in both schemes.
  `npm run verify:fly` checks it at 1440 and 390 px.

## 0.1.0 — 2026-11-23

- Added the `fly-january` MaterialX child theme and `fly` plugin. Sites can select
  chrome, page presets, font roles and hues. The package ships compiled CSS and JavaScript.
- Task 5 verified the baseline grid, type sizes, light and dark palettes, chrome,
  keyboard navigation and page presets in Chromium through `agent-browser`.
- The FontLab 9 migration added page-hue H1s, neutral buttons, responsive utilities
  and a maximum measure for H1 and H2. The main sites and blog added the sans role,
  italic emphasis, the article link colour option, sticky chrome and the menu site URL.
- Bare MaterialX plugin names work with inherited templates. Three small Adobe kits
  supply the default fonts. Blog posts use the article measure, wide tables scroll on
  phones and component links can opt out of article styling.
- Local consumer comparisons covered all 16 FontLab 9 pages, 60 main-site cases and
  44 blog cases. The demo, versioned CDN assets and `latest/` alias build into `docs/`.
  The build compares assets against the published version's manifest and refuses to
  overwrite a published version with different files.
- Restricted the source distribution to package sources, Python tests, fixtures and
  project metadata. Added archive checks for private paths and complete wheel contents.
- Restored fluid H2 sizing, documented CSS specificity and added integrity checks for
  PhotoSwipe. The symbols and lightbox partials can be overridden for local-only sites.
- Validated page classes, made missing-plugin errors actionable, and omitted disabled
  utility CSS from site output. MaterialX stylesheet discovery follows the installed
  version. CI exercises both the pinned engine and the newest compatible release.

## 2026-11-23: CDN tree and demo site (Task 6)

- Margin-figure grouping now comes from `vexy-python-markdown-figure-groups`
  (`group_figures` with the `fly-aside`/`fly-cut` classes); the plugin's own copy is gone.
- Demo site `src_docs/`: the Marketing design-pattern pages (merged from fly-demo-content) on
  `fly-january` with `extra.fly` (FontLab chrome "Design system", cobalt, the Marketing font
  sources with Outfit/REM roles) and the light/dark palette toggle. The old `overrides/`
  (menu/footer injection, five-subtheme switcher, pre-paint scripts) and the editorial CSS
  are gone; `hooks/page_scripts.py` loads Mermaid, MathJax and Chart.js per front-matter flag;
  `patterns.css` carries the editorial layout classes the pages use. The theme runtime
  keeps the component bundle in sync with the slate scheme.
- New theme pages: tokens (live palette, type roles, grid), configuration (every `extra.fly` and
  page key; its YAML examples are validated by `tests/py/test_demo_site.py`), assets, chrome.
- CDN tree `docs/fly/0.1.0/` and `docs/fly/latest/` (fly CSS/JS, Basecoat/daisyUI bundle,
  licences) with `docs/fly/manifest.json` (size, sha256), written by `scripts/build-cdn.mjs`
  during `npm run build`. The version comes from the release tag or the next planned version.
- `./build.sh` builds `docs/` in one step and link-checks it; the site's plugins are pinned
  in the `site` dependency group (src_docs/tooling and src_docs/build.sh are gone).

## 2026-11-23: fly plugin (Task 4)

- `fly` plugin: validates `extra.fly` (chrome, chrome_options, hue, fonts, presets,
  margin_side, utilities, debug) and page `fly:` frontmatter (legacy `subtheme:` = preset);
  unknown keys or names fail the build with a `PluginError`.
- Templates render plugin-provided font links, preconnects, one `<style data-fly-roles>` of
  `--fly-<role>-<prop>` variables on `:root`, and the chosen chrome (fontlab, vexy, none or a
  custom script/tags) with `chrome_options` attributes. `<body>` gets `data-fly-hue`,
  `fly-chrome-<kind>`, `fly-margin-*`, `fly-no-l2` and `subtheme-<preset>`.
- `fly-utilities.css` (1.9 MB) loads only with `extra.fly.utilities: true`.
- Ported from fltheme27: margin-figure groups (`fly-aside`/`fly-cut`), permalink names,
  unparsed attribute-list warnings, `?v=` cache-busting (now also the theme's own assets),
  MaterialX rem rescale (20/14.4) on post-build. Tailwind compilation at build time is gone.
- MaterialX's header is hidden only under the FontLab and Vexy bars; `chrome: none` and custom
  chrome keep it (search, palette toggle, drawer).
- The theme registers only under `mkdocs.themes` (ProperDocs reads both groups; two
  registrations made every build warn about a duplicate provider).
- fly-debug.js switches presets from the plugin's `{links, style, hue}` data.
- `@property --fly-line` restored (Task 3 review fix).
- Runtime dependency `mkdocs>=1.6.1` declared.

## 2026-11-23: planning for fly-january

Added SPEC.md and rewrote PLAN.md and TODO.md for issues/401.md. Closed out the previous
TODO list, all of whose items were verified complete in earlier entries and in `review/`:
shared-theme audit and publication; README/AGENTS updates in the 19 affected repositories;
the public setup and MaterialX integration guide; the from-scratch starter build and
responsive checks; publication and live verification of documentation (task422, issues 212
and 213; evidence in `review/documentation-publication.json`, `review/issue212-delivery.json`
and `review/issue213-delivery.json`). No source or published asset changed.

## 2026-10-18: documentation plugin adoption

Made MaterialX search explicit in starter/fixture and enabled native breadcrumbs. Added downloadable PLUGINS.md covering all 15 requested projects, actual compatibility limitations and profile inheritance. Updated the public copyable YAML to match the starter. `npm run build` and all 15 `npm test` checks pass. Extracted ZIP, installed pinned requirements in a fresh environment and built strictly. No shared CSS/runtime source changed.

## 2026-10-14 — accessibility suite follow-up (unpublished)

- Initialize the active palette radio from MaterialX's visible label; upstream
  initialization leaves every radio unchecked, hiding the shared focus box.
- Target the independent TOC's `data-md-toggle="toc"` input in the runtime and
  browser tests; nested navigation can reuse the `__toc` ID.
- Add a palette initialization unit regression and exercise keyboard palette
  switching without relaxing any focus, closed-panel or contrast assertion.
- Build and 15 Node tests pass. All 80 browser cases and the four-case HEAD
  API/legacy comparison are blocked by sandbox Chromium launch permissions.

## 2026-10-14 — native toggle keyboard access (unpublished)

- Make visible native header drawer/search labels focusable buttons with names,
  panel references and expanded state; support Enter/Space without double toggles.
- Focus the first navigation link/query field on opening and return focus to the
  actual opener on Escape; retain existing global/local ownership and controls.
- Add two activation unit cases and two mobile Tab/Enter/Space browser cases.

## 2026-10-14 — consumer accessibility follow-up (unpublished)

- Synchronize the independent secondary TOC drawer at its native 60em breakpoint.
- Hide inactive Back to top controls from layout and keyboard focus; add explicit
  focus rings to top and copy controls, including legacy `.md-clipboard` buttons.
- Fix dark `.api-hero > .api-kicker` text whose consumer CSS used the primary
  header colour; the shared override survives consumer CSS loaded afterward.
- Extend fixture browser coverage and add a TOC state unit regression.

## 2026-10-14 — accessibility fixes (unpublished)

- Exclude closed native drawers/search panels and search results from focus,
  including pages without global chrome; retain native desktop search access.
- Add inset keyboard focus rings, visible copy-button focus and a real focus
  box for MaterialX palette radios; restore native mobile triggers on Escape.
- Raise slate indigo links/active navigation, secondary text and numeric/constant
  code tokens; preserve light colours and branded header surfaces.
- Add three Node regressions and nine fixture browser cases (both viewport sizes,
  both schemes and native/global chrome), with copy controls enabled in the fixture.
- Full gates remain blocked by unavailable pinned npm dependencies and sandbox
  Chromium launch permissions. No deployment or publication was performed.

## 2026-10-02 — marked text weight

- Set `.md-typeset mark` to `font-weight: 500`, retaining black text and a
  transparent background; added responsive/light/dark/editorial regression.
- Published to the CDN and verified exact public asset hashes and the live Pad
  post. Eight Node tests and all 69 browser tests pass.

## 2026-10-02 — Markdown extensions and transparent marks

- Enabled PyMdown Keys, Mark, Details, Highlight, InlineHilite, Tabbed and
  Tasklist in the shared starter and native build fixture; retained SuperFences
  and added tables and footnotes. Pinned PyMdown Extensions to 11.0.1.
- Added authored/rendered examples and kept the public YAML guide synchronized.
- Set shared `mark` text to black and `--md-typeset-mark-color` to transparent;
  removed the competing optional editorial colors.
- Added browser and generated-output regressions for parsing and computed styles.
- Published and verified the CDN files: eight Node tests, 69 browser tests,
  a strict starter build, exact public asset hashes and live responsive checks.

## 2026-09-24 — unboxed admonitions and normal article spacing

- Removed admonition borders, backgrounds and shadows. Icons, headings and body
  text share semantic colors, including readable dark-mode colors. Body content
  aligns with the heading; collapsible icons and disclosure controls remain visible.
- Removed the final-paragraph 25vh padding rule. Updated the guide, starter and
  integration notes to describe normal end-of-article spacing.

## 2026-09-24 — range thumb alignment

- Removed daisyUI's additional thumb translation from the shared horizontal
  slider styling, centering the thumb on the track.
- Added rendered native-part geometry regressions at desktop and phone widths,
  covering minimum, middle and maximum values plus keyboard/output updates.

## 2026-09-24 — setup guide and repository documentation

- Expanded the CDN landing page with a complete MaterialX setup, template override,
  per-control ownership, component authoring, optional editorial styling, static and
  Webflow integration, keyboard behavior, troubleshooting and publication procedure.
- Added a downloadable two-page MaterialX starter with pinned Python dependencies.
  Its YAML and template are checked against the guide; its archive and source files
  are included in the release manifest. A fresh extracted copy builds in strict mode.
- Updated README.md and AGENTS.md across all 19 affected repositories; consumer and
  infrastructure repositories now have detailed THEME.md integration notes. Preserved
  unrelated local changes and published those notes from clean remote-based worktrees.
- Updated the obsolete browser assertion to test final-paragraph spacing, preserving
  the requested removal of padding from the full content container.
- Published the guide and starter to the CDN; verified both public screen sizes,
  the downloaded archive and every deployed asset. Corrected the blog AGENTS symlink
  target without replacing its existing instructions.
- Verification: 66 browser tests, seven Node tests, seven final guide/UI checks and
  a fresh starter browser check. Publication evidence is in
  `review/documentation-publication.json`; pre-existing unrelated CI failures are
  recorded separately from successful Pages publication.

## 2026-09-24 — final paragraph spacing

- Moved 25vh bottom padding from `.md-main .md-content` to
  `article.md-typeset > p:last-of-type`.

## 2026-09-24 — consistent standard buttons

- Matched MaterialX, Basecoat and daisyUI standard button height, padding, font
  size, weight and line height while preserving explicit size/shape variants.
- Added browser coverage for the three-library comparison and sized buttons.

## 2026-09-24 — Vexy mobile search regression

- Added six browser cases for opaque mobile search panels with transparent headers.

## 2026-09-24 — component harmony (issue 213)

- Unified labels, checkboxes, radios, switch thumbs, selects, sliders, keycaps,
  content tabs, tooltips and annotation text across the three libraries.
- Matched MaterialX admonitions to the approved alert palette. Fixed captions,
  pagination, dropdown chevrons, drawers, skeletons, progress tracks and hero gaps.
- Repaired all four mockup frames, chart containment and theme refresh, countdown
  values, filter reset clipping, and added 25vh below MaterialX page content.
- Added 21 browser regressions with desktop/mobile and five-theme acceptance.
  See `review/issue213.md` for all 37 requirements and WORK.md for release evidence.

## 2026-09-24 — page and history shortcuts

- Right and Alt+Right follow the next documentation page; Alt+Left follows the
  previous page; Left goes back in browser history. Applies through the shared
  theme to ProperDocs/MaterialX sites and the CDN specimen/authoring pages.
- Preserve editing and widget shortcuts, stop at navigation boundaries, and
  ignore repeated navigation while a key is held down.
- Keep the editorial contents toggle below the header by leaving local search
  placement to the shared navigation adapter.

## 2026-09-24 — desktop local search

- Connected the global search loupe to MaterialX search at every screen width.
  Auxiliary www.fontlab.com and www.vexy.art keep global search.
- Centered desktop results, preserved full-screen mobile search, and restored
  the loupe on older documentation pages that disabled the global search field.
- Extended both-brand ownership tests to desktop results, centering, backdrop
  dismissal and Escape/focus return, plus native pages without a global menu.
- Build, five Node tests, 30 browser tests and all 18 candidate page checks pass.
- Published both menu scripts and shared assets; all four public hashes match.
  Live acceptance covers 18 pages (one legacy Tooltipster error passed recheck).

## 2026-09-24 — integrated mobile controls (issue 212)

- Added independent `mobile-menu` and `mobile-search` ownership to FontLab and
  Vexy chrome. MaterialX defaults replace global controls in the same right-hand
  slot; search stays left of the hamburger and local controls remain after scroll.
- Moved the native drawer right, placed palettes at its bottom, and preserved
  keyboard trapping, Escape/focus return and desktop restoration.
- Added the global menu/footer and a vanilla MaterialX ownership fixture to the
  CDN showcase. Auxiliary FontLab/Vexy pages explicitly use global controls.
- Fixed legacy search form hiding/opacity and explicit light/dark component
  surfaces. All seven candidate sites, 29 browser tests and five Node tests pass;
  the repaired search opacity has additional vanilla and real-consumer checks.
- Independent implementation review: 95/100. Published both menus and the CDN;
  both live suites pass 18 entries and all four bare asset hashes match.
  Long site names retain both controls inside narrow headers. Evidence is in WORK.

## 2026-09-24 — responsive navigation, published and verified

- Added the shared mobile default: the global menu scrolls away while a 44px
  MaterialX hamburger stays at the top. Restores the drawer trigger in older
  search-only header templates; preserves desktop and Webflow layouts.
- Verified keyboard activation, Escape/focus return, scrolling and drawer
  visibility on seven published sites with candidate assets at phone/tablet
  widths, plus desktop checks. All 16 browser tests and five Node tests pass.
- Published CDN commit `40721ae` (Pages run `35995541134`) and verified
  exact public CSS/JS hashes. All seven sites pass the same interaction checks
  against public assets. Marketing commit `0c2b294` (run `35995637277`) puts
  Home first inside Showcase, leaving only Showcase and Design tabs.

## 2026-09-23 — task422 completed

- Published the shared MaterialX customization, scoped Basecoat 1.0.2 and
  `du-` prefixed daisyUI 5.7.44 at https://i.fontlab.com/fltheme26/.
  Includes an interactive specimen, authoring instructions, pinned dependencies,
  source provenance and redistributed licenses. All 18 non-HTML CDN payloads
  match the release manifest; rebuilding reproduces that manifest.
- Updated all 32 inventoried configurations, including active MaterialX sites,
  generator inputs, internal docs, archived references and production mirrors.
  `consumers.json` records each configuration's role and deployment evidence.
- Modernized Extend FontLab and GetGo Fonts with locked ProperDocs/MaterialX
  builds, preserving source pages, routes, illustrations, downloads and editable
  font specimens. Both sites are deployed and pass browser interaction tests.
- Modernized the FontLab/PythonQt API documentation. Restored project-relative
  404 links and working MaterialX search across 8938/40713 index entries.
  Added a tested, narrow compatibility hook for the large generated Qt corpus.
- Modernized FontLab VI/7 help and republished the current FontLab 8 manual.
  Pinned the VI wiki to its original publication era, retained 3413 historical
  HTML/image paths, and verified all 2459 historical images/fonts byte-for-byte.
  Source overrides retain original illustrations across clean builds.
- Released fontlab-www-toolkit 1.0.14 to PyPI. Final-output injection adds shared
  assets after Webflow overlays. Updated Ionos runtime/source copies and rebuilt
  FontLab/Vexy production sites; live output contains every asset exactly once.
- Changed Vexy Play's shared menu destination to https://playlines.vexy.art.
  Published i.vexy.art commit 251ad0096249c5a88bc88317407e79eefac3ac02;
  Pages run 35890576118 succeeded and the live menu script was verified.
- Built, committed, pushed and deployed all active consumers. Used isolated
  publication worktrees where needed to retain unrelated user changes.
  `review/publication.json` records verified remote commits and preserved edits.
- Passed 5 Node tests, 13 local browser tests, 108 toolkit tests, 6 legacy-help
  compatibility tests and the PythonQt search regression. All 18 live browser
  checks pass at desktop/mobile sizes, with search and asset checks where
  available. Screenshots and JSON evidence are retained in `review/`.
- Independent implementation review: **96/100**, above the requested 94 threshold.
  Fixed all blocking findings and both follow-up notes. The pre-existing fldoc
  tooltipster error was reproduced without shared theme assets and is recorded
  separately in `review/baseline-limitations.json`.

Completed checklist items have been removed from TODO.md. PLAN.md retains the
implemented architecture and acceptance contract.
