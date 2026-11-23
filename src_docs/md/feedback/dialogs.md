---
this_file: src_docs/md/feedback/dialogs.md
---

# Dialogs and popovers

A dialog interrupts the current task. Use it for a short decision that needs attention, and keep ordinary information in the reading flow. A popover suits optional context that can close without completing a form.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Alert dialog · Basecoat { #basecoat-alert-dialog }

Ask for a consequential decision that interrupts the current task.

**Behaviour and access.** Use a labelled native dialog opened with showModal(). Offer an explicit cancel action, keep initial focus on the safe choice and return focus to the trigger.

<!-- specimen:basecoat-alert-dialog html -->
<div class="fltheme-components">
<button class="btn" onclick="document.getElementById('basecoat-alert-dialog-bc-alert-dialog').showModal()" type="button">Review sample decision</button><dialog aria-labelledby="basecoat-alert-dialog-bc-alert-dialog-title" class="alert-dialog" id="basecoat-alert-dialog-bc-alert-dialog"><div><header><h3 id="basecoat-alert-dialog-bc-alert-dialog-title">Keep the draft?</h3></header><section><p>This example opens and closes a panel. No project is changed.</p></section><footer><form method="dialog"><button autofocus class="btn">Keep editing</button></form></footer></div></dialog>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/alert-dialog/)

## Dialog · Basecoat { #basecoat-dialog }

Focus attention on a short task in a modal surface.

**Behaviour and access.** Open the native dialog with showModal(), close with close() or a method="dialog" form. Retain Escape and focus restoration. Wire the opener to a unique dialog ID.

<!-- specimen:basecoat-dialog html -->
<div class="fltheme-components">
<button class="btn" onclick="document.getElementById('basecoat-dialog-bc-dialog').showModal()" type="button">Inspect sample details</button><dialog aria-labelledby="basecoat-dialog-bc-dialog-title" class="dialog" id="basecoat-dialog-bc-dialog"><div><header><h3 id="basecoat-dialog-bc-dialog-title">Sample family</h3></header><section><p>This example opens and closes a panel. No project is changed.</p></section><footer><form method="dialog"><button autofocus class="btn">Close</button></form></footer></div></dialog>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/dialog/)

## Modal · daisyUI { #daisyui-modal }

The button opens a native modal dialog. Focus moves into it and returns to
the opener after Close or Escape. The inline handler is included in the copied
HTML; rename the dialog ID and its references when duplicating the example.

<!-- specimen:daisyui-modal html -->
<div class="fltheme-components">
<button class="du-btn" onclick="document.getElementById('daisyui-modal-du-details-dialog').showModal()" type="button">Inspect sample details</button><dialog aria-labelledby="daisyui-modal-du-details-title" class="du-modal" id="daisyui-modal-du-details-dialog"><div class="du-modal-box"><h3 id="daisyui-modal-du-details-title">Sample family</h3><p>This dialog demonstrates a modal surface. No project is changed.</p><form class="du-modal-action" method="dialog"><button autofocus class="du-btn">Close</button></form></div></dialog>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/modal/)

## Popover · Basecoat { #basecoat-popover }

Show a small anchored surface without blocking the whole page.

**Behaviour and access.** The shared runtime opens and dismisses the popover. Connect the trigger to the panel with aria-controls and retain an accessible trigger label. Use a dialog instead when the task must be modal.

<!-- specimen:basecoat-popover html -->
<div class="fltheme-components">
<div class="popover"><button aria-controls="basecoat-popover-font-popover" aria-expanded="false" class="btn">Font info</button><div aria-hidden="true" data-popover id="basecoat-popover-font-popover"><header><h3>Regular</h3></header><p>400 weight, upright.</p></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/popover/)
