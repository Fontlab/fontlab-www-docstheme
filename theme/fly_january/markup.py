"""Rewrites of rendered HTML: tag classes and attributes, permalinks.

this_file: theme/fly_january/markup.py

All rewrites see only markup outside comments and script/style/pre/textarea, so code
samples and inline scripts are never touched. Used by plugin.py (on_page_content,
on_post_page, on_post_template).
"""

from __future__ import annotations

import re
from html import escape
from typing import Any

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
