---
this_file: src_docs/md/feedback/notes.md
---

# Notes and alerts

Put a note where the reader needs it. A quiet aside supplies context; a warning changes the next action. Words carry the meaning, with colour and icons reinforcing it. Static examples do not announce themselves as urgent live alerts.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Admonitions · MaterialX { #materialx-admonitions }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-admonitions -->
!!! note "Keep the original"

    Save a copy of the source files before you compare a converted family.

??? tip "What to compare"

    Inspect names, outlines, spacing, kerning and family structure.
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/admonitions.md)

## Alert · Basecoat { #basecoat-alert }

Give an important message a persistent place in the reading flow.

**Behaviour and access.** Pair the message with a heading and text. Use role="alert" only for urgent updates, not every static notice; do not rely on colour.

<!-- specimen:basecoat-alert html -->
<div class="fltheme-components">
<div class="alert"><h2>Export complete</h2><section>Your font is ready to inspect.</section></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/alert/)

## Alert · daisyUI { #daisyui-alert }

**Status:** `supported`; **specimen:** static state preview. Alerts carry four
states: `info`, `success`, `warning`, and `error`. These in-flow examples are
already present when the page loads, so they do not claim live-region
behaviour. In a product, use `role="status"` for a dynamically updated polite
message. Reserve `role="alert"` for an urgent message inserted or changed in
response to an event. Do not repeat the same update in both an alert and a
toast.

<!-- specimen:daisyui-alert html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<div class="du-alert du-alert-info" role="note"><span>Note &mdash; the reading column is fixed at 40rem.</span></div>
<div class="du-alert du-alert-success"><span>Success &mdash; the build finished cleanly.</span></div>
<div class="du-alert du-alert-warning"><span>Warning &mdash; this image will break the measure.</span></div>
<div class="du-alert du-alert-error"><span>Error &mdash; a linked asset returned 404.</span></div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/alert/)

## Admonitions: authoring details

### Admonition icons { #materialx-admonitions-admonition-icons }

The icon reinforces the written title; it never carries severity alone. Keep
the renderer's icon for each semantic family so meaning remains consistent
between pages and themes.

### Changing the title { #materialx-admonitions-changing-the-title }

Write a short, specific title when the default type is too vague.

<!-- specimen:materialx-admonitions-changing-the-title-sample -->
!!! warning "Unsaved font changes"
    Export or save the font before replacing this source.
<!-- /specimen -->

### Nested admonitions { #materialx-admonitions-nested-admonitions }

Nest only when the inner note qualifies the outer message. More than one level
usually means the section needs rewriting.

<!-- specimen:materialx-admonitions-nested-admonitions-sample -->
!!! note "Export settings"
    These settings apply to the current export.

    !!! tip "Keep a preset"
        Save repeated settings as a named preset.
<!-- /specimen -->

### Removing the title { #materialx-admonitions-removing-the-title }

An empty title is acceptable for one short aside whose meaning is complete in
the first sentence. Do not remove a title merely to save vertical space.

<!-- specimen:materialx-admonitions-removing-the-title-sample -->
!!! note ""
    Variable fonts need an `fvar` table.
<!-- /specimen -->

### Collapsible blocks { #materialx-admonitions-collapsible-blocks }

Use a collapsible block for optional detail, never for a warning or a required
step. Its summary must describe what opening it reveals.

<!-- specimen:materialx-admonitions-collapsible-blocks-sample -->
??? tip "Show the optional naming check"
    Confirm that family and style names match the export preset.
<!-- /specimen -->

### Inline blocks { #materialx-admonitions-inline-blocks }

Inline admonitions suit a short aside beside related prose on wide screens.
They must return to normal flow when space narrows, and surrounding text must
still make sense before and after the aside.

<!-- specimen:materialx-admonitions-inline-blocks-sample -->
!!! info inline end "Scope"
    This setting affects the current file only.

Continue with the main instruction after the aside. Keep inline content brief
enough that it does not turn the reading column into two competing columns.
<!-- /specimen -->

### Custom icons and colors { #materialx-admonitions-custom-icons-and-colors }

FontLab customises the semantic system centrally, not per page. Authors may
choose the approved info, success, warning, error, secondary, or neutral role;
they must not add a literal colour, replace a paired foreground, or make a new
severity through local CSS.

### Classic admonitions { #materialx-admonitions-classic-admonitions }

The classic `!!! type` form is the default for a visible authored aside. It is
live in this site and preferred when the reader should see the content without
an extra action.

### Prior to version { #materialx-admonitions-prior-to-version-md-version-8-5-6 }

Older renderer-specific workarounds are reference history, not authoring
guidance for this pinned stack. Use the current classic syntax shown above.

### Prior to version { #materialx-admonitions-prior-to-version-md-version-10-0-6 }

Do not copy legacy overrides into a page. The tracked MaterialX bridge owns the
current behaviour and derives it from the active daisyUI theme.

### Style overrides { #materialx-admonitions-style-overrides }

Project-wide overrides belong in the MaterialX bridge stylesheet. A page may
select semantic type and title, but it may not change surface, foreground,
border, icon colour, or spacing locally.
