---
this_file: src_docs/md/navigation/location.md
---

# Breadcrumbs and pagination

Breadcrumbs show the route through a hierarchy. Pagination moves through a sequence. Use ordinary links for both, with a visible current item and destinations that still work when JavaScript is unavailable.

The same holds for the global menu and footer. A menu rendered by a script or
inside a component's shadow tree may be invisible to crawlers and to readers
whose script fails, so keep plain HTML links to the product, price and help
pages in the page itself. Forms follow the same care: submit by POST, keep
email addresses out of URLs, and put any consent text beside the button it
applies to.

A 404 page is a location page too: it links search, the product pages and
help, so a reader who followed an old link still has a route.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Breadcrumb · Basecoat { #basecoat-breadcrumb }

Show where the current page sits in a hierarchy.

**Behaviour and access.** Use a labelled nav and ordered list. Every ancestor is a real link; the current page uses aria-current="page" and is not a redundant self-link.

<!-- specimen:basecoat-breadcrumb html -->
<div class="fltheme-components">
<nav aria-label="Example hierarchy" class="breadcrumb"><ol><li><a href="../../start/">Field guide</a></li><li aria-current="page">Navigation</li></ol></nav>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/breadcrumb/)

## Breadcrumbs · daisyUI { #daisyui-breadcrumbs }

Breadcrumbs show the route back through a hierarchy. Keep the current page last
and mark it with `aria-current="page"`; do not turn a short breadcrumb into a
second menu. The component scrolls within its own box when a path is longer than
the available measure.

<!-- specimen:daisyui-breadcrumbs html -->
<div class="fltheme-components">
<nav aria-label="Example hierarchy" class="du-breadcrumbs"><ul><li><a href="../../start/">Field guide</a></li><li aria-current="page">Navigation</li></ul></nav>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/breadcrumbs/)

## Pagination · Basecoat { #basecoat-pagination }

The neighbouring links move through real guide pages; the pill marks the current page. In a results application, your data source supplies the actual page URLs and current state.

<!-- specimen:basecoat-pagination html -->
<div class="fltheme-components">
<nav aria-label="Guide pagination" class="pagination"><div class="button-group"><a class="btn" href="../menus/">1 &middot; Menus</a><span class="btn" aria-current="page">2 &middot; Location</span><a class="btn" href="../drawers/">3 &middot; Drawers</a></div></nav>
</div>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/pagination/)

## Pagination · daisyUI { #daisyui-pagination }

The three links move through real guide pages in sequence. In a results application, your data source supplies the actual page URLs and current state.

<!-- specimen:daisyui-pagination html -->
<div class="fltheme-components">
<nav aria-label="Read in order" class="du-join"><a class="du-btn du-join-item" href="../../text/type/">1 &middot; Type</a><a class="du-btn du-join-item" href="../../text/lists/">2 &middot; Lists</a><a class="du-btn du-join-item" href="../../text/links/">3 &middot; Links</a></nav>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/pagination/)
