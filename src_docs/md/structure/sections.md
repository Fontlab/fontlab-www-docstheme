---
this_file: src_docs/md/structure/sections.md
---

# Sections and dividers

Headings establish the document structure. Dividers can mark a change of subject inside that structure, while footers collect secondary routes. Decorative surfaces should support those relationships without becoming another layer of navigation.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Aura · daisyUI { #daisyui-aura }

The aura is decorative. It does not indicate loading, success or selection. Keep a readable foreground and respect reduced-motion preferences when you add animation.

<!-- specimen:daisyui-aura html -->
<div class="fltheme-components">
<div class="du-aura" style="padding:2rem;text-align:center"><strong>Vexy Lines</strong><p>Line direction, density and rhythm.</p></div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/aura/)

## Divider · daisyUI { #daisyui-divider }

A divider separates adjacent groups inside a component. For a change of subject
in prose, use the semantic horizontal rule documented in
[Foundations](../text/type.md) instead.

<!-- specimen:daisyui-divider html -->
<div class="fltheme-components">
<div class="fl-ui">
<div>Structure first</div>
<div class="du-divider">then detail</div>
<div>Decoration last</div>
</div>
<div class="fl-ui fl-ui-row">
<span>Measure</span>
<div class="du-divider du-divider-horizontal"></div>
<span>Rhythm</span>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/divider/)

## Footer · daisyUI { #daisyui-footer }

The component footer groups links or ownership information inside a bounded
specimen. This footer belongs to its enclosing example section; it is not the
site’s global `fontlab-footer`. Give its navigation a specific name when
another navigation region appears on the same page.

<!-- specimen:daisyui-footer html -->
<div class="fltheme-components">
<footer class="du-footer" style="padding:1rem"><nav aria-label="Example footer"><h3 class="du-footer-title">Font resources</h3><a class="du-link" href="https://help.fontlab.com/fontlab/8/">FontLab 8 manual</a><a class="du-link" href="https://www.fontlab.com/">FontLab products</a></nav></footer>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/footer/)

## Contain a component sample { #fl-ui }

The optional `.fl-ui` helper supplies spacing for a small sample. It does not initialize controls or replace `.fltheme-components`.

This pattern uses the shared FontLab editorial styles described in
[Theme and setup](../start/setup.md).

<!-- specimen:fl-ui -->
<div class="fltheme-components fl-ui">
<a class="du-btn" href="https://help.fontlab.com/fontlab/8/">Read the manual</a>
</div>
<!-- /specimen -->
