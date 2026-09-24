---
this_file: WORK.md
---

# Work

## 2026-09-24 — unboxed admonitions and normal article spacing

Regression tests reproduced the old colored boxes and 25vh final-paragraph gap.
Replaced the boxes with semantic text colors and one shared heading/body column;
removed duplicate editorial overrides and the special paragraph rule. Dark mode
uses lighter semantic colors. Visual review caught the native summary overflow
clipping its icon; a further failing regression covers icon visibility and matching
disclosure color. Guide, starter and consumer integration notes reflect the change.

Final build, all seven Node tests and all 68 browser tests pass. Ten candidate
checks across five themes at 1440/390px verify matching icon/heading/body colors,
zero borders/backgrounds/shadows, heading/body alignment, collapse interactions
and zero final-paragraph padding. Screenshots inspected, no page JavaScript errors.
Published the corrected THEME.md contract in all 18 consumer/infrastructure repos.

## 2026-09-24 — range thumb alignment

Reproduced the reported Marketing daisyUI range offset. A Chromium native-shadow
geometry regression fails before the fix at both widths: 6.64px at 1440px and
5.36px at 390px. The shared negative margin was combining with daisyUI's relative
positioning and translateY. Reset those vendor offsets so the shared margin is
the sole centering mechanism. Regression checks pass for both daisyUI and Basecoat
at minimum, middle and maximum values; keyboard/output and pointer interaction
remain working. Browser plugin unavailable; used Playwright with real Chrome.

Build, all seven Node tests and the full 68-test browser suite pass. Ten additional
geometry checks pass across five themes and both viewport sizes. Candidate preview
screenshots were inspected; the live-page candidate check has no JavaScript errors.

Published source `1f98b33` and CDN `305b685`; Pages run `36056707687` succeeded.
Purged theme.css and manifest.json; both public files match the build byte-for-byte.
The same geometry regressions pass against the public Marketing page at 1440/390px.
Live pointer clicks produce value 76 and ArrowRight changes 48 to 49 with the output
updated. No JavaScript errors; final live screenshots inspected. Evidence is under
`/tmp/range-*`, including live-regression.log, live-hashes.json and live.json.

## 2026-09-24 — publish and document the integration

Audited all 19 repositories against remote heads. Existing shared theme, menu,
keyboard, button and paragraph-spacing changes were already published. Remaining
Typekit/config, redirects, campaign notes, generated screenshots and submodule edits
were unrelated and preserved. Root README/AGENTS updates and detailed THEME.md notes
were published for all 18 consumer/infrastructure repositories, then synchronized
back without replacing unrelated local changes. Exact commits and remote checks are
in `review/documentation-publication.json`.

The CDN guide now covers new-site setup, native MaterialX extension, branding,
menu/search ownership, Markdown/HTML authoring, appearance, optional editorial CSS,
static/Webflow output, keyboard navigation, troubleshooting and publication. The
starter download is reproducible, uses pinned packages and has matching copyable
examples. Extracted it into a fresh directory, installed its requirements and ran
`uv run properdocs build -f mkdocs.yml --strict`. Browser checks exercised the native
search index, right-hand mobile drawer, Escape, equal button metrics and navigation
keys with no page JavaScript errors.

Fixed one stale test still asserting container padding. All 66 browser tests then
passed; seven Node tests verify scoping, cascade, example consistency and archive
manifest coverage. Seven guide/component checks passed after the final header/layout
cleanup. Screenshots and logs are under `/tmp/theme-guide-*` and `/tmp/guide-*`.

Four unrelated CI workflows were already failing on their parent commits: flchimp
Ruff lint, toolkit's missing Ruff executable, VFJ corpus source lookup, and the main
FontLab site's virtualenv creation. Read both baseline and current failed-run logs;
the errors match. Documentation commits changed only README, AGENTS and THEME.
Pages jobs completed successfully wherever triggered; these package/build failures
are not presented as passing tests and were not changed as part of site documentation.

Final publication: source `f20ab47`, CDN `f7c25e4`, successful Pages run
`36051900877`. The public guide passes 1440px and 390px checks for section links,
overflow, tabs, form interaction, dark mode and ZIP download. Both downloaded ZIPs
match the built archive; a fresh public-download extraction and installation builds
with the exact documented strict command. Live screenshots were inspected.

All 70 manifest entries plus the manifest were fetched: 66 match byte-for-byte;
five HTML pages match exactly after reversing Cloudflare font-proxy and Rocket
Loader transformations. The live consumer sweep passes 17 of 18 sites; fldoc alone
retains the previously recorded Tooltipster initialization error. Its navigation
and search assertions pass. This is not reported as a clean console result.

The tracked-document audit checks all 19 repositories, resolving symlinks. It caught
blog's AGENTS.md link to CLAUDE.md; follow-up `b3acd76` preserves the full existing
instructions and publishes the missing maintenance notes. Blog deployment
`36052484321` succeeded. Last-paragraph spacing was rechecked live at 800/1000px:
200/250px on the final paragraph, zero on the content container. No task-owned
publication work remains; unrelated worktree edits and baseline CI failures remain.

## 2026-09-24 — final paragraph spacing

Replaced the content-container padding rule with the requested last-paragraph
selector. Build and all five Node tests passed. Browser checks at 800px and
1000px viewport heights confirm 200px and 250px padding on the final paragraph,
respectively, with the container rule removed.

## 2026-09-24 — consistent standard buttons

Matched MaterialX, Basecoat and daisyUI standard buttons inside component wrappers:
2.5rem height, 1rem horizontal padding, .875rem text, 600 weight and 1.25rem line
height. Explicit size/shape variants retain their library settings.
The screenshot's Start-page comparison failed its geometry regression before the
fix. Build, five Node tests and all 65 browser tests passed afterward; ten checks
across five themes at 1440/390px confirmed identical metrics. Screenshots inspected;
no page JavaScript errors. Browser plugin unavailable; used the existing Playwright
setup. Evidence and verification script are under `/tmp/shared-buttons-*` and
`/tmp/verify-shared-buttons.mjs`.

Published source `5feb78d` and CDN `cf2bbcb`; Pages run `36044506693` succeeded.
Purged the changed stylesheet and manifest. Both public files match the build
byte-for-byte; all ten live theme/viewport checks passed with no page JS errors.

## 2026-09-24 — Vexy mobile search background

Reproduced the transparent search field with the homepage's `bg="transparent"`
and opaque panel settings. The regression failed before the CDN fix, then all
14 search-background and menu-ownership tests passed. Coverage includes dark/light
panels at 390, 800 and 1100px, focus, Escape, search destination and desktop hiding.
The canonical fix is in `../i.vexy.art/docs/menu/vexy.js`.

## 2026-09-24 — issue 213

Implemented the 37 requested component corrections in shared source, preserving
the component wrapper and vendor behavior. Marketing pagination now has real
neighbouring destinations and an aria-current pill. Its clean publication worktree
contains only the source page, generated page and regenerated search index.

Seven initial regressions failed before implementation. Visual review then found
two further regressions (terminal prompt alignment and checkbox rotation); both
were reproduced as failing tests before the final build. The review also corrected
duplicated key symbols, phone aspect-ratio slack, chart theme refresh and tooltip
focus handling. Theme assertions wait for finite CSS transitions to finish.

The full requirement mapping and direct standards/spec review are in
`review/issue213.md`. No dependencies changed. Unrelated source changes and
generated review-image changes were excluded from the task commits.

Candidate verification: the final 63-file build and all 5 Node tests passed.
The complete 55-test browser suite passed; all 200 five-theme desktop/mobile
checks passed, followed by 20 checks of the two final visual repairs. All 520
specimen captures were generated; frames and choices were refreshed after the
main visual repairs. Direct cleanup and standards/spec review found no remaining
issue-213 blockers. Logs and screenshots are under `/tmp/issue213/`.

Live screenshot review caught a terminal row wider than its phone frame, which
the page-level overflow assertion had missed. A new row/text containment test
reproduced it (509px right edge versus a 351px frame edge). Constraining the row
width passed that regression and 15 checks across five themes at 1440/390/320px.

Published source `be55f9f` plus the terminal correction `cb9d8c1`, CDN `c0b7af2`
(Pages run `36024043979`, success), and Marketing `0e10102` (Pages run
`36023270219`, success). Targeted cache purges succeeded. All 63 staged files
match the manifest; the three public CSS/JS assets and public manifest match the
final build hashes.

Final acceptance: 5 Node tests and the full 56-test browser suite passed. All 200
live component checks passed across five themes and desktop/phone widths, plus
15 live terminal checks at desktop, phone and 320px. All 19 catalogue pages were
free of JavaScript errors. Live shortcuts remained correct on Ornotto, styleguide,
partners, blog, FontLab auxiliary pages and the CDN specimen; Vexy history passed
on its page without a declared successor. The earlier full shortcut audit also
covered Marketing and the other consumers, retaining the known fldoc/Gordon
Tooltipster limitations. `review/issue213-delivery.json` records the final evidence.

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

## Desktop search follow-up

Use the selected MaterialX search from the global loupe at every viewport width;
keep www.fontlab.com and www.vexy.art on global search. Reuse the current ownership
choice and native search worker. Extend both-brand ownership tests to desktop
clicks, real results, one field, Escape/focus return and breakpoint changes.

Implemented all-width search dispatch in both menu components and native search
placement in the shared adapter. Removed the inherited float and fixed result
width that displaced desktop dialogs. Legacy `no-search` pages expose the local
loupe when MaterialX owns search. Preserved mobile Escape handling on pages
without a global menu and added a dedicated regression test. The GetGo test now
opens search through the visible global loupe before typing.

Validation: build passed; five Node tests and 30 browser tests passed. The
candidate interaction suite passed all 18 entries, including desktop searches
at 1280, 1440 and 1920px, mobile controls at 390, 800 and 1100px, both global
exceptions and four native-only legacy pages. All 63 publication files match
the build manifest. Candidate evidence: review/menu-integration-candidate/report.json.

Published source `f2266be`, FontLab CDN `2e210d1` (Pages run 36009474949), and
Vexy menu `e2b13ba` (Pages run 36009476116). Both Pages deployments succeeded.
Purged only the four changed CDN URLs; every public asset matches the tested
build byte for byte (review/desktop-search-live-hashes.json).

Live acceptance passed all 18 pages. All search interactions passed on the first
run; fldoc additionally reported a legacy Tooltipster initialization error. Its
isolated strict recheck passed with no page errors. Both attempts are retained
in review/desktop-search-live-initial.json and review/desktop-search-live-recheck.json;
the aggregate report uses the successful recheck. Delivery summary:
review/desktop-search-delivery.json. Desktop screenshots for the five requested
local-search sites are recorded at 1440px in review/menu-integration-live/.

## 2026-09-24 — page-order and browser-history shortcuts

Added the requested Right/Alt+Right next-page, Alt+Left previous-page and Left
browser-history mappings to the shared runtime. ProperDocs relation links define
page order, with normalized primary-nav links as a fallback. Editable controls,
widgets, open dialogs, text selections and modifier combinations remain native;
held keys and page-order boundaries cannot repeatedly navigate or wrap. Added
relations and runtime loading to the two static CDN documentation pages.

Five new browser tests failed before implementation and passed afterwards. The
full suite passed 35 browser cases plus five Node cases. During the Ornotto editorial migration, fixed
an older search relocation that could position the contents toggle behind the
header; the shared navigation adapter now retains ownership of its search dialog.

Candidate verification: all four requested navigation/history behaviors passed
across 19 public page entries (the Vexy auxiliary page has no declared next page).
The 17 non-legacy entries were also console-clean. fldoc and Gordon emitted the
previously observed Tooltipster initialization error during navigation; their
shortcut assertions still passed, and their strict console rechecks retain the
error. This is a recorded existing dependency issue, not a waived shortcut test.
The Marketing editorial regression additionally verifies search remains outside
the hidden header/sidebar and its contents toggle can be clicked.

Published source `51d2228` and CDN `9124937`; Pages run `36015310383`
succeeded. The 63 staged files match the build manifest. Both changed public
JavaScript files match their build hashes after targeted CDN purging. Cloudflare
transforms the two showcase HTML files; their navigation relations and runtime
were verified structurally and through actual live keyboard interactions.

Live acceptance exercised 19 page entries: all four shortcuts passed on 18,
and browser history passed on the Vexy page without a declared next page.
Seventeen entries were console-clean; fldoc and Gordon retained the documented
Tooltipster errors while passing every shortcut assertion. The strict overall
matrix therefore reports those two entries as failures, not clean passes.
Ornotto also passed its complete live editorial/responsive check with no page
errors. Reports and screenshots: `/tmp/ornotto-theme-qa/keyboard-live.json`,
`live-assets.json`, and `live-report.json` in the same directory.
