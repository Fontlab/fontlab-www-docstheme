---
this_file: src_docs/md/navigation/menus.md
---

# Menus and bars

A navigation menu offers destinations; a command menu offers actions. Keep those meanings in the underlying anchors and buttons. Start with a short visible list before hiding it behind a trigger.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Dock · daisyUI { #daisyui-dock }

A dock holds a few peer destinations for a compact application surface. It is
not a substitute for the documentation site's own navigation. In this specimen
the daisyUI dock is explicitly positioned inside its example instead of fixed
to the viewport; the active item carries `aria-current="page"` as well as the
visual active state.

<!-- specimen:daisyui-dock html -->
<div class="fltheme-components">
<nav aria-label="Bounded example navigation" class="du-dock" style="position:relative;inset:auto"><a class="du-dock-active" aria-current="page" href="../../start/">Start</a><a href="../../text/type/">Text</a><a href="../../images/pictures/">Images</a></nav>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/dock/)

## Dropdown · daisyUI { #daisyui-dropdown }

A dropdown offers a short, contextual list next to its trigger. Native
`details` and `summary` supply closed, open, focus, Enter, and Space behaviour
without scripting. The summary names the choice; the links remain ordinary
links in the tab order.

<!-- specimen:daisyui-dropdown html -->
<div class="fltheme-components">
<details class="du-dropdown"><summary class="du-btn">Reading destinations</summary><ul class="du-dropdown-content du-menu" style="background:var(--color-base-100);width:14rem;z-index:2"><li><a href="../../text/type/">Type and emphasis</a></li><li><a href="../../structure/cards/">Cards and groups</a></li></ul></details>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/dropdown/)

## Dropdown menu · Basecoat { #basecoat-dropdown-menu }

Expose a short list of commands from one trigger.

**Behaviour and access.** The runtime manages opening, focus and dismissal. Preserve aria-haspopup, aria-controls and the menu roles. Commands need application handlers; navigation items should be actual links.

<!-- specimen:basecoat-dropdown-menu html -->
<div class="fltheme-components">
<div class="dropdown-menu"><button aria-controls="basecoat-dropdown-menu-destinations-menu" aria-expanded="false" aria-haspopup="menu" class="btn" id="basecoat-dropdown-menu-destinations-trigger">Reading destinations</button><div aria-hidden="true" data-popover><div aria-labelledby="basecoat-dropdown-menu-destinations-trigger" id="basecoat-dropdown-menu-destinations-menu" role="menu"><a href="../../text/type/" role="menuitem">Type and emphasis</a><a href="../../structure/cards/" role="menuitem">Cards and groups</a></div></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/dropdown-menu/)

## Megamenu · daisyUI { #daisyui-megamenu }

A megamenu is for a broad catalogue whose groups help recognition. If a single
short list will do, use a menu or dropdown instead. The native Popover API
connects the trigger and panel and supports Escape to dismiss the menu. The
panel uses the browser's top layer, so it can extend beyond the specimen.

<!-- specimen:daisyui-megamenu html -->
<div class="fltheme-components">
<button type="button" class="du-btn" popovertarget="daisyui-megamenu-navigation-megamenu" style="anchor-name:--navigation-megamenu">Browse the guide</button>
<ul aria-label="Design guide groups" class="du-menu" id="daisyui-megamenu-navigation-megamenu" popover style="position-anchor:--navigation-megamenu;position-area:bottom;max-width:calc(100vw - 2rem);background:var(--color-base-100);padding:1rem">
<li class="du-menu-title">Write</li>
<li><a href="../../text/type/">Type and emphasis</a></li>
<li><a href="../../text/links/">Links and buttons</a></li>
<li class="du-menu-title">Arrange</li>
<li><a href="../../data/tables/">Tables and lists</a></li>
<li><a href="../../layouts/editorial/">Editorial features</a></li>
<li class="du-menu-title">Respond</li>
<li><a href="../../feedback/notes/">Notes and alerts</a></li>
<li><a href="../../forms/fields/">Fields and labels</a></li>
</ul>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/megamenu/)

## Menu · daisyUI { #daisyui-menu }

A menu is a compact list of destinations or commands. Use a link for
navigation, a button for an action, and the native `disabled` attribute for an
unavailable action. A submenu should disclose its nesting instead of depending
on indentation alone.

<!-- specimen:daisyui-menu html -->
<div class="fltheme-components">
<ul class="du-menu"><li><a href="../../text/type/">Write the text</a></li><li><a href="../../images/pictures/">Add a picture</a></li><li><a href="../../layouts/editorial/">Compose the page</a></li></ul>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/menu/)

## Navbar · daisyUI { #daisyui-navbar }

A navbar arranges a small set of primary controls across one bounded row. Its
landmark needs a specific accessible label when another navigation landmark is
already present. This specimen is not sticky and does not repeat the real site
menu.

<!-- specimen:daisyui-navbar html -->
<div class="fltheme-components">
<nav aria-label="Example product navigation" class="du-navbar" style="flex-wrap:wrap;gap:1rem"><strong>Font tools</strong><a class="du-btn du-btn-ghost" href="https://www.fontlab.com/font-editor/">Editors</a><a class="du-btn du-btn-ghost" href="https://www.fontlab.com/font-converter/">Converters</a></nav>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/navbar/)
