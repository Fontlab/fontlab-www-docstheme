---
this_file: src_docs/md/structure/disclosure.md
---

# Tabs and disclosure

Keep essential instructions visible. Use a disclosure for optional detail and tabs for alternative views of the same subject. A sequence belongs in steps, because readers need every part in order.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Collapse · daisyUI { #daisyui-collapse }

Collapse reveals one optional region independently. Prefer native `details`
over a focus-only disclosure: it works from keyboard and touch, survives loss
of focus, and keeps the hidden text discoverable.

<!-- specimen:daisyui-collapse html -->
<div class="fltheme-components">
<details class="du-collapse du-collapse-plus"><summary class="du-collapse-title">Keep a source note</summary><div class="du-collapse-content"><p>Record the original file and the conversion settings beside your result.</p></div></details>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/collapse/)

## Accordion · Basecoat { #basecoat-accordion }

Reveal related answers without leaving the page.

**Behaviour and access.** Use native details and summary inside .accordion. The runtime keeps one item open; data-multiple allows several. A summary must name its own answer.

<!-- specimen:basecoat-accordion html -->
<div class="fltheme-components">
<section class="accordion"><details open><summary>What should survive conversion?</summary><section>Names, outlines, spacing, kerning and family structure.</section></details><details><summary>What should I inspect?</summary><section>Compare the converted family with the original files.</section></details></section>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/accordion/)

## Accordion · daisyUI { #daisyui-accordion }

An accordion groups several disclosures and allows only one to remain open.
Use it for optional, closely related detail. Do not hide the main reading path
or required instructions inside it.

<!-- specimen:daisyui-accordion html -->
<div class="fltheme-components">
<details class="du-collapse du-collapse-arrow" name="conversion-faq" open><summary class="du-collapse-title">What should survive conversion?</summary><div class="du-collapse-content"><p>Names, outlines, spacing, kerning and family structure.</p></div></details><details class="du-collapse du-collapse-arrow" name="conversion-faq"><summary class="du-collapse-title">What should I inspect?</summary><div class="du-collapse-content"><p>Compare the converted family with the original files.</p></div></details>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/accordion/)

## Content tabs · MaterialX { #materialx-content-tabs }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-content-tabs -->
=== "Outlines"

    Inspect curves and contour direction.

=== "Spacing"

    Inspect sidebearings and representative pairs.
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/content-tabs.md)

## Tabs · Basecoat { #basecoat-tabs }

Switch between related panels while keeping the same context.

**Behaviour and access.** The runtime supplies selection and keyboard navigation. Connect each tab and panel with unique IDs, aria-controls and aria-labelledby. A tab without a corresponding panel is not a working tab.

<!-- specimen:basecoat-tabs html -->
<div class="fltheme-components">
<div class="tabs"><nav aria-label="Sample inspection" role="tablist"><button aria-controls="basecoat-tabs-bc-outline-panel" aria-selected="true" id="basecoat-tabs-bc-outline-tab" role="tab">Outlines</button><button aria-controls="basecoat-tabs-bc-spacing-panel" aria-selected="false" id="basecoat-tabs-bc-spacing-tab" role="tab" tabindex="-1">Spacing</button></nav><div aria-labelledby="basecoat-tabs-bc-outline-tab" id="basecoat-tabs-bc-outline-panel" role="tabpanel">Inspect curves and contour direction.</div><div aria-labelledby="basecoat-tabs-bc-spacing-tab" hidden id="basecoat-tabs-bc-spacing-panel" role="tabpanel">Inspect sidebearings and representative pairs.</div></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/tabs/)

## Tab · daisyUI { #daisyui-tab }

daisyUI tabs switch among peer application views. This specimen uses one native
radio group, so arrow-key selection, focus and active state work without
page JavaScript. Outlines and Spacing expose alternative inspection notes.

<!-- specimen:daisyui-tab html -->
<div class="fltheme-components">
<div class="du-tabs du-tabs-border"><input aria-label="Outlines" checked class="du-tab" name="outline-view" type="radio" value="outlines"><div class="du-tab-content" style="padding:1rem">Inspect curves and contour direction.</div><input aria-label="Spacing" class="du-tab" name="outline-view" type="radio" value="spacing"><div class="du-tab-content" style="padding:1rem">Inspect sidebearings and representative pairs.</div></div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/tab/)

## Content tabs: authoring details

### Anchor links { #materialx-content-tabs-anchor-links }

Tab anchors are live and shareable. Keep labels stable so existing links do not
silently point at a different choice.

### Linked content tabs { #materialx-content-tabs-linked-content-tabs }

Tabs with the same label synchronize across groups. Use identical labels only
when the choices genuinely mean the same thing.

### Grouping code blocks { #materialx-content-tabs-grouping-code-blocks }

Group equivalent implementations, such as two languages or platforms. Keep
the order consistent throughout the site.

### Grouping other content { #materialx-content-tabs-grouping-other-content }

Tabs may contain lists and prose. Choose tabs only when readers need one of
several peers, not when they should read every section.

### Embedded content { #materialx-content-tabs-embedded-content }

SuperFences allows tabs inside admonitions and other blocks. Avoid deep nesting:
keyboard focus and heading hierarchy must remain predictable.
