---
this_file: src_docs/md/compare/buttons.md
---

# Buttons

Compare the same two export links first, then the variants, sizes and states each library supplies.

<!-- specimen:compare-buttons -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components fl-compare-stack">
<div class="fl-demo-row">
<a href="../fields/" class="btn" data-compare-control="primary">Set up export</a>
<a href="../choices/" class="btn" data-variant="outline">View options</a>
</div>

<h3>Variants</h3>
<div class="fl-demo-row">
<a href="../fields/" class="btn">Default</a>
<a href="../fields/" class="btn" data-variant="primary">Primary</a>
<a href="../fields/" class="btn" data-variant="secondary">Secondary</a>
<a href="../fields/" class="btn" data-variant="outline">Outline</a>
<a href="../fields/" class="btn" data-variant="ghost">Ghost</a>
<a href="../fields/" class="btn" data-variant="link">Link</a>
<a href="../fields/" class="btn" data-variant="destructive">Destructive</a>
</div>

<h3>Sizes</h3>
<div class="fl-demo-row">
<a href="../fields/" class="btn" data-size="xs">XS</a>
<a href="../fields/" class="btn" data-size="sm">SM</a>
<a href="../fields/" class="btn" data-size="default">Default</a>
<a href="../fields/" class="btn" data-size="lg">LG</a>
</div>

<h3>States and shapes</h3>
<div class="fl-demo-row">
<a href="../fields/" class="btn" data-compare-label="icon"><span aria-hidden="true">→</span> Review fields</a>
<a href="../fields/" class="btn" data-compare-label="long">Review the family name, outline format and export notes before preparing the files for the next round of inspection</a>
<button class="btn" type="button" disabled>Unavailable</button>
<a href="../fields/" class="btn" data-size="icon-xs" aria-label="Set up export (icon-xs)"><span aria-hidden="true">→</span></a>
<a href="../fields/" class="btn" data-size="icon-sm" aria-label="Set up export (icon-sm)"><span aria-hidden="true">→</span></a>
<a href="../fields/" class="btn" data-size="icon" aria-label="Set up export (icon)"><span aria-hidden="true">→</span></a>
<a href="../fields/" class="btn" data-size="icon-lg" aria-label="Set up export (icon-lg)"><span aria-hidden="true">→</span></a>
</div>
<nav class="button-group" aria-label="Export references">
<a class="btn" data-variant="outline" href="../fields/">Fields</a>
<a class="btn" data-variant="outline" href="../choices/">Choices</a>
</nav>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components fl-compare-stack">
<div class="fl-demo-row">
<a href="../fields/" class="du-btn du-btn-primary" data-compare-control="primary">Set up export</a>
<a href="../choices/" class="du-btn du-btn-outline">View options</a>
</div>

<h3>Variants</h3>
<div class="fl-demo-row">
<a href="../fields/" class="du-btn">Default</a>
<a href="../fields/" class="du-btn du-btn-primary">Primary</a>
<a href="../fields/" class="du-btn du-btn-neutral">Neutral</a>
<a href="../fields/" class="du-btn du-btn-secondary">Secondary</a>
<a href="../fields/" class="du-btn du-btn-accent">Accent</a>
<a href="../fields/" class="du-btn du-btn-info">Info</a>
<a href="../fields/" class="du-btn du-btn-success">Success</a>
<a href="../fields/" class="du-btn du-btn-warning">Warning</a>
<a href="../fields/" class="du-btn du-btn-error">Error</a>
<a href="../fields/" class="du-btn du-btn-outline">Outline</a>
<a href="../fields/" class="du-btn du-btn-dash">Dash</a>
<a href="../fields/" class="du-btn du-btn-soft">Soft</a>
<a href="../fields/" class="du-btn du-btn-ghost">Ghost</a>
<a href="../fields/" class="du-btn du-btn-link">Link</a>
</div>

<h3>Sizes</h3>
<div class="fl-demo-row">
<a href="../fields/" class="du-btn du-btn-xs">XS</a>
<a href="../fields/" class="du-btn du-btn-sm">SM</a>
<a href="../fields/" class="du-btn du-btn-md">MD</a>
<a href="../fields/" class="du-btn du-btn-lg">LG</a>
<a href="../fields/" class="du-btn du-btn-xl">XL</a>
</div>
<div class="fl-demo-row">
<a href="../fields/" class="du-btn du-btn-wide">Wide</a>
<a href="../fields/" class="du-btn du-btn-block">Block</a>
</div>

<h3>States and shapes</h3>
<div class="fl-demo-row">
<a href="../fields/" class="du-btn" data-compare-label="icon"><span aria-hidden="true">→</span> Review fields</a>
<a href="../fields/" class="du-btn" data-compare-label="long">Review the family name, outline format and export notes before preparing the files for the next round of inspection</a>
<button class="du-btn" type="button" disabled>Unavailable</button>
<a href="../fields/" class="du-btn du-btn-active">Active</a>
<a href="../fields/" class="du-btn du-btn-square" aria-label="Set up export (square)"><span aria-hidden="true">→</span></a>
<a href="../fields/" class="du-btn du-btn-circle" aria-label="Set up export (circle)"><span aria-hidden="true">→</span></a>
</div>
<nav class="du-join" aria-label="Export references">
<a class="du-btn du-join-item" href="../fields/">Fields</a>
<a class="du-btn du-join-item" href="../choices/">Choices</a>
</nav>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

<div class="fl-compare-stack" markdown="1">

<div class="fl-demo-row" markdown="1">

[Set up export](fields.md){ .md-button .md-button--primary data-compare-control="primary" }
[View options](choices.md){ .md-button }

</div>

### Variants

<div class="fl-demo-row" markdown="1">

[Primary](fields.md){ .md-button .md-button--primary }
[Outline](fields.md){ .md-button }

</div>

### Sizes

Fly adds sizes to the MaterialX button with `data-size`.

<div class="fl-demo-row" markdown="1">

[XS](fields.md){ .md-button data-size="xs" }
[SM](fields.md){ .md-button data-size="sm" }
[Default](fields.md){ .md-button }
[LG](fields.md){ .md-button data-size="lg" }
[XL](fields.md){ .md-button data-size="xl" }

</div>

### States and shapes

<div class="fl-demo-row">
<a href="../fields/" class="md-button" data-compare-label="icon"><span aria-hidden="true">→</span> Review fields</a>
<a href="../fields/" class="md-button" data-compare-label="long">Review the family name, outline format and export notes before preparing the files for the next round of inspection</a>
<button class="md-button" type="button" disabled>Unavailable</button>
<a href="../fields/" class="md-button" data-size="icon" aria-label="Set up export"><span aria-hidden="true">→</span></a>
</div>

<div class="fl-demo-row" markdown="1">

[Fields](fields.md){ .md-button }
[Choices](choices.md){ .md-button }

</div>

</div>

</section>

</div>
<!-- /specimen -->

Choose MaterialX for links in an article. Choose Basecoat for application actions with a small set of weights, or daisyUI when an interface needs semantic colours, more sizes or joined controls. Preserve the link or button semantics when you change its appearance.
