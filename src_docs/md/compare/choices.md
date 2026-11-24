---
this_file: src_docs/md/compare/choices.md
---

# Choices and switches

Try the same export options in each column. Each control changes its own local state.

<!-- specimen:compare-choices -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components fl-compare-fields">
  <label class="label"><input class="input" name="hinting" type="checkbox" checked> Include hinting</label>
  <fieldset>
  <legend>Outline format</legend>
  <label class="label"><input class="input" name="basecoat-outline" type="radio" value="cubic" checked> Cubic</label>
  <label class="label"><input class="input" name="basecoat-outline" type="radio" value="quadratic"> Quadratic</label>
  </fieldset>
  <label class="label"><input class="input" name="guides" type="checkbox" role="switch"> Show guides</label>
  <div class="fl-compare-field">
  <label class="label" for="basecoat-preview">Preview size (12–96 px)</label>
  <input class="input" type="range" id="basecoat-preview" name="preview" min="12" max="96" value="48" oninput="this.nextElementSibling.value = this.value + ' px'">
  <output for="basecoat-preview">48 px</output>
  </div>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components fl-compare-fields">
  <label class="du-label"><input class="du-checkbox" name="hinting" type="checkbox" checked> Include hinting</label>
  <fieldset class="du-fieldset">
  <legend class="du-fieldset-legend">Outline format</legend>
  <label class="du-label"><input class="du-radio" name="daisyui-outline" type="radio" value="cubic" checked> Cubic</label>
  <label class="du-label"><input class="du-radio" name="daisyui-outline" type="radio" value="quadratic"> Quadratic</label>
  </fieldset>
  <label class="du-label"><input class="du-toggle" name="guides" type="checkbox" role="switch"> Show guides</label>
  <div class="fl-compare-field">
  <label class="du-label" for="daisyui-preview">Preview size (12–96 px)</label>
  <input class="du-range" type="range" id="daisyui-preview" name="preview" min="12" max="96" value="48" oninput="this.nextElementSibling.value = this.value + ' px'">
  <output for="daisyui-preview">48 px</output>
  </div>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

<div markdown="0" class="fly-form fl-compare-fields">
  <label><input name="hinting" type="checkbox" checked> Include hinting</label>
  <fieldset>
  <legend>Outline format</legend>
  <label><input name="materialx-outline" type="radio" value="cubic" checked> Cubic</label>
  <label><input name="materialx-outline" type="radio" value="quadratic"> Quadratic</label>
  </fieldset>
  <label><input name="guides" type="checkbox" role="switch"> Show guides</label>
  <div class="fl-compare-field">
  <label for="materialx-preview">Preview size (12–96 px)</label>
  <input type="range" id="materialx-preview" name="preview" min="12" max="96" value="48" oninput="this.nextElementSibling.value = this.value + ' px'">
  <output for="materialx-preview">48 px</output>
  </div>
</div>

</section>

</div>
<!-- /specimen -->

Use native controls for a lightweight MaterialX example, or the matching Basecoat or daisyUI classes if the choices belong to an application interface. Keep one radio group per question, use a switch for an on/off setting and show a range’s value next to the slider.
