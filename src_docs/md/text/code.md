---
this_file: src_docs/md/text/code.md
---

# Code and keys

Use inline code for literal file names, attributes and values. Use a code block
when the reader needs to copy several lines. Keyboard keys describe input;
they are not interactive buttons.

## A literal name inside prose

<!-- specimen:code-inline -->
Put component markup inside `.fltheme-components`. Add `du-` to daisyUI
component classes, as in `du-btn` and `du-btn-outline`.
<!-- /specimen -->

## A copyable code sample

The specimen is a rendered code block, so its compiled HTML includes the code
block's markup. Copy Markdown to author the same block in another document.

<!-- specimen:code-block -->
```html
<div class="fltheme-components">
  <a class="du-btn" href="https://www.fontlab.com/">FontLab</a>
</div>
```
<!-- /specimen -->

This distinction matters in a reference page: the HTML copy reproduces what
you see, including displayed code, rather than executing the displayed sample.

## Describe keyboard input

MaterialX's key notation suits a sentence. Keep the surrounding verb so the
reader knows what to do with the key.

<!-- specimen:code-materialx-keys -->
Press ++tab++ to move to the next control. Press ++shift+tab++ to move back.
<!-- /specimen -->

## Keep keycaps consistent with nearby controls

Basecoat and daisyUI keycaps can appear beside their respective controls. The
examples describe browser focus navigation, not a product-specific shortcut.

<!-- specimen:code-component-keys html -->
<div class="fltheme-components fl-pattern-grid">
  <p>Next control: <kbd class="kbd">Tab</kbd></p>
  <p>Previous control: <kbd class="du-kbd">Shift</kbd> + <kbd class="du-kbd">Tab</kbd></p>
</div>
<!-- /specimen -->

Use text labels in addition to unfamiliar symbols. Avoid presenting a
platform-specific shortcut as universal when the two operating systems differ.

## Code blocks · MaterialX { #materialx-code-blocks }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-code-blocks -->
``` yaml title="mkdocs.yml" linenums="1" hl_lines="2"
markdown_extensions:
  - attr_list
  - md_in_html
```
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/code-blocks.md)

## Kbd · Basecoat { #basecoat-kbd }

Use a keyboard element for literal input. Keep the action in the surrounding sentence so the key does not become an unexplained symbol.

<!-- specimen:basecoat-kbd html -->
<div class="fltheme-components">
<p>Press <kbd class="kbd">Tab</kbd> to move to the next control.</p>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/kbd/)

## Kbd · daisyUI { #daisyui-kbd }

Use a keyboard element for literal input. Keep the action in the surrounding sentence so the key does not become an unexplained symbol.

<!-- specimen:daisyui-kbd html -->
<div class="fltheme-components">
<p>Press <kbd class="du-kbd">Tab</kbd> to move to the next control.</p>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/kbd/)

## Code blocks: authoring details

### A titled, annotated, downloadable block

This one block combines copy, line selection, download, folding, a title, line
numbers and a highlighted line. The annotation explains the changed setting.
Expand it before copying if you want to inspect every line; copying and
 downloading retain the complete source regardless of the folded view.

<!-- specimen:code-actions -->
``` yaml title="renderer.yml" linenums="1" hl_lines="5" data-download="blob" data-fold="3"
theme:
  name: materialx
  code:
    fold:
      enabled: true # (1)!
      lines: 8
```

1. Fold long examples to shorten a page while retaining their source.
<!-- /specimen -->

### Highlight a literal inside prose

<!-- specimen:code-inline-highlight -->
`#!python range(3)` produces the indexes 0, 1 and 2.
<!-- /specimen -->

### Include tracked source

The Markdown snippet refers to a tracked source file. The compiled HTML
contains the included code, so it is independent of that file after building.

<!-- specimen:code-include -->
--8<-- "includes/renderer-snippet.md:renderer"
<!-- /specimen -->

### Show a platform shortcut

<!-- specimen:code-command-keys html -->
<div class="fltheme-components"><p>A macOS command shortcut can be written as <kbd class="kbd">⌘</kbd> + <kbd class="kbd">K</kbd>. Use the equivalent named shortcut for other platforms.</p></div>
<!-- /specimen -->

### Code copy button { #materialx-code-blocks-code-copy-button }

**Supported/live:** `content.code.copy`; see
[copy action](../renderer-capabilities.md#renderer-code-copy).

### Code selection button { #materialx-code-blocks-code-selection-button }

**Adapted/live:** `content.code.select`; see
[line selection](../renderer-capabilities.md#renderer-code-selection).

### Code download button { #materialx-code-blocks-code-download-button }

**Adapted/live:** `material.extensions.code_download`; see
[download action](../renderer-capabilities.md#renderer-code-download).

### Enable button { #materialx-code-blocks-enable-button }

Enable downloads once in the renderer, then opt a block in with tracked
attributes. The button must have a useful accessible name.

### Enhanced extension { #materialx-code-blocks-enhanced-extension }

The locked download extension supports blob, local-file, and URL strategies.
Use brace-wrapped attributes where Markdown parsing would otherwise be
ambiguous.

### Code collapse & expand { #materialx-code-blocks-code-collapse-expand }

**Adapted/live:** `theme.code.fold.enabled`; see
[code folding](../renderer-capabilities.md#renderer-code-fold). Keep the first
visible lines sufficient to identify the example.

### Change default threshold { #materialx-code-blocks-change-default-threshold }

Set `theme.code.fold.lines` centrally when most examples need the same
threshold. A threshold changes presentation, never the copied source.

### Set individual threshold { #materialx-code-blocks-set-individual-threshold }

Use `data-fold="N"` for an exceptional block. Prefer the shared threshold so
pages do not develop arbitrary folding behaviour.

### Disable folding for specific blocks { #materialx-code-blocks-disable-folding-for-specific-blocks }

Use `data-fold="0"` when every line is necessary for comparison or safe use.

### Code annotations { #materialx-code-blocks-code-annotations }

**Supported/live:** `content.code.annotate`; see
[code annotations](../renderer-capabilities.md#renderer-code-annotations).
Place markers in valid comments for the selected language.

### Custom selectors { #materialx-code-blocks-custom-selectors }

**Adapted/live:** custom annotation selectors are a renderer-level exception.
Prefer ordinary comments; a custom selector must not alter executable text.

### Adding a title { #materialx-code-blocks-adding-a-title }

**Supported/live:** use `title="filename.ext"` after the language. A title adds
context but does not replace the surrounding explanation.

### Adding annotations { #materialx-code-blocks-adding-annotations }

**Supported/live:** put `(1)` in a language comment and follow the fence with
the matching ordered list.

### Stripping comments { #materialx-code-blocks-stripping-comments }

**Supported/live:** append `!` to a marker when the renderer should remove the
comment characters. Only one stripped annotation may occupy a comment.

### Adding line numbers { #materialx-code-blocks-adding-line-numbers }

**Supported/live:** `linenums="1"` sets the visible starting number. Do not use
line numbers as the only way to identify a statement in prose.

### Highlighting specific lines { #materialx-code-blocks-highlighting-specific-lines }

**Supported/live:** `hl_lines="2 4-6"` emphasizes lines while keeping all code
available. Explain the significance outside the colour highlight.

### Highlighting inline code blocks { #materialx-code-blocks-highlighting-inline-code-blocks }

**Supported/live:** prefix an inline literal with a lexer shortcode, for
example `#!python range()`. Use plain inline code when syntax colour adds no
information.

### Embedding external files { #materialx-code-blocks-embedding-external-files }

**Supported/live:** snippets use the tracked `--8<--` include notation; see
[the canonical include](../renderer-capabilities.md#renderer-code-snippet).
Includes must stay inside the documentation source and must build offline.

### Custom syntax theme { #materialx-code-blocks-custom-syntax-theme }

**Adapted/live:** syntax tokens derive from the active theme. Change token
roles in the shared bridge; never add literal per-page colours.

### Annotation tooltip width { #materialx-code-blocks-annotation-tooltip-width }

**Adapted/live:** the shared MaterialX bridge owns tooltip width. If a note
outgrows it, edit the note before widening the global component.
