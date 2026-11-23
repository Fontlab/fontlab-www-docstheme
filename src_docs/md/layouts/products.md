---
this_file: src_docs/md/layouts/products.md
---

# Product pages

A product page connects a clear task to visible evidence and a next step. Lead with the work the reader wants to do, then show the interface or output that supports the claim. Keep compatibility, pricing and licensing in their current authoritative destinations.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Hero · daisyUI { #daisyui-hero }

This opening adapts the FontLab font-conversion page. Its call to action goes to the current product information; the example makes no price or compatibility claim.

<!-- specimen:daisyui-hero html -->
<div class="fltheme-components">
<section class="du-hero" style="background:var(--color-base-200);padding:2rem"><div class="du-hero-content" style="display:block"><p>Font conversion</p><h3>Keep the intent of the typeface</h3><p>Font conversion is about preserving intent: names, outlines, spacing, kerning, and family structure should survive the trip.</p><a class="du-btn du-btn-primary" href="https://www.fontlab.com/font-converter/">Explore conversion</a></div></section>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/hero/)

## Show the work beside the claim

Once you have named the task, show what the reader will inspect. A screenshot
needs a caption that explains its role. Keep the product description as text
so it remains readable when the image cannot load.

Put the demonstration beside the opening claim, not at the foot of the page,
and let the first screen answer two questions: what is it, and what does it do
for me? A text block near the top carries the phrase people search for. Use
only fonts we own, fonts whose licence allows modified publication, or fonts
with written permission in screenshots and demonstrations.

This feature adapts the Vexy Lines introduction. The picture shows the actual
workspace; the text explains the relationship between source, fill and layer.

<!-- specimen:product-workspace -->
<div class="fl-feature" markdown="1">

<section markdown="1">

### Direct the lines

Vexy Lines transforms photos and images into vector artwork. A fill interprets
the source's tone and structure as lines, dots or other marks. You can combine
fills with layers, groups and masks to give different parts of the image
different treatments.

Start with one source and one fill. Inspect the result at the size where you
intend to use it, then add another treatment where the composition needs one.

[Read about fills](https://help.vexy.art/lines/articles/fills-overview/){ .md-button }

</section>

<figure markdown="1">

![Vexy Lines workspace with a portrait and editing controls](https://i.vexy.art/vl/landing/home-vexy-lines.jpg){ loading="lazy" }

<figcaption>A source image, its line treatment and the controls used to adjust it.</figcaption>
</figure>

</div>
<!-- /specimen -->

The feature uses `.fl-feature` from `field-guide.css`. Below 800px, the text
comes before the image. Keep that source order when changing the desktop
proportions.

## Explain the handoff

The FontLab conversion source describes the information that should survive
conversion. The blog's TransType article explains why that information matters:
a font contains decisions made during its design, not just a collection of
outlines. This three-part composition gives those decisions room.

<!-- specimen:product-conversion-path -->
<div class="fl-pattern-grid" markdown="1">

<section markdown="1">

### Keep the source

Retain the original files. Names, family structure, outlines, spacing and
kerning give you something concrete to compare after conversion.

</section>

<section markdown="1">

### Convert the family

TransType is FontLab's dedicated tool for converting and organising font
families. Check the current documentation for the formats and workflow you
need before you begin.

[TransType product information](https://www.fontlab.com/font-converter/transtype/)

</section>

<section markdown="1">

### Inspect the result

Open the converted fonts in the application that will use them. Compare the
names and family grouping, then inspect the outlines, spacing and kerning.
Further design work belongs in a font editor.

[FontLab product information](https://www.fontlab.com/font-editor/fontlab/)

</section>

</div>
<!-- /specimen -->

The preservation criteria come from `www.fontlab.com/src_docs/md/font-converter.md`.
The distinction between conversion and further editing draws on the TransType
article in `blog.fontlab.com`. The inspection sequence is editorial guidance
for this example, not an automatic validation feature of either app.
{ .fl-source-note }

## Answer the remaining decision

Put purchase conditions at the destination that maintains them. Use a
disclosure for supporting explanation, but keep the primary action visible.
If the page shows ratings or reviews, show them as received, not filtered by
stars, with a link to the full set.

<!-- specimen:product-next-step -->
<section markdown="1">

### Find the right route for your files

Conversion preserves an existing design in a usable format. Editing changes
the design or its behaviour. If you need both, check each stage of the workflow
against the source files and the destination application.

<details markdown="1">
<summary>What should I check before choosing?</summary>

Identify the source formats, the target applications and the information that
must survive. Check the product's current compatibility and licence terms.
Keep an original copy of the files for comparison.

</details>

[Explore font conversion](https://www.fontlab.com/font-converter/){ .md-button .md-button--primary }

</section>
<!-- /specimen -->

The grid uses `.fl-pattern-grid` from `field-guide.css`. The final disclosure
uses native HTML and works without an application handler.

## End with the whole offer

Before the last action, gather what the reader collected along the page: what
they receive, who qualifies, the price and currency, the requirements that
would otherwise send them looking (system, file formats, licence terms) and
the exit terms. Give the page one offer for its reader, and name the action on
the button. On a long page, show the terms near the top and again before the
final button.

Captions under product images are read more often than the body text. Write
each one as a complete claim with the product name, so it still works for the
reader who looks only at the pictures.

Three small blocks help near the end. A “what you receive” list names the
files, licence and access the buyer gets. A licence row states whether the
licence expires and what the next major version is expected to cost, or that
the cost is not yet set. A “reviewed on” date under the facts tells readers and
answer engines that someone checked them.

## Pages for particular readers

Some readers need a page of their own rather than a paragraph:

- **A customer project.** One named person's real work: the brief, the files,
  what they did in the product, what was hard, the result, with their
  permission and the date.
- **The reader who must ask someone else.** A page a designer can forward to
  whoever approves software spending: price per seat, licence terms, invoices,
  what the team gets, in plain language.
- **A paid landing page.** One action and a minimal menu, the same facts and
  terms as the product page, and kept out of search results if it exists only
  for paid traffic.
- **A free guide.** The guide itself, readable without a form; any form offers
  something extra, such as test files or update notices.

## A quieter product opener { #fl-hero }

The editorial `.fl-hero` class provides a centred opener. Pair it with the prefixed daisyUI hero inside a component area, and give the link a real destination.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-hero -->
<section class="fltheme-components du-hero fl-hero" markdown="1">
<div class="du-hero-content" markdown="1">
<div markdown="1">

### Keep the intent of the typeface

Names, outlines, spacing, kerning and family structure belong with the design.

[Explore font conversion](https://www.fontlab.com/font-converter/){ .du-btn .du-btn-primary }

</div>
</div>
</section>
<!-- /specimen -->

## Match display type to the document outline { #fl-hero-title }

The `.fl-hero__title` class changes presentation. The element still needs the heading level appropriate to its place in your document.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-hero-title -->
<section class="fl-hero" markdown="1">

### Preserve the design
{ .fl-hero__title }

Conversion changes the format while preserving the intent of the typeface.

</section>
<!-- /specimen -->
