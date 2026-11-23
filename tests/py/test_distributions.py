"""Audit the actual sdist and the wheel built from it.

this_file: tests/py/test_distributions.py
"""

import subprocess
import tarfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
THEME = ROOT / "theme" / "fly_january"
SDIST_DIRS = ("theme/fly_january/", "tests/py/", "fixtures/fly/")
# Hatch includes its VCS exclusion file and generates PKG-INFO.
SDIST_ROOT = {"README.md", "LICENSE", "CHANGELOG.md", "pyproject.toml", ".gitignore", "PKG-INFO"}


def test_distributions_contain_only_public_sources_and_complete_theme(tmp_path):
    subprocess.run(["uv", "build", "--out-dir", tmp_path], cwd=ROOT, check=True)
    (sdist,) = tmp_path.glob("*.tar.gz")
    (wheel,) = tmp_path.glob("*.whl")
    # Construct the byte sequence so this test can itself ship in the sdist.
    home_prefix = b"/" + b"Users/"
    with tarfile.open(sdist) as archive:
        source_paths = set()
        for member in archive.getmembers():
            _, path = member.name.split("/", 1)
            assert member.isfile(), path
            assert path in SDIST_ROOT or path.startswith(SDIST_DIRS), path
            assert not {".superpowers", "review", "issues", "consumers.json"} & set(Path(path).parts)
            assert home_prefix not in archive.extractfile(member).read(), path
            source_paths.add(path)
        assert {"README.md", "LICENSE", "CHANGELOG.md", "pyproject.toml"} <= source_paths
        assert all(any(p.startswith(d) for p in source_paths) for d in SDIST_DIRS)

    expected_payload = {
        p.relative_to(THEME.parent).as_posix()
        for p in THEME.rglob("*")
        if p.is_file() and "__pycache__" not in p.parts and p.name != ".DS_Store"
    }
    info = f"{sdist.name.removesuffix('.tar.gz')}.dist-info/"
    metadata = {"METADATA", "WHEEL", "entry_points.txt", "licenses/LICENSE", "RECORD"}
    with zipfile.ZipFile(wheel) as archive:
        files = set(archive.namelist())
        assert files == expected_payload | {info + name for name in metadata}
        for path in files:
            assert home_prefix not in archive.read(path), path
    assert {f"theme/{p}" for p in expected_payload} <= source_paths
