---
this_file: src_docs/md/compare/dialogs.md
---

# Dialogs

Open the same family preview three ways. Close it with the button or Escape.

<!-- specimen:compare-dialogs -->
<div class="fl-library-grid fl-compare" markdown="1">

<section data-compare-library="basecoat" markdown="1">

## Basecoat

<div markdown="0" class="fltheme-components">
<button class="btn" type="button" onclick="document.getElementById('bc-family-dialog').showModal()">Inspect family</button>
<dialog class="dialog" id="bc-family-dialog" aria-labelledby="bc-family-title" aria-describedby="bc-family-details">
  <div>
  <header><h3 id="bc-family-title">Studio Sans</h3></header>
  <section><p id="bc-family-details">Regular, Italic and Bold are ready to inspect.</p></section>
  <footer><form method="dialog"><button class="btn" type="submit" autofocus>Close</button></form></footer>
  </div>
</dialog>
</div>

</section>

<section data-compare-library="daisyui" markdown="1">

## daisyUI

<div markdown="0" class="fltheme-components">
<button class="du-btn du-btn-primary" type="button" onclick="document.getElementById('du-family-dialog').showModal()">Inspect family</button>
<dialog class="du-modal" id="du-family-dialog" aria-labelledby="du-family-title" aria-describedby="du-family-details">
  <div class="du-modal-box">
  <h3 id="du-family-title">Studio Sans</h3>
  <p id="du-family-details">Regular, Italic and Bold are ready to inspect.</p>
  <div class="du-modal-action"><form method="dialog"><button class="du-btn du-btn-primary" type="submit" autofocus>Close</button></form></div>
  </div>
</dialog>
</div>

</section>

<section data-compare-library="materialx" markdown="1">

## MaterialX

<button class="md-button md-button--primary" type="button" onclick="document.getElementById('mx-family-dialog').showModal()">Inspect family</button>
<dialog class="fly-dialog" id="mx-family-dialog" aria-labelledby="mx-family-title" aria-describedby="mx-family-details">
  <h3 id="mx-family-title">Studio Sans</h3>
  <p id="mx-family-details">Regular, Italic and Bold are ready to inspect.</p>
  <form method="dialog"><button class="md-button md-button--primary" type="submit" autofocus>Close</button></form>
</dialog>

</section>

</div>
<!-- /specimen -->

MaterialX pages can embed a native HTML dialog when a task requires focus. Choose the Basecoat or daisyUI modal if it already belongs to an application built with that library. All three use the browser’s modal keyboard and focus handling.
