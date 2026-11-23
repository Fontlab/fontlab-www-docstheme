---
this_file: src_docs/md/presentations/releases.md
---

# Release notes

Release notes identify a version, explain what changed and give readers enough
detail to use the change. Put the version and date beside the title. Keep a
short overview separate from the exact behaviour of each feature.

The specimens below adapt the archived FontLab **8.4.0.8887** notes dated
**27 June 2024**. They demonstrate a release-page layout and do not describe
the current FontLab release or a current upgrade offer.

## A dated release overview

An overview groups changes by the work they affect. It should help readers
find the part of the release that matters to them, without replacing the
details below.

<!-- specimen:release-overview -->
<header markdown="1">

FontLab 8.4.0.8887 · 27 June 2024 · Archive
{ .fl-source-note }

## Edit, assemble and inspect

FontLab 8.4 adds tool-relevant context menus, more control over node rendering
and improvements to work with components. The release also adds ways to use
components in a Mask as visual references.

</header>

<div class="fl-pattern-grid" markdown="1">

<section markdown="1">

### Edit and test

Use context menus near the pointer for tool-specific operations. Adjust
Glyph window panning and node rendering to suit the way you work.

</section>
<section markdown="1">

### Prototype and assemble

Visually adjust variable components made from glyphs. Add named anchors and
glyph variation layers, and refine stroke caps.

</section>
<section markdown="1">

### Refer and reuse

Use components in a Mask as references. Turn contour selections into new
components or elements and bring parts to the same width or height.

</section>

</div>
<!-- /specimen -->

## Explain one change in context

A feature entry needs a trigger and a result. Preserve the interface labels
from the source. If the behaviour has an exception, put it near the instruction
that the exception affects.

<!-- specimen:release-detail -->
<div class="fl-editorial" markdown="1">

<article markdown="1">

### Tool-relevant context menus

FontLab's Toolbox gives access to sub-tools and operations for the active
tool. In FontLab 8.4, more tools also have context menus, so you can reach
their operations where the pointer is, even when the toolbox is not visible.

1. Activate a tool in the Toolbar.
2. Right-click the Glyph window.
3. Choose the operation from the tool's context menu.

For the Eraser, Brush and Guide tools, the context menu appears when you
release the right mouse button. These tools also use right-dragging, so their
menu timing differs from most tools.

</article>

<aside class="fl-editorial-note" markdown="1">

#### Historical context

This entry describes FontLab 8.4 as released in June 2024. The full archive
contains the complete tool table and other changes for that build.

[Read the original release notes](https://help.fontlab.com/fontlab/8/whats-new/release-notes/8.4.0.8887/)

</aside>

</div>
<!-- /specimen -->

## Keep reference facts scannable

A compact table suits facts that readers compare or return to. Here, the
shape identifies the kind of point. The explanation stays in words, so the
table remains useful without colour or a screenshot.

<!-- specimen:release-reference -->
### Node and handle shapes

| Shape | Meaning in the archived release notes |
| :--- | :--- |
| Circle | Smooth node: smooth connection between two curve segments |
| Triangle | Tangent node: smooth connection between a line and a curve |
| Square | Corner node: sharp connection between two segments |
| Rhombus | Handle, an off-curve point |

The Glyph Window preferences let you adjust the rendering of nodes and
handles. The shape and colour settings communicate different properties;
keep the shape descriptions available when illustrating the colour settings.
<!-- /specimen -->

Source: `fldoc/docs/fontlab/8/whats-new/release-notes/8.4.0.8887/index.md`.
The overview is adapted; the version, date, tool names and point meanings come
from that file. Pricing, purchase links and an unfinished source TODO were
excluded.
{ .fl-source-note }
