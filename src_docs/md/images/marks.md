---
this_file: src_docs/md/images/marks.md
---

# Avatars and marks

A name carries the identity; a portrait, icon or badge helps the reader recognise it. Keep status words beside coloured marks. The names and availability states below are fictional demonstration data.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Avatar · Basecoat { #basecoat-avatar }

Represent a person or team in a compact identity marker.

**Behaviour and access.** Use meaningful image alternative text when the name is absent. Initials are a useful fallback; online state also needs visible text.

<!-- specimen:basecoat-avatar html -->
<div class="fltheme-components">
<span aria-label="FontLab team" class="avatar"><span>FL</span></span>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/avatar/)

## Avatar · daisyUI { #daisyui-avatar }

An avatar identifies a person or account. Initials are a useful fallback, but
the adjacent name remains the real label.

<!-- specimen:daisyui-avatar html -->
<div class="fltheme-components">
<div class="fl-ui">
<div aria-label="Avatar states" class="fl-ui-row">
<div class="du-avatar du-avatar-placeholder"><div class="bg-neutral text-neutral-content w-12 rounded-full"><span aria-hidden="true">AL</span></div></div>
<span>Alex Lin</span>
<div class="du-avatar du-avatar-online du-avatar-placeholder"><div class="bg-neutral text-neutral-content w-12 rounded-full"><span aria-hidden="true">MK</span></div></div>
<span>Mae Kim &mdash; online</span>
<div class="du-avatar du-avatar-offline du-avatar-placeholder"><div class="bg-neutral text-neutral-content w-12 rounded-full"><span aria-hidden="true">RS</span></div></div>
<span>Ravi Shah &mdash; offline</span>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/avatar/)

## Badge · Basecoat { #basecoat-badge }

Attach a short status to a nearby item.

**Behaviour and access.** Keep the badge as text, not a pretend button. Use data-variant for secondary, outline or destructive emphasis and include the meaning in its label.

<!-- specimen:basecoat-badge html -->
<div class="fltheme-components">
<span class="badge" data-variant="secondary">Draft</span>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/badge/)

## Badge · daisyUI { #daisyui-badge }

Badges label, count, or qualify something already named. Keep their text short
and do not use a badge as an unlabeled action.

<!-- specimen:daisyui-badge html -->
<div class="fltheme-components">
<div class="fl-ui">
<div aria-label="Badge treatments" class="fl-ui-row">
<span class="du-badge">Default</span>
<span class="du-badge du-badge-outline">Outline</span>
<span class="du-badge du-badge-primary du-badge-soft">Soft</span>
<span class="du-badge du-badge-secondary du-badge-dash">Draft</span>
<span class="du-badge du-badge-success">Published</span>
</div>
<div aria-label="Filled semantic badge colors" class="fl-ui-row">
<span class="du-badge du-badge-primary">Primary</span>
<span class="du-badge du-badge-secondary">Secondary</span>
<span class="du-badge du-badge-info">Info</span>
<span class="du-badge du-badge-success">Success</span>
<span class="du-badge du-badge-warning">Warning</span>
<span class="du-badge du-badge-error">Error</span>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/badge/)

## Icons emojis · MaterialX { #materialx-icons-emojis }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-icons-emojis -->
:material-check: Source files retained.
{ .fl-source-note }

:material-information-outline: Keep a written status beside the icon.
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/icons-emojis.md)

## Mask · daisyUI { #daisyui-mask }

Mask changes an image silhouette without changing its meaning. Keep essential
details away from the cropped edges and retain the image’s alternative text.

<!-- specimen:daisyui-mask html -->
<div class="fltheme-components">
<div class="fl-ui">
<img alt="Blue and green Vexy Lines strokes cropped to a rounded square" class="du-mask du-mask-squircle" height="240" loading="lazy" src="https://res.cloudinary.com/fontlab/image/upload/c_fill,w_320,h_320/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png" width="240">
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/mask/)

## Icons emojis: authoring details

### Using emojis { #materialx-icons-emojis-using-emojis }

Use a shortcode when the symbol adds tone or recognition. Do not replace a
label, warning, or status with an emoji alone.

### Using icons { #materialx-icons-emojis-using-icons }

Use a bundled icon shortcode so the build remains local and deterministic.
Pair an icon-only control with an accessible name.

### with colors { #materialx-icons-emojis-with-colors }

Add a semantic class whose value comes from the active theme. Literal colour
values in Markdown are forbidden, and colour cannot be the sole signal.

### with animations { #materialx-icons-emojis-with-animations }

Animation belongs in shared CSS, must respect reduced-motion preferences, and
must not be required to understand state.

### Using icons in templates { #materialx-icons-emojis-using-icons-in-templates }

Templates may include tracked theme icons through the renderer helper. Keep
content-facing icons in Markdown so authors can see them in context.

## Compare semantic badges

The sample labels name the colour roles. In a product, replace them with the
actual status: colour should reinforce readable text.

<!-- specimen:marks-semantic-badges html -->
<div class="fltheme-components fl-demo-row">
<span class="du-badge du-badge-primary">Primary</span>
<span class="du-badge du-badge-secondary">Secondary</span>
<span class="du-badge du-badge-info">Info</span>
<span class="du-badge du-badge-success">Success</span>
<span class="du-badge du-badge-warning">Warning</span>
<span class="du-badge du-badge-error">Error</span>
</div>
<!-- /specimen -->
