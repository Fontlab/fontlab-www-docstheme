---
this_file: src_docs/md/forms/ranges.md
---

# Ranges and ratings

A slider works when the direction of change matters more than an exact typed value. Show the current number and units. Ratings express an ordered choice; dates usually need a labelled native date input.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Calendar · daisyUI { #daisyui-calendar }

daisyUI styles third-party calendars but does not supply a date-picker runtime. This visual is the native date-input alternative. A custom calendar needs a separately installed, tested library with keyboard navigation and locale support.

<!-- specimen:daisyui-calendar html -->
<div class="fltheme-components">
<label class="du-label" for="daisyui-calendar-native-publication-date">Publication date</label><input class="du-input" id="daisyui-calendar-native-publication-date" name="publication-date" type="date">
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/calendar/)

## Range · daisyUI { #daisyui-range }

Move the slider or press the arrow keys. The inline input handler updates the adjacent output, so copied HTML retains the visible value.

<!-- specimen:daisyui-range html -->
<div class="fltheme-components">
<label class="du-label" for="daisyui-range-du-preview-size">Sample preview size (12&ndash;96 px)</label><input class="du-range" id="daisyui-range-du-preview-size" max="96" min="12" oninput="this.nextElementSibling.value=this.value+' px'" type="range" value="48"><output for="daisyui-range-du-preview-size">48 px</output>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/range/)

## Rating · daisyUI { #daisyui-rating }

Half-star values run from 0 to 5 in steps of 0.5. Native radio buttons make the rating a single ordered choice. Each input has a spoken label and a numeric submitted value; the first option clears the rating.

<!-- specimen:daisyui-rating html -->
<div class="fltheme-components">
<div class="fl-ui">
<fieldset class="du-fieldset">
<legend class="du-fieldset-legend">Rate this example</legend>
<div class="du-rating du-rating-half">
<input aria-label="No rating" class="du-rating-hidden" name="example-rating" type="radio" value="0">
<input aria-label="Half a star" class="du-mask du-mask-star-2 du-mask-half-1" name="example-rating" type="radio" value="0.5">
<input aria-label="One star" class="du-mask du-mask-star-2 du-mask-half-2" name="example-rating" type="radio" value="1">
<input aria-label="One and a half stars" class="du-mask du-mask-star-2 du-mask-half-1" name="example-rating" type="radio" value="1.5">
<input aria-label="Two stars" class="du-mask du-mask-star-2 du-mask-half-2" name="example-rating" type="radio" value="2">
<input aria-label="Two and a half stars" class="du-mask du-mask-star-2 du-mask-half-1" name="example-rating" type="radio" value="2.5">
<input aria-label="Three stars" class="du-mask du-mask-star-2 du-mask-half-2" name="example-rating" type="radio" value="3">
<input aria-label="Three and a half stars" checked class="du-mask du-mask-star-2 du-mask-half-1" name="example-rating" type="radio" value="3.5">
<input aria-label="Four stars" class="du-mask du-mask-star-2 du-mask-half-2" name="example-rating" type="radio" value="4">
<input aria-label="Four and a half stars" class="du-mask du-mask-star-2 du-mask-half-1" name="example-rating" type="radio" value="4.5">
<input aria-label="Five stars" class="du-mask du-mask-star-2 du-mask-half-2" name="example-rating" type="radio" value="5">
</div>
</fieldset>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/rating/)

## Slider · Basecoat { #basecoat-slider }

Move the slider or press the arrow keys. The inline input handler updates the adjacent output, so copied HTML retains the visible value.

<!-- specimen:basecoat-slider html -->
<div class="fltheme-components">
<label for="basecoat-slider-bc-preview-size">Sample preview size (12&ndash;96 px)</label><input class="input" id="basecoat-slider-bc-preview-size" max="96" min="12" oninput="this.nextElementSibling.value=this.value+' px'" type="range" value="48"><output for="basecoat-slider-bc-preview-size">48 px</output>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/slider/)
