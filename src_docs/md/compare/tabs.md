---
this_file: src_docs/md/compare/tabs.md
---

# Tabs

Switch between the same two inspection views. The focus and selection behaviour comes from each renderer.

<!-- specimen:compare-tabs -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components">
<div class="tabs">
  <nav role="tablist" aria-label="Sample inspection">
  <button type="button" role="tab" id="bc-outlines-tab" aria-controls="bc-outlines-panel" aria-selected="true">Outlines</button>
  <button type="button" role="tab" id="bc-spacing-tab" aria-controls="bc-spacing-panel" aria-selected="false" tabindex="-1">Spacing</button>
  </nav>
  <div role="tabpanel" id="bc-outlines-panel" aria-labelledby="bc-outlines-tab">Inspect curves and contour direction.</div>
  <div role="tabpanel" id="bc-spacing-panel" aria-labelledby="bc-spacing-tab" hidden>Inspect sidebearings and representative pairs.</div>
</div>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components">
<div class="du-tabs du-tabs-border" role="group" aria-label="Sample inspection">
  <input class="du-tab" name="compare-inspection" type="radio" value="outlines" aria-label="Outlines" aria-controls="du-outlines-panel" checked>
  <div class="du-tab-content" id="du-outlines-panel">Inspect curves and contour direction.</div>
  <input class="du-tab" name="compare-inspection" type="radio" value="spacing" aria-label="Spacing" aria-controls="du-spacing-panel">
  <div class="du-tab-content" id="du-spacing-panel">Inspect sidebearings and representative pairs.</div>
</div>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

=== "Outlines"

    Inspect curves and contour direction.

=== "Spacing"

    Inspect sidebearings and representative pairs.

</section>

</div>
<!-- /specimen -->

Use MaterialX content tabs for equivalent instructions or examples. Choose Basecoat for application tabs with tab-panel keyboard behaviour, and daisyUI when a labelled radio group can drive the view without a separate script.
