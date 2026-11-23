"""Theme package skeleton: discovery, inheritance and a strict fixture build.

this_file: tests/py/test_theme_package.py
"""

import re
import subprocess
import sys
from importlib.metadata import entry_points
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = ROOT / "fixtures" / "fly"


def test_theme_when_registered_then_only_mkdocs_group_and_properdocs_finds_it():
    from properdocs.utils import get_theme_names, get_themes

    found = {ep.name: ep.value for ep in entry_points(group="mkdocs.themes")}
    assert found.get("fly-january") == "fly_january", found
    assert "fly-january" not in {ep.name for ep in entry_points(group="properdocs.themes")}, (
        "a second registration makes ProperDocs warn about a duplicate provider"
    )
    assert "fly-january" in get_theme_names()
    assert get_themes()["fly-january"].value == "fly_january"


def test_plugin_when_entry_point_then_loads_flyplugin():
    (ep,) = [e for e in entry_points(group="mkdocs.plugins") if e.name == "fly"]
    assert ep.load().__name__ == "FlyPlugin"


def test_theme_package_when_imported_then_ships_theme_config():
    import fly_january

    assert (Path(fly_january.__file__).parent / "mkdocs_theme.yml").is_file()


def build(config: Path, site: Path) -> subprocess.CompletedProcess:
    """`properdocs build --strict` of one fixture config into `site`."""
    return subprocess.run(
        [
            sys.executable,
            "-m",
            "properdocs",
            "build",
            "--strict",
            "-f",
            str(config),
            "-d",
            str(site),
        ],
        capture_output=True,
        text=True,
        cwd=config.parent,
        check=False,
    )


@pytest.fixture(scope="module")
def built_site(tmp_path_factory):
    site = tmp_path_factory.mktemp("site")
    result = build(FIXTURE / "mkdocs.yml", site)
    assert result.returncode == 0, result.stdout + result.stderr
    log = (result.stdout + result.stderr).lower()
    assert "duplicate" not in log and "provided by the python packages" not in log, log
    return site


def test_fixture_when_built_strict_then_all_pages_exist(built_site):
    for page in ("index.html", "guide/index.html", "reference/index.html"):
        assert (built_site / page).is_file(), page


def test_fixture_when_built_then_contains_materialx_markup(built_site):
    html = (built_site / "index.html").read_text()
    assert "md-header" in html and "md-content" in html, "MaterialX markup missing"


def test_fixture_when_built_then_contains_child_main_html_marker(built_site):
    html = (built_site / "index.html").read_text()
    assert '<meta name="fly-january" content="skeleton">' in html


def test_fixture_when_built_then_ships_and_links_fly_assets(built_site):
    for name in (
        "fly.css",
        "fly-tokens.css",
        "fly-utilities.css",
        "fly.js",
        "fly-bridge.js",
        "fly-debug.js",
    ):
        assert (built_site / "assets" / "fly" / name).is_file(), name
    html = (built_site / "guide" / "index.html").read_text()
    links = [line for line in html.splitlines() if "assets/fly/" in line]
    v = r"\?v=[0-9a-f]{10}"
    assert any(re.search(rf'href="\.\./assets/fly/fly\.css{v}"', line) for line in links), links
    assert any(re.search(rf'src="\.\./assets/fly/fly-bridge\.js{v}"', line) for line in links), (
        links
    )
    assert any(
        re.search(rf'type="module" src="\.\./assets/fly/fly\.js{v}"', line) for line in links
    ), links
    assert "fly-utilities.css" not in html, "utilities load only with extra.fly.utilities: true"
    assert html.index("assets/stylesheets/main.") < html.index("assets/fly/fly.css"), (
        "fly.css loads after MaterialX"
    )


def test_fixture_when_built_then_renders_fontlab_chrome_and_fly_partials(built_site):
    html = (built_site / "guide" / "index.html").read_text()
    assert "<fontlab-menu " in html and "<fontlab-footer " in html
    assert "fly-arrow" in html, "partials/footer.html previous/next arrows"
