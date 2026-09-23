---
this_file: WORK.md
---

# Work

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
