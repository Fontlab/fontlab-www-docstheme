"""Theme package skeleton: discovery, inheritance and a strict fixture build.

this_file: tests/py/test_theme_package.py
"""

import subprocess
import sys
from importlib.metadata import entry_points
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = ROOT / "fixtures" / "fly"


@pytest.mark.parametrize("group", ["properdocs.themes", "mkdocs.themes"])
def test_theme_when_entry_point_group_then_discoverable(group):
    found = {ep.name: ep.value for ep in entry_points(group=group)}
    assert found.get("fly-january") == "fly_january", f"{group}: {found}"


def test_plugin_when_entry_point_then_loads_flyplugin():
    (ep,) = [e for e in entry_points(group="mkdocs.plugins") if e.name == "fly"]
    assert ep.load().__name__ == "FlyPlugin"


def test_theme_package_when_imported_then_ships_theme_config():
    import fly_january

    assert (Path(fly_january.__file__).parent / "mkdocs_theme.yml").is_file()


@pytest.fixture(scope="module")
def built_site(tmp_path_factory):
    site = tmp_path_factory.mktemp("site")
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "properdocs",
            "build",
            "--strict",
            "-f",
            str(FIXTURE / "mkdocs.yml"),
            "-d",
            str(site),
        ],
        capture_output=True,
        text=True,
        cwd=FIXTURE,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
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
    for name in ("fly.css", "fly-tokens.css", "fly-utilities.css", "fly.js", "fly-bridge.js", "fly-debug.js"):
        assert (built_site / "assets" / "fly" / name).is_file(), name
    html = (built_site / "guide" / "index.html").read_text()
    links = [line for line in html.splitlines() if "assets/fly/" in line]
    assert any('href="../assets/fly/fly.css"' in line for line in links), links
    assert any('href="../assets/fly/fly-utilities.css"' in line for line in links), links
    assert any('src="../assets/fly/fly-bridge.js"' in line for line in links), links
    assert any('type="module" src="../assets/fly/fly.js"' in line for line in links), links
    assert html.index("assets/stylesheets/main.") < html.index("assets/fly/fly.css"), "fly.css loads after MaterialX"


def test_fixture_when_built_then_renders_fontlab_chrome_and_fly_partials(built_site):
    html = (built_site / "guide" / "index.html").read_text()
    assert "<fontlab-menu " in html and "<fontlab-footer " in html
    assert "fly-arrow" in html, "partials/footer.html previous/next arrows"
