# this_file: src_docs/hooks/compiled_examples.py
"""Publish copy blocks from the same final HTML that renders each specimen."""

import html
import re

from bs4 import BeautifulSoup
from mkdocs.plugins import event_priority

SPECIMEN = re.compile(
    r"<!-- specimen:([a-z][a-z0-9-]*)( html)? -->\s*\n(.*?)\n<!-- /specimen -->",
    re.DOTALL,
)
COMPILED = re.compile(
    r"<!-- compiled-specimen:([a-z][a-z0-9-]*) -->\s*(.*?)\s*<!-- /compiled-specimen -->",
    re.DOTALL,
)


def on_page_markdown(markdown: str, **kwargs: object) -> str:
    """Capture the authored source once, then let MkDocs render it normally."""
    if "<!-- specimen:" not in markdown and "<!-- /specimen" not in markdown:
        return markdown
    ids: set[str] = set()

    def expand(match: re.Match[str]) -> str:
        name, html_only, source = match.groups()
        if name in ids or "<!-- specimen:" in source:
            raise ValueError(f"Duplicate or nested specimen: {name}")
        ids.add(name)
        original = "" if html_only else f'<pre data-example-source="{html.escape(source, quote=True)}" hidden></pre>'
        return (
            f'<!-- compiled-specimen:{name} -->\n\n{source}\n\n'
            f'{original}\n\n<!-- /compiled-specimen -->'
        )

    expanded = SPECIMEN.sub(expand, markdown)
    if "<!-- specimen:" in expanded or "<!-- /specimen" in expanded:
        raise ValueError("Malformed or unclosed specimen marker")
    return expanded


def copy_panel(soup: BeautifulSoup, name: str, language: str, source: str):
    """Create selectable source with an explicitly named clipboard button."""
    panel = soup.new_tag("div", attrs={"class": "fl-example-code", "data-copy-language": language})
    bar = soup.new_tag("div", attrs={"class": "fl-example-codebar"})
    label = soup.new_tag("span")
    label.string = "HTML · compiled output" if language == "html" else "Markdown · authored source"
    target = f"{name}-{language}"
    button = soup.new_tag("button", attrs={"type": "button", "data-copy-target": target, "aria-label": f"Copy {language.upper()} for {name.removeprefix('example-').replace('-', ' ')}"})
    button.string = "Copy HTML" if language == "html" else "Copy Markdown"
    bar.extend([label, button])
    pre = soup.new_tag("pre", attrs={"tabindex": "0", "class": "no-copy"})
    code = soup.new_tag("code", attrs={"id": target, "class": f"language-{language}"})
    code.string = source
    pre.append(code)
    panel.extend([bar, pre])
    return panel


@event_priority(-100)
def on_post_page(output: str, **kwargs: object) -> str:
    """Extract after Markdown, theme and other page-output transformations."""
    if '<!-- compiled-specimen:' not in output:
        return output
    return COMPILED.sub(render_example, output)


def render_example(match: re.Match[str]) -> str:
    """Wrap only compiled HTML, avoiding interference with Markdown's parser."""
    name, content = match.groups()
    soup = BeautifulSoup(content, "html.parser")
    original = soup.select_one("pre[data-example-source]")
    source = original["data-example-source"] if original is not None else None
    if original is not None:
        original.decompose()
    example = soup.new_tag("section", attrs={"class": "fl-example", "id": f"example-{name}"})
    preview = soup.new_tag("div", attrs={"class": "fl-example-preview"})
    preview.extend(list(soup.contents))
    example.append(preview)
    compiled = preview.decode_contents(formatter="html5").strip()
    example.append(copy_panel(soup, example["id"], "html", compiled))
    if source is not None:
        example.append(copy_panel(soup, example["id"], "markdown", source))
    status = soup.new_tag("p", attrs={"class": "fl-example-copy-status", "role": "status", "aria-live": "polite"})
    example.append(status)
    return example.decode(formatter="html5")
