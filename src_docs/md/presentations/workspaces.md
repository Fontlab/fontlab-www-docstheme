---
this_file: src_docs/md/presentations/workspaces.md
---

# Interactive workspaces

A workspace combines controls, content and feedback around one task. The
reader needs to see what can change, where the result appears and whether the
change has been saved. These small browser demonstrations illustrate that
relationship without pretending to be FontLab or Vexy Lines.

## A proofing desk with one working control

A live size control makes the relationship between a setting and its output
visible. Keep the number beside the slider and preserve a native reset action.
The sample sentence is adapted from the FontLab font-conversion page.

<!-- specimen:workspace-proof html -->
<div class="fltheme-components fl-editorial">
  <section>
    <h3>Sample proof</h3>
    <p id="workspace-proof-text" style="font-size:32px;line-height:1.3;overflow-wrap:anywhere">Names, outlines, spacing, kerning and family structure should survive the trip.</p>
    <p>This text is a browser proof, not a font-editor preview.</p>
  </section>
  <form class="fl-editorial-note" onreset="document.getElementById('workspace-proof-text').style.fontSize='32px';this.querySelector('output').value='32 px'">
    <label for="workspace-proof-size">Preview size</label>
    <input class="input" id="workspace-proof-size" type="range" min="16" max="64" value="32" oninput="document.getElementById('workspace-proof-text').style.fontSize=this.value+'px';this.nextElementSibling.value=this.value+' px'">
    <output for="workspace-proof-size">32 px</output>
    <p><button class="btn" type="reset" data-variant="outline">Reset preview</button></p>
  </form>
</div>
<!-- /specimen -->

The inline handlers update only the named preview and output. Copied HTML
retains that behaviour. If you insert another copy in the same document, rename
the IDs and every reference to them. The grid and side-note treatment come
from `field-guide.css`.

## Separate editing from acknowledgement

A form can acknowledge a local edit without suggesting that a server received
it. Native required-field validation runs before the submit handler. The
result names the submitted value and states where it went.

<!-- specimen:workspace-local-form html -->
<div class="fltheme-components">
  <form class="fl-workspace-form" onsubmit="event.preventDefault();this.querySelector('output').textContent='Local draft: '+this.elements.namedItem('family').value+'. No data was sent.'" onreset="this.querySelector('output').textContent='Changes stay in this demonstration.'">
    <div class="field">
      <label for="workspace-family">Sample family name (required)</label>
      <input class="input" id="workspace-family" name="family" value="Studio Sans" required aria-describedby="workspace-family-help">
      <p id="workspace-family-help">This is fictional project data. Enter a name to update the local result.</p>
    </div>
    <div class="fl-demo-row">
      <button class="btn" type="submit">Update local draft</button>
      <button class="btn" data-variant="outline" type="reset">Reset form</button>
    </div>
    <output role="status" aria-live="polite">Changes stay in this demonstration.</output>
  </form>
</div>
<!-- /specimen -->

A product that saves remotely needs to represent pending, failed and confirmed
saves separately. This demonstration has no remote save operation. Its status
describes only the completed local change.

## Keep task guidance beside the workspace

The Vexy Lines source describes a composition built with layers, groups and
masks. A help panel can keep that model close to the controls without copying
the whole manual into a sidebar.

<!-- specimen:workspace-guidance -->
<div class="fl-editorial" markdown="1">

<article markdown="1">

### Compose with layers and masks

Stack fills to give different parts of the image different treatments.
Group related layers and paint masks to control where each fill appears.
The Vexy Lines source page describes one mask per layer and project files
that you can reopen and refine.

A workspace should keep those relationships visible. Put the selected layer's
settings beside its result, and give the mask a name that remains useful when
the composition has several layers.

[Read the layer guide](https://help.vexy.art/lines/articles/adding-a-layer/){ .md-button }

</article>

<aside class="fl-editorial-note" markdown="1">

#### Inspect one relationship

Which layer draws this region? Which mask limits it? What changes when the
fill settings change?

Keep the answer beside the active control. A tooltip can explain a term;
the layer-to-mask relationship deserves a persistent label.

[Read about masks](https://help.vexy.art/lines/articles/adding-a-mask/)

</aside>

</div>
<!-- /specimen -->

Text sources: `www.fontlab.com/src_docs/md/font-converter.md` and
`www.vexy.art/src_docs/md/lines/index.md`. The browser controls are illustrative
guide examples and are not copied product interfaces.
{ .fl-source-note }
