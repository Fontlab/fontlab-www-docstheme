---
this_file: src_docs/md/compare/tables.md
---

# Tables

Compare how the three renderers align and separate this sample family’s styles.

<!-- specimen:compare-tables -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components"><div class="table-container">
<table class="table">
<thead><tr><th scope="col">Style</th><th scope="col">Weight</th><th scope="col">Form</th></tr></thead>
<tbody>
  <tr><td>Regular</td><td>400</td><td>Upright</td></tr>
  <tr><td>Italic</td><td>400</td><td>Italic</td></tr>
  <tr><td>Bold</td><td>700</td><td>Upright</td></tr>
</tbody>
</table>
</div></div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components"><div class="overflow-x-auto">
<table class="du-table">
<thead><tr><th scope="col">Style</th><th scope="col">Weight</th><th scope="col">Form</th></tr></thead>
<tbody>
  <tr><td>Regular</td><td>400</td><td>Upright</td></tr>
  <tr><td>Italic</td><td>400</td><td>Italic</td></tr>
  <tr><td>Bold</td><td>700</td><td>Upright</td></tr>
</tbody>
</table>
</div></div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

| Style | Weight | Form |
| :--- | :--- | :--- |
| Regular | 400 | Upright |
| Italic | 400 | Italic |
| Bold | 700 | Upright |

</section>

</div>
<!-- /specimen -->

Use a Markdown table for stable reference data. Basecoat and daisyUI are appropriate when the rest of an application uses their components or when the HTML table needs features such as a caption or grouped headers.
