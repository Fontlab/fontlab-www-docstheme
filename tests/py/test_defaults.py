"""Out-of-the-box use: bare plugin names resolve as under MaterialX, the minimal site builds.

this_file: tests/py/test_defaults.py
"""

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


def test_entry_points_when_materialx_plugins_then_each_has_a_fly_january_twin():
    declared = tomllib.loads((ROOT / "pyproject.toml").read_text())["project"]["entry-points"][
        "mkdocs.plugins"
    ]
    twins = {
        name.removeprefix("fly-january/"): value
        for name, value in declared.items()
        if name.startswith("fly-january/")
    }
    assert twins == installed_materialx_plugins(), (
        "pyproject.toml fly-january/<name> entry points must mirror the installed "
        "materialx/<name> ones; update them when mkdocs-materialx changes"
    )
    assert declared["fly"] == "fly_january.plugin:FlyPlugin"


def test_entry_points_when_installed_then_fly_january_twins_load_materialx_classes():
    live = {ep.name: ep for ep in entry_points(group="mkdocs.plugins")}
    for name, value in installed_materialx_plugins().items():
        assert live[f"fly-january/{name}"].value == value, name


@pytest.fixture(scope="module")
def minimal(tmp_path_factory):
    site = tmp_path_factory.mktemp("minimal")
    result = build(FIXTURE / "mkdocs-minimal.yml", site)
    assert result.returncode == 0, result.stdout + result.stderr
    return site


def test_minimal_when_search_bare_then_materialx_search_plugin_and_worker(minimal):
    assert list((minimal / "assets/javascripts/workers").glob("search.*.min.js")), (
        "MaterialX's search worker is shipped"
    )
    assert not (minimal / "search/worker.js").exists(), "MkDocs' own worker is not"
    assert (minimal / "search/search_index.json").is_file()
