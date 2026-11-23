# this_file: src_docs/hooks/page_scripts.py
"""Load Mermaid, MathJax and Chart.js only on pages whose front matter asks for them.

Front matter flags (each `true`): `mermaid` (diagram fences), `math` (arithmatex),
`chart` (Basecoat charts). The theme's main.html stays untouched: the scripts are added
to the rendered page, Mermaid and MathJax before the first </head>, Chart.js before the
last </body>, each with its subresource-integrity hash.
"""

from typing import Any

from mkdocs.utils import get_relative_url


def pinned(url: str, sha384: str) -> str:
    """A script tag for a pinned CDN file with its subresource-integrity hash.

    The hashes were computed from the pinned files (openssl dgst -sha384 -binary | base64);
    change the version and the hash together.
    """
    return f'<script src="{url}" integrity="sha384-{sha384}" crossorigin="anonymous"></script>'


MERMAID = pinned(
    "https://unpkg.com/mermaid@11.16.0/dist/mermaid.min.js",
    "T/0lMUdJpd2S1ZHtRiofG3htU3xPCrFVeAQ1UUE2TJwlEJSV5NUwn30kP28n238E",
)
MATHJAX = pinned(
    "https://unpkg.com/mathjax@3.2.2/es5/tex-mml-chtml.js",
    "Wuix6BuhrWbjDBs24bXrjf4ZQ5aFeFWBuKkFekO2t8xFU0iNaLQfp2K6/1Nxveei",
)
CHART = "\n".join(
    [
        pinned(
            "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js",
            "jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ",
        ),
        pinned(
            "https://cdn.jsdelivr.net/npm/basecoat-css@1.0.2/dist/js/chart.min.js",
            "Sn28rPtKJJwqYWDSBOVgYGvXTIcKeCH/1Bul1EX+r3f/HqDzRtF1Z5Eyq0AKFr5Q",
        ),
    ]
)


def head_scripts(meta: dict[str, Any], page_url: str) -> list[str]:
    """Scripts for <head>: Mermaid, then the MathJax configuration and MathJax."""
    scripts = [MERMAID] if meta.get("mermaid") else []
    if meta.get("math"):
        config = get_relative_url("assets/javascripts/mathjax.js", page_url)
        scripts += [f'<script src="{config}"></script>', MATHJAX]
    return scripts


def on_post_page(output: str, page: Any, **_: Any) -> str:
    """Insert the scripts the page's front matter flags ask for."""
    meta = page.meta or {}
    head = head_scripts(meta, page.url)
    if head:
        output = output.replace("</head>", "\n".join(head) + "\n</head>", 1)
    if meta.get("chart"):
        # The page's own </body>, not one quoted in a code sample earlier in the page.
        before, tag, after = output.rpartition("</body>")
        output = f"{before}{CHART}\n{tag}{after}" if tag else output
    return output
