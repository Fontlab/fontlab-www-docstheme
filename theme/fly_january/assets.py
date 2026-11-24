"""Built-asset helpers: cache-busting queries and the MaterialX rem rescale.

this_file: theme/fly_january/assets.py

Used by plugin.py: `version_links` at on_config, `theme_versions` for main.html's own
assets, `rescale_materialx` at on_post_build.
"""

from __future__ import annotations

import hashlib
import logging
import re
from pathlib import Path
from typing import Any

from mkdocs.exceptions import PluginError
from mkdocs.utils import get_theme_dir

THEME_DIR = Path(__file__).parent
THEME_ASSETS = ("fly.css", "fly-utilities.css", "fly.js", "fly-bridge.js", "fly-debug.js")
CDN_ASSETS = (*THEME_ASSETS, "fly-tokens.css", "components.css", "basecoat.js")
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
STYLESHEETS = Path("assets/stylesheets")
log = logging.getLogger(__name__)


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


def version_links(config: Any, assets_url: str | None = None) -> None:
    """Version local extra_css / extra_javascript links in place."""
    roots = [Path(config.get("docs_dir") or "."), THEME_DIR]

    def link(url: str) -> str:
        prefix = "assets/fly/"
        if assets_url and url.startswith(prefix):
            name = url.removeprefix(prefix).split("?", 1)[0]
            if name in CDN_ASSETS:
                return assets_url + name
            if not (roots[0] / prefix / name).is_file():
                log.warning("Remote Fly CDN does not include %s; keeping its local URL", url)
        return versioned(url, roots)

    css = config.get("extra_css")
    if css is not None:
        css[:] = [link(u) for u in css]
    scripts = config.get("extra_javascript") or []
    for i, item in enumerate(scripts):
        if isinstance(item, str):
            scripts[i] = link(item)
        elif hasattr(item, "path"):
            item.path = link(item.path)


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
    source = Path(get_theme_dir("materialx")) / STYLESHEETS
    shipped = {path.relative_to(source) for path in source.rglob("*.css")}
    target = site / STYLESHEETS
    built = {path.relative_to(target) for path in target.rglob("*.css")}
    for path in sorted(built - shipped):
        log.warning("fly: leaving third-party stylesheet %s unscaled", STYLESHEETS / path)
    materialx = shipped & built
    if not materialx:
        raise PluginError(f"fly: no installed MaterialX stylesheets found in {target}")
    for path in sorted(materialx):
        stylesheet = target / path
        css = stylesheet.read_text(encoding="utf-8")
        if not css.endswith(RESCALED):
            stylesheet.write_text(rescale_rem(css) + RESCALED, encoding="utf-8")
