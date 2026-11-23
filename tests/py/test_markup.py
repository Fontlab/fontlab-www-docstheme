"""Content and page rewrites ported from the prototype's hook tests (renamed to fly-*).

this_file: tests/py/test_markup.py
"""

import re
from pathlib import Path

import pytest
from fly_january.markup import (
    name_permalinks,
    patch_tags,
    stray_attr_lists,
)

ROOT = Path(__file__).resolve().parents[2]
PAGE = '<html><body dir="ltr"><main class="md-main"><article class="a">x</article></main></body>'
# Classes the image-sizes plugin emits and plugin-made classes the theme CSS must style.
CONTRACT_CLASSES = (
    "img-wide",
    "img-tall",
    "img-small",
    "img-cut",
    "img-tiny",
    "edge-all-light",
    "edge-top-light",
    "edge-left-light",
    "fly-aside",
    "fly-cut",
    "fly-no-l2",
    "fly-margin-left",
    "fly-margin-right",
    "fly-chrome-fontlab",
    "fly-chrome-vexy",
)


def test_patch_tags_when_attribute_then_added_once_and_existing_kept():
    out = patch_tags(PAGE, {"body": ["b"]}, {"body": {"data-fly-hue": "teal"}})
    assert '<body dir="ltr" class="b" data-fly-hue="teal">' in out, out
    kept = patch_tags('<body data-fly-hue="rose">', {}, {"body": {"data-fly-hue": "teal"}})
    assert kept == '<body data-fly-hue="rose">'
    hidden = patch_tags("<!-- <body> --><body>", {}, {"body": {"data-fly-hue": "a&b"}})
    assert hidden == '<!-- <body> --><body data-fly-hue="a&amp;b">'


def test_name_permalinks_when_headerlink_then_aria_label_added_once():
    html = '<h2 id="a"><a class="headerlink" href="#a" title="Permanent link">¶</a>A</h2>'
    out = name_permalinks(html)
    assert out == (
        '<h2 id="a"><a aria-label="Permanent link" class="headerlink" href="#a" '
        'title="Permanent link">¶</a>A</h2>'
    )
    assert name_permalinks(out) == out


def test_name_permalinks_when_class_not_first_then_aria_label_added_once():
    html = '<h3 id="b"><a href="#b" class="headerlink" title="Permanent link">¶</a>B</h3>'
    out = name_permalinks(html)
    assert out == (
        '<h3 id="b"><a aria-label="Permanent link" href="#b" class="headerlink" '
        'title="Permanent link">¶</a>B</h3>'
    )
    assert name_permalinks(out) == out
    assert name_permalinks('<a href="#x" class="other">x</a>') == '<a href="#x" class="other">x</a>'


@pytest.mark.parametrize(
    "tag",
    [
        '<a title="x>y" href="#b" class="headerlink">',
        "<a href='#b' class = 'top headerlink' data-k=\"1\">",
        '<a\nhref="#b"\nclass="headerlink">',
    ],
)
def test_name_permalinks_when_attributes_vary_then_aria_label_added_once(tag):
    out = name_permalinks(tag + "¶</a>")
    assert out == '<a aria-label="Permanent link"' + tag[2:] + "¶</a>", out
    assert name_permalinks(out) == out


def test_name_permalinks_when_in_comment_script_or_other_attr_then_untouched():
    for html in (
        '<!-- <a class="headerlink" href="#a"> -->',
        "<script>x = '<a class=\"headerlink\">'</script>",
        '<a title="class=headerlink" href="#a">',
        '<a href="#a" class="headerlink" aria-label="Link">',
    ):
        assert name_permalinks(html) == html, html


def test_stray_attr_lists_when_attr_list_not_parsed_then_reported_outside_code():
    html = (
        '<h2 id="titletwtop-8" class="tw:mt-8">Title{ .tw:top-8 }</h2>'
        "<p>Para{.tw:mt-8}</p><p>Code <code>{ .tw:mt-8 }</code></p>"
        "<pre><code>{ .tw:mt-8 }</code></pre><p>{ .md-button }</p>"
    )
    assert stray_attr_lists(html) == ["{ .tw:top-8 }", "{.tw:mt-8}"]
    assert stray_attr_lists('<h2 class="tw:top-8">Title</h2>') == []
    goto = '<p>See [Color](color.md) { .goto }</p><p><a class="goto">Color</a></p>'
    assert stray_attr_lists(goto) == ["{ .goto }"]


def test_contract_classes_when_listed_then_each_styled_in_theme_css():
    css = (ROOT / "theme/fly_january/assets/fly/fly.css").read_text()
    for name in CONTRACT_CLASSES:
        assert re.search(rf"\.{name}(?![\w-])", css), f"{name} has no rule in fly.css"
