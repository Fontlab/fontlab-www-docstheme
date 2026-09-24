#!/usr/bin/env python3
# this_file: scripts/package-starter.py
"""Package only authored starter files into a reproducible download."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / "examples/starter"
files = ["README.md", "requirements.txt", "mkdocs.yml", "overrides/main.html",
         "docs/index.md", "docs/next.md"]
with ZipFile(root / "dist/starter.zip", "w") as archive:
    for name in files:
        info = ZipInfo(f"fontlab-materialx-starter/{name}", (2026, 1, 1, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, (source / name).read_bytes())
