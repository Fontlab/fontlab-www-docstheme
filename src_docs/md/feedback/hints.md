---
this_file: src_docs/md/feedback/hints.md
---

# Notifications and hints

Keep the main instruction visible. Tooltips, annotations and footnotes hold optional context; notifications acknowledge an action. If losing a message would prevent the reader from continuing, give it a persistent place on the page.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Tooltips · MaterialX { #materialx-tooltips }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-tooltips -->
[FontLab 8 manual](https://help.fontlab.com/fontlab/8/ "Opens the FontLab 8 manual")

An OTF filename describes the file container, not the whole design.

*[OTF]: OpenType font file
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/tooltips.md)

## Tooltip · Basecoat { #basecoat-tooltip }

Add brief optional context to an already labelled control.

**Behaviour and access.** Use data-tooltip on a focusable element. Essential instructions must remain visible; do not put links or actions inside a tooltip. Check keyboard focus as well as hover.

<!-- specimen:basecoat-tooltip html -->
<div class="fltheme-components">
<a class="btn" data-tooltip="Opens the FontLab 8 manual" data-variant="outline" href="https://help.fontlab.com/fontlab/8/">Read the manual</a>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/tooltip/)

## Tooltip · daisyUI { #daisyui-tooltip }

Hover or focus the manual link to reveal optional context. The visible link
label already names its destination, so the tooltip carries no essential
instruction.

<!-- specimen:daisyui-tooltip html -->
<div class="fltheme-components">
<a class="du-btn du-tooltip" data-tip="Opens the FontLab 8 manual" href="https://help.fontlab.com/fontlab/8/">Read the manual</a>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/tooltip/)

## Annotations · MaterialX { #materialx-annotations }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-annotations -->
Font conversion should preserve the decisions in the family. (1)
{ .annotate }

1. Names, outlines, spacing, kerning and family structure all need inspection.
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/annotations.md)

## Footnotes · MaterialX { #materialx-footnotes }

The footnote marker and collected note belong together. The explicit footnote placement marker keeps both inside the compiled specimen, so copying its HTML retains the note and return link.

<!-- specimen:materialx-footnotes -->
Keep the original font files for comparison.[^conversion-source]

[^conversion-source]: This advice accompanies the font-conversion layout demonstration.

///Footnotes Go Here///
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/footnotes.md)

## Toast · Basecoat { #basecoat-toast }

Click the button to create a temporary notice. The runtime requires the notification region to use `id="toaster"`; keep one region per page. Its generated notices include dismissal controls. The notification explicitly reports a demonstration; no save operation takes place.

<!-- specimen:basecoat-toast html -->
<div class="fltheme-components">
<button class="btn" onclick="document.getElementById('toaster').toast({title:'Sample notice',description:'This demonstrates a notification. No data was saved.'})" type="button">Show sample notice</button><div aria-label="Sample notifications" class="toaster" id="toaster" role="region"></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/toast/)

## Toast · daisyUI { #daisyui-toast }

This static notification shows the message surface inside the specimen. A
product may position it with `du-toast`, but must also decide when to create
and dismiss the message. This sample does not report an actual export.

<!-- specimen:daisyui-toast html -->
<div class="fltheme-components">
<div aria-label="Visible toast specimen" class="fl-ui fl-ui-stack">
<div class="du-alert du-alert-success" role="status"><span>Export finished.</span></div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/toast/)

## Annotations: authoring details

### Annotation icons { #materialx-annotations-annotation-icons }

The renderer supplies the marker icon. Change it centrally in theme
configuration, not per paragraph, so the interaction remains recognisable.

### Using annotations { #materialx-annotations-using-annotations }

Add `{ .annotate }` to the outer host and follow it with a numbered list whose
items match the markers. The specimen above is the preferred minimal pattern.

### in annotations { #materialx-annotations-in-annotations }

Nested annotations are supported. Mark the containing list item with
`.annotate`, and keep nesting shallow enough to follow by keyboard.

### in admonitions { #materialx-annotations-in-admonitions }

An admonition title or body may host a marker. Use it for optional context, not
to explain the warning itself.

### in content tabs { #materialx-annotations-in-content-tabs }

A tab panel may host annotations. Give every panel enough context to stand on
its own because linked tabs can change the selected panel elsewhere.

### in everything else { #materialx-annotations-in-everything-else }

For structures that cannot accept an attribute list, wrap the smallest useful
region in Markdown-aware HTML. Preserve semantic elements and reading order.


## Footnotes: authoring details

### Footnote tooltips { #materialx-footnotes-footnote-tooltips }

The same footnote is available in a focusable tooltip and in the collected
footnote list. Never write content that only works in one presentation.

### Adding footnote references { #materialx-footnotes-adding-footnote-references }

Write `[^measure]` immediately after the relevant phrase. Reuse an identifier
only when every reference points to the same note.

### Adding footnote content { #materialx-footnotes-adding-footnote-content }

Define the matching identifier anywhere in the source; the renderer collects
notes after the article and adds backlinks.

### on a single line { #materialx-footnotes-on-a-single-line }

Use `[^short]: A concise note.` when one sentence is enough.

### on multiple lines { #materialx-footnotes-on-multiple-lines }

Indent continuation paragraphs beneath the definition. Keep multi-paragraph
notes rare; a substantial argument belongs in the main article.


## Tooltips: authoring details

### Improved tooltips { #materialx-tooltips-improved-tooltips }

The renderer enhances native title and glossary text visually while preserving
the underlying meaning for keyboard and assistive-technology users.

[FontLab](https://www.fontlab.com/ "Font editor and font tools") publishes the
same destination whether or not its supplementary tooltip is visible.

### Adding tooltips { #materialx-tooltips-adding-tooltips }

Attach short supplementary text to an already understandable phrase. Do not
put instructions, links, or the only instance of a fact inside a tooltip.

[Export the font](#daisyui-toast "Create the selected font files") rather than relying
on an unexplained icon.

### Adding abbreviations { #materialx-tooltips-adding-abbreviations }

Define an unfamiliar abbreviation once, then use it consistently. The expanded
term belongs in the document even when the enhanced tooltip is unavailable.

The API exposes the same export action used by the application.

### Adding a glossary { #materialx-tooltips-adding-a-glossary }

Place shared definitions in the tracked glossary when several pages use the
same term. A local definition is better for a term that appears on one page;
duplicated global definitions drift quietly.

*[API]: Application programming interface
