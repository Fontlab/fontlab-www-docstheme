---
this_file: src_docs/md/layouts/tutorials.md
---

# Tutorials and reference

A tutorial leads through one completed task. A reference page lets the reader
enter at any point. You can use the same headings, lists, notes and tables in
both, but their order should answer different needs.

## Keep the path through a task visible

The Vexy Lines introduction has four stages: bring in a source, choose a fill,
compose with layers, then export. The specimen gives each stage enough space
for an explanation without turning the sequence into four unrelated cards.

<!-- specimen:tutorial-sequence -->
<div class="fl-editorial" markdown="1">

<article markdown="1">

Screenshots in a tutorial use only fonts and images we own, whose licence
allows modified publication, or that we have written permission to show.

## Make vector artwork from an image

Vexy Lines transforms photos and images into scalable vector artwork. Choose a
source with visible differences in tone so you can inspect how a fill responds.

<div class="steps" markdown="1">

1. Bring a source image into Vexy Lines.

    The product accepts PNG, JPEG, TIFF, BMP, SVG and PDF sources. Start with one
    image so you can compare the source and the marks produced by the fill.

2. Choose a fill.

    Linear fills create engraving-like lines. Wave fills bend the strokes.
    Halftone fills use dots. Try the same source with more than one fill before
    you commit to a composition.

3. Compose with layers and masks.

    Stack fills or put them in groups. Use masks to control where a fill
    contributes to the image. Inspect both the overall composition and the
    places where two treatments meet.

4. Export the artwork.

    SVG, PDF and EPS carry vector output. PNG and JPEG provide raster output
    for sharing. Choose the format for the next application that will use it.

</div>

</article>

<aside class="fl-editorial-note" markdown="1">

### Inspect the result

- Can you still recognise the source's main shapes?
- Does the line density suit the intended output size?
- Do masks end where you intended?
- Does the exported file open in the destination application?

These are checks for this tutorial specimen. They do not describe automatic
validation performed by Vexy Lines.

</aside>

</div>
<!-- /specimen -->

The sequence and format names come from
`www.vexy.art/src_docs/md/lines/index.md`. The explanatory inspection guidance
is written for this tutorial. [Vexy Lines product page](https://www.vexy.art/lines/).
{ .fl-source-note }

## Put the reference beside the decision

A table works when every row answers the same question. An accompanying note
can explain the boundary, while an optional disclosure holds a longer example.
This composition combines MaterialX Markdown with a native HTML disclosure.

<!-- specimen:tutorial-reference -->
### Choose the output for the next task

| Next task | Output to consider | What to inspect |
| --- | --- | --- |
| Continue working with vector paths | SVG | The imported paths and their appearance |
| Place artwork in a page | PDF | Scale, clipping and the rendered result |
| Share a raster preview | PNG or JPEG | Pixel dimensions and compression |

!!! note "Check the destination"
    A format name does not guarantee identical rendering in every application.
    Open the exported file in the application that will use it.

<details markdown="1">
<summary>Example: a page illustration</summary>

Export the artwork, place it in the page layout, then inspect the illustration
at its intended size. A dense pattern that reads well at a large preview size
may need a different treatment when the illustration is reduced.

</details>
<!-- /specimen -->

The supported output names come from the Vexy Lines source. The rows are
editorial guidance, not a claim that Vexy Lines tests those destinations.

## Adapt the composition

Give each procedure a result the reader can recognise. Put prerequisites before
the first action. Keep instructions outside closed tabs or disclosures when
they are required to finish the task.

Use `.steps` for ordered procedures and `.fl-editorial` for a sequence with a
short checklist. The layout class and `.fl-editorial-note` are defined in
`field-guide.css`; the numbered stages use MaterialX's document styles.

If a reference table grows beyond a phone's width, contain its horizontal
scrolling inside the table area. Do not compress explanatory text into tiny
columns to make a desktop composition fit.
