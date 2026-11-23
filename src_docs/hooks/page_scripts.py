# this_file: src_docs/hooks/page_scripts.py
"""Load Mermaid, MathJax and Chart.js only on pages whose front matter asks for them.

Front matter flags (each `true`): `mermaid` (diagram fences), `math` (arithmatex),
`chart` (Basecoat charts). The theme's main.html stays untouched: the scripts are added
to the rendered page, Mermaid and MathJax before </head>, Chart.js before </body>.
"""

from typing import Any

from mkdocs.utils import get_relative_url

MERMAID = '<script src="https://unpkg.com/mermaid@11.16.0/dist/mermaid.min.js"></script>'
MATHJAX = '<script src="https://unpkg.com/mathjax@3.2.2/es5/tex-mml-chtml.js"></script>'
CHART = (
    '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>\n'
    '<script src="https://cdn.jsdelivr.net/npm/basecoat-css@1.0.2/dist/js/chart.min.js"></script>'
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
        output = output.replace("</body>", CHART + "\n</body>", 1)
    return output
