---
this_file: src_docs/md/text/lists.md
---

# Lists and steps

Use bullets for peers and numbers for actions that must happen in order. Keep
each step executable on its own. If a step needs a paragraph of explanation,
put that explanation before or after the list.

## A short list of capabilities

<!-- specimen:lists-bullets -->
Vexy Lines supports several stages of vector composition:

- Bring in a source image, such as PNG, JPEG, SVG or PDF.
- Choose a fill that responds to the image's tone and edges.
- Compose the result with layers, groups and masks.
- Export vectors as SVG, PDF or EPS.
<!-- /specimen -->

Adapted from the *How it works* section of
[Vexy Lines](https://www.vexy.art/lines/).
{ .fl-source-note }

## A procedure with visible stages

The MaterialX `.steps` class adds a visual sequence to an ordinary ordered
list. Keep the ordered-list meaning in the source; numbering must survive if
the stylesheet does not load.

<!-- specimen:lists-steps -->
<div class="steps" markdown="1">

1. Bring a source image into Vexy Lines.
2. Choose a fill.
3. Compose the artwork with layers and masks.
4. Export the artwork as SVG or PDF.

</div>
<!-- /specimen -->

The steps adapt the same Vexy source. They describe the sequence without
inventing menu labels.

## A status sequence

daisyUI steps are useful when you need to distinguish completed and upcoming
stages. Add words as well as colour. These labels are sample workflow states,
not the state of an actual export.

<!-- specimen:lists-workflow html -->
<div class="fltheme-components">
  <ol class="du-steps du-steps-vertical" aria-label="Example publication workflow">
    <li class="du-step du-step-primary">Draft complete</li>
    <li class="du-step du-step-primary" aria-current="step">Review in progress</li>
    <li class="du-step">Publish pending</li>
  </ol>
</div>
<!-- /specimen -->

## Define a term once

Definition lists keep a term beside its meaning without the repeated column
headings of a table.

<!-- specimen:lists-definitions -->
Source image
:   The image you bring into Vexy Lines.

Fill
:   A method for drawing vector marks from the source image.

Export
:   The file you save for use outside the composition.
<!-- /specimen -->

These descriptions adapt the Vexy Lines product introduction. Use a table
instead when every term has the same three or more properties to compare.

## Lists · MaterialX { #materialx-lists }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-lists -->
- Inspect the family names.
- Compare outlines.
- Review spacing and kerning.

Family
:   Related styles presented under one name.

- [x] Preserve the source files.
- [ ] Inspect the converted family.
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/lists.md)

## Steps · MaterialX { #materialx-steps }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-steps -->
<ol class="steps" markdown="1">

1. Open the source font.
2. Inspect its family names.
3. Compare the exported result.

</ol>
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/steps.md)

## Steps · daisyUI { #daisyui-steps }

Use the daisyUI list when the stages are short labels. Completed stages use
`step-primary`; the current stage also receives `aria-current="step"`; later
stages remain unaccented. The original Draft, Rest, Cut, Ship sequence is the
canonical specimen.

<!-- specimen:daisyui-steps html -->
<div class="fltheme-components">
<ul class="du-steps">
<li class="du-step du-step-primary">Draft</li>
<li class="du-step du-step-primary">Rest</li>
<li aria-current="step" class="du-step du-step-primary">Cut</li>
<li class="du-step">Ship</li>
</ul>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/steps/)

## Lists: authoring details

### Using unordered lists { #materialx-lists-using-unordered-lists }

Use bullets for peers:

- One type system for prose and interface text.
- Semantic tokens for state.
- Whitespace for structure.

### Using ordered lists { #materialx-lists-using-ordered-lists }

Use numbers when order matters:

1. Draft the explanation.
2. Add the smallest useful specimen.
3. Verify it in the rendered site.

### Using definition lists { #materialx-lists-using-definition-lists }

Use a definition list for terms and their meanings:

Measure
:   The width of the reading column.

Renderer
:   The locked stack that turns source Markdown into the site.

### Using task lists { #materialx-lists-using-task-lists }

Task lists report progress; they are not interactive form controls:

- [x] Source is tracked
- [x] Specimen renders
- [ ] Page is reviewed in every subtheme


## Steps: authoring details

### List Mode { #materialx-steps-list-mode }

Use list mode for a direct procedure whose steps need no internal headings.

<!-- specimen:materialx-steps-list-mode-sample -->
<div class="steps" markdown="1">

1. Write the rough sentence without polishing it.
2. Read it aloud once.
3. Remove the clause that repeats the point.

</div>
<!-- /specimen -->

### Complex List Mode { #materialx-steps-complex-list-mode }

Use complex list mode when a step needs a paragraph, list, code sample, or
other supporting material. Keep the action in the first sentence so scanning
still works.

<!-- specimen:materialx-steps-complex-list-mode-sample -->
<div class="steps" markdown="1">

1. **Draft without stopping.** Capture the claim and its evidence before
   choosing the final phrasing.

   - Name the reader.
   - Name the decision they need to make.

2. **Rest the draft.** Return when you can notice what the prose actually says,
   rather than what you remember intending.

3. **Cut in descending order.** Remove repeated paragraphs, then repeated
   sentences, then words that earn nothing.

</div>
<!-- /specimen -->

### Heading Mode { #materialx-steps-heading-mode }

Use heading mode only when each stage is a substantial section that readers may
need to link to directly.

<!-- specimen:materialx-steps-heading-mode-sample -->
<div class="steps" markdown="1">
<!-- /specimen -->
