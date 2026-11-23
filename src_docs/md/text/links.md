---
this_file: src_docs/md/text/links.md
---

# Links and buttons

A link goes to a destination. A button performs an action in the current
interface. Keep that distinction in the HTML even when the two look similar.
Name the destination or action so the label makes sense outside its paragraph.

## Start with a text link

<!-- specimen:links-text -->
Read the [FontLab 8 manual](https://help.fontlab.com/fontlab/8/) when you need
the exact behaviour of a tool or panel.
<!-- /specimen -->

Use a plain link inside prose. A paragraph full of buttons makes it harder to
read the relationship between the destinations.

## Give one route emphasis

MaterialX link buttons work directly with Markdown attribute lists. Use the
primary modifier for the route that follows from the page's main idea.

<!-- specimen:links-materialx -->
[Read the manual](https://help.fontlab.com/fontlab/8/){ .md-button .md-button--primary }
[Explore font tools](https://www.fontlab.com/){ .md-button }
<!-- /specimen -->

## Use the same link semantics with component styles

Basecoat and daisyUI also style anchors. The same source pattern carries their
class names, so you can keep the link in Markdown while matching nearby HTML
controls.

<!-- specimen:links-components -->
<div class="fltheme-components fl-demo-row" markdown="1">

[Font converters](https://www.fontlab.com/font-converter/){ .btn data-variant="outline" }
[Font editors](https://www.fontlab.com/font-editor/){ .du-btn .du-btn-outline }

</div>
<!-- /specimen -->

The first anchor uses Basecoat's outline variant. The second uses daisyUI's
prefixed outline modifier. Do not put both component families on one element.

## A button needs an action

Both buttons below reset their own form. The browser supplies the behaviour;
neither button sends information to a server. Change the sample family name,
then click the reset button to restore it.

<!-- specimen:links-reset html -->
<div class="fltheme-components fl-pattern-grid">
  <form>
    <label for="basecoat-family">Sample family name</label>
    <input class="input" id="basecoat-family" name="family" value="Studio Sans">
    <button class="btn" type="reset" data-variant="outline">Reset Basecoat example</button>
  </form>
  <form>
    <label for="daisy-family">Sample family name</label>
    <input class="du-input" id="daisy-family" name="family" value="Studio Sans">
    <button class="du-btn du-btn-outline" type="reset">Reset daisyUI example</button>
  </form>
</div>
<!-- /specimen -->

The sample family is fictional. If you repeat this specimen, rename both
input IDs and the matching `for` attributes.

## Show an unavailable action honestly

<!-- specimen:links-disabled html -->
<div class="fltheme-components fl-demo-row">
  <button class="btn" type="button" disabled>Export unavailable</button>
  <button class="du-btn du-btn-primary" type="button" disabled>Export unavailable</button>
</div>
<!-- /specimen -->

Native `disabled` prevents button activation. Explain the cause in nearby
text in your application; colour or a tooltip alone is insufficient.

## Button · Basecoat { #basecoat-button }

Change the text, then reset the form. The second button demonstrates a native disabled control. Give unavailable actions an explanation in a real interface.

<!-- specimen:basecoat-button html -->
<div class="fltheme-components">
<form class="fl-demo-row"><input aria-label="Basecoat demonstration text" class="input" value="Sample text"><button class="btn" type="reset">Reset text</button><button class="btn" disabled>Export unavailable</button></form>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/button/)

## Button · daisyUI { #daisyui-button }

Change the text, then reset the form. The second button demonstrates a native disabled control. Give unavailable actions an explanation in a real interface.

<!-- specimen:daisyui-button html -->
<div class="fltheme-components">
<form class="fl-demo-row"><input aria-label="Demonstration text" class="du-input" value="Sample text"><button class="du-btn du-btn-primary" type="reset">Reset text</button><button class="du-btn" disabled>Export unavailable</button></form>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/button/)

## Button group · Basecoat { #basecoat-button-group }

Joined links can express a small group of peer destinations. Each link keeps its own accessible name and focus stop.

<!-- specimen:basecoat-button-group html -->
<div class="fltheme-components">
<nav aria-label="Reading group" class="button-group"><a class="btn" data-variant="outline" href="../../text/type/">Type</a><a class="btn" data-variant="outline" href="../../text/lists/">Lists</a></nav>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/button-group/)

## Buttons · MaterialX { #materialx-buttons }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-buttons -->
[Read the manual](https://help.fontlab.com/fontlab/8/){ .md-button }
[Explore font conversion :material-arrow-right:](https://www.fontlab.com/font-converter/){ .md-button .md-button--primary }
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/buttons.md)

## Fab · daisyUI { #daisyui-fab }

A floating action button fits a compact application workspace. Focus the plus control to reveal two real destinations. Absolute positioning keeps the example inside its preview; copied HTML retains that boundary.

<!-- specimen:daisyui-fab html -->
<div class="fltheme-components">
<div style="position:relative;min-height:12rem"><div class="du-fab" style="position:absolute;bottom:1rem;right:1rem"><div aria-label="Open reading destinations" class="du-btn du-btn-circle du-btn-primary" role="button" tabindex="0">+</div><a class="du-btn" href="https://help.fontlab.com/fontlab/8/">Manual</a><a class="du-btn" href="https://www.fontlab.com/">Products</a></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/fab/)

## Link · daisyUI { #daisyui-link }

Use `.link` when an interface fragment needs daisyUI's link treatment. Normal
article links already have the house style and do not need the class.

<!-- specimen:daisyui-link html -->
<div class="fltheme-components">
<a class="du-link du-link-primary" href="https://help.fontlab.com/fontlab/8/">FontLab 8 manual</a>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/link/)

## Buttons: authoring details

### Adding buttons { #materialx-buttons-adding-buttons }

Use the base treatment for a visible but secondary route.

[Read the action guidance](../design/actions.md#button-system){ .md-button }

``` markdown
[Read the action guidance](../design/actions.md#button-system){ .md-button }
```

### Adding primary buttons { #materialx-buttons-adding-primary-buttons }

Add the primary modifier only when this is the page's single main route.

[Start reading](https://fontlab.dev/vexy-fontlab-writing-styleguide/fl1992mk/){ .md-button .md-button--primary }

``` markdown
[Start reading](https://fontlab.dev/vexy-fontlab-writing-styleguide/fl1992mk/){ .md-button .md-button--primary }
```

### Adding icon buttons { #materialx-buttons-adding-icon-buttons }

An icon may reinforce the label, but must not replace it.

[Continue :material-arrow-right:](links.md#daisyui-fab){ .md-button }

``` markdown
[Continue :material-arrow-right:](links.md#daisyui-fab){ .md-button }
```

**Accessibility.** Write link text that still makes sense without its visual
treatment or icon. Do not apply `.md-button` to a link whose destination is
missing, and do not mix `.md-button` and `.btn` on one element.

## Compare semantic action colours

Use the role that describes an action, and keep its text label. These buttons
reset the sample field so that every enabled control has an observable action.
A warning or error colour belongs to that state, not to ordinary emphasis.

<!-- specimen:links-semantic-buttons html -->
<div class="fltheme-components"><form><label for="semantic-button-sample">Editable sample</label><input class="du-input" id="semantic-button-sample" value="Studio Sans"><div class="fl-demo-row">
<button type="reset" class="du-btn du-btn-primary">Primary reset</button>
<button type="reset" class="du-btn du-btn-secondary">Secondary reset</button>
<button type="reset" class="du-btn du-btn-info">Info reset</button>
<button type="reset" class="du-btn du-btn-success">Success reset</button>
<button type="reset" class="du-btn du-btn-warning">Warning reset</button>
<button type="reset" class="du-btn du-btn-error">Error reset</button>
</div></form></div>
<!-- /specimen -->

## Size and weight of an action

Outline and ghost treatments let a secondary action recede. Small and large
variants change the control size; preserve a comfortable touch target when
using them on a phone. All four controls below reset the same editable field.

<!-- specimen:links-button-variants html -->
<div class="fltheme-components"><form><label for="variant-button-sample">Editable sample</label><input class="du-input" id="variant-button-sample" value="Studio Sans"><div class="fl-demo-row">
<button type="reset" class="du-btn du-btn-outline">Outline reset</button>
<button type="reset" class="du-btn du-btn-ghost">Ghost reset</button>
<button type="reset" class="du-btn du-btn-sm">Small reset</button>
<button type="reset" class="du-btn du-btn-lg">Large reset</button>
</div></form></div>
<!-- /specimen -->

## Show a busy action

This static specimen represents work in progress. A real application should
set `aria-busy="true"` while its request runs, then restore the enabled action
and announce the result. The spinner is decorative because the label says
what is happening.

<!-- specimen:links-busy-button html -->
<div class="fltheme-components"><button type="button" class="du-btn" aria-busy="true" disabled><span class="du-loading du-loading-spinner" aria-hidden="true"></span>Preparing preview…</button></div>
<!-- /specimen -->
