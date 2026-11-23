#!/usr/bin/env bash
# this_file: build.sh
#
# Build everything GitHub Pages serves from docs/ (SPEC 7):
#   1. npm run build: dist/ (fltheme26), the theme assets and the CDN tree docs/fly/.
#   2. The demo site (src_docs/) with the pinned engine (dev group) and the site's plugins
#      (site group), strict, into a temporary directory.
#   3. Sync it into docs/, keeping docs/fly/ and docs/.nojekyll, then check every internal
#      link and asset reference under docs/.
set -euo pipefail
cd "$( dirname "${BASH_SOURCE[0]}" )"

npm run build
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
uv run --python 3.13 --locked --group site properdocs build -f src_docs/mkdocs.yml --strict -d "$tmp/site"
rsync -a --delete --exclude /fly/ --exclude /.nojekyll "$tmp/site/" docs/
node scripts/check-links.mjs docs
