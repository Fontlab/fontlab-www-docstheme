---
this_file: PLAN.md
---

# fly-january implementation plan

The owner brief is in `issues/401.md`. `SPEC.md` governs the theme and `DESIGN-TOKENS.md` records its design rationale.

## Maintenance constraints

- Never discard owner edits in any repo; consumer sites pin published theme versions only after release.

- CSS custom properties use the prefix `--fly-`. The strings `fl27` and `fltheme27` must not
  appear in any new source file, class name, data attribute or storage key.
- `1rem` = half a baseline line; body line-height is `2rem`; flowing text uses exactly three
  sizes (`xs`, `sm`, `md`). See SPEC §4.
- The theme is the package `fly-january`, `extends: materialx`, consumed as
  `theme.name: fly-january` + `plugins: [fly]`. No hooks file and no Node at site build time.
- Engine pins for builds and tests: properdocs==1.6.7, mkdocs==1.6.1,
  mkdocs-materialx==10.1.8, pymdown-extensions==11.0.1, Python 3.13 via `uv`.
- Python packages: hatchling + hatch-vcs, version file `__version__.py` git-ignored,
  `requires-python >=3.12`, ruff line length 100, pytest.
- Every source file carries a `this_file:` record.
- `docs/` in this repo is build output; never hand-edit it. `dist/` and
  `../img/docs/fltheme26` (the fltheme26 bundle) must keep building (`npm run build`) and
  passing `npm test`. The legacy browser suite (`npm run test:browser`, `tests/browser/*.spec.mjs`,
  `playwright test`, `npx playwright`) is Playwright and is NOT run in this initiative; prove the
  legacy bundle unchanged with `git diff origin/main -- dist` instead.
- Gates for this repo: `npm run build`, `npm test`, `uv run --python 3.13 pytest`, and
  `node scripts/verify-fly.mjs` (agent-browser) for fly CSS/JS changes. Do not launch
  Playwright's headless Chromium in this initiative; it crashes on the owner's machine.

## Remaining work

**T13a / T15. Finish the 0.2.1 consumer rebuild checks.** Compare the 16 scripting sites, fontlabcom.github.io and getgo-fonts with their final merge receipts. GrabLab, Python Pens, Python Examples, ScriptMix and RemoPy report blocked rebuilds against recorded asset inventories. Confirm approved inventory handling before rerunning the strict builds and docs tests.

**T13a–e. Verify delivery of all five rollout batches.** Use the site list in issues/401.md and the per-site strict-build and screenshot receipts. Check each accepted commit against the remote and published site. Include the VFJ and PHF specs, styleguide, Marketing minisite, five Vexy Lines sites, 24 unofficial Vexy sites and both betabooks. Preserve unofficial branding and exclude vendored pycrdt. For vexy-print, check the pre-existing build-script deletions before delivery and verify the layout with the consent overlay dismissed.

**T15. Verify the public CDN for the default-design release.** The 0.2.1 PyPI upload and local tag are recorded. Check that the release tag is on the remote, Pages succeeded and public versioned assets match the manifest.

**Deployment. Obtain owner approval for the two live rsync deployments.** Check the production targets for www.fontlab.com and www.vexy.art before the approved sync and verify both live sites afterwards.

**T14. Close out the rollout documentation and final review.** Check README, AGENTS, CHANGELOG and planning notes in each touched repo against the accepted result. Record final review and delivery evidence. The owner reverted the blog to its old design (8da9d51).

**T16. Fold verified .fly worktrees into their primary checkouts.** Reconcile upstream first, then fast-forward and verify the primary checkout before removing the worktree and merged branch. Leave refused fast-forwards and dirty overlaps in place. The recorded holds include Marketing and the reverted blog.
