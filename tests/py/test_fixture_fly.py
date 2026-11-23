"""Strict fixture builds through the fly plugin: fonts, presets, page overrides, hue, chrome.

this_file: tests/py/test_fixture_fly.py
"""

import re
from pathlib import Path

import pytest
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
    assert re.search(
        r"body:not\(\.fly-chrome-none\)[^{]*header\.md-header[^{]*\{\s*display: none", css
    )


def test_utilities_and_debug_when_enabled_then_linked_and_switcher_data(sites):
    html = read(sites, "mkdocs-custom", "reference/index.html")
    assert re.search(r'href="\.\./assets/fly/fly-utilities\.css\?v=\w{10}"', html)
    assert html.index("assets/fly/fly.css") < html.index("assets/fly/fly-utilities.css")
    assert re.search(r'src="\.\./assets/fly/fly-debug\.js\?v=\w{10}" defer', html)
    assert '<script id="fly-debug-data" type="application/json">{"page": "plain"' in html
    plain = read(sites, "mkdocs", "reference/index.html")
    assert "fly-debug" not in plain and "fly-utilities" not in plain


def test_rescale_when_built_then_materialx_rems_scaled(sites):
    (main,) = (sites["mkdocs"] / "assets/stylesheets").glob("main.*.min.css")
    # MaterialX's root is 125% and its header is 2.4rem tall; scaled by 20/14.4.
    assert "3.3333rem" in main.read_text()


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
