---
this_file: src_docs/md/data/tables.md
---

# Tables and lists

Use a table when readers compare the same properties across records. Use a list when each record has a small independent story. Names and counts in the examples are sample data, not a live catalogue.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Data tables · MaterialX { #materialx-data-tables }

MaterialX renders this pattern from Markdown. The source panel contains the actual authoring syntax, including attribute lists where they apply. Keep the renderer extensions enabled on the destination.

<!-- specimen:materialx-data-tables -->
| Sample style | Weight | Form |
| :--- | ---: | :---: |
| Regular | 400 | Upright |
| Italic | 400 | Italic |
| Bold | 700 | Upright |
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/data-tables.md)

## List · daisyUI { #daisyui-list }

Use a list when records share the same compact shape but do not need column
alignment. Native lists remain the semantic container.

<!-- specimen:daisyui-list html -->
<div class="fltheme-components">
<ul class="du-list"><li class="du-list-row"><div><strong>Regular</strong><p>Sample style, weight 400</p></div></li><li class="du-list-row"><div><strong>Bold</strong><p>Sample style, weight 700</p></div></li></ul>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/list/)

## Table · Basecoat { #basecoat-table }

Compare records with meaningful row and column relationships.

**Behaviour and access.** Use caption, thead, th and scope to describe the data. Wrap wide tables in a scrolling container instead of clipping them. Sorting and filtering require application logic.

<!-- specimen:basecoat-table html -->
<div class="fltheme-components">
<div class="table-container"><table class="table"><caption>Font styles</caption><thead><tr><th scope="col">Style</th><th scope="col">Weight</th></tr></thead><tbody><tr><td>Regular</td><td>400</td></tr></tbody></table></div>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/table/)

## Table · daisyUI { #daisyui-table }

Use daisyUI table classes when the author needs component states such as zebra
rows or pinned headers and columns.

<!-- specimen:daisyui-table html -->
<div class="fltheme-components">
<div aria-label="Theme token comparison" class="fl-ui overflow-x-auto" role="region" tabindex="0">
<table class="du-table du-table-zebra du-table-pin-rows du-table-pin-cols">
<caption>Theme token comparison; scroll horizontally on a narrow screen.</caption>
<thead><tr><th scope="col">Token</th><th scope="col">Role</th><th scope="col">Required</th><th scope="col">Owner</th></tr></thead>
<tbody>
<tr><th scope="row"><code>--color-base-100</code></th><td>Page surface</td><td>Yes</td><td>daisyUI</td></tr>
<tr><th scope="row"><code>--color-base-content</code></th><td>Body text</td><td>Yes</td><td>daisyUI</td></tr>
<tr><th scope="row"><code>--color-primary</code></th><td>Primary action</td><td>Yes</td><td>daisyUI</td></tr>
<tr><th scope="row"><code>--fl-measure</code></th><td>Prose width</td><td>Yes</td><td>FontLab</td></tr>
</tbody>
</table>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/table/)

## Data tables: authoring details

### Column alignment { #materialx-data-tables-column-alignment }

Alignment follows the data: names read from the left, quantities align right,
and compact categories may be centred.

<!-- specimen:materialx-data-tables-column-alignment-sample -->
| Document | Pages | Status |
| :--- | ---: | :---: |
| Craft of Writing | 18 | Ready |
| Product Documentation | 14 | Review |
| Marketing Copywriting | 12 | Draft |
<!-- /specimen -->

### Sortable tables { #materialx-data-tables-sortable-tables }

Sortable tables require an unpinned third-party runtime, so this site does not
turn headers into sorting controls. If sorting becomes necessary, pin and test
the runtime first, then add keyboard-operable buttons with announced direction
and preserve the original source order.

### Import table from file { #materialx-data-tables-import-table-from-file }

Importing a table requires an additional data-loading plugin outside the locked
renderer stack. Keep data in authored Markdown for now; do not imply that a CSV
or spreadsheet import will run during this build.
