"""Out-of-the-box use: bare plugin names resolve as under MaterialX, the minimal site builds.

this_file: tests/py/test_defaults.py
"""

import json
import re
import tomllib
from importlib.metadata import entry_points

import pytest
from test_theme_package import FIXTURE, ROOT, build

PREFIX = "materialx/"


def installed_materialx_plugins() -> dict[str, str]:
    return {
        ep.name.removeprefix(PREFIX): ep.value
        for ep in entry_points(group="mkdocs.plugins")
        if ep.name.startswith(PREFIX)
    }


@pytest.mark.parametrize("theme", ["fly-january", "fly-january-remote"])
def test_entry_points_when_materialx_plugins_then_each_has_a_fly_january_twin(theme):
    declared = tomllib.loads((ROOT / "pyproject.toml").read_text())["project"]["entry-points"][
        "mkdocs.plugins"
    ]
    twins = {
        name.removeprefix(f"{theme}/"): value
        for name, value in declared.items()
        if name.startswith(f"{theme}/")
    }
    assert twins == installed_materialx_plugins(), (
        "pyproject.toml fly-january/<name> entry points must mirror the installed "
        "materialx/<name> ones; update them when mkdocs-materialx changes"
    )
    assert declared["fly"] == "fly_january.plugin:FlyPlugin"


@pytest.mark.parametrize("theme", ["fly-january", "fly-january-remote"])
def test_entry_points_when_installed_then_fly_january_twins_load_materialx_classes(theme):
    live = {ep.name: ep for ep in entry_points(group="mkdocs.plugins")}
    for name, value in installed_materialx_plugins().items():
        assert live[f"{theme}/{name}"].value == value, name


@pytest.fixture(scope="module")
def minimal(tmp_path_factory):
    site = tmp_path_factory.mktemp("minimal")
    result = build(FIXTURE / "mkdocs-minimal.yml", site)
    assert result.returncode == 0, result.stdout + result.stderr
    return site


def test_minimal_when_search_bare_then_materialx_search_plugin_and_worker(minimal):
    from material.plugins.search.config import SearchConfig

    assert list((minimal / "assets/javascripts/workers").glob("search.*.min.js")), (
        "MaterialX's search worker is shipped"
    )
    assert not (minimal / "search/worker.js").exists(), "MkDocs' own worker is not"
    search = minimal / "search"
    provider = SearchConfig().get("provider", "lunr")
    if provider == "pagefind":
        assert "md-search-result--pagefind" in (minimal / "index.html").read_text()
        manifest = json.loads((search / "pagefind-entry.json").read_text())
        assert manifest["languages"]["en"]["page_count"] >= 2
        assert list((search / "index").glob("en_*.pf_index"))
    else:
        assert provider == "lunr"
        assert json.loads((search / "search_index.json").read_text())["docs"]


def test_alias_when_bare_name_then_materialx_key_added_without_second_registration():
    from fly_january.plugin import alias_materialx_plugins
    from properdocs.plugins import BasePlugin, PluginCollection

    class Probe(BasePlugin):
        def on_config(self, config, **_):
            return config

    plugins = PluginCollection()
    plugins["fly-january/search"] = Probe()
    plugins["materialx/blog"] = Probe()
    events = list(plugins.events["config"])
    assert alias_materialx_plugins(plugins) == ["materialx/search"]
    assert plugins["materialx/search"] is plugins["fly-january/search"]
    assert plugins.events["config"] == events, "events are registered once"
    assert alias_materialx_plugins(plugins) == [], "idempotent"


def test_alias_when_both_spellings_present_then_nothing_added():
    from fly_january.plugin import alias_materialx_plugins
    from properdocs.plugins import BasePlugin, PluginCollection

    plugins = PluginCollection()
    plugins["fly-january/x"], plugins["materialx/x"] = BasePlugin(), BasePlugin()
    before = dict(plugins)
    assert alias_materialx_plugins(plugins) == []
    assert dict(plugins) == before and plugins["materialx/x"] is not plugins["fly-january/x"]


SEARCH_MARKUP = (
    '<label class="md-header__button md-icon" for="__search">',
    'class="md-search__input"',
    'data-md-component="search"',
)


def assert_search_markup(site):
    html = (site / "index.html").read_text()
    for needle in SEARCH_MARKUP:
        assert needle in html, f"header search markup missing: {needle}"


@pytest.mark.parametrize("config", ["mkdocs-minimal", "mkdocs-search", "mkdocs-search-explicit"])
def test_header_when_search_plugin_bare_or_spelled_out_then_search_markup_rendered(config, tmp_path):
    result = build(FIXTURE / f"{config}.yml", tmp_path)
    assert result.returncode == 0, result.stdout + result.stderr
    assert_search_markup(tmp_path)


def test_group_plugin_when_wrapping_aliased_plugin_then_strict_build_and_search_markup(tmp_path):
    result = build(FIXTURE / "mkdocs-group.yml", tmp_path)
    assert result.returncode == 0, result.stdout + result.stderr
    assert_search_markup(tmp_path)
    assert (tmp_path / "tags.json").is_file(), "the grouped tags plugin ran"


def body_tag(site, page="index.html"):
    import re

    html = (site / page).read_text()
    return html, re.search(r"<body[^>]*>", html)[0]


def test_minimal_when_no_extra_fly_then_default_font_sources_loaded(minimal):
    from fly_january.config import DEFAULT_SOURCES

    html, _ = body_tag(minimal)
    for kit in ("xht3uat", "cna4jfp", "wck5koo"):
        assert f"https://use.typekit.net/{kit}.css" in html, kit
    assert "gav0zux" not in html and "Outfit" not in html, "no all-families kit, no Google font"
    for origin in ("https://use.typekit.net", "https://p.typekit.net"):
        assert f'<link rel="preconnect" href="{origin}" crossorigin>' in html, origin
    assert html.count("data-fly-font") == len(DEFAULT_SOURCES)


def test_minimal_when_no_font_overrides_then_heading_tokens_in_built_stylesheet(minimal):
    html = (minimal / "index.html").read_text()
    assert "assets/fly/fly.css?" in html and "data-fly-roles" not in html
    css = (minimal / "assets/fly/fly.css").read_text()
    for role, family, weight, tracking in (
        ("h1", "polymath-display", 900, "-0.01em"),
        ("h2", "polymath", 500, "0"),
    ):
        assert f"--fly-{role}-family: '{family}', Arial, sans-serif;" in css
        assert f"--fly-{role}-weight: {weight};" in css
        assert f"--fly-{role}-tracking: {tracking};" in css
        assert f"letter-spacing: var(--fly-{role}-tracking);" in css
    assert "--fly-lead-family: var(--fly-h2-family);" in css
    assert "--fly-h5-family: var(--fly-sans-family);" in css


def test_fonts_sources_when_empty_list_then_no_font_stylesheets(tmp_path):
    config = tmp_path / "mkdocs.yml"
    config.write_text(
        f"INHERIT: {FIXTURE / 'mkdocs-minimal.yml'}\n"
        f"docs_dir: {FIXTURE / 'docs-minimal'}\n"
        "extra:\n  fly:\n    fonts:\n      sources: []\n"
    )
    result = build(config, tmp_path / "site")
    assert result.returncode == 0, result.stdout + result.stderr
    assert "data-fly-font" not in (tmp_path / "site/index.html").read_text()


def test_minimal_when_site_sets_news_serif_and_heading_tracking_then_overrides_render(tmp_path):
    config = tmp_path / "mkdocs.yml"
    config.write_text(
        f"INHERIT: {FIXTURE / 'mkdocs-minimal.yml'}\n"
        f"docs_dir: {FIXTURE / 'docs-minimal'}\n"
        "extra:\n  fly:\n    fonts:\n      sources: [typekit:cmv5add]\n"
        "      roles:\n        h1: {family: newsserif-huge-variable, tracking: 0.01em}\n"
        "        h2: {tracking: -0.03em}\n"
    )
    result = build(config, tmp_path / "site")
    assert result.returncode == 0, result.stdout + result.stderr
    html = (tmp_path / "site/index.html").read_text()
    assert "https://use.typekit.net/cmv5add.css" in html and "xht3uat" not in html
    assert "--fly-h1-family: newsserif-huge-variable;" in html
    assert "--fly-h1-tracking: 0.01em;" in html and "--fly-h2-tracking: -0.03em;" in html


@pytest.fixture(scope="module")
def configured(tmp_path_factory):
    built = {}
    for name in ("mkdocs", "mkdocs-accent", "mkdocs-sticky"):
        site = tmp_path_factory.mktemp(name)
        result = build(FIXTURE / f"{name}.yml", site)
        assert result.returncode == 0, name + result.stdout + result.stderr
        built[name] = site
    return built


def test_body_when_site_hue_only_then_no_h1_accent(configured):
    _, tag = body_tag(configured["mkdocs"])
    assert 'data-fly-hue="cobalt"' in tag and "data-fly-h1" not in tag, tag
    assert "data-fly-links" not in tag


def test_body_when_page_hue_then_h1_accent_unless_page_says_ink(configured):
    site = configured["mkdocs"]
    assert 'data-fly-h1="accent"' in body_tag(site, "hue-page/index.html")[1]
    assert 'data-fly-h1="accent"' in body_tag(site, "guide/index.html")[1], "preset hue"
    assert "data-fly-h1" not in body_tag(site, "reference/index.html")[1], "h1: ink wins"


def test_body_when_site_h1_and_links_accent_then_both_attributes(configured):
    _, tag = body_tag(configured["mkdocs-accent"])
    assert 'data-fly-h1="accent"' in tag and 'data-fly-links="accent"' in tag, tag
    css = (configured["mkdocs-accent"] / "index.html").read_text()
    assert "--fly-em-style: italic;" in css and "--fly-sans-family: system-ui, sans-serif;" in css


def test_chrome_when_sticky_then_menu_attribute_and_body_class(configured):
    html, tag = body_tag(configured["mkdocs-sticky"])
    assert "fly-sticky" in tag
    assert "<fontlab-menu" in html and " sticky" in html.split("<fontlab-menu")[1].split(">")[0]
    html, tag = body_tag(configured["mkdocs"])
    assert "fly-sticky" not in tag and " sticky" not in html.split("<fontlab-menu")[1].split(">")[0]


def test_blog_when_blog_alias_then_strict_build_with_excerpts_and_pagination(tmp_path):
    result = build(FIXTURE / "mkdocs-blog.yml", tmp_path)
    assert result.returncode == 0, result.stdout + result.stderr
    index = (tmp_path / "blog/index.html").read_text()
    assert index.count("md-post--excerpt") >= 2 and "md-post__content" in index
    assert (tmp_path / "blog/page/2/index.html").is_file(), "pagination"
    assert (tmp_path / "a-post-with-a-wide-table/index.html").is_file() or list(
        tmp_path.glob("**/a-post-with-a-wide-table/index.html")
    )


@pytest.mark.parametrize(
    ("theme", "options", "cdn"),
    [
        ("fly-january", "", None),
        ("fly-january", "assets: remote", "https://fontlab.dev/fontlab-www-docstheme/fly/latest/"),
        (
            "fly-january-remote",
            "assets_url: https://cdn.invalid/fly/0.4.0/",
            "https://cdn.invalid/fly/0.4.0/",
        ),
    ],
)
def test_fixture_asset_delivery(tmp_path, theme, options, cdn):
    config = tmp_path / "mkdocs.yml"
    components = (
        "extra_css: [assets/fly/fly-tokens.css, assets/fly/components.css]\n"
        "extra_javascript: [{path: assets/fly/basecoat.js, defer: true}]\n"
        if cdn else "extra_css: [assets/fly/fly-tokens.css]\n"
    )
    config.write_text(
        f"INHERIT: {FIXTURE / 'mkdocs-minimal.yml'}\ndocs_dir: {FIXTURE / 'docs-minimal'}\n"
        f"theme: {{name: {theme}}}\n{components}"
        f"extra:\n  fly:\n    debug: true\n    utilities: true\n    {options}\n"
    )
    site = tmp_path / "site"
    result = build(config, site)
    assert result.returncode == 0, result.stdout + result.stderr
    assert_search_markup(site)
    html = (site / "guide/index.html").read_text()
    files = [
        "fly.css", "fly-utilities.css", "fly.js", "fly-bridge.js", "fly-debug.js", "fly-tokens.css"
    ]
    if cdn:
        files.extend(["components.css", "basecoat.js"])
    error_page = (site / "404.html").read_text()
    for name in files:
        if cdn:
            assert f'="{cdn}{name}"' in html and f'="{cdn}{name}"' in error_page
        else:
            assert re.search(r'="\.\./assets/fly/' + re.escape(name) + r'\?v=[a-f0-9]{10}"', html)
    assert (site / "assets/fly").exists() == (cdn is None)
    assert 'href="../assets/stylesheets/' in html
    assert 'src="../assets/javascripts/' in html
