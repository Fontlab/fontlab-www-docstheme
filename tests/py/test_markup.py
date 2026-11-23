"""Content and page rewrites ported from the prototype's hook tests (renamed to fly-*).

this_file: tests/py/test_markup.py
"""

import re
from pathlib import Path

import pytest
from fly_january.markup import (
    add_classes,
    class_names,
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


def test_class_names_when_string_or_list_then_invalid_names_dropped():
    assert class_names("one two") == ["one", "two"]
    assert class_names(["ok", "9bad", "a<b", "_x-1"]) == ["ok", "_x-1"]
    assert class_names(None) == []


def test_add_classes_when_class_attr_exists_then_appended():
    html = add_classes(PAGE, {"main": ["wide"], "article": ["x", "y"]})
    assert '<main class="md-main wide">' in html
    assert '<article class="a x y">' in html


def test_add_classes_when_no_class_attr_then_added():
    assert '<body dir="ltr" class="b">' in add_classes(PAGE, {"body": ["b"]})


def test_add_classes_when_tag_repeats_then_only_first_patched():
    html = add_classes("<article>1</article><article>2</article>", {"article": ["k"]})
    assert html == '<article class="k">1</article><article>2</article>'


def test_add_classes_when_custom_element_shares_prefix_then_not_patched():
    html = add_classes('<main-x class="c"></main-x><main>', {"main": ["m"]})
    assert html == '<main-x class="c"></main-x><main class="m">'


def test_add_classes_when_class_unquoted_then_merged_into_one_attribute():
    out = add_classes("<body class=foo data-x=1>", {"body": ["fly-margin-left"]})
    assert out == '<body class="foo fly-margin-left" data-x=1>', out


@pytest.mark.parametrize(
    "head",
    [
        "<script>var s = '<body class=\"fake\"><main><article>';</script>",
        '<style>/* <body> <main class="x"> <article> */</style>',
        '<!-- <body class="x"> <main> <article> -->',
    ],
)
def test_add_classes_when_tags_in_script_style_or_comment_then_real_tags_patched(head):
    out = add_classes(head + PAGE, {"body": ["b"], "main": ["m"], "article": ["k"]})
    expected = head + PAGE.replace('dir="ltr"', 'dir="ltr" class="b"').replace(
        '"md-main"', '"md-main m"'
    ).replace('class="a"', 'class="a k"')
    assert out == expected, out


def test_add_classes_when_content_has_literal_tags_then_content_untouched():
    content = (
        '<pre><code>&lt;body&gt; <article> <main class="x"></code></pre>'
        '<main><article class="inner">raw</article></main>'
    )
    html = PAGE.replace(">x<", f">{content}<")
    out = add_classes(html, {"body": ["b"], "main": ["m"], "article": ["k"]})
    assert out.count('class="b"') == 1 and out.count('"md-main m"') == 1 and out.count('"a k"') == 1
    assert content in out, out


def test_add_classes_when_gt_inside_attribute_value_then_whole_tag_kept():
    out = add_classes('<body data-x="a>b" class="c">', {"body": ["fly-margin-left"]})
    assert out == '<body data-x="a>b" class="c fly-margin-left">', out


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
