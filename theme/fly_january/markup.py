"""Rewrites of rendered HTML: tag classes and attributes, permalinks.

this_file: theme/fly_january/markup.py

All rewrites see only markup outside comments and script/style/pre/textarea, so code
samples and inline scripts are never touched. Used by plugin.py (on_page_content,
on_post_page, on_post_template).
"""

from __future__ import annotations

import logging
import re
from html import escape
from typing import Any

log = logging.getLogger("mkdocs.plugins.fly")

# Attributes up to the tag's closing ">": quoted values may contain ">" or "/".
ATTRS = r"""(?:[^>"']|"[^"]*"|'[^']*')*"""
TAG = re.compile(rf"<(body|main|article)(?=[\s>/])({ATTRS})>", re.IGNORECASE)
# Raw-text regions whose contents are never markup to rewrite.
OPAQUE = re.compile(
    r"<!--.*?-->|<(script|style|pre|textarea)\b.*?</\1\s*>", re.IGNORECASE | re.DOTALL
)
# Quoted or unquoted class value: group 2 is the quote ("" when unquoted).
CLASS = re.compile(
    r'(\sclass\s*=\s*)(?:(["\'])(.*?)\2|()([^\s"\'=<>`]+))', re.IGNORECASE | re.DOTALL
)
VALID = re.compile(r"[a-zA-Z_][a-zA-Z0-9_-]*\Z")
TAGS = ("body", "main", "article")


def mask(html: str) -> str:
    """Blank comments and script/style/pre/textarea, keeping every offset."""
    return OPAQUE.sub(lambda m: " " * len(m[0]), html)


def sub_outside(pattern: re.Pattern[str], html: str, repl: Any) -> str:
    """``pattern.sub`` that only sees markup outside ``OPAQUE`` regions.

    Matches are found in ``mask(html)``; ``repl(m)`` gets that match (its ``m.string`` is
    the masked page). A match that overlaps a blanked region is left as it is.
    """
    masked, out, last = mask(html), [], 0
    for m in pattern.finditer(masked):
        text = html[m.start() : m.end()]
        out += [html[last : m.start()], repl(m) if text == m[0] else text]
        last = m.end()
    return "".join(out) + html[last:]


def class_names(value: Any) -> list[str]:
    """Valid class names from a space-separated string or a list; the rest warn and drop."""
    if isinstance(value, str):
        items = value.split()
    elif isinstance(value, (list, tuple)):
        items = [v for v in value if isinstance(v, str)]
        if len(items) != len(value):
            log.warning("fly: ignoring non-string class names in %r", value)
    else:
        if value is not None:
            log.warning("fly: ignoring classes value %r (use a list or string)", value)
        return []
    good = [name for name in items if VALID.match(name)]
    if len(good) != len(items):
        log.warning("fly: ignoring invalid class names %s", sorted(set(items) - set(good)))
    return good


def frontmatter_classes(value: Any) -> dict[str, list[str]]:
    """Parse ``classes:`` frontmatter; unknown shapes and tags warn and are ignored."""
    if value is None:
        return {}
    if not isinstance(value, dict):
        log.warning("fly: ignoring classes %r (expected body/main/article mapping)", value)
        return {}
    classes: dict[str, list[str]] = {}
    for tag, names in value.items():
        if str(tag).lower() not in TAGS:
            log.warning("fly: ignoring classes for unknown tag %r", tag)
            continue
        classes[str(tag).lower()] = class_names(names)
    return classes


def merge_class(attrs: str, added: str) -> str:
    """Append ``added`` to the tag's class attribute, or add one."""
    if not CLASS.search(attrs):
        return f'{attrs} class="{added}"'
    return CLASS.sub(
        lambda c: f"{c[1]}{c[2] or chr(34)}{c[3] if c[2] else c[5]} {added}{c[2] or chr(34)}",
        attrs,
        count=1,
    )


def patch_tags(
    html: str,
    classes: dict[str, list[str]],
    attributes: dict[str, dict[str, str]] | None = None,
) -> str:
    """Add classes and attributes to the first opening tag of each listed type, once each.

    Tags inside comments, scripts, styles and ``<pre>`` never count. An attribute the tag
    already has is left as it is.
    """
    attributes = attributes or {}
    seen: set[str] = set()

    def patch(match: re.Match[str]) -> str:
        tag, attrs = match.group(1).lower(), match.group(2)
        if tag in seen:
            return match.group(0)
        seen.add(tag)
        if names := classes.get(tag):
            attrs = merge_class(attrs, escape(" ".join(names)))
        for name, value in (attributes.get(tag) or {}).items():
            if not re.search(rf"\s{re.escape(name)}\s*=", attrs, re.IGNORECASE):
                attrs += f' {name}="{escape(value)}"'
        return f"<{match.group(1)}{attrs}>"

    return sub_outside(TAG, html, patch)


def add_classes(html: str, classes: dict[str, list[str]]) -> str:
    """Append classes to the first opening tag of each listed type, once each."""
    return patch_tags(html, classes)


PERMALINK = re.compile(
    rf"""<a(?=\s)(?={ATTRS}\sclass\s*=\s*(["'])[^"']*\bheaderlink\b[^"']*\1)(?!{ATTRS}\saria-label\s*=)""",
    re.IGNORECASE,
)


def name_permalinks(html: str) -> str:
    """Give heading permalinks an accessible name; their "¶" text is hidden (notch)."""
    return sub_outside(PERMALINK, html, lambda m: '<a aria-label="Permanent link"')


# An attr_list written without the space before the brace (`## Title{ .tw:top-8 }`) is not
# parsed and lands in the text; nothing else would flag it. The same for an inline
# `{ .goto }` that did not attach to its link.
STRAY_ATTRS = re.compile(r"\{[^{}<>]*?(?:(?<![\w-])tw:|\.goto\b)[^{}<>]*\}?")
CODE = re.compile(r"<code\b.*?</code\s*>", re.IGNORECASE | re.DOTALL)


def stray_attr_lists(html: str) -> list[str]:
    """Literal `{ … tw:… }` or `{ .goto }` left in the text (outside code and raw-text tags)."""
    text = CODE.sub(lambda m: " " * len(m[0]), mask(html))
    tagless = re.sub(r"<[^>]*>", lambda m: " " * len(m[0]), text)
    return [m[0] for m in STRAY_ATTRS.finditer(tagless)]
