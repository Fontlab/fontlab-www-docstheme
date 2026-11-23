"""Font sources, role variables and the per-page look (SPEC 5).

this_file: theme/fly_january/fonts.py

`resolve` applies the precedence page fonts/hue > page preset > site; `head` turns the
result into what main.html emits in <head>: preconnects, one stylesheet link per distinct
source and one :root rule of --fly-<role>-<prop> variables. Used by plugin.py.
"""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urlsplit

from .config import ROLE_PROPS, Look, Roles

TYPEKIT_CSS = "https://use.typekit.net/{}.css"
GOOGLE_CSS = "https://fonts.googleapis.com/css2?family={}&display=swap"
TYPEKIT_ORIGIN = "https://use.typekit.net"
TYPEKIT_CSS_ORIGIN = "https://p.typekit.net"
# main.html always preconnects to these (the Material Symbols icon font).
TEMPLATE_ORIGINS = ("https://fonts.googleapis.com", "https://fonts.gstatic.com")


@dataclass(frozen=True)
class Head:
    """What the templates emit for one page's fonts."""

    preconnects: tuple[str, ...]
    links: tuple[str, ...]
    style: str


def source_url(source: str) -> str:
    """typekit:<id> and google:<spec> to their stylesheet URLs; https URLs as they are."""
    kind, _, rest = source.partition(":")
    if kind == "typekit":
        return TYPEKIT_CSS.format(rest)
    if kind == "google":
        return GOOGLE_CSS.format(rest)
    return source


def merge_roles(*levels: Roles) -> Roles:
    """Merge role mappings property by property; later levels win."""
    merged: Roles = {}
    for roles in levels:
        for role, props in roles.items():
            merged[role] = merged.get(role, {}) | props
    return merged


def resolve(site: Look, preset: Look | None, page: Look) -> Look:
    """The page's look: sources accumulate (deduplicated), roles merge, hue overrides."""
    levels = [site, *([preset] if preset else []), page]
    sources = tuple(dict.fromkeys(s for level in levels for s in level.sources))
    hue = next((level.hue for level in reversed(levels) if level.hue), None)
    return Look(sources, merge_roles(*(level.roles for level in levels)), hue)


def roles_css(roles: Roles) -> str:
    """One :root rule setting the role variables, in role and property order ('' if none)."""
    decls = [
        f"--fly-{role}-{prop}: {roles[role][prop]};"
        for role, props in ROLE_PROPS.items()
        if role in roles
        for prop in props
        if prop in roles[role]
    ]
    return f":root {{ {' '.join(decls)} }}" if decls else ""


def origin(url: str) -> str:
    """scheme://host of a URL."""
    parts = urlsplit(url)
    return f"{parts.scheme}://{parts.netloc}"


def head(look: Look) -> Head:
    """Preconnects, stylesheet links and the role style for a resolved look."""
    links = tuple(dict.fromkeys(source_url(s) for s in look.sources))
    origins = dict.fromkeys(origin(u) for u in links)
    if TYPEKIT_ORIGIN in origins:
        origins.setdefault(TYPEKIT_CSS_ORIGIN)  # every kit @imports its stylesheet from here
    preconnects = tuple(o for o in origins if o not in TEMPLATE_ORIGINS)
    return Head(preconnects, links, roles_css(look.roles))
