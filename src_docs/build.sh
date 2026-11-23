#!/usr/bin/env bash
# this_file: src_docs/build.sh
#
# Build or serve the demo site with the pinned toolchain in tooling/python.
#   ./build.sh                       build into ../docs (strict)
#   ./build.sh build [SITE_DIR]      build into SITE_DIR instead
#   ./build.sh serve                 local preview
set -euo pipefail
cd "$( dirname "${BASH_SOURCE[0]}" )"

run() { uv run --project tooling/python --locked properdocs "$@"; }

case "${1:-build}" in
  build) if [ -n "${2:-}" ]; then run build -f mkdocs.yml --strict -d "$2"; else run build -f mkdocs.yml --strict; fi ;;
  serve) run serve -f mkdocs.yml ;;
  *) echo "Usage: $0 {build [SITE_DIR]|serve}" >&2; exit 1 ;;
esac
