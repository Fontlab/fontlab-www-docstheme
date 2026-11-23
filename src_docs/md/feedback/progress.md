---
this_file: src_docs/md/feedback/progress.md
---

# Progress and loading

Show a percentage only when you can measure completed work. Use a spinner for an unknown duration and a skeleton to reserve the eventual layout. These are labelled static demonstrations, not live background tasks.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Progress · Basecoat { #basecoat-progress }

Report a measured proportion of a task.

**Behaviour and access.** Keep the rendered width and aria-valuenow synchronized with real progress. Use a named progressbar; do not invent a completion percentage for indeterminate work.

<!-- specimen:basecoat-progress html -->
<div class="fltheme-components">
<div aria-label="Export progress" aria-valuemax="100" aria-valuemin="0" aria-valuenow="60" class="progress" role="progressbar"><span style="width:60%"></span></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/progress/)

## Progress · daisyUI { #daisyui-progress }

A linear progress bar reports completion against a known maximum. Name the
task and show the numeric value nearby.

<!-- specimen:daisyui-progress html -->
<div class="fltheme-components">
<div class="fl-ui">
<label for="daisyui-progress-catalog-progress">Catalog review: 7 of 10 pages</label>
<progress class="du-progress du-progress-primary w-full" id="daisyui-progress-catalog-progress" max="10" value="7">70%</progress>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/progress/)

## Radial progress · daisyUI { #daisyui-radial-progress }

Radial progress is the compact alternative when a circular shape fits the
surrounding composition. It carries the same determinate meaning as a linear
bar.

<!-- specimen:daisyui-radial-progress html -->
<div class="fltheme-components">
<div class="fl-ui">
<div aria-label="Catalog review" aria-valuemax="100" aria-valuemin="0" aria-valuenow="70" class="du-radial-progress text-primary" role="progressbar" style="--value:70;">70%</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/radial-progress/)

## Spinner · Basecoat { #basecoat-spinner }

Indicate ongoing activity whose duration is unknown.

**Behaviour and access.** Use an SVG with animate-spin and a text status. Avoid announcing every animation frame and honour reduced-motion preferences. It does not prove a request is progressing.

<!-- specimen:basecoat-spinner html -->
<div class="fltheme-components">
<span role="status"><svg aria-hidden="true" class="animate-spin" height="20" viewbox="0 0 24 24" width="20"><path d="M12 3a9 9 0 1 1-9 9" fill="none" stroke="currentColor" stroke-width="2"></path></svg> Loading preview</span>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/spinner/)

## Loading · daisyUI { #daisyui-loading }

**Status:** `supported`; **specimen:** live. The six visual states are
`spinner`, `dots`, `ring`, `ball`, `bars`, and `infinity`. Pair an indeterminate
indicator with concise text; animation alone is neither a name nor a progress
report. If completion can be measured, use progress rather than loading.

<!-- specimen:daisyui-loading html -->
<div class="fltheme-components">
<div class="fl-ui">
<div aria-live="polite" class="fl-ui-row" role="status">
<span aria-hidden="true" class="du-loading du-loading-spinner"></span>
<span aria-hidden="true" class="du-loading du-loading-dots"></span>
<span aria-hidden="true" class="du-loading du-loading-ring"></span>
<span aria-hidden="true" class="du-loading du-loading-ball"></span>
<span aria-hidden="true" class="du-loading du-loading-bars"></span>
<span aria-hidden="true" class="du-loading du-loading-infinity"></span>
<span>Preparing preview&hellip;</span>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/loading/)

## Skeleton · Basecoat { #basecoat-skeleton }

Reserve the shape of content while it is genuinely loading.

**Behaviour and access.** Hide decorative placeholders from assistive technology and mark the containing region aria-busy. Replace them with content or an error; a skeleton must not remain a permanent empty state.

<!-- specimen:basecoat-skeleton html -->
<div class="fltheme-components">
<div aria-busy="true" aria-label="Loading font preview"><div aria-hidden="true" class="skeleton" style="height:4rem"></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/skeleton/)

## Skeleton · daisyUI { #daisyui-skeleton }

A skeleton reserves a stable shape while content is loading. It is a temporary
placeholder, not proof that progress is occurring.

<!-- specimen:daisyui-skeleton html -->
<div class="fltheme-components">
<div aria-busy="true" aria-label="Loading contributor details" class="fl-ui flex items-center gap-4">
<div aria-hidden="true" class="du-skeleton h-12 w-12 shrink-0 rounded-full"></div>
<div aria-hidden="true" class="flex-1">
<div class="du-skeleton h-4 w-32"></div>
<div class="du-skeleton mt-2 h-3 w-full"></div>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/skeleton/)
