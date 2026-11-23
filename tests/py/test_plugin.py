"""The fly plugin: extra.fly validation, precedence, page classes, chrome, assets, hooks.

this_file: tests/py/test_plugin.py
"""

import json
import re
from pathlib import Path
from types import SimpleNamespace

import pytest
from fly_january import assets
from fly_january.config import HUES, ROLE_PROPS, Look, PageConfig, parse_page, parse_site
from fly_january.fonts import head, merge_roles, resolve, roles_css, source_url
from fly_january.plugin import FlyPlugin
from fly_january.view import chrome_view, page_classes, view
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
    assert config.chrome.kind == "fontlab" and not config.utilities and not config.debug
    assert config.margin_side == "left" and config.look == Look() and config.presets == {}


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
        ({"chrome_options": {"site-url": "x"}}, "chrome_options: unknown key(s) site-url"),
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
    declared = set(
        re.findall(r"(--fly-[a-z0-9]+-[a-z]+):", (ROOT / "src/fly/tokens/type.css").read_text())
    )
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
    assert out.preconnects == ("https://use.typekit.net", "https://x.test")
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
    assert page_classes({}, config, page({"subtheme": "sitka"}))["body"] == [
        "subtheme-sitka",
        "fly-margin-left",
        "fly-chrome-fontlab",
    ]


def test_page_classes_when_page_sets_side_then_it_wins():
    assert page_classes({"margin_side": "right"}, site(), None)["body"][0] == "fly-margin-right"
    assert page_classes({}, site(margin_side="right"), None)["body"][0] == "fly-margin-right"


def test_page_classes_when_hide_toc_then_body_gets_no_l2():
    config = site()
    assert page_classes({"hide": ["toc"]}, config, None)["body"][:2] == [
        "fly-no-l2",
        "fly-margin-left",
    ]
    assert page_classes({"hide": ["navigation"]}, config, None)["body"][0] == "fly-margin-left"
    assert page_classes({"hide": None}, config, None)["body"][0] == "fly-margin-left"
    # Same test MaterialX's base.html uses to drop the L2 sidebar.
    assert page_classes({"hide": "toc"}, config, None)["body"][0] == "fly-no-l2"


def test_page_classes_when_bad_side_then_raises():
    with pytest.raises(PluginError, match="margin_side"):
        page_classes({"margin_side": "top"}, site(), None)


@pytest.mark.parametrize("side", ["fly-margin-left", "fly-margin-right"])
def test_page_classes_when_body_sets_margin_class_then_no_default_added(side):
    assert page_classes({"classes": {"body": [side]}}, site(), None)["body"] == [
        side,
        "fly-chrome-fontlab",
    ]


@pytest.mark.parametrize("value", ["foo", 5, ["body"], True])
def test_page_classes_when_classes_not_mapping_then_ignored_with_warning(value, caplog):
    assert page_classes({"classes": value}, site(), None) == {
        "body": ["fly-margin-left", "fly-chrome-fontlab"]
    }
    assert "fly: ignoring classes" in caplog.text


@pytest.mark.parametrize("names", [5, {"a": 1}, 3.5])
def test_page_classes_when_tag_value_not_list_or_string_then_ignored(names, caplog):
    classes = page_classes({"classes": {"body": names, "main": names}}, site(), None)
    assert classes == {"body": ["fly-margin-left", "fly-chrome-fontlab"], "main": []}
    assert "ignoring classes value" in caplog.text


def test_page_classes_when_unknown_tag_or_bad_names_then_warned(caplog):
    classes = page_classes({"classes": {"div": ["x"], "main": ["ok", "9bad", 7]}}, site(), None)
    assert classes == {"main": ["ok"], "body": ["fly-margin-left", "fly-chrome-fontlab"]}
    assert "unknown tag 'div'" in caplog.text
    assert "non-string" in caplog.text and "invalid class names" in caplog.text


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


def test_version_links_when_extra_css_and_js_then_local_ones_versioned(tmp_path):
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


def test_on_post_build_when_materialx_css_present_then_rescaled(tmp_path):
    d = tmp_path / "assets/stylesheets"
    d.mkdir(parents=True)
    (d / "main.abc.min.css").write_text("a{width:1rem}")
    (d / "palette.def.min.css").write_text("b{top:2rem}")
    FlyPlugin().on_post_build({"site_dir": str(tmp_path)})
    marker = assets.RESCALED
    assert (d / "main.abc.min.css").read_text() == marker + "a{width:1.3889rem}"
    assert (d / "palette.def.min.css").read_text() == marker + "b{top:2.7778rem}"
    FlyPlugin().on_post_build({"site_dir": str(tmp_path)})
    assert (d / "main.abc.min.css").read_text() == marker + "a{width:1.3889rem}", (
        "second run: no-op"
    )


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
        '<body dir="ltr" class="p subtheme-sitka fly-margin-left fly-chrome-fontlab" data-fly-hue="magenta">'
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
