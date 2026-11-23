---
this_file: src_docs/md/images/pictures.md
---

# Pictures and captions

A useful picture shows something the prose cannot show as quickly. Give it a caption that directs attention, useful alternative text and enough space to inspect the detail. Keep the source image proportional when the column narrows.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Images · MaterialX { #materialx-images }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-images -->
<figure markdown="1">

![Vexy Lines workspace with a line-art portrait](https://i.vexy.art/vl/landing/home-vexy-lines.jpg){ loading="lazy" width="960" }

<figcaption>The workspace places the source and its line treatment beside the controls.</figcaption>
</figure>
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/images.md)

## Images: authoring details

### Lightbox { #materialx-images-lightbox }

The image plugin wraps ordinary Markdown images with a lightbox link. Select
this specimen to inspect detail, then close it with the close control or
++escape++. The inline image remains useful when scripting is unavailable.

<!-- specimen:materialx-images-lightbox-sample -->
![Parallel blue and green strokes demonstrating a Vexy Lines fill](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_960/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png){ loading=lazy }
<!-- /specimen -->

### Image alignment { #materialx-images-image-alignment }

Alignment is for a small image with a short explanatory passage, not a way to
force long prose into a narrow channel. The image returns to the available
width when there is no room beside it.

<!-- specimen:materialx-images-image-alignment-sample -->
![A compact blue and green line sample aligned beside this note](https://res.cloudinary.com/fontlab/image/upload/c_fill,w_360,h_240/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png){ align=right loading=lazy width=240 }

The aligned specimen lets a short note refer to an adjacent detail. End the
relationship promptly; for a sustained margin composition, use the FontLab
[aside image pattern](../design/fontlab-patterns.md#fl-aside).
<!-- /specimen -->

### Image captions { #materialx-images-image-captions }

A caption says what the reader should notice or why the image matters. It adds
context; it does not replace alternative text.

<!-- specimen:materialx-images-image-captions-sample -->
![Parallel strokes showing how the fill keeps an even visual rhythm](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_720/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png){ loading=lazy }
/// caption
The line spacing stays legible at the baseline content width.
///
<!-- /specimen -->

### Image lazy-loading { #materialx-images-image-lazy-loading }

Use `loading=lazy` for non-critical images below the opening view. The browser
may delay the request, but the dimensions, alternative text, and surrounding
layout remain stable.

<!-- specimen:materialx-images-image-lazy-loading-sample -->
![A lazily loaded Vexy Lines detail](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_720/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png){ loading=lazy width=480 }
<!-- /specimen -->

### Light and dark mode { #materialx-images-light-and-dark-mode }

Theme-specific sources are appropriate when one asset cannot remain legible on
both surfaces. Both images need equivalent alternative text because only one is
visible at a time. FontLab’s theme switcher updates the MaterialX colour scheme,
so the matching fragment is selected without page-level JavaScript.

<!-- specimen:materialx-images-light-and-dark-mode-sample -->
![A Vexy Lines sample prepared for a light reading surface](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_720/e_brightness:10/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png#only-light){ loading=lazy }
![The same Vexy Lines sample prepared for a dark reading surface](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_720/e_brightness:-20/f_auto,q_auto/vw/68daa71678eede3413b20f4e_fill-linear.png#only-dark){ loading=lazy }

When an illustration remains clear in all five identities, prefer one source.
Theme-specific files double the maintenance and accessibility checks, so they
should solve a real contrast problem rather than decorate the theme switch.
<!-- /specimen -->


## A wider picture { #fl-wide }

Use the editorial `.fl-wide` class when the image needs more room than the prose. It retains the image proportions and shrinks with the viewport.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-wide -->
![Linear fill showing parallel strokes and tone](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_auto/f_auto,q_auto,dpr_auto/vw/68daa71678eede3413b20f4e_fill-linear.png){ .fl-wide loading="lazy" }
<!-- /specimen -->

## A picture beside the text { #fl-aside }

Use `.fl-aside` for supporting media in the desktop margin. Keep the image in a logical source position; on narrow screens it returns to the reading column.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-aside -->
![Linear fill with parallel strokes](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_auto/f_auto,q_auto,dpr_auto/vw/68daa71678eede3413b20f4e_fill-linear.png){ .fl-aside loading="lazy" }

Line direction and density affect the appearance of the source image. The picture supports this explanation; no instruction depends on its position.
<!-- /specimen -->

## An image beyond the text column { #fl-bleed }

The editorial `.fl-bleed` class extends a substantial picture towards the viewport edge. It requires the shared editorial layout CSS and JavaScript, which measure the available width. Test it in the actual destination shell.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-bleed -->
![Vexy Lines workspace and portrait](https://i.vexy.art/vl/landing/home-vexy-lines.jpg){ .fl-bleed loading="lazy" }
<!-- /specimen -->
