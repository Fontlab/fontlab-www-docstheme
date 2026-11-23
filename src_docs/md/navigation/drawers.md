---
this_file: src_docs/md/navigation/drawers.md
---

# Drawers and sidebars

A drawer makes room for an occasional task without replacing the page. Keep the trigger visible and return focus when the panel closes. The examples are bounded demonstrations; a product sidebar needs its own application shell.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Drawer · Basecoat { #basecoat-drawer }

Present a temporary panel from an edge of the viewport.

**Behaviour and access.** Beta component. Use the shared drawer runtime with a native dialog and data-side. Give it a title and an explicit close action; do not duplicate the documentation sidebar.

<!-- specimen:basecoat-drawer html -->
<div class="fltheme-components">
<button class="btn" onclick="document.getElementById('basecoat-drawer-bc-drawer').showModal()" type="button">Open sample panel</button><dialog aria-labelledby="basecoat-drawer-bc-drawer-title" class="drawer" data-side="right" id="basecoat-drawer-bc-drawer"><div><header><h3 id="basecoat-drawer-bc-drawer-title">Sample inspection</h3></header><section><p>This example opens and closes a panel. No project is changed.</p></section><footer><form method="dialog"><button autofocus class="btn">Close</button></form></footer></div></dialog>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/drawer/)

## Drawer · daisyUI { #daisyui-drawer }

A drawer reveals supporting navigation without permanently narrowing the main
view. The checkbox and its labels provide a keyboard-operable open and close
control without page JavaScript. This demonstration constrains the side panel
to the specimen box rather than the viewport.

<!-- specimen:daisyui-drawer html -->
<div class="fltheme-components">
<div class="du-drawer" style="min-height: 13rem;">
<input class="du-drawer-toggle" id="daisyui-drawer-navigation-drawer-toggle" type="checkbox">
<div class="du-drawer-content" style="padding: 1rem;">
<p>The article remains the primary surface.</p>
<label class="du-btn du-btn-primary du-drawer-button" for="daisyui-drawer-navigation-drawer-toggle">Open section drawer</label>
</div>
<div class="du-drawer-side" style="position: absolute; inset: 0; height: 100%;">
<label aria-label="Close section drawer" class="du-drawer-overlay" for="daisyui-drawer-navigation-drawer-toggle"></label>
<nav aria-label="Section drawer">
<ul class="du-menu" style="min-height: 100%;">
<li><a href="../location/#daisyui-breadcrumbs">Orientation</a></li>
<li><a href="../menus/#daisyui-menu">Menus</a></li>
<li><a href="../../text/lists/#materialx-steps">Progress</a></li>
</ul>
</nav>
</div>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/drawer/)

## Scroll area · Basecoat { #basecoat-scroll-area }

Constrain a long auxiliary collection without expanding the entire page.

**Behaviour and access.** Basecoat styles native scrollbars; it does not replace scrolling. Set an explicit maximum block size and overflow, retain keyboard access, and avoid nested scroll areas for primary prose.

<!-- specimen:basecoat-scroll-area html -->
<div class="fltheme-components">
<div aria-label="Sample glyph names" class="scrollbar" role="region" style="max-height:8rem;overflow:auto" tabindex="0"><p>A</p><p>Aacute</p><p>Acircumflex</p><p>Adieresis</p><p>Agrave</p><p>Aring</p><p>Atilde</p><p>B</p><p>C</p><p>Cacute</p><p>Ccaron</p><p>Ccedilla</p></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/scroll-area/)

## Sidebar · Basecoat { #basecoat-sidebar }

Basecoat sidebars normally occupy the viewport. These inline position overrides keep this example within a bounded stage at both screen widths. The toggle calls the initialized sidebar method; the guide’s main navigation remains outside the example.

<!-- specimen:basecoat-sidebar html -->
<div class="fltheme-components">
<div style="position:relative;min-height:18rem;overflow:hidden"><button aria-controls="basecoat-sidebar-sample-sidebar" class="btn" onclick="document.getElementById('basecoat-sidebar-sample-sidebar').toggle()" type="button">Toggle example sidebar</button><aside class="sidebar" data-breakpoint="-1" data-initial-open="true" id="basecoat-sidebar-sample-sidebar" style="position:relative;inset:auto;background:transparent"><nav aria-label="Example project" style="position:relative;inset:auto;height:13rem;width:min(100%,15rem)"><header>Reading desk</header><section><ul><li><a href="../../text/type/">Text</a></li><li><a href="../../images/pictures/">Images</a></li></ul></section></nav></aside></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/sidebar/)
