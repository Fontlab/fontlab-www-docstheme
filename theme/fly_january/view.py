"""What the templates and the post-page rewrite need for a page (or a static template).

this_file: theme/fly_january/view.py

`view` builds the `fly` template variable: font head, hue, chrome with its element
attributes, the utilities switch, asset versions and debug data. `page_classes` and
`body_attributes` give the classes and attributes on_post_page adds. Used by plugin.py.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from typing import Any

from .config import SIDES, Look, PageConfig, SiteConfig, fail
from .fonts import Head, head, resolve
from .markup import class_names, frontmatter_classes

BRANDS = {
    "fontlab": ("https://i.fontlab.com/menu/fontlab.js", "fontlab-menu", "fontlab-footer"),
    "vexy": ("https://i.vexy.art/menu/vexy.js", "vexy-menu", "vexy-footer"),
}
MARGIN_CLASSES = ("fly-margin-left", "fly-margin-right")


@dataclass(frozen=True)
class ChromeView:
    """The global bars to render; all None for `chrome: none`."""

    kind: str
    script: str | None = None
    header: str | None = None
    footer: str | None = None
    header_attrs: dict[str, str] = field(default_factory=dict)
    footer_attrs: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class View:
    """The `fly` template variable."""

    head: Head
    hue: str | None
    preset: str | None
    chrome: ChromeView
    utilities: bool
    v: dict[str, str]
    debug: str | None


def chrome_view(site: SiteConfig, config: Any) -> ChromeView:
    """Script, tags and attributes for the chosen chrome (menu attributes from chrome_options)."""
    chrome = site.chrome
    if chrome.kind == "none":
        return ChromeView("none")
    script, header, footer = BRANDS.get(chrome.kind) or (
        chrome.script,
        chrome.header,
        chrome.footer,
    )
    header_attrs = {
        "mode": "dark",  # the bars are dark in both colour schemes
        "site-label": config.get("site_name") or "",
        "site-url": config.get("site_url") or "",
        "mobile-menu": "materialx",
        "mobile-search": "materialx",
    } | site.chrome_options
    if site.sticky:
        header_attrs["sticky"] = ""  # the menu components pin themselves on [sticky]
    return ChromeView(chrome.kind, script, header, footer, header_attrs, {"mode": "dark"})


def preset_look(site: SiteConfig, page: PageConfig | None) -> Look:
    """The resolved look of a page (site defaults when there is no page)."""
    page = page or PageConfig()
    preset = site.presets.get(page.preset) if page.preset else None
    return resolve(site.look, preset, page.look)


def look_data(look: Look) -> dict[str, Any]:
    """A resolved look as the debug switcher reads it."""
    return {**asdict(head(look)), "hue": look.hue or ""}


def debug_data(site: SiteConfig, page: PageConfig | None, own: Look) -> str:
    """JSON for #fly-debug-data, safe inside a <script> element."""
    presets = [[name, look_data(resolve(site.look, p, Look()))] for name, p in site.presets.items()]
    data = {
        "page": (page.preset if page else None) or "",
        "own": look_data(own),
        "presets": presets,
    }
    return json.dumps(data).replace("<", "\\u003c")


def view(site: SiteConfig, page: PageConfig | None, config: Any, versions: dict[str, str]) -> View:
    """The `fly` template variable for one page, or for static templates (page None)."""
    look = preset_look(site, page)
    return View(
        head=head(look),
        hue=look.hue,
        preset=page.preset if page else None,
        chrome=chrome_view(site, config),
        utilities=site.utilities,
        v=versions,
        debug=debug_data(site, page, look) if site.debug else None,
    )


def page_classes(
    meta: dict[str, Any], site: SiteConfig, page: PageConfig | None
) -> dict[str, list[str]]:
    """Map tag name to the classes this page adds to it."""
    classes = frontmatter_classes(meta.get("classes"))
    body = classes.setdefault("body", [])
    if "toc" in (meta.get("hide") or ()):  # MaterialX `hide: [toc]` removes L2
        body.append("fly-no-l2")
    if page and page.preset:
        body += class_names(f"subtheme-{page.preset}")
    side = meta.get("margin_side") or site.margin_side
    if side not in SIDES:
        raise fail("margin_side", f"must be left or right, not {side!r}")
    if not any(name in MARGIN_CLASSES for name in body):
        body.append(f"fly-margin-{side}")
    body.append(f"fly-chrome-{site.chrome.kind}")
    if site.sticky:
        body.append("fly-sticky")
    return classes


def h1_mode(site: SiteConfig, page: PageConfig | None) -> str:
    """`accent` when the page's H1 takes the hue's text colour, else `ink`.

    A page's own `h1` wins; then a hue that comes from the page (its front matter or its
    preset); then the site's `h1`. A site-wide hue alone leaves titles ink.
    """
    if page is None:
        return site.h1
    if page.h1:
        return page.h1
    preset = site.presets.get(page.preset) if page.preset else None
    if page.look.hue or (preset and preset.hue):
        return "accent"
    return site.h1


def body_attributes(
    look_hue: str | None, h1: str = "ink", links: str = "inherit"
) -> dict[str, dict[str, str]]:
    """data-fly-hue, and data-fly-h1 / data-fly-links when they are `accent`, on <body>."""
    attrs = {}
    if look_hue:
        attrs["data-fly-hue"] = look_hue
    if h1 == "accent":
        attrs["data-fly-h1"] = "accent"
    if links == "accent":
        attrs["data-fly-links"] = "accent"
    return {"body": attrs} if attrs else {}
