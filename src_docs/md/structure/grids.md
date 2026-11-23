---
this_file: src_docs/md/structure/grids.md
---

# Grids and columns

A grid expresses a relationship between peers. Start with two columns and let narrow screens return to one. If every section needs to be read in order, a single column often communicates more clearly.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Grids · MaterialX { #materialx-grids }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-grids -->
<div class="grid cards" markdown="1">

-   :material-format-text: **Write the text**

    Give the reader one clear subject and a useful heading.

    [Type and emphasis](../text/type.md)

-   :material-image: **Add a picture**

    Show the detail that the prose asks the reader to inspect.

    [Pictures and captions](../images/pictures.md)

</div>
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/grids.md)

## Grids: authoring details

### Using card grids { #materialx-grids-using-card-grids }

Use a card grid for peers that deserve equal scanning weight, such as three
routes into a guide. Keep the labels parallel and let the grid collapse to one
column when the available width runs out.

### List syntax { #materialx-grids-list-syntax }

The list form is the shortest authoring syntax when every item has the same
basic shape.

<!-- specimen:materialx-grids-list-syntax-sample -->
<div class="grid cards" markdown>

-   **Read the foundations**

    Establish type, measure, colour, and baseline imagery before composing a
    page.

    [Open Foundations](../design/foundations.md)

-   **Choose a layout**

    Add only the structure the relationship between items requires.

    [Continue on this page](disclosure.md#daisyui-accordion)

-   **Apply a house pattern**

    Use FontLab-owned widths and editorial compositions for exceptional media.

    [Open FontLab patterns](../design/fontlab-patterns.md)

</div>
<!-- /specimen -->

### Block syntax { #materialx-grids-block-syntax }

The block form can mix different Markdown blocks while preserving equal grid
tracks. Use it when the content types differ, not merely to avoid writing a
list.

<!-- specimen:materialx-grids-block-syntax-sample -->
<div class="grid" markdown>

**A short principle**
{ .card }


</div>
<!-- /specimen -->

### Using generic grids { #materialx-grids-using-generic-grids }

Generic grids arrange arbitrary authored blocks without adding card treatment.
They suit comparisons in which the content already carries its own structure.

<!-- specimen:materialx-grids-using-generic-grids-sample -->
<div class="grid" markdown>

!!! note "Editorial column"
    Best for explanation, evidence, and a single reading path.

!!! tip "Component row"
    Best for comparable controls or states that need direct visual inspection.

</div>

Do not wrap this structure in `.fl-ui`; doing so would blur the declared
MaterialX/daisyUI ownership boundary.
<!-- /specimen -->


## Wrap a row of actions { #fl-ui-row }

Use `.fl-ui-row` for a short set of related actions. They wrap in source order when their labels need more room.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-ui-row -->
<div class="fltheme-components fl-ui-row">
<a class="du-btn" href="https://help.fontlab.com/fontlab/8/">FontLab 8 manual</a>
<a class="du-btn du-btn-outline" href="https://www.fontlab.com/font-converter/">Font conversion</a>
</div>
<!-- /specimen -->

## Stack related actions { #fl-ui-stack }

Use `.fl-ui-stack` when labels are easier to scan in one column. Spacing does not replace a group label or explain how two actions relate.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-ui-stack -->
<div class="fltheme-components fl-ui-stack">
<a class="du-btn" href="https://help.fontlab.com/fontlab/8/">FontLab 8 manual</a>
<a class="du-btn du-btn-outline" href="https://help.vexy.art/lines/">Vexy Lines help</a>
</div>
<!-- /specimen -->

## A grid of editorial cards { #fl-showcase-grid }

The editorial `.fl-showcase-grid` class arranges peers. Keep the heading levels and reading order meaningful when the grid becomes a single column.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-showcase-grid -->
<div class="fl-showcase-grid" markdown="1">

<section class="fl-card" markdown="1">

### Preserve the family

Names, spacing and kerning carry the type designer’s decisions.

</section>

<section class="fl-card" markdown="1">

### Inspect the result

Compare converted fonts with their source in the destination application.

</section>

</div>
<!-- /specimen -->
