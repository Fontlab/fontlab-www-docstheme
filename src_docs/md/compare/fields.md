---
this_file: src_docs/md/compare/fields.md
---

# Fields

Compare a text field, a select and a textarea in their usual states. The sample export note shows how an error is associated with its field.

<!-- specimen:compare-fields -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components fl-compare-fields">
  <div class="fl-compare-field">
  <label class="label" for="basecoat-family">Family name</label>
  <input class="input" type="text" id="basecoat-family" name="family" aria-describedby="basecoat-family-hint" value="Studio Sans" data-compare-control="text">
  <small id="basecoat-family-hint">Use the name shown in font menus.</small>
  </div>
  <div class="fl-compare-field">
  <label class="label" for="basecoat-format">Export format</label>
  <select class="select" id="basecoat-format" name="format" aria-describedby="basecoat-format-hint">
   <option value="otf">OpenType</option><option value="ttf">TrueType</option>
  </select>
  <small id="basecoat-format-hint">Choose the format requested for review.</small>
  </div>
  <div class="fl-compare-field">
  <label class="label" for="basecoat-note">Review note (required)</label>
  <textarea class="textarea" id="basecoat-note" name="note" rows="3" required aria-invalid="true" aria-describedby="basecoat-note-hint basecoat-note-error"></textarea>
  <small id="basecoat-note-hint">Describe a change the reviewer should inspect.</small>
  <small id="basecoat-note-error" data-error>Enter a review note.</small>
  </div>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components fl-compare-fields">
  <div class="fl-compare-field">
  <label class="du-label" for="daisyui-family">Family name</label>
  <input class="du-input" type="text" id="daisyui-family" name="family" aria-describedby="daisyui-family-hint" value="Studio Sans" data-compare-control="text">
  <small id="daisyui-family-hint">Use the name shown in font menus.</small>
  </div>
  <div class="fl-compare-field">
  <label class="du-label" for="daisyui-format">Export format</label>
  <select class="du-select" id="daisyui-format" name="format" aria-describedby="daisyui-format-hint">
   <option value="otf">OpenType</option><option value="ttf">TrueType</option>
  </select>
  <small id="daisyui-format-hint">Choose the format requested for review.</small>
  </div>
  <div class="fl-compare-field">
  <label class="du-label" for="daisyui-note">Review note (required)</label>
  <textarea class="du-textarea" id="daisyui-note" name="note" rows="3" required aria-invalid="true" aria-describedby="daisyui-note-hint daisyui-note-error"></textarea>
  <small id="daisyui-note-hint">Describe a change the reviewer should inspect.</small>
  <small id="daisyui-note-error" data-error>Enter a review note.</small>
  </div>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

<div markdown="0" class="fly-form fl-compare-fields">
  <div class="fl-compare-field">
  <label for="materialx-family">Family name</label>
  <input type="text" id="materialx-family" name="family" aria-describedby="materialx-family-hint" value="Studio Sans" data-compare-control="text">
  <small id="materialx-family-hint">Use the name shown in font menus.</small>
  </div>
  <div class="fl-compare-field">
  <label for="materialx-format">Export format</label>
  <select id="materialx-format" name="format" aria-describedby="materialx-format-hint">
   <option value="otf">OpenType</option><option value="ttf">TrueType</option>
  </select>
  <small id="materialx-format-hint">Choose the format requested for review.</small>
  </div>
  <div class="fl-compare-field">
  <label for="materialx-note">Review note (required)</label>
  <textarea id="materialx-note" name="note" rows="3" required aria-invalid="true" aria-describedby="materialx-note-hint materialx-note-error"></textarea>
  <small id="materialx-note-hint">Describe a change the reviewer should inspect.</small>
  <small id="materialx-note-error" data-error>Enter a review note.</small>
  </div>
</div>

</section>

</div>
<!-- /specimen -->

Use labelled native HTML fields for a small form inside a MaterialX page. Use Basecoat or daisyUI to match a larger interface that already uses that library. All three retain the browser’s label, text entry and select behaviour.
