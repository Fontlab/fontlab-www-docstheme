---
this_file: PLAN.md
---

# FontLab theme 2026

## Publication and documentation follow-up

Completed 2026-09-24. The public guide and starter, all 19 repositories, live
verification and pre-existing limitations are recorded in
`review/documentation-publication.json`.

Audit the current remote heads and task-owned changes in all 19 affected repositories.
Document their individual configuration, source/output boundaries, build and publish
routes, mobile control ownership, search, keyboard navigation and shared components.
Preserve unrelated edits by publishing from clean worktrees when necessary.

Expand `examples/index.html` with complete copyable setup, MaterialX template
integration, static/hybrid setup, component authoring, optional editorial styles,
theme/keyboard behavior, troubleshooting and release instructions. Keep the existing
interactive examples and add a downloadable setup fixture proven by a clean build.
Verify documentation links and code examples, desktop/mobile rendering and keyboard
interactions. Publish the source, CDN and consumer documentation, then inspect public
assets and remote commits before completing the follow-up.

Implement task422.md: a shared MaterialX customization, Basecoat and prefixed
daisyUI assets published at https://i.fontlab.com/fltheme26/, adopted by all
active documentation sites and hybrid Webflow builds, including the legacy
Extend FontLab and GetGo Fonts sites. Build, commit, push, deploy and verify live.

Completed 2026-09-23. All implementation and release acceptance gates passed.
See CHANGELOG.md and review/ for the completion record.

Issue 213 component harmony was published and accepted on 2026-09-24. All 37
requirements and the five-theme desktop/mobile checks are recorded in
`review/issue213.md` and `review/issue213-delivery.json`; no rollout work remains.

## Architecture

Retain MaterialX as the rendering engine and preserve each site's menus, fonts,
navigation, content, URLs, search, footer and specialized behavior. Centralize
shared browser assets in this repository. Publish reproducible, versioned
assets to `../img/docs/fltheme26/`. Consumer configuration loads those assets;
hybrid builds must also include them after Webflow/static overlays.

Basecoat uses its documented component classes. daisyUI uses `du-` classes.
Keep component styling inside an explicit `.fltheme-components` boundary and
avoid global Tailwind Preflight resets. Bridge light/dark tokens to MaterialX
without overriding existing brand typography. Pin dependencies and retain
redistributed license notices. Document authored markup and runtime lifecycle.

## Completed implementation

1. Inventory all authored configs, customizations, build commands, deployment
   destinations and existing dirty files. Read both supplied Basecoat/daisyUI
   studies and verify APIs against current upstream documentation and source.
2. Establish a reproducible theme build, shared customization assets, a component
   specimen and tests for isolation, prefixing, runtime and deterministic output.
3. Update Vexy Play's shared menu destination to https://playlines.vexy.art.
4. Migrate every active consumer (including separate web-fontlab source copies),
   with explicit per-config evidence. Modernize Extend/GetGo sources and build
   tooling without losing their downloadable assets or public URLs.
5. Integrate hybrid Webflow final output and server-side toolkit copies. Verify
   full builds and preserve unrelated user edits when committing task changes.
6. Inspect desktop/mobile, light/dark, search, navigation, Basecoat interactions
   and daisyUI components in a real browser. Compare retained design references
   with rendered screenshots and record concrete findings.
7. Run the independently requested agent review, record its 0–100 score, repair
   findings and repeat until above 94. Complete cleanup and direct verification.
8. Commit and push task changes, publish CDN assets first, deploy every consumer,
   and verify live asset hashes, menu destination and representative pages for
   every published site. Record exact commits and live evidence.

## Acceptance

Tests prove the behavior they claim, generated assets reproduce from the lockfile,
and browsers show working controls with no unrelated style damage. Inventory
rows remain open until built and live-verified. Pending work stays in TODO.md;
completed work moves to CHANGELOG.md. A local build or review score alone does
not satisfy the deployment requirement.
