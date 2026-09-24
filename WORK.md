---
this_file: WORK.md
---

# Work

## 2026-09-24: responsive local navigation

User correction: global FontLab/Vexy navigation must scroll away on small
screens while a compact MaterialX hamburger stays reachable. Verified the
initial defect on ornotto, Marketing, the writing styleguide, Partners, FontLab
legal, Vexy about and the blog. Marketing/styleguide retained a search-only
header without the drawer label; other sites hid the native header in CSS.

The shared runtime reuses the native checkbox and drawer, restores the missing
label where necessary and orders the header after the global menu. Scoped
responsive rules show a 44px sticky control and restore hidden mobile drawers.
Desktop and non-MaterialX Webflow pages retain their existing behavior.

Five Node tests and all 16 browser tests pass. Candidate CDN substitution on
all seven live sites passes at 390px and 800px, with desktop checks at 1440px:
global menu leaves the viewport, local trigger remains at top, Enter opens,
Escape closes and restores focus, and navigation links enter the viewport.
Fixed double activation from MaterialX's document-level Enter listener.
Consent dialogs are dismissed through their visible Reject All control.
Screenshots and results: `review/mobile-navigation-candidate/`.
Publication is complete: CDN `40721ae`, successful Pages run `35995541134`.
Both public asset hashes match the local build. All seven sites pass live at
390px and 800px, with desktop checks at 1440px. Public Marketing navigation
is exactly Showcase / Design, with Home first inside Showcase; its isolated
publication `0c2b294` passed 108 tests and Pages run `35995637277`.

Cloudflare initially served cached assets. Available credentials lacked cache
purge permission (401); no purge succeeded. The public cache subsequently
refreshed, and the final unmodified-URL hash and browser checks passed.
Evidence: `review/mobile-navigation-live/`, asset hashes and publication JSON.

## 2026-09-23: task422 baseline

Read task422 and both supplied library studies. Confirmed current official
Basecoat installation and lifecycle documentation, daisyUI configuration,
Tailwind Preflight controls and ProperDocs customization documentation.
This repository starts without implementation or tests. Its existing modified
`.gitignore` and untracked `.DS_Store` are unrelated and must not be committed.

Several consumers contain existing user edits, notably the writing styleguide
and www.fontlab.com. Preserve them and stage only task-specific changes.
Extend FontLab and GetGo Fonts are symlinks to an external volume. Extend's
Git status currently reports `bad tree object HEAD`; inspect and repair only
with preservation of its existing working files.

Wait, but shared CSS alone does not cover Webflow pages: their final HTML
overlays the documentation build. The rollout must verify final publish trees.

## Foundation verification and bounded cleanup

2026-09-23: five Node tests and nine Chromium browser checks pass. The browser
checks cover MaterialX and Marketing hosts, light/dark and nested schemes,
instant navigation, tabs/form/disclosure, mobile overflow and native-versus-
compiled layer equivalence for the adapted daisyUI resets. Toolkit baseline
96 tests grew to 108 passing tests. Reviewer scored the initial foundation 91,
then 96 after real head-boundary parsing and palette-observation fixes. This
score does not cover the unfinished rollout or the subsequent CSS compiler.

Cleanup plan (shared foundation only): remove the failed hand-written layer
flattening, use one maintained nesting/layer compilation pass, retain output
provenance, and strengthen appearance assertions. This is now implemented.
Wait, but transformed CSS must preserve native library behavior: the differential
browser test caught collapse-open's lower-layer overflow:clip fallback. That
case is retained explicitly; remaining pinned reset fallbacks match browser
defaults in the covered selectors. Dependency updates require rerunning this
comparison. Existing local/global editorial CSS remains unchanged.

Pages API confirmed FontLabVI-help owns help.fontlab.com; fldoc publishes to
fontlab.dev/fldoc, despite its configured canonical help.fontlab.com URLs.
flchimp and fontlab-www-toolkit have no configured GitHub Pages deployment.
Extend and GetGo builds succeeded; illustration source paths are being corrected
before final asset verification. All consumer deployments remain pending.

Follow-up independent cascade review: 96/100; no blocking foundation defect.
All non-custom computed properties of the native and compiled regression
fixtures matched. Explicit Tailwind source discovery now excludes unrelated
repository text. Repeated builds produced identical manifests.

## Consumer publication and failure-driven verification

2026-09-23: Basecoat/daisyUI assets and specimen are live on i.fontlab.com;
18 non-HTML payloads match the published SHA-256 manifest. Cloudflare Fonts
rewrites the two HTML pages' Google Font links, so those are checked in browsers.
Toolkit 1.0.14 is published on PyPI and installed in the Ionos admin environment;
both hybrid sites rebuilt from their existing Webflow caches and serve all four
assets exactly once. Production source/admin mirrors are updated.

Extend/GetGo preserve all 4/100 source pages and their hashed assets. Both builds
and Pages deployments pass. Marketing, partners, blog, VFJ, fldoc and the clean
styleguide build are deployed. The styleguide publication worktree excludes
unpublished prose; pre-existing Adobe kit edits remain unstaged in other sites.
Internal toolkit/flchimp docs build but have no independent Pages authority.

The VI/7 builds pass six compatibility tests. VI is pinned to the source revision
matching the prior 2019-06-24 publication, retaining VI prose rather than today's
FontLab 7 wiki. Every pre-migration manual HTML route and image path exists again;
legacy illustration variants are maintained as explicit source overrides.
FontLab 8 output from fldoc is also published by the help.fontlab.com authority.

PythonQt's 35 MB generated QtGui page exposed pathological MaterialX HTML search
parsing. Core ProperDocs search builds it in 64 s; a small hook adds MaterialX's
field/pipeline defaults and a header override enables its existing search UI.
Browser search returns QAbstractButton without errors. The independent rollout
review scored 94 and identified missing API site_url values; all four active and
generator configs now include the project URLs, with fresh builds in progress.

Publication isolation: img and web-fontlab publish from clean worktrees to avoid
pre-existing local commits. fldoc's push also included its already-ahead
31ebe3fbc auto-commit (47 IgorTips source images/numbers files outside docs).
That existing commit was preserved; no history was rewritten.


## Final acceptance — 2026-09-23

Task422 is complete. Earlier pending statements above describe intermediate
checkpoints, not the final state. All 32 configurations have the shared assets;
active sites are published, internal sites are built, and archived/generator
inputs are explicitly classified. Remote commits are verified in publication.json.

Fresh acceptance: 5 Node tests, 13 sequential Chromium tests, 18/18 live browser
checks, 108 toolkit tests, 6 help compatibility tests and one PythonQt search
regression passed. The independent final implementation review scored 96/100.
The 404 project-path issue is fixed in all four API configs; both legacy API
wrappers now use clean locked builds. CDN manifest reproduction and all 18
non-HTML published payload hashes pass.

Wait, but retaining an image path does not prove its contents were retained:
a final baseline Git-object comparison found older illustration variants.
All 2459 historical image/font assets now match their original bytes; 1041
per-manual source overrides preserve these across future clean builds.
The final help Pages run 35901324533 and API run 35901285326 succeeded.
Live image/font samples also match. Remote toolkit builder.py/theme.py hashes
match the local released source after synchronization.

The only retained browser limitation is the pre-existing fldoc tooltipster
error, reproduced with all shared theme assets blocked. It is explicitly
allowlisted for that preview only. No new theme runtime errors were observed.
All screenshots, baseline limitations and publication records are in review/.

## 2026-09-24 — issue 212 review repairs

- Fixed explicit light/dark component surfaces and exercised both setup toggles
  with computed colours, restoring the original mode and preserving the host.
- Fixed Partners' transparent native search inner container after mobile
  reparenting; regression checks now include ancestor opacity and real typing.
- Auxiliary production sites rebuilt with global/global controls; source and
  admin mirrors updated without replacing unrelated production files.
- Partners deployment required replacing the obsolete FAQ class check with
  current markup and adding a generated search-index assertion.

## Issue 212 — published acceptance

All 33 inventoried configurations consume the centralized theme; ornotto is
recorded at its external checkout path. Both live suites pass 18 entries, and
the final shared suite passes 29 browser cases plus five unit cases. The four
bare menu/theme URLs match their build hashes. See review/issue212-delivery.json,
review/issue212-live-hashes.json, review/menu-integration-live/report.json and
review/live-browser.json.

The final menu fix constrains long site names without pushing search or the
hamburger off a narrow screen. Both brands and all eight ownership combinations
are tested with a deliberately long title. Targeted Cloudflare purges succeeded
for both menu scripts. Production Webflow caches remain unchanged (22 files);
current toolkit source is installed in the site virtual environments so future
rebuilds retain the shared assets.

Final independent deployment review: 96/100, no blockers. Public asset hashes
and Partners search were checked again independently.
