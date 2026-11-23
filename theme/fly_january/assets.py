"""Built-asset helpers: cache-busting queries and the MaterialX rem rescale.

this_file: theme/fly_january/assets.py

Used by plugin.py: `version_links` at on_config, `theme_versions` for main.html's own
assets, `rescale_materialx` at on_post_build.
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path
from typing import Any

from mkdocs.exceptions import PluginError

THEME_DIR = Path(__file__).parent
THEME_ASSETS = ("fly.css", "fly-utilities.css", "fly.js", "fly-bridge.js", "fly-debug.js")
ASSET_VERSION_LEN = 10
# The theme sets the root to 90% (14.4px) so the 28.8px body line is 2rem. MaterialX is
# written in rem against its 125% (20px) root, so its built CSS is rescaled by 20/14.4 to
# keep every MaterialX size in px.
REM_SCALE = 20 / 14.4
# A quoted string (escapes allowed, so a data-URI holding ")" stays whole), an unquoted
# url(...), or a rem length (sign kept by leaving it outside; e-notation included). Only
# the last group is rewritten; strings and urls are text, never lengths.
REM = re.compile(
    r"\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|url\([^)'\"]*\)"
    r"|(?<![\w.])(?<![eE][+-])(\d*\.?\d+(?:[eE][+-]?\d+)?)rem\b"
)
# Last line of a rescaled stylesheet: a second run (serve rebuilds) leaves it alone. At the
# end, so MaterialX's leading @charset stays the first bytes of the file.
RESCALED = "\n/* fly: MaterialX rem rescaled by 20/14.4 */"
MATERIALX_CSS = ("assets/stylesheets/main.*.min.css", "assets/stylesheets/palette.*.min.css")


def asset_version(path: Path) -> str:
    """Short content hash for a cache-busting `?v=` query (the CDN caches for hours)."""
    return hashlib.sha256(path.read_bytes()).hexdigest()[:ASSET_VERSION_LEN]


def versioned(url: str, roots: list[Path]) -> str:
    """Append `?v=<hash>` to a local asset URL found under one of `roots`; leave others.

    Idempotent: an existing query is dropped and recomputed (serve re-runs on_config).
    """
    if "://" in url or url.startswith("//"):
        return url
    bare = url.split("?", 1)[0]
    for root in roots:
        if (root / bare).is_file():
            return f"{bare}?v={asset_version(root / bare)}"
    return url


def version_links(config: Any) -> None:
    """Version local extra_css / extra_javascript links in place."""
    roots = [Path(config.get("docs_dir") or "."), THEME_DIR]
    css = config.get("extra_css")
    if css is not None:
        css[:] = [versioned(u, roots) for u in css]
    scripts = config.get("extra_javascript") or []
    for i, item in enumerate(scripts):
        if isinstance(item, str):
            scripts[i] = versioned(item, roots)
        elif hasattr(item, "path"):
            item.path = versioned(item.path, roots)


def theme_versions() -> dict[str, str]:
    """`?v=` hashes for the theme's own assets/fly files, keyed by file name."""
    return {name: asset_version(THEME_DIR / "assets" / "fly" / name) for name in THEME_ASSETS}


def rescale_rem(css: str, scale: float = REM_SCALE) -> str:
    """Multiply every rem length in ``css`` by ``scale`` (sign and unit kept).

    Lengths inside calc() and other functions scale too; url() and quoted strings do not.
    """

    def repl(m: re.Match[str]) -> str:
        if m[1] is None:
            return m[0]
        text = f"{float(m[1]) * scale:.4f}".rstrip("0").rstrip(".")
        return (text[1:] if text.startswith("0.") else text) + "rem"

    return REM.sub(repl, css)


def rescale_materialx(site: Path) -> None:
    """Rescale MaterialX's stylesheets in the built site to the 14.4px root, once each."""
    files = [f for pattern in MATERIALX_CSS for f in site.glob(pattern)]
    if len(files) != len(MATERIALX_CSS):
        raise PluginError(f"fly: expected MaterialX main + palette CSS, found {files}")
    for f in files:
        css = f.read_text(encoding="utf-8")
        if not css.endswith(RESCALED):
            f.write_text(rescale_rem(css) + RESCALED, encoding="utf-8")
