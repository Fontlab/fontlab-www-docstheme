"""The demo site (src_docs/): its configuration examples, token page, assets page and hook.

this_file: tests/py/test_demo_site.py

Every YAML block on the theme pages (src_docs/md/theme/*.md) is checked by its title:
`mkdocs.yml` blocks must validate (`extra.fly` through fly_january.config.parse_site),
`Page front matter` blocks through parse_page against the configuration page's complete
site block, and `Invalid: ...` / `Invalid page: ...` blocks must fail. A block with any
other title fails the test, so no example on those pages goes unchecked.
"""

import importlib.util
import json
import re
import subprocess
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml
from fly_january.config import (
    BLOCK_PROPS,
    BLOCK_ROLES,
    CHROME_OPTIONS,
    HUES,
    INLINE_PROPS,
    INLINE_ROLES,
    NAMED_CHROMES,
    PAGE_KEYS,
    SITE_KEYS,
    SiteConfig,
    parse_page,
    parse_site,
)
from fly_january.view import chrome_view
from mkdocs.exceptions import PluginError

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "src_docs"
THEME_PAGES = sorted((SITE / "md/theme").glob("*.md"))
FENCE = re.compile(r'^```yaml(?: title="([^"]*)")?\n(.*?)^```$', re.MULTILINE | re.DOTALL)


def blocks() -> list[tuple[str, str, dict]]:
    """(page, title, parsed YAML) for every YAML fence on the theme pages."""
    found = []
    for page in THEME_PAGES:
        for title, body in FENCE.findall(page.read_text()):
            found.append((page.name, title, yaml.safe_load(body)))
    return found


BLOCKS = blocks()


def reference_site():
    """The configuration page's complete site block (the one with presets)."""
    full = [b for p, t, b in BLOCKS if p == "configuration.md" and "presets" in str(b)]
    return parse_site(full[0]["extra"])


def test_theme_pages_when_listed_then_all_four_exist_and_have_yaml():
    assert [p.stem for p in THEME_PAGES] == ["assets", "chrome", "configuration", "tokens"]
    assert len(BLOCKS) >= 15, BLOCKS


@pytest.mark.parametrize(("page", "title", "block"), BLOCKS, ids=lambda v: str(v)[:40])
def test_yaml_example_when_validated_then_matches_its_title(page, title, block):
    site = reference_site()
    if title == "mkdocs.yml" and "extra" in block:
        parse_site(block["extra"])
    elif title == "mkdocs.yml":
        assert block == {"theme": {"name": "fly-january"}, "plugins": ["fly"]}
    elif title == "Page front matter":
        parse_page(block, site, page)
    elif title.startswith("Invalid page:"):
        with pytest.raises(PluginError, match="^fly: "):
            parse_page(block, site, page)
    elif title.startswith("Invalid:"):
        with pytest.raises(PluginError, match="^fly: "):
            parse_site(block["extra"])
    else:
        pytest.fail(f"{page}: YAML block with unknown title {title!r}")


def test_yaml_examples_when_valid_then_every_key_and_chrome_is_shown():
    site_keys, options, chromes, page_keys = set(), set(), set(), set()
    for _, title, block in BLOCKS:
        if title == "mkdocs.yml" and "extra" in block:
            fly = block["extra"]["fly"]
            site_keys |= set(fly)
            options |= set(fly.get("chrome_options", {}))
            chrome = fly.get("chrome", "fontlab")
            chromes.add(chrome if isinstance(chrome, str) else "custom")
        elif title == "Page front matter":
            page_keys |= set(block.get("fly", {}))
    assert site_keys == set(SITE_KEYS)
    assert options == set(CHROME_OPTIONS)
    assert chromes == {*NAMED_CHROMES, "custom"}
    assert page_keys == set(PAGE_KEYS)


def ignore_python_tags(loader, suffix, node):
    """mkdocs.yml names Python objects (!!python/name:...); the test only needs extra."""


def test_demo_site_config_when_parsed_then_valid_with_fly_theme():
    loader = type("Loader", (yaml.SafeLoader,), {})
    loader.add_multi_constructor("tag:yaml.org,2002:python/", ignore_python_tags)
    config = yaml.load((SITE / "mkdocs.yml").read_text(), Loader=loader)
    assert config["theme"]["name"] == "fly-january"
    assert "custom_dir" not in config["theme"]
    assert config["plugins"][0] == "fly"
    site = parse_site(config["extra"])
    assert site.chrome.kind == "fontlab"
    assert site.chrome_options["site-label"] == "Design system"
    assert site.look.hue == "cobalt"
    assert "typekit:gav0zux" in site.look.sources
    assert not any("i.fontlab.com" in str(u) for u in config["extra_css"])
    assert not any("i.fontlab.com" in str(u) for u in config["extra_javascript"])


def test_tokens_page_when_rendered_then_every_hue_variant_and_grey_in_both_schemes():
    text = (SITE / "md/theme/tokens.md").read_text()
    light, dark = text.split("### Light")[1].split("### Dark")
    # Each panel pins its scheme, so it shows its values whichever scheme the page has.
    assert 'class="fly-demo-palette" data-md-color-scheme="default"' in light
    assert 'class="fly-demo-palette" data-md-color-scheme="slate"' in dark
    for panel in (light, dark):
        for hue in HUES:
            if hue == "gray":
                names = [f"--fly-gray-{i}" for i in range(1, 10)]
            else:
                names = [f"--fly-{hue}{v}" for v in ("", "-soft", "-deep", "-tint")]
            for name in names:
                assert f"var({name})" in panel, name


def test_assets_page_when_rendered_then_names_the_built_version():
    script = "import('./scripts/build-cdn.mjs').then((m) => console.log(m.FLY_VERSION))"
    version = subprocess.run(
        ["node", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()
    text = (SITE / "md/theme/assets.md").read_text()
    urls = set(re.findall(r"fontlab-www-docstheme/fly/([^/\s)\"]+)/", text))
    assert urls == {version}, urls
    assert f"This release is `{version}`" in text
    assert f'"version": "{version}"' in text and f'"latest": "{version}"' in text
    pins = json.loads((ROOT / "package.json").read_text())["devDependencies"]
    libraries = {pins["basecoat-css"], pins["daisyui"]}
    assert f"Basecoat {pins['basecoat-css']}" in text and f"daisyUI {pins['daisyui']}" in text
    assert set(re.findall(r"\b\d+\.\d+\.\d+\b", text)) == {version} | libraries


def ticks(text: str) -> list[str]:
    """The backticked words of a Markdown fragment, in order."""
    return re.findall(r"`([^`]+)`", text)


def site_table() -> dict[str, tuple[str, str]]:
    """The configuration page's site-keys table: key -> (default cell, value cell)."""
    text = (SITE / "md/theme/configuration.md").read_text()
    table = text.split("## Site keys")[1].split("A complete site block")[0]
    rows = re.findall(r"^\| `([a-z_.]+)` \| (.*?) \| (.*?) \|$", table, re.MULTILINE)
    return {key: (default, value) for key, default, value in rows}


def test_configuration_table_when_compared_with_the_parser_then_keys_and_names_match():
    table = site_table()
    expected = [k for k in SITE_KEYS if k != "fonts"] + ["fonts.sources", "fonts.roles"]
    assert sorted(table) == sorted(expected)
    assert ticks(table["hue"][1]) == list(HUES)
    assert ticks(table["chrome_options"][1]) == list(CHROME_OPTIONS)
    assert ticks(table["chrome"][1])[:3] == list(NAMED_CHROMES)


def test_configuration_table_when_compared_with_defaults_then_default_cells_match():
    table, defaults = site_table(), SiteConfig()
    assert ticks(table["chrome"][0]) == [defaults.chrome.kind]
    assert ticks(table["margin_side"][0]) == [defaults.margin_side]
    assert ticks(table["utilities"][0]) == [str(defaults.utilities).lower()]
    assert ticks(table["debug"][0]) == [str(defaults.debug).lower()]
    # No site hue by default; the accent then comes from semantic.css.
    assert defaults.look.hue is None and table["hue"][0] == "none (accent `cobalt`)"
    semantic = (ROOT / "src/fly/tokens/semantic.css").read_text()
    assert re.search(r"--fly-accent: var\(--fly-([a-z]+)\)", semantic)[1] == "cobalt"


def test_configuration_roles_when_compared_with_the_parser_then_roles_and_props_match():
    text = (SITE / "md/theme/configuration.md").read_text()
    sentence = text.split("Role properties:")[1].split("Values are plain CSS")[0]
    block, inline = sentence.split("; inline roles")
    roles, props = block.split(") take")
    assert ticks(roles) == list(BLOCK_ROLES) and ticks(props) == list(BLOCK_PROPS)
    roles, props = inline.split(") take")
    assert ticks(roles) == list(INLINE_ROLES) and ticks(props) == list(INLINE_PROPS)


def test_chrome_page_when_compared_with_the_view_then_menu_attributes_match():
    text = (SITE / "md/theme/chrome.md").read_text()
    config = {"site_name": "Site", "site_url": "https://example.com/"}
    attrs = chrome_view(parse_site({"fly": {"chrome": "fontlab"}}), config).header_attrs
    assert attrs["mode"] == "dark" and 'mode="dark"' in text
    assert attrs["site-label"] == "Site" and "`site-label` (default: `site_name`)" in text
    assert attrs["site-url"] == config["site_url"] and "`site-url`\n(`site_url`)" in text
    for key in ("mobile-menu", "mobile-search"):
        assert attrs[key] == "materialx" and f'`{key}="materialx"`' in text
    view = chrome_view(parse_site({"fly": {"chrome": "vexy"}}), config)
    assert (view.header, view.footer) == ("vexy-menu", "vexy-footer")
    assert view.script in text and "<vexy-menu>" in text


def page_scripts():
    spec = importlib.util.spec_from_file_location("page_scripts", SITE / "hooks/page_scripts.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


HTML = "<html><head><title>t</title></head><body><p>x</p></body></html>"


def test_page_scripts_when_no_flags_then_page_unchanged():
    page = SimpleNamespace(meta={"title": "x"}, url="data/statistics/")
    assert page_scripts().on_post_page(HTML, page=page) == HTML


def test_page_scripts_when_flags_then_loaders_in_head_and_chart_before_body_end():
    hook = page_scripts()
    page = SimpleNamespace(meta={"mermaid": True, "math": True, "chart": True}, url="data/x/")
    out = hook.on_post_page(HTML, page=page)
    head, body = out.split("</head>")
    assert hook.MERMAID in head and hook.MATHJAX in head
    assert '<script src="../../assets/javascripts/mathjax.js"></script>' in head
    assert head.index("mathjax.js") < head.index(hook.MATHJAX), "configuration before MathJax"
    assert body.endswith(hook.CHART + "\n</body></html>")


def test_page_scripts_when_body_tag_quoted_earlier_then_chart_goes_before_the_last():
    hook = page_scripts()
    html = "<html><head></head><body><pre>&lt;/body&gt;</pre><code></body></code></body></html>"
    out = hook.on_post_page(html, page=SimpleNamespace(meta={"chart": True}, url="x/"))
    assert out.count(hook.CHART) == 1
    assert out.endswith(hook.CHART + "\n</body></html>")
    assert "<code></body></code>" in out


def test_page_scripts_when_pinned_then_every_cdn_tag_has_integrity_and_crossorigin():
    hook = page_scripts()
    tags = re.findall(r"<script [^>]*>", f"{hook.MERMAID}\n{hook.MATHJAX}\n{hook.CHART}")
    assert len(tags) == 4
    for tag in tags:
        assert re.search(r'integrity="sha384-[A-Za-z0-9+/]{64}"', tag), tag
        assert 'crossorigin="anonymous"' in tag and re.search(r"@\d+\.\d+\.\d+/", tag), tag
