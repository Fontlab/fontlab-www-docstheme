---
this_file: src_docs/md/text/type.md
---

# Type and emphasis

Write the distinction before styling it. A heading names the subject, a lead
sets the scope, and emphasis marks the few words a scanning reader must retain.
FontLab's page themes supply typefaces and colours; the source preserves the
same reading order in every theme.

## Heading, lead and body

Use one page title. Give each substantial idea a second-level heading, and put
subtopics beneath it. A lead paragraph introduces the mechanism rather than
announcing what the page will discuss.

<!-- specimen:type-hierarchy -->
## From pixels to vector artwork

Vexy Lines transforms photos and images into expressive, scalable SVG and PDF
vector artwork: engraving lines, waves, halftone dots and letters.
{ .fl-lead }

You direct the composition with layers, fills and masks. Export vector artwork
for scaling, or a raster image for a quick share.
<!-- /specimen -->

Adapted from [Vexy Lines](https://www.vexy.art/lines/),
`www.vexy.art/src_docs/md/lines/index.md`. No price or licensing promise is part
of this specimen.
{ .fl-source-note }

## Emphasis and literal text

Use emphasis for the distinction in the sentence. Use code for literal names
such as file extensions. Highlight a UI label only when you refer to a control
the reader can find.

<!-- specimen:type-inline -->
Keep the **family structure** intact when you convert a font. Review *names,
spacing and kerning* together. The output file may use `.otf` or `.ttf`.

In FontLab 8, choose ==Window > Workspaces > Kerning== to enter the kerning
workspace.
<!-- /specimen -->

The menu path comes from the FontLab 8 tutorial
[90 Second Quick Start Kerning](https://help.fontlab.com/fontlab/8/tutorials/calfonts/3.%20Fitting%20and%20Spacing/3d-1%2090%20Second%20Quick%20Start%20Kerning/).
Local source: `fldoc/docs/fontlab/8/tutorials/calfonts/3. Fitting and Spacing/3d-1 90 Second Quick Start Kerning/index.md`.
The first paragraph adapts FontLab's font-converter introduction.
{ .fl-source-note }

## A quotation needs a source

Use a blockquote for another voice. Keep the attribution beside the words so
the reader can distinguish source material from your instruction.

<!-- specimen:type-quote -->
> Font conversion is about preserving intent: names, outlines, spacing, kerning,
> and family structure should survive the trip.

[FontLab · Font Converter](https://www.fontlab.com/font-converter/)
{ .fl-source-note }
<!-- /specimen -->

## Keep line length under control

Use the article's reading width for sustained prose. Columns work for short,
parallel items; a long explanation split into narrow cards takes more effort
to follow. Test real words with accents and long product names before choosing
a fixed card width.

## Formatting · MaterialX { #materialx-formatting }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-formatting -->
Keep **family names** intact. Use *emphasis* for a short distinction. Mark ==text to inspect==, show ~~removed wording~~ and ^^inserted wording^^ when reviewing a draft.

For notation, H~2~O and x^2^ keep the index next to its base.
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/formatting.md)

## Formatting: authoring details

### Highlighting changes { #materialx-formatting-highlighting-changes }

Critic markup can show editorial changes in review material. Publish the final
reading text rather than leaving change notation in ordinary articles.

### Highlighting text { #materialx-formatting-highlighting-text }

Use `==mark==`, `^^inserted^^`, and `~~deleted~~` sparingly.
The sentence must still communicate when emphasis styling is absent.

### Sub- and superscripts { #materialx-formatting-sub-and-superscripts }

Use H~2~O and x^2^ for short textual notation. Use the math renderer for
expressions whose structure matters.

### Adding keyboard keys { #materialx-formatting-adding-keyboard-keys }

Write a shortcut such as ++ctrl+alt+del++ only when the keys are part of an
instruction. Name platform alternatives in prose.

## A lead paragraph { #fl-lead }

A lead introduces one subject below the title. Keep the paragraph brief; the larger type does not give it heading semantics.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-lead -->
Font conversion should preserve the intent of the typeface: names, outlines, spacing, kerning and family structure.
{ .fl-lead }
<!-- /specimen -->
