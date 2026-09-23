---
this_file: PLAN.md
---

# FontLab theme 2026

Implement task422.md: a shared MaterialX customization, Basecoat and prefixed
daisyUI assets published at https://i.fontlab.com/fltheme26/, adopted by all
active documentation sites and hybrid Webflow builds, including the legacy
Extend FontLab and GetGo Fonts sites. Build, commit, push, deploy and verify live.

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

## Ordered implementation

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
