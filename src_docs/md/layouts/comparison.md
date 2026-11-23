---
this_file: src_docs/md/layouts/comparison.md
---

# Comparison and pricing

A comparison helps readers choose a route. Give each route the same questions,
in the same order, so the visual treatment does not make the decision for them.
For prices, the currency, billing period and conditions belong beside the
amount. This page demonstrates the layout without publishing a copied price
that may have changed.

## Compare the work first

The FontLab font-conversion page defines conversion as preserving intent:
names, outlines, spacing, kerning and family structure should survive the move.
The blog's TransType article describes further editing as a separate job.
Those two tasks make a more useful comparison than an unexplained feature count.

<!-- specimen:comparison-tasks -->
<div class="fl-pattern-grid" markdown="1">

<section markdown="1">

### Convert an existing family

You have a typeface whose design should survive a change of format. Names,
family grouping, spacing and kerning carry decisions that belong with the
outlines. Keep the originals so you can inspect the result against them.

TransType is the dedicated route for conversion and family organisation.
The next step is to check the current product information against the files
you need to convert.

[Explore font conversion](https://www.fontlab.com/font-converter/){ .md-button }

</section>

<section markdown="1">

### Continue designing the family

You need to change the design or its behaviour: extend a character set,
work on OpenType features, or develop a family further. Those tasks need
the editing tools and project structure of a font editor.

The FontLab blog describes a workflow in which conversion brings a font into
a usable format and FontLab carries the design work forward.

[Explore font editing](https://www.fontlab.com/font-editor/){ .md-button }

</section>

</div>
<!-- /specimen -->

Text adapted from `www.fontlab.com/src_docs/md/font-converter.md` and the
February 2024 TransType article in `blog.fontlab.com`. The comparison describes
tasks; it does not certify compatibility with a particular source font.
{ .fl-source-note }

## Align the decision criteria

A table is useful once the reader understands the alternatives. Keep its rows
concrete and its language parallel. A missing feature and a feature that has
not been checked are different states; write the distinction in the cell.

<!-- specimen:comparison-matrix -->
| Question | Conversion task | Editing task |
| :--- | :--- | :--- |
| What stays central? | Preserve the existing typeface | Develop the design or behaviour |
| What do you inspect? | Names, outlines, spacing, kerning, family grouping | The parts of the font you changed |
| What source do you retain? | Original font files | Editable project and reference files |
| Where do you check suitability? | Current converter documentation | Current editor documentation |
<!-- /specimen -->

On a narrow screen, the table can scroll inside its own container. A card
comparison is better when each alternative needs several paragraphs. Avoid
making readers swipe repeatedly between a row label and its values.

## Start with what every option must do

Before the differences, show the parity: the things a reader expects of any
tool in the category, each with a checked yes and the version. Readers coming
from another tool want to know nothing essential is missing before they read
what is different. Name one frame per reader: other editors for people who use
them, free tools or doing nothing for occasional users. A short “who should
switch” block can follow, including who should not. When we publish a list of
tools that includes our own, say it is ours and state the order's criterion.

## Compare other makers fairly

When the table names another company's product, the layout itself makes
claims. A full cell for our product beside a sparse one for theirs tells the
reader the other product does less, whether or not that is true.

- Fill every cell from what that maker publishes, with the source and the date
  it was read. Where a maker publishes nothing, write “not stated on [page],
  read [date]” in the same type size as the facts.
- Compare like with like. A time-limited full licence and a reduced edition go
  in separate rows, even when both are the cheapest option.
- Put a currency note in any row that mixes currencies, not only in the
  introduction.
- Use product names, not other makers' logos or interface screenshots. A
  screenshot of another application's output appears only where the claim is
  about that output, cropped to it, named and dated.
- A short list of questions helps readers compare on their own terms: can the
  licence move to a new computer, on how many computers may it be installed,
  what will the next version cost, which formats does it open and export, does
  it make variable and colour fonts, can it be scripted, which writing systems
  does it support. Answer each for every tool on the page, dated and linked.
- Recheck the table when a competitor changes a price or a version, not only
  before publishing; a date in small print does not keep an old figure true.
- State when the other product is the better fit.

## Keep offers current

Use a clear destination when the offer is maintained elsewhere. If you do
publish a price, record when it was checked and include the conditions beside
it. Do not turn an old campaign price into an apparently current offer. The
word “free” carries its condition in the same sentence, and an earlier or later
price is shown only if it was or will actually be charged.

<!-- specimen:comparison-offers -->
<div class="fltheme-components fl-pattern-grid" markdown="1">

<article class="card" markdown="1">
<header markdown="1">

### TransType

Conversion and family organisation

</header>
<section markdown="1">

Check the current product page for purchase options and compatibility.
This guide does not quote an offer.

</section>
<footer markdown="1">

[View current options](https://www.fontlab.com/font-converter/transtype/){ .btn data-variant="outline" }

</footer>
</article>

<article class="du-card du-card-border" markdown="1">
<div class="du-card-body" markdown="1">

### FontLab
{ .du-card-title }

Font design and editing

Check the current product page for purchase options and compatibility.
This guide does not quote an offer.

[View current options](https://www.fontlab.com/font-editor/fontlab/){ .du-btn .du-btn-outline }

</div>
</article>

</div>
<!-- /specimen -->

The two card implementations carry the same content structure. Keep the
`.fl-pattern-grid` rule from `field-guide.css` when you copy this composition.
It lets the cards stack in source order instead of shrinking their text.
