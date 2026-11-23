---
this_file: src_docs/md/images/frames.md
---

# Device frames

A device frame gives a screenshot context. It does not turn an image into a working browser, phone or terminal. Keep the frame subordinate to the content and label simulated interfaces as illustrations.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Mockup browser · daisyUI { #daisyui-mockup-browser }

This frame is an illustration. Its chrome is decorative; the content keeps ordinary headings, paragraphs and code semantics. Keep the caption when the surrounding context could imply a working application.

<!-- specimen:daisyui-mockup-browser html -->
<div class="fltheme-components">
<figure><div class="du-mockup-browser" style="border:1px solid var(--color-base-300)"><div aria-hidden="true" class="du-mockup-browser-toolbar"><div class="du-input">help.fontlab.com</div></div><article style="padding:1.5rem"><h3>FontLab 8 manual</h3><p>Inspect outlines, spacing and kerning in context.</p></article></div><figcaption>Illustrative browser frame; the address is not an input.</figcaption></figure>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/mockup-browser/)

## Mockup code · daisyUI { #daisyui-mockup-code }

This frame is an illustration. Its chrome is decorative; the content keeps ordinary headings, paragraphs and code semantics. Keep the caption when the surrounding context could imply a working application.

<!-- specimen:daisyui-mockup-code html -->
<div class="fltheme-components">
<div aria-label="Illustrative terminal output" class="du-mockup-code" role="region" tabindex="0"><pre data-prefix="&gt;"><code>Source: Studio Sans</code></pre><pre data-prefix="&gt;"><code>Review: names, outlines, spacing, kerning</code></pre></div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/mockup-code/)

## Mockup phone · daisyUI { #daisyui-mockup-phone }

This frame is an illustration. Its chrome is decorative; the content keeps ordinary headings, paragraphs and code semantics. Keep the caption when the surrounding context could imply a working application.

<!-- specimen:daisyui-mockup-phone html -->
<div class="fltheme-components">
<figure class="flex flex-col items-center">
<div class="du-mockup-phone border-base-300">
<div aria-hidden="true" class="du-mockup-phone-camera"></div>
<div class="du-mockup-phone-display">
<article class="artboard artboard-demo phone-1 bg-base-100 px-6 text-base-content">
<p class="text-sm">FontLab Marketing</p>
<h3>Read comfortably anywhere</h3>
<p>A narrow screen keeps the same hierarchy and semantic roles.</p>
</article>
</div>
</div>
<figcaption>A compact article shown at phone width.</figcaption>
</figure>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/mockup-phone/)

## Mockup window · daisyUI { #daisyui-mockup-window }

This frame is an illustration. Its chrome is decorative; the content keeps ordinary headings, paragraphs and code semantics. Keep the caption when the surrounding context could imply a working application.

<!-- specimen:daisyui-mockup-window html -->
<div class="fltheme-components">
<figure><div class="du-mockup-window" style="border:1px solid var(--color-base-300)"><article style="padding:1.5rem"><h3>Sample proofing workspace</h3><p>Compare the original and converted family.</p></article></div><figcaption>Decorative window controls do not perform actions.</figcaption></figure>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/mockup-window/)
