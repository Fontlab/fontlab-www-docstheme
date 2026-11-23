"""Typed `extra.fly` site configuration and `fly:` page frontmatter (SPEC 5).

this_file: theme/fly_january/config.py

`parse_site` and `parse_page` turn raw YAML into frozen dataclasses at the plugin boundary;
any unknown key, unknown name or malformed value raises `PluginError` naming its path.
Used by plugin.py (on_config, on_page_context).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Literal

from mkdocs.exceptions import PluginError

HUES = (
    "cherry",
    "tangerine",
    "amber",
    "lime",
    "emerald",
    "teal",
    "sky",
    "cobalt",
    "indigo",
    "violet",
    "magenta",
    "rose",
    "gray",
)
BLOCK_ROLES = (
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "body",
    "lead",
    "nav",
    "table",
    "caption",
    "code",
)
BLOCK_PROPS = (
    "family",
    "weight",
    "stretch",
    "features",
    "variation",
    "size",
    "leading",
    "tracking",
    "scale",
)
INLINE_ROLES = ("em", "strong", "mono")
INLINE_PROPS = ("family", "weight", "adjust")
ROLE_PROPS = {r: BLOCK_PROPS for r in BLOCK_ROLES} | {r: INLINE_PROPS for r in INLINE_ROLES}
SIDES = ("left", "right")
NAMED_CHROMES = ("fontlab", "vexy", "none")
CHROME_OPTIONS = ("site-label", "mobile-menu", "mobile-search", "search-from")
SITE_KEYS = (
    "chrome",
    "chrome_options",
    "hue",
    "fonts",
    "presets",
    "margin_side",
    "utilities",
    "debug",
)
PAGE_KEYS = ("preset", "hue", "fonts")
TYPEKIT = re.compile(r"typekit:([a-z0-9]+)")
# One css2 family spec, or several joined by "&family=" (one stylesheet for many families).
GOOGLE = re.compile(r"google:([A-Za-z0-9+:@.,;_-]+(?:&family=[A-Za-z0-9+:@.,;_-]+)*)")
HTTPS = re.compile(r"https://[^\s\"'<>]+")
CSS_VALUE = re.compile(r"[^<>{};\\\n\r]+")
NAME = re.compile(r"[a-z0-9][a-z0-9_-]*")
# A quote inside an unquoted url( ) is a bad-url token that can swallow what follows.
BAD_URL = re.compile(r"url\(\s*(?![\"'\s])[^)]*[\"']", re.IGNORECASE)
CUSTOM_ELEMENT = re.compile(r"[a-z][a-z0-9._]*-[a-z0-9._-]*")

Roles = dict[str, dict[str, str]]


@dataclass(frozen=True)
class Look:
    """Fonts and hue at one level: site, preset or page."""

    sources: tuple[str, ...] = ()
    roles: Roles = field(default_factory=dict)
    hue: str | None = None


@dataclass(frozen=True)
class Chrome:
    """The global bars: a named brand, none, or a custom script with element tags."""

    kind: Literal["fontlab", "vexy", "none", "custom"]
    script: str | None = None
    header: str | None = None
    footer: str | None = None


@dataclass(frozen=True)
class SiteConfig:
    """Validated `extra.fly`."""

    chrome: Chrome = Chrome("fontlab")
    chrome_options: dict[str, str] = field(default_factory=dict)
    look: Look = Look()
    presets: dict[str, Look] = field(default_factory=dict)
    margin_side: str = "left"
    utilities: bool = False
    debug: bool = False


@dataclass(frozen=True)
class PageConfig:
    """Validated page frontmatter: `fly: {preset, hue, fonts}` (`subtheme:` = preset)."""

    preset: str | None = None
    look: Look = Look()


def fail(where: str, message: str) -> PluginError:
    """A PluginError with the fly prefix and the config path."""
    return PluginError(f"fly: {where}: {message}")


def mapping(where: str, value: Any, allowed: tuple[str, ...]) -> dict[str, Any]:
    """Require a mapping whose keys are all in `allowed` (None reads as empty)."""
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise fail(where, f"must be a mapping, got {value!r}")
    if unknown := sorted(set(map(str, value)) - set(allowed)):
        raise fail(where, f"unknown key(s) {', '.join(unknown)}; allowed: {', '.join(allowed)}")
    return value


def choice(where: str, value: Any, allowed: tuple[str, ...]) -> str:
    """Require one of `allowed`."""
    if value not in allowed:
        raise fail(where, f"must be one of {', '.join(allowed)}, got {value!r}")
    return value


def boolean(where: str, value: Any) -> bool:
    """Require true or false."""
    if not isinstance(value, bool):
        raise fail(where, f"must be true or false, got {value!r}")
    return value


def source(where: str, value: Any) -> str:
    """Require a font source: typekit:<id>, google:<css2 family spec> or an https URL."""
    if isinstance(value, str) and any(p.fullmatch(value) for p in (TYPEKIT, GOOGLE, HTTPS)):
        return value
    raise fail(
        where,
        f"font source must be typekit:<id>, google:<family spec> or https://..., got {value!r}",
    )


def balanced(text: str) -> bool:
    """True when quotes close and parentheses (outside quotes) pair up."""
    quote, depth = "", 0
    for char in text:
        if quote:
            quote = "" if char == quote else quote
        elif char in "'\"":
            quote = char
        elif char in "()":
            depth += 1 if char == "(" else -1
            if depth < 0:
                return False
    return not quote and depth == 0


def css_value(where: str, value: Any) -> str:
    """A role value as CSS text that cannot end its declaration, rule or <style> element.

    Rejects < > { } ; backslashes, newlines, comment openers and unbalanced quotes or
    parentheses, quotes inside an unquoted url(), since the value is written unescaped into the plugin's role style.
    """
    if isinstance(value, bool) or not isinstance(value, (str, int, float)):
        raise fail(where, f"must be a string or a number, got {value!r}")
    text = str(value).strip()
    if not CSS_VALUE.fullmatch(text) or "/*" in text or not balanced(text) or BAD_URL.search(text):
        raise fail(where, f"is not a plain CSS value: {value!r}")
    return text


def parse_roles(where: str, value: Any) -> Roles:
    """Roles mapping: role name -> {property: value}, per SPEC 4.3."""
    roles: Roles = {}
    for role, props in mapping(where, value, tuple(ROLE_PROPS)).items():
        here = f"{where}.{role}"
        props = mapping(here, props, ROLE_PROPS[role])
        roles[role] = {p: css_value(f"{here}.{p}", v) for p, v in props.items()}
    return roles


def parse_look(where: str, fonts: Any, hue: Any) -> Look:
    """Fonts ({sources, roles}) and hue at one level."""
    fonts = mapping(f"{where}.fonts", fonts, ("sources", "roles"))
    sources = fonts.get("sources") or []
    if not isinstance(sources, list):
        raise fail(f"{where}.fonts.sources", f"must be a list, got {sources!r}")
    return Look(
        sources=tuple(source(f"{where}.fonts.sources[{i}]", s) for i, s in enumerate(sources)),
        roles=parse_roles(f"{where}.fonts.roles", fonts.get("roles")),
        hue=None if hue is None else choice(f"{where}.hue", hue, HUES),
    )


def parse_chrome(where: str, value: Any) -> Chrome:
    """`fontlab | vexy | none | {script, header, footer}`."""
    if not isinstance(value, dict):
        return Chrome(choice(where, value, NAMED_CHROMES))
    value = mapping(where, value, ("script", "header", "footer"))
    if not isinstance(value.get("script"), str) or not HTTPS.fullmatch(value["script"]):
        raise fail(f"{where}.script", f"must be an https:// URL, got {value.get('script')!r}")
    tags = {}
    for key in ("header", "footer"):
        tag = value.get(key)
        if not isinstance(tag, str) or not CUSTOM_ELEMENT.fullmatch(tag):
            raise fail(
                f"{where}.{key}", f"must be a custom element name (with a hyphen), got {tag!r}"
            )
        tags[key] = tag
    return Chrome("custom", value["script"], tags["header"], tags["footer"])


def parse_options(where: str, value: Any) -> dict[str, str]:
    """Menu attributes under chrome_options."""
    options = mapping(where, value, CHROME_OPTIONS)
    for key, text in options.items():
        if not isinstance(text, str):
            raise fail(f"{where}.{key}", f"must be a string, got {text!r}")
    return dict(options)


def parse_presets(where: str, value: Any) -> dict[str, Look]:
    """Named bundles of fonts and hue."""
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise fail(where, f"must be a mapping of preset names, got {value!r}")
    presets = {}
    for name, body in value.items():
        if not isinstance(name, str) or not NAME.fullmatch(name):
            raise fail(where, f"preset name must match {NAME.pattern}, got {name!r}")
        body = mapping(f"{where}.{name}", body, ("fonts", "hue"))
        presets[name] = parse_look(f"{where}.{name}", body.get("fonts"), body.get("hue"))
    return presets


def parse_site(extra: Any) -> SiteConfig:
    """Validate `config.extra` -> SiteConfig (absent `fly` is all defaults)."""
    raw = mapping("extra.fly", (extra or {}).get("fly"), SITE_KEYS)
    return SiteConfig(
        chrome=parse_chrome("extra.fly.chrome", raw.get("chrome", "fontlab")),
        chrome_options=parse_options("extra.fly.chrome_options", raw.get("chrome_options")),
        look=parse_look("extra.fly", raw.get("fonts"), raw.get("hue")),
        presets=parse_presets("extra.fly.presets", raw.get("presets")),
        margin_side=choice("extra.fly.margin_side", raw.get("margin_side", "left"), SIDES),
        utilities=boolean("extra.fly.utilities", raw.get("utilities", False)),
        debug=boolean("extra.fly.debug", raw.get("debug", False)),
    )


def parse_page(meta: dict[str, Any], site: SiteConfig, src: str) -> PageConfig:
    """Validate a page's `fly:` frontmatter (and the legacy `subtheme:` alias)."""
    where = f"{src}: fly"
    raw = mapping(where, meta.get("fly"), PAGE_KEYS)
    preset, alias = raw.get("preset"), meta.get("subtheme")
    for key, name in (("fly.preset", preset), ("subtheme", alias)):
        if name is not None and not isinstance(name, str):
            raise fail(f"{src}: {key}", f"must be a preset name, got {name!r}")
    if alias is not None and preset is not None and alias != preset:
        raise fail(where, f"subtheme {alias!r} and fly.preset {preset!r} disagree; keep one")
    preset = preset if preset is not None else alias
    if meta.get("margin_side") is not None:
        choice(f"{src}: margin_side", meta["margin_side"], SIDES)
    if preset is not None and preset not in site.presets:
        known = ", ".join(site.presets) or "none configured"
        raise fail(f"{where}.preset", f"unknown preset {preset!r} (known: {known})")
    return PageConfig(preset=preset, look=parse_look(where, raw.get("fonts"), raw.get("hue")))
