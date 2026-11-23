---
this_file: PLAN.md
---

# fly-january implementation plan

Spec: `SPEC.md` (binding). Brief: `issues/401.md`. Earlier initiatives (task422, issues
212/213, documentation publication) are complete and recorded in `CHANGELOG.md` and `review/`.

## Global Constraints

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
- Never discard owner edits in any repo. Tasks 1–11 do not push, publish or deploy; release
  is Task 12, and Task 13 pushes each site only after it.
- Before Task 12, other repos install the theme and plugins from local paths (editable
  installs); after it they pin the published versions.
- Order: 1 → 2 → 3 → 4 → 5 → 6; 7 in parallel; 8 after 4; 9 after 7; 10 after 5; 11 after 9
  and 10; 12 after all of these; 13 then 14.
- Gates for this repo: `npm run build`, `npm test`, `uv run --python 3.13 pytest`, and
  `node scripts/verify-fly.mjs` (agent-browser) for fly CSS/JS changes. Do not launch
  Playwright's headless Chromium in this initiative; it crashes on the owner's machine.

## Task 1: Theme package skeleton

Create `pyproject.toml` (project `fly-january`, hatch-vcs, entry points per SPEC §3) and
`theme/fly_january/` with `__init__.py`, `mkdocs_theme.yml` (`extends: materialx`),
`main.html` extending `base.html`, and an empty `FlyPlugin` in `plugin.py`.
Add `fixtures/fly/` (mkdocs.yml with `theme.name: fly-january`, `plugins: [fly]`, three
pages) and `tests/py/test_theme_package.py` proving: the theme is discoverable through the `mkdocs.themes` entry point (which ProperDocs reads), the fixture builds with `properdocs build --strict`, the output contains
MaterialX's markup (inheritance works) and a marker emitted by the child `main.html`.
Verify: `uv run --python 3.13 pytest tests/py -q`.

## Task 2: Token system

Create `src/fly/tokens/` (`grid.css`, `size.css`, `type.css`, `color.css`, `semantic.css`,
`materialx.css`) implementing SPEC §4 in layer `fly.tokens`, for light and dark schemes.
Design the twelve hues in OKLCH (lead, soft, deep, tint) after studying current palette
references and the mood image named in SPEC §4.4; record the sources and the reasoning in
`DESIGN-TOKENS.md`, together with the heading-size table of SPEC §4.2 (study
`Marketing/src/gav0zux/site/newspaper/state.mjs`, `site/shared/spacing.mjs` and
`Marketing/src/fontlab-9-zvx/**/fontlab-page/style.css` for the sizing techniques).
Add `tests/fly-tokens.test.mjs`: every documented token exists; contrast and hue-spacing
thresholds from SPEC §4.4 hold; no `fl27`; role variables exist for every role × property.
Verify: `npm test`.

## Task 3: Port layout, components and scripts

Port `Marketing/src/whats-new-fontlab-9/fltheme27` (working-tree state) into `src/fly/`:
split `fltheme27.css` and `fltheme27-bridge.css` into the layers and files of SPEC §6,
replace every literal with tokens from Task 2, rename all `fl27` identifiers, and remove
patches the layer order makes unnecessary. Port the three scripts to `src/fly/js/`.
Port `main.html` and `partials/` into `theme/fly_january/`. Extend `scripts/build.mjs` to
build `theme/fly_january/assets/fly/` (`fly.css`, `fly-tokens.css`, `fly-utilities.css`,
`fly.js`, `fly-bridge.js`, `fly-debug.js`); the utilities file is the prebuilt Tailwind
subset the old theme compiled per build. Keep the fltheme26 build intact.
Verify: `npm run build`, `npm test`, fixture build from Task 1 still strict-clean.

## Task 4: The fly plugin

Implement `FlyPlugin` per SPEC §5: validated `extra.fly` config, font sources and roles,
presets, page frontmatter with precedence, `subtheme` alias, hue attribute, chrome selection
(templates render the chosen bars), body classes, cache-busting, and the MaterialX rem
rescale. Port the behaviour and tests of `fltheme27/hooks.py` / `test_hooks.py`; functions
that qualify under SPEC §9 are listed in `WORK.md` for Task 8 and stay in the plugin until
then. Verify: `uv run --python 3.13 pytest tests/py -q`.

## Task 5: Browser verification of grid, sizes and chrome

Browser tool: `agent-browser` (own named session), not Playwright — headless Chromium via
Playwright crashes on the owner's machine. Add `scripts/verify-fly.mjs`, a Node script that
serves the built fixture and drives `agent-browser` (`open`, `set viewport`, `eval`,
`screenshot`) to assert, against the built fixture: baseline grid, three text sizes, heading
sizes at 390/1024/1440/1920, light/dark token bridging, the three chrome variants, keyboard
paging, preset fonts on a page, no page errors. Fix what they find.
Verify: `node scripts/verify-fly.mjs` exits 0 and prints one line per assertion.

## Task 6: CDN tree and demo site

Extend the build to emit `docs/fly/<version>/`, `docs/fly/latest/` and `manifest.json`
(SPEC §7). Create `src_docs/` (mkdocs.yml on `fly-january`, `md/`): token reference with live
palette and type specimens, configuration reference, and the content migrated from
`Marketing/src_docs` (pages, `includes/`, `nav.yml`, specimen hook as a local plugin or hook
module under `src_docs/`, authored assets). Brand-asset binaries are linked, not copied.
`./build.sh` builds everything into `docs/`. Verify: strict build, link check over `docs/`,
screenshots of five representative pages.

## Task 7: vexy-mkdocs-page-import

Create `/Users/adam/Developer/vcs3/github.vexyart/vexy-mkdocs-page-import` per SPEC §8 with
tests for the three keys, the two-key error, cache hit, offline miss, retry limit, Webflow
post-processing (ported from `fontlab-www-toolkit` `process_page_html` and its tests), and
a fixture site build. Verify: `uv run pytest`, `uvx ruff check`.

## Task 8: Markdown extensions

For each function Task 4 listed, create the `vexy-python-markdown-*` package (house
conventions as Task 7), move the function and its tests there, and make `fly-january`
depend on it. If the list is empty, record that in `WORK.md` and close the task.

## Task 9: Toolkit

Update `fontlab-www-toolkit` per SPEC §10 in a branch; its test suite passes; build
www.fontlab.com with `--skip_webflow` against it as a smoke test.

## Task 10: whats-new-fontlab-9

In a Marketing worktree seeded with the working-tree state: copy the current output to
`docs/whats-new-fontlab-9-ref/` for reference (not published), switch the site to
`fly-january`, convert `extra.fltheme27` subthemes to `extra.fly.presets`, assign hues per
SPEC §11, delete `fltheme27/` once parity holds. Compare screenshots old/new for all 16
pages at 1440 and 390, light and dark; iterate until nothing breaks.

## Task 11: Main sites

www.fontlab.com, www.vexy.art, blog.fontlab.com: adopt the theme, plugin and (first two)
page-import; rebuild locally; verify menu, search, footer, imported pages and typography in a
browser at desktop and phone widths.

## Task 12: Release

Review branch, merge, tag, publish `fly-january`, `vexy-mkdocs-page-import` (and Task 8
packages) to PyPI, create the GitHub repos, push, verify Pages and live manifest hashes.

## Task 13: Rollout

Adopt the theme in the remaining listed sites in batches (fontlab-scripting; other FontLab
official; Vexy official; Vexy unofficial; FontLab unofficial), each in a clean worktree when
dirty: edit config, strict build, screenshot the home page, update that repo's
README/CHANGELOG/AGENTS, commit, push.

## Task 14: Close-out

Update PLAN/TODO/CHANGELOG/README/AGENTS in every touched repo, run the final whole-branch
review, and record evidence.

## Task 15: Default design (issue 502)

Source: /Users/adam/Developer/vcs3/PLAN/502.md. Change the theme's default design: body
sans/serif pair, side-navigation font and h3/h4 (and lower) styles taken from
Marketing.fly/src/whats-new-fontlab-9; H1 Polymath, weight 900, letter-spacing -0.01em; H2
Polymath, weight 500, letter-spacing 0. Update DESIGN-TOKENS, tests and verify-fly; release a
new minor version (CDN + PyPI) and rebuild every site that uses fly-january.

## Task 16: Fold the .fly worktrees back (issue 502)

For every repo with a `<repo>.fly` worktree: integrate branch fly-january and all its
changes and additions into the original repo folder (preserving uncommitted owner edits),
then remove the .fly worktree (`git worktree remove`) and the branch once merged.
