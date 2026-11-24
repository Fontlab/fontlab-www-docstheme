---
this_file: src_docs/md/compare/alerts.md
---

# Alerts, admonitions and callouts

Compare a successful export and a missing source. Each specimen is a static message.

<!-- specimen:compare-alerts -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components">
  <div class="alert">
  <h3>Export ready</h3>
  <section>Open the build and inspect the result.</section>
  </div>
  <div class="alert" data-variant="destructive">
  <h3>Source missing</h3>
  <section>Restore the source before exporting again.</section>
  </div>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components">
  <div class="du-alert du-alert-success">
  <div><h3>Export ready</h3><p>Open the build and inspect the result.</p></div>
  </div>
  <div class="du-alert du-alert-error">
  <div><h3>Source missing</h3><p>Restore the source before exporting again.</p></div>
  </div>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

!!! success "Export ready"

    Open the build and inspect the result.

!!! failure "Source missing"

    Restore the source before exporting again.

</section>

</div>
<!-- /specimen -->

Use a MaterialX admonition for an authored instruction. Use either component alert for a visible application message and announce time-sensitive live updates when they appear. A plain callout can carry the same guidance when no status treatment is needed.

## A callout in the reading flow

<!-- specimen:compare-alert-callout -->
<section class="fl-card" markdown="1">

### Source missing

Restore the source before exporting again.

</section>
<!-- /specimen -->
