"""Strict fixture builds through the fly plugin: fonts, presets, page overrides, hue, chrome.

this_file: tests/py/test_fixture_fly.py
"""

import re
import shutil
import subprocess
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

import pytest
from fly_january.assets import RESCALED, rescale_rem
from mkdocs.utils import get_theme_dir
from test_theme_package import FIXTURE, build

CHROMES = ("mkdocs", "mkdocs-vexy", "mkdocs-none", "mkdocs-custom")


@pytest.fixture(scope="module")
def sites(tmp_path_factory):
    built = {}
    for name in CHROMES:
        site = tmp_path_factory.mktemp(name)
        result = build(FIXTURE / f"{name}.yml", site)
        assert result.returncode == 0, name + result.stdout + result.stderr
        built[name] = site
    return built


def read(sites, name, page="index.html"):
    return (sites[name] / page).read_text()


def body(html):
    return re.search(r"<body[^>]*>", html)[0]


def font_links(html):
    return re.findall(r'<link rel="stylesheet" href="([^"]+)" data-fly-font>', html)


def test_site_page_when_no_frontmatter_then_site_fonts_roles_and_hue(sites):
    html = read(sites, "mkdocs")
    assert font_links(html) == [
        "https://use.typekit.net/gav0zux.css",
        "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&amp;display=swap",
    ]
    assert html.count("<style data-fly-roles>") == 1
    assert "--fly-h1-family: 'newsserif-huge-variable', serif; --fly-h1-weight: 700;" in html
    assert '<link rel="preconnect" href="https://use.typekit.net" crossorigin>' in html
    assert 'data-fly-hue="cobalt"' in body(html)
    assert "fly-margin-left" in body(html) and "fly-chrome-fontlab" in body(html)


def test_extra_css_overrides_the_tracking_token_on_the_heading(sites):
    site = sites["mkdocs-custom"]
    html = (site / "index.html").read_text()
    assert html.index("assets/fly/fly.css?") < html.index("tracking.css?")
    css = (site / "assets/fly/fly.css").read_text()
    # The heading normally inherits this token. A declaration on h2 wins over the root.
    token = "--fly-h2-tracking"
    definitions = re.findall(r"([^{}]*)\{[^{}]*?" + token + r"\s*:", css)
    assert [selector.strip() for selector in definitions] == [":root"]
    heading_rules = css.replace(r":not(#\#)", "")
    assert re.search(
        r"\.md-typeset h2\s*\{[^{}]*letter-spacing:\s*var\(" + token + r"\)", heading_rules
    )
    assert ".md-typeset h2 { --fly-h2-tracking: 2px; }" in (site / "tracking.css").read_text()


def test_preset_page_when_fly_preset_then_preset_fonts_roles_hue_and_class(sites):
    html = read(sites, "mkdocs", "guide/index.html")
    assert font_links(html)[2:] == [
        "https://fonts.googleapis.com/css2?family=Blaka+Ink&amp;display=swap"
    ]
    assert len(font_links(html)) == 3, "typekit:gav0zux from site and preset loads once"
    assert "--fly-h1-family: 'Blaka Ink'; --fly-h1-weight: 400; --fly-h1-scale: 1.1;" in html
    assert 'data-fly-hue="magenta"' in body(html)
    assert "subtheme-fl9-color" in body(html) and "fly-no-l2" in body(html)


def test_override_page_when_subtheme_alias_and_page_fonts_then_page_wins(sites):
    html = read(sites, "mkdocs", "reference/index.html")
    assert font_links(html)[2:] == [
        "https://fonts.example.com/plain.css",
        "https://use.typekit.net/abc1def.css",
    ]
    assert "--fly-h1-weight: 300;" in html and '--fly-body-features: "onum" 1;' in html
    tag = body(html)
    assert 'data-fly-hue="teal"' in tag and "subtheme-plain" in tag and "fly-margin-right" in tag
    assert '<main class="md-main ref-main"' in html


def test_content_when_margin_figure_and_permalinks_then_grouped_and_named(sites):
    html = read(sites, "mkdocs", "guide/index.html")
    assert re.search(r'<div class="fly-aside" style="--rows: 2"><p>The paragraph', html), (
        "margin group"
    )
    assert 'aria-label="Permanent link"' in html


def test_static_404_when_built_then_site_body_classes_and_fly_variable(sites):
    html = read(sites, "mkdocs-none", "404.html")
    assert "fly-chrome-none" in body(html) and 'data-fly-hue="cobalt"' in body(html)
    assert html.count("<style data-fly-roles>") == 1


@pytest.mark.parametrize(
    ("name", "script", "header", "footer"),
    [
        ("mkdocs", "https://i.fontlab.com/menu/fontlab.js", "fontlab-menu", "fontlab-footer"),
        ("mkdocs-vexy", "https://i.vexy.art/menu/vexy.js", "vexy-menu", "vexy-footer"),
        ("mkdocs-custom", "https://menu.example.com/bars.js", "acme-menu", "acme-footer"),
    ],
)
def test_chrome_when_variant_then_script_and_bars_with_options(sites, name, script, header, footer):
    html = read(sites, name)
    assert f'<script src="{script}" defer></script>' in html
    menu = re.search(rf"<{header} [^>]*></{header}>", html)
    assert menu, header
    assert 'mode="dark"' in menu[0] and 'site-url="https://fixture.example/"' in menu[0]
    assert 'search-from="fixture"' in menu[0] and 'mobile-menu="materialx"' in menu[0]
    assert f'<{footer} mode="dark"></{footer}>' in html
    assert f"fly-chrome-{'custom' if name.endswith('custom') else header.split('-')[0]}" in body(
        html
    )
    others = {"fontlab-menu", "vexy-menu", "acme-menu"} - {header}
    assert not any(f"<{tag}" in html for tag in others)


def test_chrome_options_when_vexy_overrides_label_then_inherited_options_kept(sites):
    assert 'site-label="Vexy fixture"' in read(sites, "mkdocs-vexy")
    assert 'site-label="Fixture"' in read(sites, "mkdocs")


def test_chrome_none_when_built_then_no_bars_and_materialx_header_shown(sites):
    html = read(sites, "mkdocs-none")
    assert not re.search(r"<(fontlab|vexy)-(menu|footer)|menu/(fontlab|vexy)\.js", html)
    assert "fly-chrome-none" in body(html) and "md-header" in html
    css = (sites["mkdocs-none"] / "assets/fly/fly.css").read_text()
    hide = re.search(r"([^{}]*header\.md-header[^{}]*)\{\s*display: none", css)
    assert hide and "fly-chrome-fontlab" in hide[1] and "fly-chrome-vexy" in hide[1], hide
    assert "fly-chrome-none" not in hide[1] and "fly-chrome-custom" not in hide[1]
    assert set(re.findall(r"fly-chrome-(\w+)", hide[1])) == {"fontlab", "vexy"}, hide[1]


def test_chrome_custom_when_built_then_materialx_header_kept_beside_custom_bars(sites):
    html = read(sites, "mkdocs-custom")
    assert "fly-chrome-custom" in body(html) and "<acme-menu " in html
    css = (sites["mkdocs-custom"] / "assets/fly/fly.css").read_text()
    hide = re.search(r"([^{}]*header\.md-header[^{}]*)\{\s*display: none", css)
    assert hide and set(re.findall(r"fly-chrome-(\w+)", hide[1])) == {"fontlab", "vexy"}, hide
    # The fixture has no search plugin or palette; the header and its drawer button remain.
    assert '<header class="md-header' in html and 'for="__drawer"' in html


def test_utilities_and_debug_when_enabled_then_linked_and_switcher_data(sites):
    assert (sites["mkdocs-custom"] / "assets/fly/fly-utilities.css").is_file()
    html = read(sites, "mkdocs-custom", "reference/index.html")
    assert re.search(r'href="\.\./assets/fly/fly-utilities\.css\?v=\w{10}"', html)
    assert html.index("assets/fly/fly.css") < html.index("assets/fly/fly-utilities.css")
    assert re.search(r'src="\.\./assets/fly/fly-debug\.js\?v=\w{10}" defer', html)
    assert '<script id="fly-debug-data" type="application/json">{"page": "plain"' in html
    plain = read(sites, "mkdocs", "reference/index.html")
    assert "fly-debug" not in plain and "fly-utilities" not in plain


def test_rescale_when_built_then_materialx_rems_scaled(sites):
    source = Path(get_theme_dir("materialx")) / "assets/stylesheets"
    target = sites["mkdocs"] / "assets/stylesheets"
    shipped = {f.relative_to(source) for f in source.rglob("*.css")}
    built = {f.relative_to(target) for f in target.rglob("*.css")}
    rescaled = {path for path in built if (target / path).read_text().endswith(RESCALED)}
    assert shipped and shipped <= built
    assert rescaled == shipped
    for path in shipped:
        assert (target / path).read_text() == rescale_rem((source / path).read_text()) + RESCALED


def test_build_when_page_classes_invalid_then_fails_even_without_strict(tmp_path):
    fixture = tmp_path / "fixture"
    shutil.copytree(FIXTURE, fixture)
    (fixture / "docs/index.md").write_text("---\nclasses: {body: [3]}\n---\n# Home\n")
    result = subprocess.run(
        [sys.executable, "-m", "properdocs", "build", "-f", str(fixture / "mkdocs.yml")],
        capture_output=True, text=True, check=False,
    )
    assert result.returncode != 0
    assert "index.md: classes.body: invalid class name" in result.stderr + result.stdout


def test_build_when_extra_fly_invalid_then_strict_build_fails_with_message(tmp_path):
    config = tmp_path / "mkdocs.yml"
    config.write_text(
        f"INHERIT: {FIXTURE / 'mkdocs.yml'}\ndocs_dir: {FIXTURE / 'docs'}\n"
        "extra:\n  fly:\n    hue: orange\n"
    )
    result = build(config, tmp_path / "site")
    assert result.returncode != 0
    assert "fly: extra.fly.hue: must be one of" in result.stdout + result.stderr


def test_debug_js_when_switching_then_reads_plugin_data_shape():
    js = (Path(FIXTURE).parents[1] / "src/fly/js/fly-debug.js").read_text()
    assert "data.presets" in js and "data.own" in js
    assert 'querySelectorAll("link[data-fly-font], style[data-fly-roles]")' in js
    assert "dataset.flyHue" in js and "position: fixed" in js


class Ids(HTMLParser):
    """Every id attribute of a page, in order (script and template contents are not parsed
    as markup by HTMLParser's CDATA handling of script/style)."""

    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []

    def handle_starttag(self, tag, attrs):
        self.ids += [value for name, value in attrs if name == "id" and value]


def test_built_pages_when_parsed_then_every_id_is_unique(sites):
    checked = 0
    for name, site in sites.items():
        for page in sorted(site.rglob("*.html")):
            parser = Ids()
            parser.feed(page.read_text())
            dupes = {i: n for i, n in Counter(parser.ids).items() if n > 1}
            assert not dupes, f"{name}/{page.relative_to(site)}: duplicate ids {dupes}"
            controls = [i for i in parser.ids if re.match(r"__(toc|nav|drawer|search)", i)]
            assert "__drawer" in controls and "__search" in controls, page
            checked += 1
    assert checked >= 16
