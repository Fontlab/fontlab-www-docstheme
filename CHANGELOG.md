---
this_file: CHANGELOG.md
---

# Changelog

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
