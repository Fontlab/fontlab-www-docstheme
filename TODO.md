---
this_file: TODO.md
---

# Work — fly-january (issues/401.md)

Spec: SPEC.md. Plan: PLAN.md. One implementer per task; a separate reviewer per task.
Order: T1 → T2 → T3 → T4 → T5 → T6; T7 in parallel; T8 after T4; T9 after T7; T10 after T5;
T11 after T9 and T10; T12; T13; T14.

## Theme implementer (this repo)
- [x] T1 Theme package skeleton, entry points, strict fixture build
- [x] T3 Port fltheme27 CSS/JS/templates into `src/fly/` layers; build into the package
- [x] T4 `fly` plugin: config, fonts, presets, hue, chrome, rem rescale; port hook tests
- [x] T5 Browser specs: grid, sizes, schemes, chrome, keyboard

## Design-token implementer (this repo)
- [x] T2 `--fly-*` tokens: grid, sizes, roles, 12 hues, semantic map, MaterialX bridge; tests

## Site implementer (this repo)
- [x] T6 `docs/fly/<version>/` CDN tree, demo site in `src_docs/`, Marketing content migrated

## Plugin implementer (github.vexyart, via Codex)
- [ ] T7 `vexy-mkdocs-page-import` (import-url, webflow-import-url, copy-file)
- [ ] T8 `vexy-python-markdown-*` extension(s) where SPEC §9 requires one
- [ ] T9 `fontlab-www-toolkit` on the plugin and fly assets

## Migration implementers
- [x] T10 whats-new-fontlab-9 on fly-january with chapter hues; old/new screenshot parity
- [x] T11 www.fontlab.com, www.vexy.art, blog.fontlab.com rebuilt and browser-checked
- [ ] T13a fontlab-scripting sites (16) + fontlabcom.github.io + getgo-fonts
- [ ] T13b vfj spec, photofont spec, writing styleguide, Marketing minisite
- [ ] T13c Vexy official: vexy-lines ×5
- [ ] T13d Vexy unofficial ×24 (no Vexy icon or name)
- [ ] T13e FontLab unofficial: betabooks ×2 (no FontLab logo); pycrdt not modified (vendored)

## Controller
- [ ] T12 Release: merge, tag, PyPI, GitHub repos, Pages, live verification
- [ ] T14 Docs in every touched repo, final review, evidence
- [ ] Owner go-ahead before live rsync deploys of www.fontlab.com and www.vexy.art
- [ ] Task 15: default design per issue 502 (whats-new fonts; H1 Polymath 900 -0.01em; H2 Polymath 500 0); release; rebuild all fly sites
- [ ] Task 16: integrate every .fly worktree into its original repo folder, then remove the .fly folders
