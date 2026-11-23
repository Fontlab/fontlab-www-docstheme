"""The `fly` plugin: config validation, page looks, body classes, content rewrites, rescale.

this_file: theme/fly_january/plugin.py

Site options live in `extra.fly` (SPEC 5), validated at on_config. Every template gets a
`fly` variable (on_env for static templates such as 404.html, on_page_context per page).
MaterialX writes <body>, <main> and <article> outside any Jinja block, so classes and
data-fly-hue are patched into the rendered page. Page frontmatter read:

- ``fly: {preset, hue, fonts: {sources, roles}}``; the legacy ``subtheme: <name>`` is
  ``fly.preset`` and adds ``subtheme-<name>`` on <body>
- ``classes: {body: [...], main: [...], article: [...]}`` (list or string)
- ``margin_side: left|right`` -> ``fly-margin-<side>`` (default ``extra.fly.margin_side``)
- ``hide: [toc]`` -> ``fly-no-l2``
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from mkdocs.plugins import BasePlugin
from vexy_markdown_figure_groups import group_figures

from .assets import rescale_materialx, theme_versions, version_links
from .config import PageConfig, SiteConfig, parse_page, parse_site
from .markup import log, name_permalinks, patch_tags, stray_attr_lists
from .view import body_attributes, h1_mode, page_classes, preset_look, view

# Margin figures (img-small/img-tall/img-cut) and their paragraphs become one block in the
# theme's vocabulary: <div class="fly-aside[ fly-cut]" style="--rows: N">.
FIGURE_GROUPS = {
    "figure_classes": ("img-small", "img-tall", "img-cut"),
    "cut_classes": ("img-cut",),
    "group_class": "fly-aside",
    "cut_class": "fly-cut",
}


def src_of(page: Any) -> str:
    """The page's source path for messages and the per-page cache."""
    return getattr(getattr(page, "file", None), "src_uri", "?")


THEME_PLUGINS = "fly-january/"
MATERIALX_PLUGINS = "materialx/"


def alias_materialx_plugins(plugins: Any) -> list[str]:
    """Also expose each `fly-january/<name>` plugin under `materialx/<name>`.

    A bare `search` in `plugins` registers as `fly-january/search` (pyproject entry
    points), but MaterialX's header.html tests the literal key `materialx/search`; without
    the twin the header ships no search box. Only the dict entry is added (not through
    PluginCollection.__setitem__), so no event handler is registered twice. Returns the
    added keys.
    """
    added = []
    for key in list(plugins):
        twin = MATERIALX_PLUGINS + key.removeprefix(THEME_PLUGINS)
        if key.startswith(THEME_PLUGINS) and twin not in plugins:
            dict.__setitem__(plugins, twin, plugins[key])
            added.append(twin)
    return added


class FlyPlugin(BasePlugin):
    """Site-build plugin for the fly-january theme."""

    site: SiteConfig
    versions: dict[str, str]

    def __init__(self) -> None:
        super().__init__()
        self.pages: dict[str, PageConfig] = {}

    def on_config(self, config: Any, **_: Any) -> Any:
        """Validate extra.fly and version local CSS/JS links."""
        self.site = parse_site(config.get("extra"))
        if config.get("plugins") is not None:
            alias_materialx_plugins(config["plugins"])
        self.versions = theme_versions()
        self.pages = {}
        version_links(config)
        return config

    def on_env(self, env: Any, config: Any, **_: Any) -> Any:
        """Site-level `fly` for templates rendered without a page (404.html)."""
        env.globals["fly"] = view(self.site, None, config, self.versions)
        return env

    def page_config(self, page: Any) -> PageConfig:
        """The page's validated frontmatter, parsed once per build."""
        src = src_of(page)
        if src not in self.pages:
            self.pages[src] = parse_page(page.meta or {}, self.site, src)
        return self.pages[src]

    def on_page_content(self, html: str, page: Any = None, **_: Any) -> str:
        """Group margin figures, name permalinks, warn about unparsed attribute lists."""
        for hit in stray_attr_lists(html):
            log.warning(
                "%s: unparsed attribute list %r (needs a space before the brace and no brace "
                "inside it)",
                src_of(page),
                hit,
            )
        return name_permalinks(group_figures(html, **FIGURE_GROUPS))

    def on_page_context(self, context: Any, page: Any, config: Any, **_: Any) -> Any:
        """The page's `fly` variable: fonts, hue, chrome, debug data."""
        context["fly"] = view(self.site, self.page_config(page), config, self.versions)
        return context

    def on_post_page(self, output: str, page: Any, config: Any, **_: Any) -> str:
        """Body/main/article classes and data-fly-hue."""
        page_config = self.page_config(page)
        hue = preset_look(self.site, page_config).hue
        classes = page_classes(page.meta or {}, self.site, page_config)
        h1 = h1_mode(self.site, page_config)
        return patch_tags(output, classes, body_attributes(hue, h1, self.site.links))

    def on_post_template(self, output_content: str, template_name: str, **_: Any) -> str:
        """Site-level body classes and hue on static HTML templates (404.html)."""
        if not template_name.endswith(".html"):
            return output_content
        hue = preset_look(self.site, None).hue
        classes = page_classes({}, self.site, None)
        h1 = h1_mode(self.site, None)
        return patch_tags(output_content, classes, body_attributes(hue, h1, self.site.links))

    def on_post_build(self, config: Any, **_: Any) -> None:
        """Rescale MaterialX's built stylesheets to the theme's 14.4px root."""
        rescale_materialx(Path(config["site_dir"]))
