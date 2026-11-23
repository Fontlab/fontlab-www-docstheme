---
this_file: src_docs/md/data/timelines.md
---

# Timelines and milestones

A timeline makes the order of events visible. Put the same order in the HTML so it survives a narrow screen and a screen reader. The specimen shows an editorial workflow, not a dated product release schedule.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Timeline · daisyUI { #daisyui-timeline }

A timeline connects events in order. Choose one orientation for the available
space; the source order must remain chronological in either layout.

<!-- specimen:daisyui-timeline html -->
<div class="fltheme-components">
<div aria-label="Publication timeline" class="fl-ui overflow-x-auto" role="region" tabindex="0">
<ol class="du-timeline du-timeline-horizontal">
<li><div class="du-timeline-start">Draft</div><div aria-hidden="true" class="du-timeline-middle">●</div><hr class="bg-primary"></li>
<li><hr class="bg-primary"><div class="du-timeline-end">Review</div><div aria-hidden="true" class="du-timeline-middle">●</div><hr></li>
<li><hr><div class="du-timeline-start">Publish</div><div aria-hidden="true" class="du-timeline-middle">&cir;</div></li>
</ol>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/timeline/)
