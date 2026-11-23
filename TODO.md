---
this_file: TODO.md
---

# Open work — fly-january (issues/401.md)

Spec: SPEC.md. Plan: PLAN.md. One implementer per task; a separate reviewer per task.

## Theme implementer (this repo)
- [ ] T1 Theme package skeleton, entry points, strict fixture build
- [ ] T3 Port fltheme27 CSS/JS/templates into `src/fly/` layers; build into the package
- [ ] T4 `fly` plugin: config, fonts, presets, hue, chrome, rem rescale; port hook tests
- [ ] T5 Browser specs: grid, sizes, schemes, chrome, keyboard

## Design-token implementer (this repo)
- [ ] T2 `--fly-*` tokens: grid, sizes, roles, 12 hues, semantic map, MaterialX bridge; tests

## Site implementer (this repo)
- [ ] T6 `docs/fly/<version>/` CDN tree, demo site in `src_docs/`, Marketing content migrated

## Plugin implementer (github.vexyart, via Codex)
- [ ] T7 `vexy-mkdocs-page-import` (import-url, webflow-import-url, copy-file)
- [ ] T8 `vexy-python-markdown-*` extension(s) where SPEC §9 requires one
- [ ] T9 `fontlab-www-toolkit` on the plugin and fly assets

## Migration implementers
- [ ] T10 whats-new-fontlab-9 on fly-january with chapter hues; old/new screenshot parity
- [ ] T11 www.fontlab.com, www.vexy.art, blog.fontlab.com rebuilt and browser-checked
- [ ] T13a fontlab-scripting sites (16) + fontlabcom.github.io + getgo-fonts
- [ ] T13b vfj spec, photofont spec, writing styleguide, Marketing minisite
- [ ] T13c Vexy official: vexy-lines ×5
- [ ] T13d Vexy unofficial ×24 (no Vexy icon or name)
- [ ] T13e FontLab unofficial: betabooks ×2 (no FontLab logo); pycrdt not modified (vendored)

## Controller
- [ ] T12 Release: merge, tag, PyPI, GitHub repos, Pages, live verification
- [ ] T14 Docs in every touched repo, final review, evidence
- [ ] Owner go-ahead before live rsync deploys of www.fontlab.com and www.vexy.art
