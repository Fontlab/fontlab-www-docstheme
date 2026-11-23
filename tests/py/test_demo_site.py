"""The demo site (src_docs/): its configuration examples, token page, assets page and hook.

this_file: tests/py/test_demo_site.py

Every YAML block on the theme pages (src_docs/md/theme/*.md) is checked by its title:
`mkdocs.yml` blocks must validate (`extra.fly` through fly_january.config.parse_site),
`Page front matter` blocks through parse_page against the configuration page's complete
site block, and `Invalid: ...` / `Invalid page: ...` blocks must fail. A block with any
other title fails the test, so no example on those pages goes unchecked.
"""

import importlib.util
import re
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml
from fly_january.config import (
    CHROME_OPTIONS,
    HUES,
    NAMED_CHROMES,
    PAGE_KEYS,
    SITE_KEYS,
    parse_page,
    parse_site,
)
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
    assert 'data-md-color-scheme="slate"' in dark and "data-md-color-scheme" not in light
    for panel in (light, dark):
        for hue in HUES:
            if hue == "gray":
                names = [f"--fly-gray-{i}" for i in range(1, 10)]
            else:
                names = [f"--fly-{hue}{v}" for v in ("", "-soft", "-deep", "-tint")]
            for name in names:
                assert f"var({name})" in panel, name


def test_assets_page_when_rendered_then_names_the_built_version():
    version = re.search(r"FLY_VERSION = '([^']+)'", (ROOT / "scripts/build-cdn.mjs").read_text())[1]
    text = (SITE / "md/theme/assets.md").read_text()
    urls = set(re.findall(r"fontlab-www-docstheme/fly/([^/\s)\"]+)/", text))
    assert urls == {version}, urls


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
