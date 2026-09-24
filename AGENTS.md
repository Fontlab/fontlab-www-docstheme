---
this_file: AGENTS.md
---

# Shared theme maintenance

Read README.md, WORK.md and CHANGELOG.md before editing. Work directly; do not
delegate unless the current user asks for it. Preserve unrelated worktree edits.

## Source and publication boundaries

- `src/theme.css`, `src/harmony-forms.css`, `src/harmony-display.css`: shared CSS.
- `src/navigation.js`: FontLab/Vexy controls bridge to native MaterialX panels.
- `src/keyboard.js`: reading shortcuts; preserve input/widget/dialog guards.
- `src/theme.js` and `src/register.js`: palette and component initialization.
- `src/editorial/`, `src/chrome/`: existing branded styles, not a replacement theme.
- `examples/`: public landing page, authoring guide and downloadable starter.
- `fixtures/materialx/`: native MaterialX compatibility fixture.
- `scripts/build.mjs`: produces scoped assets, guide, starter archive and manifest.
- `dist/` and sibling `img/docs/fltheme26/`: generated output; never fix them alone.
- FontLab global menu source: sibling `img/docs/menu/fontlab.js`.
- Vexy global menu source: sibling `i.vexy.art/docs/menu/vexy.js`.

Keep Basecoat unprefixed only inside `.fltheme-components`; daisyUI component
classes must be `du-` prefixed. Do not apply Tailwind Preflight globally. Build
the three shared CSS files together to preserve cascade-layer precedence.

## Behavior to preserve

MaterialX documentation defaults to local menu/search, one control each in the
global bar. The drawer is on the right and its theme picker is at the bottom.
Global branding scrolls away below 76.25em; compact controls dock when local
ownership is active. `mobile-search` controls desktop search too. Main FontLab
and Vexy hybrid websites explicitly retain global menu and search ownership.

Keep native MaterialX markup and search indexes. Do not add duplicate controls.
Right and Alt+Right go next; Alt+Left goes previous in navigation; Left goes
back in browser history. Interactive controls and selected text are exempt.
Standard button metrics match across the three libraries; size/shape variants
remain available. Reading-end spacing belongs only to
`article.md-typeset > p:last-of-type`, not `.md-content`.

## Required verification

Run `npm run build`, `npm test`, and browser tests relevant to the change. For
shared CSS/runtime changes run the complete `npm run test:browser` suite. Check
desktop/mobile, light/dark, keyboard focus, menus/search and host-style isolation.
Keep screenshots/logs outside source unless an explicit deliverable requires them.
Browser tests fetch built `dist/`; do not rebuild it while tests are running.

When editing setup instructions, extract `dist/starter.zip` into a fresh directory,
install its pinned requirements and run `uv run properdocs build -f mkdocs.yml --strict` there.
Verify its menu, search, keyboard navigation and components in a browser. Keep
copyable YAML/template snippets in the guide identical to the starter sources.

`npm run deploy` stages and verifies files; it does not publish. Commit/push the
CDN repository, wait for its Pages run, purge only changed CDN URLs when needed,
then compare public bytes with the manifest and verify rendered behavior live.
Use a clean publication worktree if the CDN checkout contains unrelated edits.
The `1.0.0/` path receives compatible fixes in place; do not call it immutable.

Update README.md, CHANGELOG.md and WORK.md when contracts change. Update the
relevant consumer's integration notes for site-specific configuration changes.
`consumers.json` and dated review records describe deployment scope; historical
evidence is not a substitute for checking the current published state.
