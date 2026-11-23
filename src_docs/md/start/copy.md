---
this_file: src_docs/md/start/copy.md
---

# Copy and adapt

The HTML panel contains the markup extracted from the compiled specimen above
it. Attribute lists have become attributes; Markdown links, emphasis and lists
have become HTML. The build creates the panel after the page renderer runs.

## Copy a specimen

1. Click **Copy HTML** below the specimen.
2. Paste into a page with the [required styles and scripts](setup.md).
3. Replace the text, destinations and sample values.
4. Rename IDs and their references if you repeat the specimen on one page.
5. Check the result at a narrow width and with the keyboard.

If clipboard access is unavailable, the button selects the code and announces
the fallback. Use your system Copy command. You can also select code directly
without JavaScript.

## Markdown becomes the displayed HTML

The `title` attribute, two classes and ID below are all authored in one attribute
list. The compiled panel shows what the installed Markdown renderer made of it.

<!-- specimen:copy-attributes -->
[Read the FontLab manual](https://help.fontlab.com/fontlab/8/){ .md-button .md-button--primary #manual-link title="FontLab 8 documentation" }
<!-- /specimen -->

Attribute lists attach to the preceding inline element. For a paragraph or a
list, place the attribute list on its own line in the position documented for
that block. See [Python-Markdown attribute lists](https://python-markdown.github.io/extensions/attr_list/).

## Keep the context

| Copied with the HTML | Supplied by your page |
| --- | --- |
| Element names, classes and attributes | Shared theme CSS and MaterialX content styles |
| Wrapper elements inside the specimen | The page's `.md-typeset` content container |
| IDs and ARIA references inside the specimen | Unique IDs across the whole destination page |
| Explicit inline handlers, if an example includes them | Any named application handlers described by that example |
| Compiled links and image URLs | A valid base URL for relative links |

The copy is the initial compiled state. It does not record changes you make in
a field, an open dialog or the runtime's internal widget state. Basecoat markup
inserted later is initialised by `basecoat.js` and follows the page's light or dark
mode through the theme's `fly.js` ([setup](setup.md)). MaterialX widgets may need MaterialX's own page initialization;
copying their HTML into an unrelated site does not install that runtime.

## Use Markdown where it fits

Use Markdown for prose, lists, simple tables, notes and links with classes.
Keep controls such as `<input>`, `<select>` and `<dialog>` as HTML. The Markdown
panel can include HTML wrappers with `markdown="1"`; it is the source that
actually produced the specimen, not a proposed approximation.

The source marker format and final extraction hook are documented in
`src_docs/hooks/compiled_examples.py`. Markers enclose one independent specimen;
nested, duplicated or incomplete markers fail the build.
