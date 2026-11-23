---
this_file: src_docs/md/forms/choices.md
---

# Choices and switches

Use a checkbox for independent choices and radio buttons for one choice from a short set. A native select keeps longer lists compact. A searchable combobox adds filtering when readers need to find a known value.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Checkbox · Basecoat { #basecoat-checkbox }

Choose independent options or acknowledge a statement.

**Behaviour and access.** Pair the input with a visible label. Native checked, disabled and indeterminate states retain browser behaviour; mixed state is set with input.indeterminate in JavaScript.

<!-- specimen:basecoat-checkbox html -->
<div class="fltheme-components">
<label class="label"><input class="input" name="hints" type="checkbox"> Include hinting</label>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/checkbox/)

## Checkbox · daisyUI { #daisyui-checkbox }

These independent choices show unchecked, checked and unavailable states. Each label activates its own native checkbox. Your application decides what to do with the selected values.

<!-- specimen:daisyui-checkbox html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label cursor-pointer justify-start gap-3">
<input class="du-checkbox" name="release-notes" type="checkbox">
<span>Send release notes</span>
</label>
<label class="du-label cursor-pointer justify-start gap-3">
<input checked class="du-checkbox" name="beta-notes" type="checkbox">
<span>Send beta notes</span>
</label>
<label class="du-label cursor-not-allowed justify-start gap-3">
<input class="du-checkbox" disabled name="managed-notes" type="checkbox">
<span>Managed by your organisation</span>
</label>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/checkbox/)

## Radio · daisyUI { #daisyui-radio }

Only one density can be selected. Arrow keys move within the named group; each option has a distinct submitted value. The unavailable option remains visible with a disabled input.

<!-- specimen:daisyui-radio html -->
<div class="fltheme-components">
<div class="fl-ui">
<fieldset class="du-fieldset border-base-300 du-rounded-box border p-4">
<legend class="du-fieldset-legend">Interface density</legend>
<label class="du-label cursor-pointer justify-start gap-3">
<input class="du-radio" name="interface-density" type="radio" value="comfortable">
<span>Comfortable</span>
</label>
<label class="du-label cursor-pointer justify-start gap-3">
<input checked class="du-radio" name="interface-density" type="radio" value="compact">
<span>Compact</span>
</label>
<label class="du-label cursor-not-allowed justify-start gap-3">
<input class="du-radio" disabled name="interface-density" type="radio" value="touch">
<span>Touch optimised (unavailable)</span>
</label>
</fieldset>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/radio/)

## Radio group · Basecoat { #basecoat-radio-group }

Select exactly one choice from a related set.

**Behaviour and access.** Give every radio the same name and a unique value. Use a fieldset and legend or a labelled radiogroup. Native arrow-key behaviour is preferable to a hand-built selection widget.

<!-- specimen:basecoat-radio-group html -->
<div class="fltheme-components">
<fieldset><legend>Outline format</legend><label><input checked class="input" name="outline" type="radio" value="cubic"> Cubic</label><label><input class="input" name="outline" type="radio" value="quadratic"> Quadratic</label></fieldset>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/radio-group/)

## Native select · Basecoat { #basecoat-native-select }

Choose one value with the platform selection interface.

**Behaviour and access.** Prefer this native select for simple forms. It needs no component JavaScript and keeps mobile pickers, keyboard search, required validation and standard form submission.

<!-- specimen:basecoat-native-select html -->
<div class="fltheme-components">
<label class="label" for="basecoat-native-select-export-format">Format</label><select class="select" id="basecoat-native-select-export-format" name="format"><option>OTF</option><option>TTF</option></select>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/native-select/)

## Select · Basecoat { #basecoat-select }

Choose a value with the library’s custom listbox presentation.

**Behaviour and access.** The select runtime provides keyboard and focus behaviour. Keep button/listbox IDs connected and a hidden named input for submission. Prefer Native Select unless the custom presentation is needed.

<!-- specimen:basecoat-select html -->
<div class="fltheme-components">
<label id="basecoat-select-bc-style-label">Sample style</label><div class="select" data-placeholder="Choose style"><button type="button" aria-controls="basecoat-select-bc-style-options" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="basecoat-select-bc-style-label basecoat-select-bc-style-trigger" id="basecoat-select-bc-style-trigger"><span>Choose style</span></button><div aria-hidden="true" data-popover><div aria-labelledby="basecoat-select-bc-style-label" id="basecoat-select-bc-style-options" role="listbox"><div data-value="regular" role="option">Regular</div><div data-value="bold" role="option">Bold</div></div></div><input name="style" type="hidden"></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/select/)

## Select · daisyUI { #daisyui-select }

Use the native select when readers choose from a short known list. The examples show a prompt, a selected value, an unavailable field and a required field with an associated error.

<!-- specimen:daisyui-select html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label" for="daisyui-select-data-input-language">Interface language</label>
<select class="du-select select-bordered" id="daisyui-select-data-input-language" name="interface-language">
<option disabled selected value>Choose a language</option>
<option value="en">English</option>
<option value="pl">Polish</option>
<option value="es">Spanish</option>
</select>
<label class="du-label" for="daisyui-select-data-input-format-selected">Outline format</label>
<select class="du-select select-bordered" id="daisyui-select-data-input-format-selected">
<option>TrueType</option>
<option selected>PostScript</option>
</select>
<label class="du-label" for="daisyui-select-data-input-format-disabled">Build format</label>
<select class="du-select select-bordered" disabled id="daisyui-select-data-input-format-disabled">
<option>Set by project</option>
</select>
<label class="du-label" for="daisyui-select-data-input-format-error">Required format</label>
<select aria-describedby="daisyui-select-data-input-format-error-message" aria-invalid="true" class="du-select du-select-error" id="daisyui-select-data-input-format-error" required>
<option selected value>Choose a format</option>
<option value="otf">OpenType</option>
</select>
<p class="du-label" id="daisyui-select-data-input-format-error-message">Choose an export format.</p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/select/)

## Toggle · daisyUI { #daisyui-toggle }

A toggle is a checkbox presented as an on/off switch. Keep the setting name beside it and disable the actual input when the setting is unavailable.

<!-- specimen:daisyui-toggle html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label cursor-pointer justify-start gap-3">
<input class="du-toggle" name="show-nodes" type="checkbox">
<span>Show off-curve nodes</span>
</label>
<label class="du-label cursor-pointer justify-start gap-3">
<input checked class="du-toggle" name="snap-guides" type="checkbox">
<span>Snap to guides</span>
</label>
<label class="du-label cursor-not-allowed justify-start gap-3">
<input class="du-toggle" disabled name="cloud-sync" type="checkbox">
<span>Cloud sync unavailable</span>
</label>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/toggle/)

## Switch · Basecoat { #basecoat-switch }

The checkbox stores its own on/off state and updates an adjacent output. Your application must apply the setting to its actual preview.

<!-- specimen:basecoat-switch html -->
<div class="fltheme-components">
<label class="label"><input checked class="input" onchange="this.closest('.fltheme-components').querySelector('output').textContent=this.checked?'Guidelines on':'Guidelines off'" role="switch" type="checkbox"> Show sample guidelines</label><output>Guidelines on</output>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/switch/)

## Combobox · Basecoat { #basecoat-combobox }

Search a list and commit a selected value.

**Behaviour and access.** The shared combobox runtime manages keyboard selection and filtering. Connect the input to its listbox and keep a hidden named input for form submission; placeholder text is not a label.

<!-- specimen:basecoat-combobox html -->
<div class="fltheme-components">
<label for="basecoat-combobox-bc-family-search">Sample font family</label><div class="combobox"><input aria-autocomplete="list" aria-controls="basecoat-combobox-bc-family-options" aria-expanded="false" autocomplete="off" id="basecoat-combobox-bc-family-search" role="combobox" type="text"><div aria-hidden="true" data-popover><div data-empty="No matching families." id="basecoat-combobox-bc-family-options" role="listbox"><div data-value="sans" role="option">Studio Sans</div><div data-value="serif" role="option">Studio Serif</div><div data-value="mono" role="option">Studio Mono</div></div></div><input name="family" type="hidden"></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/combobox/)

## Filter · daisyUI { #daisyui-filter }

These radio buttons select a category and expose a reset option. They do not filter a data set; your application must use the selected value.

<!-- specimen:daisyui-filter html -->
<div class="fltheme-components">
<form><fieldset class="du-filter"><legend>Sample category</legend><input aria-label="All categories" checked class="du-btn du-filter-reset" name="category" type="radio" value="all"><input aria-label="Text" class="du-btn" name="category" type="radio" value="text"><input aria-label="Images" class="du-btn" name="category" type="radio" value="images"></fieldset></form>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/filter/)

## Swap · daisyUI { #daisyui-swap }

Swap toggles two representations of the same control. This checkbox specimen
works without page script; activate it to compare the off and on labels.

<!-- specimen:daisyui-swap html -->
<div class="fltheme-components">
<div class="fl-ui">
<label class="du-btn du-swap">
<input aria-label="Toggle preview visibility" type="checkbox">
<span class="du-swap-off">Preview off</span>
<span class="du-swap-on">Preview on</span>
<span class="du-swap-indeterminate">Preview mixed</span>
</label>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/swap/)
