---
this_file: CHANGELOG.md
---

# Changelog

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
