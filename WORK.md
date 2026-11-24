---
this_file: WORK.md
---

# Work

## 0.3.0 release-gate review, round 4

Buttons can grow when labels wrap. Native admonitions and disclosures use the
body or margin-aside size. Prose styling permits ordinary site overrides, and
the CSS test checks every selector branch that uses `!important`. The field
guide has browser assertions for the Basecoat menu, popover, toast and pagination
faces. The destructive colour pair passes the contrast unit test in both schemes.

The build and 61 Node tests exited 0. Frozen Python tests passed 235/235 with
`UV_OFFLINE=1` using cached build dependencies. The strict demo build checked
8,719 internal links on 86 pages with zero broken. Outside the sandbox,
`npm run verify:fly` (agent-browser) exited 0 with all assertions ok, including
`compare.buttons.labels-fit@390` and the four field-guide control-face checks.
A separate scoped re-review approved all eleven items.

## 2026-11-24 housekeeping

0.3.0 remains unreleased. The original release and local rollout receipts are summarised in CHANGELOG.md. PLAN.md tracks delivery, outstanding strict rebuilds, the two live rsync holds and worktree integration. The next release tag triggers PyPI Trusted Publishing once the owner configures the publisher.

Housekeeping checks passed: actionlint, 61 Node tests, 235 Python tests and `git diff --check`. The Python package-build test needed the writable worktree uv cache. No hosted publish run was attempted.
