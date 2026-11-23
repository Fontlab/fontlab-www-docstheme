---
this_file: src_docs/md/navigation/search.md
---

# Search and commands

Search reduces a large set of named choices. Basecoat supplies local filtering and keyboard movement for a command menu; your application supplies the available commands and their effects. The example searches only its three visible destinations.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Command · Basecoat { #basecoat-command }

Type a destination to filter the three links. Arrow keys move through matches; Enter follows the active link. The shared Basecoat runtime supplies filtering and focus; the anchors supply navigation.

<!-- specimen:basecoat-command html -->
<div class="fltheme-components">
<div class="command"><header><input aria-label="Find a guide page" placeholder="Type images, text or cards" type="text"></header><div aria-label="Guide pages" role="menu"><a href="../../text/type/" id="basecoat-command-command-text" role="menuitem">Type and emphasis</a><a href="../../images/pictures/" id="basecoat-command-command-images" role="menuitem">Images and captions</a><a href="../../structure/cards/" id="basecoat-command-command-cards" role="menuitem">Cards and groups</a></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/command/)
