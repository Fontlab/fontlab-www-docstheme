---
this_file: src_docs/md/start/index.md
---

# Publish with FontLab { #field-guide }

Start with the thing you need to explain. Choose a paragraph for an idea, a list
for a sequence, or a table for facts readers need to compare. Add a card, a tab
or a control when the content needs that structure.
{ .fl-lead }

This field guide takes you from text to complete pages. Each specimen shows the
result first, then the HTML extracted from that compiled result. Where Markdown
can express the example, you can copy its source too.

## One decision, three treatments

All three links below lead to the same FontLab page. Their implementations use
MaterialX, Basecoat and prefixed daisyUI, in that order. Use the treatment that
fits the surrounding content. You do not need to choose a library for an entire
page.

<!-- specimen:start-links -->
<div class="fltheme-components fl-demo-row" markdown="1">

[Explore FontLab](https://www.fontlab.com/font-editor/fontlab/){ .md-button }
[Explore FontLab](https://www.fontlab.com/font-editor/fontlab/){ .btn data-variant="outline" }
[Explore FontLab](https://www.fontlab.com/font-editor/fontlab/){ .du-btn .du-btn-primary }

</div>
<!-- /specimen -->

The `.fltheme-components` wrapper supplies the shared Basecoat and daisyUI
styles. MaterialX classes keep their `md-` names. daisyUI component classes use
`du-`, including modifiers such as `du-btn-primary`.

## Build the page in reading order

1. [Choose a pattern](choose.md) for the reader's next decision.
2. [Copy and adapt](copy.md) the compiled HTML or authored Markdown.
3. Check the [theme and setup](setup.md) before you reuse a component elsewhere.
4. Read [Type and emphasis](../text/type.md) for the smallest useful building blocks.

The examples use FontLab and Vexy content so you can judge line length, labels,
screenshots and reading order with real material. Product text is attributed
beside the specimen. Sample values in forms and data displays describe only the
demonstration.

## A complete thought before a component

The paragraph below needs no interactive control. Its title and two sentences
give the reader enough context to follow the link.

<!-- specimen:start-paragraph -->
### Keep the family together

Font conversion is about preserving intent: names, outlines, spacing, kerning,
and family structure should survive the trip.

[TransType](https://www.fontlab.com/font-converter/transtype/) is FontLab's
dedicated tool for converting and organizing font families.
<!-- /specimen -->

Text from [Font Converter](https://www.fontlab.com/font-converter/), stored in
`www.fontlab.com/src_docs/md/font-converter.md`. The heading is adapted for this
example. Product pages that contain only a Webflow import placeholder are not
used as a prose source.
{ .fl-source-note }
