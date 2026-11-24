---
this_file: src_docs/md/compare/disclosure.md
---

# Disclosure

Open the same two answers as an accordion, a collapse group and Markdown details.

<!-- specimen:compare-disclosure -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components">
<section class="accordion">
  <details open><summary>What should survive conversion?</summary><section>Names, outlines, spacing and kerning.</section></details>
  <details><summary>What should I inspect?</summary><section>Compare the build with the original files.</section></details>
</section>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components">
  <details class="du-collapse du-collapse-arrow" name="compare-inspection-details" open><summary class="du-collapse-title">What should survive conversion?</summary><div class="du-collapse-content"><p>Names, outlines, spacing and kerning.</p></div></details>
  <details class="du-collapse du-collapse-arrow" name="compare-inspection-details"><summary class="du-collapse-title">What should I inspect?</summary><div class="du-collapse-content"><p>Compare the build with the original files.</p></div></details>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

???+ note "What should survive conversion?"

    Names, outlines, spacing and kerning.

??? note "What should I inspect?"

    Compare the build with the original files.

</section>

</div>
<!-- /specimen -->

Choose MaterialX details for an independently expandable note in an article. Choose the Basecoat accordion or daisyUI collapse group to show one answer at a time in an interface.
