"""The fly plugin: extra.fly validation, precedence, page classes, chrome, assets, hooks.

this_file: tests/py/test_plugin.py
"""

import json
import re
from pathlib import Path
from types import SimpleNamespace

import pytest
from fly_january import assets
from fly_january.config import (
    DEFAULT_SOURCES,
    HUES,
    ROLE_PROPS,
    Look,
    PageConfig,
    parse_page,
    parse_site,
)
from fly_january.fonts import head, merge_roles, resolve, roles_css, source_url
from fly_january.plugin import FlyPlugin
from fly_january.view import body_attributes, chrome_view, h1_mode, page_classes, view
from mkdocs.exceptions import PluginError

ROOT = Path(__file__).resolve().parents[2]
SITE = {
    "fly": {
        "hue": "cobalt",
        "margin_side": "left",
        "fonts": {
            "sources": ["typekit:gav0zux", "google:Outfit:wght@100..900"],
            "roles": {"h1": {"family": "'News', serif", "weight": 700}, "h2": {"weight": 300}},
        },
        "presets": {
            "sitka": {
                "fonts": {
                    "sources": ["google:Blaka+Ink", "typekit:gav0zux"],
                    "roles": {"h1": {"family": "'Blaka Ink'", "scale": 1.1}},
                },
                "hue": "magenta",
            },
            "bare": {},
        },
    }
}
CONFIG = {"site_name": "Site", "site_url": "https://site.example/"}


def site(**fly):
    return parse_site({"fly": SITE["fly"] | fly})


def page(meta):
    return parse_page(meta, site(), "p.md")


# --- extra.fly validation -------------------------------------------------------------


def test_parse_site_when_no_fly_then_defaults():
    config = parse_site({})
    assert config.assets == "local"
    assert config.chrome.kind == "fontlab" and not config.utilities and not config.debug
    assert config.margin_side == "left" and config.presets == {}
    assert config.look == Look(sources=DEFAULT_SOURCES), "a bare site gets the default font sources"
    assert (config.h1, config.links, config.sticky) == ("ink", "inherit", False)


@pytest.mark.parametrize(
    ("fly", "message"),
    [
        ({"colour": "red"}, "extra.fly: unknown key(s) colour"),
        ({"hue": "orange"}, "extra.fly.hue: must be one of"),
        ({"chrome": "acme"}, "extra.fly.chrome: must be one of fontlab, vexy, none"),
        (
            {"chrome": {"script": "http://x.test/a.js", "header": "a-b", "footer": "a-c"}},
            "chrome.script",
        ),
        (
            {"chrome": {"script": "https://x.test/a.js", "header": "menu", "footer": "a-c"}},
            "chrome.header",
        ),
        ({"chrome": {"script": "https://x.test/a.js", "header": "a-b"}}, "chrome.footer"),
        ({"chrome_options": {"site-url": "x"}}, "chrome_options.site-url: must be an http(s) URL"),
        ({"chrome_options": {"site-url": "//evil.test/"}}, "chrome_options.site-url: must be"),
        ({"chrome_options": {"site-url": "/\\evil.test"}}, "chrome_options.site-url: must be"),
        ({"chrome_options": {"site-url": "https://"}}, "chrome_options.site-url: must be"),
        ({"chrome_options": {"site-url": "https:///path"}}, "chrome_options.site-url: must be"),
        ({"chrome_options": {"site-url": "http://?x"}}, "chrome_options.site-url: must be"),
        ({"chrome_options": {"site-url": 'https://a.test/"x'}}, "chrome_options.site-url: must be"),
        ({"chrome_options": {"site-url": 5}}, "chrome_options.site-url: must be a string"),
        ({"chrome_options": {"site-label": 5}}, "chrome_options.site-label: must be a string"),
        ({"fonts": {"sources": ["adobe:abc"]}}, "fonts.sources[0]: font source must be"),
        ({"fonts": {"sources": "typekit:abc"}}, "fonts.sources: must be a list"),
        ({"fonts": {"files": []}}, "extra.fly.fonts: unknown key(s) files"),
        ({"fonts": {"roles": {"h7": {}}}}, "fonts.roles: unknown key(s) h7"),
        ({"fonts": {"roles": {"h1": {"colour": "red"}}}}, "fonts.roles.h1: unknown key(s) colour"),
        (
            {"fonts": {"roles": {"em": {"stretch": "90%"}}}},
            "fonts.roles.em: unknown key(s) stretch",
        ),
        ({"fonts": {"roles": {"h1": {"family": "x;} body{color:red"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"family": "</style>"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"weight": True}}}}, "must be a string or a number"),
        ({"fonts": {"roles": {"h1": {"family": "'A' /* x"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"family": "'A, serif"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"family": '"A'}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"size": "calc(1rem"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"size": "1rem)"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"family": "url(a'b)c'"}}}}, "not a plain CSS value"),
        ({"fonts": {"roles": {"h1": {"measure": "12 ch"}}}}, "must be a CSS length"),
        ({"fonts": {"roles": {"h1": {"measure": "wide"}}}}, "must be a CSS length"),
        ({"fonts": {"roles": {"h2": {"measure": 12}}}}, "must be a CSS length"),
        ({"fonts": {"roles": {"h2": {"measure": "10vw"}}}}, "must be a CSS length"),
        ({"fonts": {"roles": {"h2": {"measure": "calc(1ch)"}}}}, "must be a CSS length"),
        ({"fonts": {"roles": {"h3": {"measure": "12ch"}}}}, "fonts.roles.h3: unknown key(s) measure"),
        ({"fonts": {"roles": {"body": {"measure": "12ch"}}}}, "unknown key(s) measure"),
        ({"fonts": {"sources": ["google:A&display=block"]}}, "font source must be"),
        ({"presets": {"Bad Name": {}}}, "preset name must match"),
        ({"presets": {"x": {"css": "a.css"}}}, "extra.fly.presets.x: unknown key(s) css"),
        ({"presets": {"x": {"hue": "beige"}}}, "extra.fly.presets.x.hue"),
        ({"margin_side": "top"}, "extra.fly.margin_side"),
        ({"utilities": "yes"}, "extra.fly.utilities: must be true or false"),
        ({"debug": 1}, "extra.fly.debug: must be true or false"),
    ],
)
def test_parse_site_when_invalid_then_plugin_error_names_the_key(fly, message):
    with pytest.raises(PluginError, match=re.escape(message)):
        parse_site({"fly": fly})


def test_parse_site_when_custom_chrome_then_script_and_tags_kept():
    chrome = parse_site(
        {
            "fly": {
                "chrome": {
                    "script": "https://x.test/a.js",
                    "header": "acme-menu",
                    "footer": "acme-footer",
                }
            }
        }
    ).chrome
    assert (chrome.kind, chrome.script, chrome.header, chrome.footer) == (
        "custom",
        "https://x.test/a.js",
        "acme-menu",
        "acme-footer",
    )


def test_hues_when_compared_with_semantic_css_then_identical():
    css = (ROOT / "src/fly/tokens/semantic.css").read_text()
    assert set(HUES) == set(re.findall(r"\[data-fly-hue='([a-z]+)'\]", css))


def test_role_props_when_compared_with_type_css_then_every_variable_declared():
    # Role variables live in type.css; the heading measures in layout.css.
    css = "".join((ROOT / f"src/fly/tokens/{name}.css").read_text() for name in ("type", "layout"))
    declared = set(re.findall(r"(--fly-[a-z0-9]+-[a-z]+):", css))
    wanted = {f"--fly-{role}-{prop}" for role, props in ROLE_PROPS.items() for prop in props}
    assert wanted <= declared, sorted(wanted - declared)


# --- page frontmatter and precedence --------------------------------------------------


def test_parse_page_when_subtheme_alias_then_read_as_preset():
    assert page({"subtheme": "sitka"}).preset == "sitka"
    assert page({"subtheme": "sitka", "fly": {"preset": "sitka"}}).preset == "sitka"


@pytest.mark.parametrize(
    ("meta", "message"),
    [
        ({"fly": {"preset": "nope"}}, "p.md: fly.preset: unknown preset 'nope'"),
        ({"subtheme": "nope"}, "unknown preset 'nope'"),
        ({"subtheme": "bare", "fly": {"preset": "sitka"}}, "disagree"),
        ({"fly": {"colour": "x"}}, "p.md: fly: unknown key(s) colour"),
        ({"fly": {"hue": "beige"}}, "p.md: fly.hue"),
        ({"fly": "sitka"}, "p.md: fly: must be a mapping"),
        ({"margin_side": "top"}, "p.md: margin_side: must be one of left, right"),
        ({"fly": {"preset": ["sitka"]}}, "p.md: fly.preset: must be a preset name"),
        ({"fly": {"preset": {"a": 1}}}, "p.md: fly.preset: must be a preset name"),
        ({"subtheme": 5}, "p.md: subtheme: must be a preset name"),
    ],
)
def test_parse_page_when_invalid_then_plugin_error_names_page(meta, message):
    with pytest.raises(PluginError, match=re.escape(message)):
        page(meta)


def test_resolve_when_page_preset_site_then_page_beats_preset_beats_site():
    config = site()
    preset = config.presets["sitka"]
    own = page(
        {
            "fly": {
                "hue": "teal",
                "fonts": {"sources": ["typekit:abc1def"], "roles": {"h1": {"weight": 300}}},
            }
        }
    ).look
    look = resolve(config.look, preset, own)
    assert look.sources == (
        "typekit:gav0zux",
        "google:Outfit:wght@100..900",
        "google:Blaka+Ink",
        "typekit:abc1def",
    ), "sources accumulate in order, deduplicated"
    assert look.roles == {
        "h1": {"family": "'Blaka Ink'", "weight": "300", "scale": "1.1"},
        "h2": {"weight": "300"},
    }, "roles merge property by property"
    assert look.hue == "teal"
    assert resolve(config.look, preset, Look()).hue == "magenta"
    assert resolve(config.look, None, Look()).hue == "cobalt"
    assert resolve(config.look, config.presets["bare"], Look()) == config.look


@pytest.mark.parametrize("measure", ["12ch", "18ch", "none", "0", "20.5em", "30rem", "75%"])
def test_parse_site_when_heading_measure_valid_then_kept_and_emitted(measure):
    config = site(fonts={"roles": {"h1": {"measure": measure}, "h2": {"measure": measure}}})
    assert config.look.roles["h1"] == {"measure": measure}
    css = roles_css(config.look.roles)
    assert f"--fly-h1-measure: {measure};" in css and f"--fly-h2-measure: {measure};" in css


def test_measure_when_preset_and_page_then_reaches_resolved_roles():
    config = site(presets={"late": {"fonts": {"roles": {"h1": {"measure": "12ch"}}}}})
    own = page({"fly": {"fonts": {"roles": {"h2": {"measure": "18ch"}}}}}).look
    look = resolve(config.look, config.presets["late"], own)
    assert look.roles["h1"]["measure"] == "12ch" and look.roles["h2"]["measure"] == "18ch"
    assert roles_css(look.roles).count("measure") == 2


def test_merge_roles_when_later_level_then_wins_per_property():
    assert merge_roles({"h1": {"a": "1", "b": "2"}}, {"h1": {"b": "3"}, "h2": {"a": "4"}}) == {
        "h1": {"a": "1", "b": "3"},
        "h2": {"a": "4"},
    }


def test_parse_site_when_values_balanced_then_accepted():
    roles = {"h1": {"family": "'A (x)', \"B\", serif", "size": "calc((1rem + 2px) * 2)"}}
    assert parse_site({"fly": {"fonts": {"roles": roles}}}).look.roles["h1"]["size"] == (
        "calc((1rem + 2px) * 2)"
    )


def test_source_url_when_google_multi_family_then_one_url_html_escaped_in_template():
    from jinja2 import Environment

    spec = "google:Outfit:wght@100..900&family=REM:wght@100..900"
    url = source_url(parse_site({"fly": {"fonts": {"sources": [spec]}}}).look.sources[0])
    assert url == (
        "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900"
        "&family=REM:wght@100..900&display=swap"
    )
    html = Environment(autoescape=True).from_string('<link href="{{ u | e }}">').render(u=url)
    assert html == (
        '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900'
        '&amp;family=REM:wght@100..900&amp;display=swap">'
    )


def test_source_url_when_each_kind_then_expanded():
    assert source_url("typekit:gav0zux") == "https://use.typekit.net/gav0zux.css"
    assert source_url("google:Outfit:wght@100..900") == (
        "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
    )
    assert source_url("https://x.test/f.css") == "https://x.test/f.css"


def test_head_when_sources_then_links_distinct_and_preconnects_skip_template_origins():
    out = head(
        Look(("typekit:a1", "google:A", "google:B", "https://x.test/f.css", "https://x.test/g.css"))
    )
    assert out.links[0] == "https://use.typekit.net/a1.css" and len(out.links) == 5
    assert out.preconnects == ("https://use.typekit.net", "https://x.test", "https://p.typekit.net")
    assert head(Look()).style == "" and head(Look()).links == ()


def test_roles_css_when_roles_then_one_root_rule_in_token_order():
    css = roles_css(
        {"body": {"features": '"onum" 1'}, "h1": {"weight": "700", "family": "'A', serif"}}
    )
    assert css == (
        ":root { --fly-h1-family: 'A', serif; --fly-h1-weight: 700; "
        '--fly-body-features: "onum" 1; }'
    )


# --- body classes, chrome and the template variable ------------------------------------


def test_page_classes_when_preset_then_body_gets_subtheme_side_and_chrome():
    config = site()
    assert page_classes(config, page({"subtheme": "sitka"}))["body"] == [
        "subtheme-sitka",
        "fly-margin-left",
        "fly-chrome-fontlab",
    ]


def test_page_classes_when_page_sets_side_then_it_wins():
    assert page_classes(site(), page({"margin_side": "right"}))["body"][0] == "fly-margin-right"
    assert page_classes(site(margin_side="right"), None)["body"][0] == "fly-margin-right"


def test_page_classes_when_hide_toc_then_body_gets_no_l2():
    config = site()
    assert page_classes(config, page({"hide": ["toc"]}))["body"][:2] == [
        "fly-no-l2",
        "fly-margin-left",
    ]
    assert page_classes(config, page({"hide": ["navigation"]}))["body"][0] == "fly-margin-left"
    assert page_classes(config, page({"hide": None}))["body"][0] == "fly-margin-left"
    # Same test MaterialX's base.html uses to drop the L2 sidebar.
    assert page_classes(config, page({"hide": "toc"}))["body"][0] == "fly-no-l2"


def test_page_classes_when_bad_side_then_raises():
    with pytest.raises(PluginError, match="margin_side"):
        page({"margin_side": "top"})


@pytest.mark.parametrize("side", ["fly-margin-left", "fly-margin-right"])
def test_page_classes_when_body_sets_margin_class_then_no_default_added(side):
    assert page_classes(site(), page({"classes": {"body": [side]}}))["body"] == [
        side,
        "fly-chrome-fontlab",
    ]


@pytest.mark.parametrize(
    "value",
    [None, "foo", 5, ["body"], {"div": "x"}, {"main": 5}, {"article": ["9bad"]},
     {"body": [False]}, {"main": ["a<b"]}],
)
def test_parse_page_when_classes_invalid_then_error_names_page_and_key(value):
    with pytest.raises(PluginError, match=r"p\.md: classes"):
        page({"classes": value})


def test_parse_page_when_classes_valid_then_repeated_render_preserves_input():
    parsed = page({"classes": {"BODY": "one two", "article": ["_x-1"]}, "hide": "toc"})
    assert parsed.classes == {"body": ("one", "two"), "article": ("_x-1",)}
    assert parsed.hide == ("toc",)
    assert page_classes(site(), parsed) == page_classes(site(), parsed)


@pytest.mark.parametrize("hide", [True, 0, {}, ["toc", 7]])
def test_parse_page_when_hide_invalid_then_error_names_page(hide):
    with pytest.raises(PluginError, match=r"p\.md: hide"):
        page({"hide": hide})


@pytest.mark.parametrize(
    ("chrome", "script", "header", "footer"),
    [
        ("fontlab", "https://i.fontlab.com/menu/fontlab.js", "fontlab-menu", "fontlab-footer"),
        ("vexy", "https://i.vexy.art/menu/vexy.js", "vexy-menu", "vexy-footer"),
        ("none", None, None, None),
        (
            {"script": "https://x.test/a.js", "header": "acme-menu", "footer": "acme-footer"},
            "https://x.test/a.js",
            "acme-menu",
            "acme-footer",
        ),
    ],
)
def test_chrome_view_when_each_variant_then_script_and_tags(chrome, script, header, footer):
    out = chrome_view(site(chrome=chrome), CONFIG)
    assert (out.script, out.header, out.footer) == (script, header, footer)


def test_chrome_view_when_options_then_override_menu_attribute_defaults():
    out = chrome_view(
        site(
            chrome_options={
                "site-label": "Partners",
                "search-from": "partners",
                "mobile-search": "global",
            }
        ),
        CONFIG,
    )
    assert out.header_attrs == {
        "mode": "dark",
        "site-label": "Partners",
        "site-url": "https://site.example/",
        "mobile-menu": "materialx",
        "mobile-search": "global",
        "search-from": "partners",
    }
    assert out.footer_attrs == {"mode": "dark"}
    assert chrome_view(site(), CONFIG).header_attrs["site-label"] == "Site", "defaults to site_name"


@pytest.mark.parametrize("chrome", ["fontlab", "vexy"])
@pytest.mark.parametrize("url", ["https://partners.example/docs/", "http://x.test", "/", "/docs/"])
def test_chrome_view_when_site_url_option_then_overrides_site_url(chrome, url):
    out = chrome_view(site(chrome=chrome, chrome_options={"site-url": url}), CONFIG)
    assert out.header_attrs["site-url"] == url
    assert chrome_view(site(chrome=chrome), CONFIG).header_attrs["site-url"] == "https://site.example/"


def test_view_when_debug_then_json_lists_presets_and_is_script_safe():
    config = site(debug=True)
    out = view(config, page({"fly": {"preset": "sitka", "hue": "teal"}}), CONFIG, {})
    data = json.loads(out.debug)
    assert data["page"] == "sitka" and data["own"]["hue"] == "teal"
    assert [name for name, _ in data["presets"]] == ["sitka", "bare"]
    assert (
        data["presets"][0][1]["hue"] == "magenta"
        and "Blaka+Ink" in data["presets"][0][1]["links"][2]
    )
    assert "<" not in out.debug
    assert view(site(), None, CONFIG, {}).debug is None


# --- assets: cache-busting and rem rescale --------------------------------------------


def test_versioned_when_local_asset_then_hash_query_idempotent(tmp_path):
    (tmp_path / "a.css").write_text("x{}")
    v = assets.versioned("a.css", [tmp_path])
    assert re.fullmatch(r"a\.css\?v=[0-9a-f]{10}", v)
    assert assets.versioned(v, [tmp_path]) == v, "serve re-runs on_config"
    assert assets.versioned("https://x.test/a.css", [tmp_path]) == "https://x.test/a.css"
    assert assets.versioned("missing.css", [tmp_path]) == "missing.css"
    (tmp_path / "a.css").write_text("y{}")
    assert assets.versioned(v, [tmp_path]) != v, "content change -> new URL"


def test_version_links_when_extra_css_and_js_then_local_ones_versioned(tmp_path, caplog):
    (tmp_path / "site.css").write_text("x{}")
    (tmp_path / "site.js").write_text("1")
    script = SimpleNamespace(path="site.js")
    config = {
        "docs_dir": str(tmp_path),
        "extra_css": ["site.css", "https://x.test/a.css"],
        "extra_javascript": ["site.js", script],
    }
    assets.version_links(config)
    assert re.fullmatch(r"site\.css\?v=\w{10}", config["extra_css"][0])
    assert config["extra_css"][1] == "https://x.test/a.css"
    assert config["extra_javascript"][0].startswith("site.js?v=") and script.path.startswith(
        "site.js?v="
    )

    config["extra_css"] = ["assets/fly/unlisted.css"]
    config["extra_javascript"] = ["assets/fly/unlisted.js"]
    assets.version_links(config, "https://cdn.example/")
    assert all(path in caplog.text for path in ("assets/fly/unlisted.css", "assets/fly/unlisted.js"))


def test_theme_versions_when_built_assets_then_one_hash_each():
    versions = assets.theme_versions()
    assert set(versions) == set(assets.THEME_ASSETS)
    assert all(re.fullmatch(r"[0-9a-f]{10}", v) for v in versions.values())


def test_rescale_rem_when_materialx_rem_then_px_preserved_at_14_4_root():
    out = assets.rescale_rem("a{margin:-.8rem 1rem;width:12.1rem;b:0.5em;c:2px}")
    assert out == "a{margin:-1.1111rem 1.3889rem;width:16.8056rem;b:0.5em;c:2px}", out


def test_on_post_build_when_materialx_css_missing_then_raises(tmp_path):
    with pytest.raises(PluginError, match="MaterialX"):
        FlyPlugin().on_post_build({"site_dir": str(tmp_path)})


def test_on_post_build_when_materialx_adds_stylesheets_then_only_its_css_rescaled(
    tmp_path, monkeypatch, caplog
):
    source = tmp_path / "installed/assets/stylesheets"
    built = tmp_path / "site/assets/stylesheets"
    monkeypatch.setattr(assets, "get_theme_dir", lambda name: tmp_path / "installed")
    css = '@charset "UTF-8";a{width:1rem}'
    for folder in (source, built):
        (folder / "extras").mkdir(parents=True)
        for name in ("any-future-name.css", "extras/grid.css"):
            (folder / name).write_text(css)
    (built / "plugin.css").write_text(css)
    for _ in range(2):
        FlyPlugin().on_post_build({"site_dir": str(tmp_path / "site")})
        for name in ("any-future-name.css", "extras/grid.css"):
            assert (built / name).read_text() == css.replace("1rem", "1.3889rem") + assets.RESCALED
        assert (built / "plugin.css").read_text() == css
    assert any(r.levelname == "WARNING" and "plugin.css" in r.message for r in caplog.records)


def test_rescale_rem_when_data_uri_holds_paren_then_following_rems_scaled():
    css = (
        "a{background:url(\"data:image/svg+xml;utf8,<svg width='1rem'>"
        "<path d='M1 2h3)'/></svg>\")}.v{font-size:.8rem;height:2.4rem}"
        "b{c:url('x).svg') 1rem}d{e:url(p/1rem.png);f:1rem}"
    )
    out = assets.rescale_rem(css)
    assert ".v{font-size:1.1111rem;height:3.3333rem}" in out, out
    assert "width='1rem'" in out and "url(p/1rem.png);f:1.3889rem" in out
    assert "url('x).svg') 1.3889rem" in out


def _outside_strings(css: str) -> str:
    """CSS with quoted strings and unquoted url() bodies blanked (independent of REM)."""
    out, i = [], 0
    while i < len(css):
        ch = css[i]
        if ch in "\"'":
            j = i + 1
            while css[j] != ch:
                j += 2 if css[j] == "\\" else 1
            out.append("\0")
            i = j + 1
        elif css.startswith("url(", i) and css[i + 4] not in "\"'":
            i = css.index(")", i) + 1
            out.append("\0")
        else:
            out.append(ch)
            i += 1
    return "".join(out)


def test_rescale_rem_when_real_materialx_stylesheet_then_every_rem_scaled():
    import material  # a missing MaterialX must fail this test, not skip it

    (main,) = (Path(material.__file__).parent / "templates/assets/stylesheets").glob(
        "main.*.min.css"
    )
    css = main.read_text(encoding="utf-8")
    number = re.compile(r"(?<![\w.])(?<![eE][+-])(\d*\.?\d+(?:[eE][+-]?\d+)?)rem\b")
    before = [float(n) for n in number.findall(_outside_strings(css))]
    after = [float(n) for n in number.findall(_outside_strings(assets.rescale_rem(css)))]
    assert len(before) == len(after) > 300
    bad = [(b, a) for b, a in zip(before, after) if abs(a - b * assets.REM_SCALE) > 0.001]
    assert bad == [], bad[:5]


def test_rescale_rem_when_calc_url_strings_and_e_notation_then_lengths_only():
    css = 'a{w:calc(100% - 2rem);m:calc(-1rem*2);b:url(img/2rem.svg);c:"1rem";d:1e-1rem;e:1E1rem}'
    assert assets.rescale_rem(css) == (
        'a{w:calc(100% - 2.7778rem);m:calc(-1.3889rem*2);b:url(img/2rem.svg);c:"1rem";'
        "d:.1389rem;e:13.8889rem}"
    )
    assert assets.rescale_rem("a{b:url('x/.5rem.png') 1rem}") == "a{b:url('x/.5rem.png') 1.3889rem}"


# --- hooks ----------------------------------------------------------------------------


def configured_plugin(**fly):
    plugin = FlyPlugin()
    plugin.on_config(
        {
            "extra": {"fly": SITE["fly"] | fly},
            "docs_dir": ".",
            "extra_css": [],
            "extra_javascript": [],
        }
    )
    return plugin


def test_on_page_content_when_stray_attr_list_then_warns_with_file_name(caplog):
    page = SimpleNamespace(file=SimpleNamespace(src_uri="index.md"))
    with caplog.at_level("WARNING", logger="mkdocs.plugins.fly"):
        configured_plugin().on_page_content("<h2>No space{ .tw:top-8 }</h2>", page=page)
    assert "index.md: unparsed attribute list '{ .tw:top-8 }'" in caplog.text


def test_on_post_page_when_frontmatter_then_classes_and_hue_patched():
    page = SimpleNamespace(
        meta={"classes": {"body": "p", "main": ["m"]}, "subtheme": "sitka"},
        file=SimpleNamespace(src_uri="a.md"),
    )
    html = configured_plugin().on_post_page(
        '<html><body dir="ltr"><main class="md-main"><article>x</article></main></body>', page, {}
    )
    assert (
        '<body dir="ltr" class="p subtheme-sitka fly-margin-left fly-chrome-fontlab" '
        'data-fly-hue="magenta" data-fly-h1="accent">'
        in html
    )
    assert '<main class="md-main m">' in html


def test_on_post_template_when_404_then_site_classes_and_hue():
    plugin = configured_plugin(chrome="none")
    out = plugin.on_post_template("<body>", template_name="404.html")
    assert out == '<body class="fly-margin-left fly-chrome-none" data-fly-hue="cobalt">'
    assert plugin.on_post_template("<body>", template_name="sitemap.xml") == "<body>"


def test_on_env_and_page_context_when_called_then_fly_variable_set():
    plugin = configured_plugin()
    env = SimpleNamespace(globals={})
    plugin.on_env(env, CONFIG)
    assert env.globals["fly"].preset is None and env.globals["fly"].hue == "cobalt"
    page = SimpleNamespace(meta={"fly": {"preset": "sitka"}}, file=SimpleNamespace(src_uri="g.md"))
    context = plugin.on_page_context({}, page, CONFIG)
    assert context["fly"].preset == "sitka" and context["fly"].hue == "magenta"
    assert isinstance(plugin.pages["g.md"], PageConfig)


PAGE_SRC = SimpleNamespace(file=SimpleNamespace(src_uri="guide.md"))
SMALL = '<figure class="img-small"><img/></figure>'


def test_on_page_content_when_margin_figure_follows_paragraph_then_fly_aside_group():
    html = f"<p>a</p>\n{SMALL}\n<p>b</p>\n<h2>H</h2>"
    out = configured_plugin().on_page_content(html, page=PAGE_SRC)
    assert out == (
        f'<div class="fly-aside" style="--rows: 2"><p>a</p>\n{SMALL}\n<p>b</p></div>\n<h2>H</h2>'
    ), out


def test_on_page_content_when_cut_figure_then_fly_cut_group_with_figure_first():
    cut = '<figure class="img-cut"><img/></figure>'
    out = configured_plugin().on_page_content(f"<p>a</p>\n{cut}\n<p>b</p>", page=PAGE_SRC)
    assert out.startswith(f'<div class="fly-aside fly-cut" style="--rows: 2">{cut}'), out


def test_on_page_content_when_figure_inside_list_or_wide_then_unchanged():
    for html in (
        f"<ul><li><p>a</p>{SMALL}<p>b</p></li></ul>",
        '<p>b</p><figure class="img-wide"><img/></figure>',
    ):
        assert configured_plugin().on_page_content(html, page=PAGE_SRC) == html


# --- sans and em roles, links, h1, sticky, default sources ------------------------------


def test_roles_when_sans_then_family_stretch_variation_adjust_emitted():
    config = site(
        fonts={
            "roles": {
                "sans": {"family": "system-ui", "stretch": "normal", "variation": "normal", "adjust": 1}
            }
        }
    )
    css = roles_css(config.look.roles)
    for name, value in (("family", "system-ui"), ("stretch", "normal"), ("adjust", "1")):
        assert f"--fly-sans-{name}: {value};" in css, css
    assert "--fly-sans-variation: normal;" in css


@pytest.mark.parametrize("style", ["normal", "italic"])
def test_roles_when_em_style_valid_then_emitted(style):
    css = roles_css(site(fonts={"roles": {"em": {"style": style}}}).look.roles)
    assert f"--fly-em-style: {style};" in css


@pytest.mark.parametrize(
    ("roles", "message"),
    [
        ({"em": {"style": "oblique"}}, "fonts.roles.em.style: must be one of normal, italic"),
        ({"strong": {"style": "italic"}}, "fonts.roles.strong: unknown key(s) style"),
        ({"sans": {"weight": 400}}, "fonts.roles.sans: unknown key(s) weight"),
    ],
)
def test_roles_when_invalid_sans_or_style_then_error_names_key(roles, message):
    with pytest.raises(PluginError, match=re.escape(message)):
        site(fonts={"roles": roles})


def test_parse_site_when_links_then_inherit_or_accent():
    assert site().links == "inherit"
    assert site(links="accent").links == "accent"
    with pytest.raises(PluginError, match=re.escape("extra.fly.links: must be one of inherit, accent")):
        site(links="blue")


def test_parse_site_when_sticky_then_bool_and_menu_attribute():
    config = site()
    assert not config.sticky and "sticky" not in chrome_view(config, CONFIG).header_attrs
    config = site(chrome_options={"site-label": "X", "sticky": True})
    assert config.sticky and "sticky" not in config.chrome_options
    assert chrome_view(config, CONFIG).header_attrs["sticky"] == ""
    with pytest.raises(PluginError, match=re.escape("extra.fly.chrome_options.sticky: must be true")):
        site(chrome_options={"sticky": "yes"})


def test_parse_site_when_fonts_sources_empty_then_explicit_opt_out_of_defaults():
    assert site(fonts={"sources": []}).look.sources == ()
    assert site(fonts={"roles": {}}).look.sources == DEFAULT_SOURCES
    assert site(fonts={"sources": ["typekit:abc1def"]}).look.sources == ("typekit:abc1def",)


def test_default_sources_when_roles_then_cover_every_default_family():
    css = (ROOT / "src/fly/tokens/type.css").read_text()
    families = {
        f.strip("'\" ")
        for value in re.findall(r"--fly-(?:h1|h2|body|nav|sans)-family: ([^;]+);", css)
        for f in value.split(",")
    } - {"Georgia", "Arial", "serif", "sans-serif"}
    assert families == {"polymath-display", "polymath", "sole-serif-small-variable", "grtsk-vf"}
    assert DEFAULT_SOURCES == ("typekit:xht3uat", "typekit:cna4jfp", "typekit:wck5koo")


@pytest.mark.parametrize(
    ("fly", "meta", "expected"),
    [
        ({}, {}, "ink"),  # a site hue alone does not colour titles
        ({}, {"fly": {"hue": "teal"}}, "accent"),  # a page hue does
        ({}, {"fly": {"preset": "sitka"}}, "accent"),  # so does a preset's hue
        ({}, {"fly": {"preset": "bare"}}, "ink"),  # a preset without a hue does not
        ({"h1": "accent"}, {}, "accent"),  # the site opts in
        ({}, {"fly": {"hue": "teal", "h1": "ink"}}, "ink"),  # the page opts out
        ({"h1": "accent"}, {"fly": {"h1": "ink"}}, "ink"),
        ({}, {"fly": {"h1": "accent"}}, "accent"),
    ],
)
def test_h1_mode_when_site_page_hue_then_rule(fly, meta, expected):
    config = site(**fly)
    assert h1_mode(config, parse_page(meta, config, "p.md")) == expected
    assert h1_mode(config, None) == config.h1, "static templates follow the site"


def test_body_attributes_when_h1_and_links_accent_then_data_attributes():
    assert body_attributes("cobalt") == {"body": {"data-fly-hue": "cobalt"}}
    assert body_attributes("cobalt", "accent", "accent") == {
        "body": {"data-fly-hue": "cobalt", "data-fly-h1": "accent", "data-fly-links": "accent"}
    }
    assert body_attributes(None, "accent", "inherit") == {"body": {"data-fly-h1": "accent"}}
    assert body_attributes(None) == {}


@pytest.mark.parametrize("bad", ["blue", True, 1])
def test_parse_site_when_h1_invalid_then_error(bad):
    with pytest.raises(PluginError, match="extra.fly.h1"):
        site(h1=bad)


@pytest.mark.parametrize(
    "url", ["https://host/fly", "/fly/", "https:///", "https://host/?x=/", "https://host:abc/", None]
)
def test_site_rejects_invalid_asset_directory(url):
    with pytest.raises(PluginError, match="extra.fly.assets_url"):
        parse_site({"fly": {"assets_url": url}})


def test_site_rejects_conflicting_or_unknown_asset_modes():
    with pytest.raises(PluginError, match="fly-january-remote requires remote"):
        parse_site({"fly": {"assets": "local"}}, "fly-january-remote")
    with pytest.raises(PluginError, match="extra.fly.assets"):
        parse_site({"fly": {"assets": "both"}})
