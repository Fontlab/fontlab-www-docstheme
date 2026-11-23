---
this_file: src_docs/md/structure/cards.md
---

# Cards and groups

A card groups one subject with its context and next step. Use a plain item for a short record; add a card boundary when a record needs its own heading, image or action. Keep related records in the same reading order on a phone.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Card · Basecoat { #basecoat-card }

A compact card can carry one argument and one destination. The copy adapts the FontLab font-conversion page; the anchor remains a normal link.

<!-- specimen:basecoat-card html -->
<div class="fltheme-components">
<article class="card"><header><h3>Keep the family together</h3><p>Font conversion</p></header><section><p>Names, outlines, spacing and kerning all matter when you convert a font.</p></section><footer><a class="btn" data-variant="outline" href="https://www.fontlab.com/font-converter/">Read about conversion</a></footer></article>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/card/)

## Card · daisyUI { #daisyui-card }

A compact card can carry one argument and one destination. The copy adapts the FontLab font-conversion page; the anchor remains a normal link.

<!-- specimen:daisyui-card html -->
<div class="fltheme-components">
<article class="du-card du-card-border"><div class="du-card-body"><h3 class="du-card-title">Keep the family together</h3><p>Names, outlines, spacing and kerning all matter when you convert a font.</p><div class="du-card-actions"><a class="du-btn du-btn-outline" href="https://www.fontlab.com/font-converter/">Read about conversion</a></div></div></article>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/card/)

## Item · Basecoat { #basecoat-item }

Present one record in a compact repeated list.

**Behaviour and access.** Use an article or list item with a heading and description. Keep actions distinct from the item body and do not turn the whole record into several overlapping click targets.

<!-- specimen:basecoat-item html -->
<div class="fltheme-components">
<article class="item" data-variant="outline"><section><h3>Regular</h3><p>400 weight, upright</p></section></article>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/item/)

## Join · daisyUI { #daisyui-join }

Joined links can express a small group of peer destinations. Each link keeps its own accessible name and focus stop.

<!-- specimen:daisyui-join html -->
<div class="fltheme-components">
<nav aria-label="Font resources" class="du-join"><a class="du-btn du-join-item" href="https://www.fontlab.com/font-editor/">Editing</a><a class="du-btn du-join-item" href="https://www.fontlab.com/font-converter/">Conversion</a></nav>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/join/)

## Stack · daisyUI { #daisyui-stack }

A stack suggests several sheets while showing only one. Keep hidden layers decorative; use a list if the reader needs the content of every item.

<!-- specimen:daisyui-stack html -->
<div class="fltheme-components">
<div class="du-stack" style="width:min(100%,20rem);margin-bottom:1rem"><article class="du-card du-card-border" style="background:var(--color-base-100)"><div class="du-card-body"><h3 class="du-card-title">Three draft sheets</h3><p>Only the top sheet is readable. Use a list if every record matters.</p></div></article><div aria-hidden="true" class="du-card du-card-border" style="background:var(--color-base-200);height:8rem"></div><div aria-hidden="true" class="du-card du-card-border" style="background:var(--color-base-300);height:8rem"></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/stack/)

## An editorial card { #fl-card }

Use `.fl-card` for a short editorial group. It changes the surface, not the meaning of its heading, paragraph or link.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-card -->
<section class="fl-card" markdown="1">

### Keep the source

Retain the original font files so you can compare names, outlines, spacing and kerning after conversion.

[Font conversion](https://www.fontlab.com/font-converter/)

</section>
<!-- /specimen -->
