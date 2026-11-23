---
this_file: src_docs/md/data/states.md
---

# Empty and changing states

An empty result, a task in progress and an error ask the reader to do different things. Give each state a concrete name and a useful next step. The figures and conversations below are fictional examples.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Chat · daisyUI { #daisyui-chat }

Chat bubbles show a short exchange. Start and end describe placement, not who
is morally or procedurally “right”; identify each speaker in text.

<!-- specimen:daisyui-chat html -->
<div class="fltheme-components">
<div aria-label="Example conversation" class="fl-ui">
<div class="du-chat du-chat-start">
<div class="du-chat-header">Editor</div>
<div class="du-chat-bubble">Does the table still fit on a narrow screen?</div>
</div>
<div class="du-chat du-chat-end">
<div class="du-chat-header">Author</div>
<div class="du-chat-bubble">Yes. Its wrapper scrolls without widening the page.</div>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/chat/)

## Countdown · daisyUI { #daisyui-countdown }

Countdown formats a number as a rolling digit. It does not supply timing logic,
and this static specimen intentionally does not start a timer.

<!-- specimen:daisyui-countdown html -->
<div class="fltheme-components">
<div class="fl-ui">
<p aria-label="12 days remaining"><span aria-hidden="true" class="du-countdown font-mono text-4xl"><span style="--value:12;"></span></span> days remaining</p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/countdown/)

## Empty · Basecoat { #basecoat-empty }

Explain why a collection has no items and how to proceed.

**Behaviour and access.** Give the empty state a concrete heading, useful reason and real next step. Do not show a spinner when nothing is loading or imply that user content was lost.

<!-- specimen:basecoat-empty html -->
<div class="fltheme-components">
<section class="empty"><header><h3>No examples selected</h3><p>Choose a pattern to start composing a page.</p></header><a class="btn" href="../../start/choose/">Choose a pattern</a></section>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/empty/)

## Indicator · daisyUI { #daisyui-indicator }

An indicator attaches a compact label or count to another object. Its content
must add information rather than serving as a decorative dot.

<!-- specimen:daisyui-indicator html -->
<div class="fltheme-components">
<div class="fl-ui">
<div class="du-indicator">
<span aria-label="3 unread notes" class="du-indicator-item du-badge du-badge-primary">3</span>
<div class="du-card bg-base-200"><div class="du-card-body"><h3 class="du-card-title">Review notes</h3><p>Open comments on this page.</p></div></div>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/indicator/)

## Status · daisyUI { #daisyui-status }

Status is a compact presence mark. The dot supports a written state; it never
replaces one.

<!-- specimen:daisyui-status html -->
<div class="fltheme-components">
<div class="fl-ui">
<div aria-label="Service states" class="fl-ui-row">
<span aria-hidden="true" class="du-status du-status-success"></span><span>Build service: available</span>
<span aria-hidden="true" class="du-status du-status-warning"></span><span>Search index: updating</span>
<span aria-hidden="true" class="du-status du-status-error"></span><span>Preview server: unavailable</span>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/status/)

## Text rotate · daisyUI { #daisyui-text-rotate }

Text rotate cycles short alternatives in one line. The surrounding sentence
must remain understandable if only the first item appears, and the sequence
must not contain instructions or status changes.

<!-- specimen:daisyui-text-rotate html -->
<div class="fltheme-components">
<div class="fl-ui">
<p>Build a system that is <strong>clear</strong>.</p>
</div>
<div class="fl-ui">
<span class="sr-only">Build a system that is clear, coherent, and calm.</span>
<p aria-hidden="true">Build a system that is
    <span class="du-text-rotate">
<span><span>clear</span><span>coherent</span><span>calm</span></span>
</span>.
  </p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/text-rotate/)
