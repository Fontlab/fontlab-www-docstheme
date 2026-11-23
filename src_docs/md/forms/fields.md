---
this_file: src_docs/md/forms/fields.md
---

# Fields and labels

Name the information before asking for it. Pair every control with a visible label and put restrictions beside the field. These examples keep values in the browser; choosing a file does not upload it.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Label · Basecoat { #basecoat-label }

Give a control its visible and accessible name.

**Behaviour and access.** Associate for with the input ID, or wrap the input in its label. State required fields in text and keep helpful detail in a separately associated hint.

<!-- specimen:basecoat-label html -->
<div class="fltheme-components">
<label class="label" for="basecoat-label-font-weight">Weight</label><input class="input" id="basecoat-label-font-weight" type="number" value="400">
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/label/)

## Label · daisyUI { #daisyui-label }

The label names the field and marks it as required. A placeholder can offer an example, but disappears when you type and cannot replace this label.

<!-- specimen:daisyui-label html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label" for="daisyui-label-data-input-designer">Designer name <span class="label-text-alt">Required</span></label>
<input aria-required="true" class="du-input input-bordered" id="daisyui-label-data-input-designer" name="designer-name" required type="text">
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/label/)

## Field · Basecoat { #basecoat-field }

Keep a label, control, hint and error together.

**Behaviour and access.** Connect hint and error IDs with aria-describedby. Set aria-invalid when validation fails. Fieldset and legend express a related group of fields; a placeholder cannot replace the label.

<!-- specimen:basecoat-field html -->
<div class="fltheme-components">
<div class="field" role="group"><label for="basecoat-field-family-name">Family name</label><input aria-describedby="basecoat-field-family-hint" id="basecoat-field-family-name"><p id="basecoat-field-family-hint">Use the name shown in font menus.</p></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/field/)

## Input · Basecoat { #basecoat-input }

Collect a short piece of text using the appropriate native input type.

**Behaviour and access.** Use a visible label, a name for submitted data and autocomplete when meaningful. Native required, type and minlength constraints provide the first validation layer.

<!-- specimen:basecoat-input html -->
<div class="fltheme-components">
<label class="label" for="basecoat-input-project-name">Project name</label><input class="input" id="basecoat-input-project-name" name="project" required>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/input/)

## Input · daisyUI { #daisyui-input }

Choose a native input type for the value you need. These examples separate an empty field, an existing value, an unavailable value and a field with an associated error.

<!-- specimen:daisyui-input html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label" for="daisyui-input-data-input-family">Family name</label>
<input class="du-input input-bordered" id="daisyui-input-data-input-family" name="family-name" placeholder="For example, Alhambra" type="text">
<label class="du-label" for="daisyui-input-data-input-style">Style name</label>
<input class="du-input input-bordered" id="daisyui-input-data-input-style" name="style-name" type="text" value="Regular">
<label class="du-label" for="daisyui-input-data-input-locked">Foundry ID</label>
<input class="du-input input-bordered" disabled id="daisyui-input-data-input-locked" type="text" value="Managed by FontLab">
<label class="du-label" for="daisyui-input-data-input-error">Version</label>
<input aria-describedby="daisyui-input-data-input-error-message" aria-invalid="true" class="du-input du-input-error" id="daisyui-input-data-input-error" name="version" type="text" value="one">
<p class="du-label" id="daisyui-input-data-input-error-message">Enter a numeric version, such as 1.000.</p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/input/)

## Input group · Basecoat { #basecoat-input-group }

Attach a unit, icon or related action to an input.

**Behaviour and access.** Put additions at data-align="start", "end", "inline-start" or "inline-end". Keep the editable input labelled independently and label any icon-only action.

<!-- specimen:basecoat-input-group html -->
<div class="fltheme-components">
<div class="input-group"><input aria-label="Units per em" type="number" value="1000"><span data-align="inline-end">UPM</span></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/input-group/)

## Textarea · Basecoat { #basecoat-textarea }

Collect several lines of plain text.

**Behaviour and access.** Provide a label, name and sensible rows. Keep resizing available, associate help text and distinguish a readonly field from a disabled one. Markdown preview is a separate feature.

<!-- specimen:basecoat-textarea html -->
<div class="fltheme-components">
<label for="basecoat-textarea-font-notes">Font notes</label><textarea class="textarea" id="basecoat-textarea-font-notes" name="notes" rows="3"></textarea>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/textarea/)

## Textarea · daisyUI { #daisyui-textarea }

A textarea accepts several lines. Keep resizing available and show the difference between editable, disabled and invalid content. The examples use fictional review notes.

<!-- specimen:daisyui-textarea html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label" for="daisyui-textarea-data-input-notes-empty">Release notes</label>
<textarea class="du-textarea textarea-bordered" id="daisyui-textarea-data-input-notes-empty" name="release-notes" placeholder="Summarise what changed" rows="3"></textarea>
<label class="du-label" for="daisyui-textarea-data-input-notes-filled">Review note</label>
<textarea class="du-textarea textarea-bordered" id="daisyui-textarea-data-input-notes-filled" rows="3">Kerning reviewed for the Latin set.</textarea>
<label class="du-label" for="daisyui-textarea-data-input-notes-disabled">Imported note</label>
<textarea class="du-textarea textarea-bordered" disabled id="daisyui-textarea-data-input-notes-disabled" rows="2">Read-only in this project.</textarea>
<label class="du-label" for="daisyui-textarea-data-input-notes-error">Change summary</label>
<textarea aria-describedby="daisyui-textarea-data-input-notes-error-message" aria-invalid="true" class="du-textarea du-textarea-error" id="daisyui-textarea-data-input-notes-error" rows="2"></textarea>
<p class="du-label" id="daisyui-textarea-data-input-notes-error-message">Describe the change before requesting review.</p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/textarea/)

## Fieldset · daisyUI { #daisyui-fieldset }

A fieldset gives related controls one group name. Each export option has its own submitted value; disabling the second fieldset disables all its inputs together.

<!-- specimen:daisyui-fieldset html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<fieldset class="du-fieldset border-base-300 du-rounded-box border p-4">
<legend class="du-fieldset-legend">Export format</legend>
<label class="du-label cursor-pointer justify-start gap-3">
<input checked class="du-radio" name="export-format" type="radio" value="otf">
<span>OpenType</span>
</label>
<label class="du-label cursor-pointer justify-start gap-3">
<input class="du-radio" name="export-format" type="radio" value="woff2">
<span>WOFF2</span>
</label>
</fieldset>
<fieldset class="du-fieldset border-base-300 du-rounded-box border p-4" disabled>
<legend class="du-fieldset-legend">Team policy</legend>
<label class="du-label justify-start gap-3">
<input checked class="du-checkbox" type="checkbox">
<span>Require review before export</span>
</label>
</fieldset>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/fieldset/)

## File input · daisyUI { #daisyui-file-input }

The browser opens its file picker and retains your selection locally. This example has no upload handler. The accept attribute suggests file types; it does not validate their contents.

<!-- specimen:daisyui-file-input html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label" for="daisyui-file-input-data-input-font-file">Font source</label>
<input accept=".glyphs,.ufo,.vfc" aria-describedby="daisyui-file-input-data-input-font-help" class="du-file-input file-input-bordered" id="daisyui-file-input-data-input-font-file" name="font-file" type="file">
<p class="du-label" id="daisyui-file-input-data-input-font-help">Choose a Glyphs, UFO, or VFC file. Selecting a file demonstrates the selected state.</p>
<label class="du-label" for="daisyui-file-input-data-input-font-file-disabled">Managed source</label>
<input class="du-file-input file-input-bordered" disabled id="daisyui-file-input-data-input-font-file-disabled" type="file">
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/file-input/)
