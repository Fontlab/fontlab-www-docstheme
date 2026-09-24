---
this_file: fixtures/materialx/docs/index.md
---

# One menu, two choices

On a small screen, the global bar has one search icon and one hamburger.
Choose which navigation and search they open independently.

<p><label for="menu-owner">Hamburger opens</label>
<select id="menu-owner"><option value="materialx">This MaterialX site</option><option value="global">FontLab global menu</option></select></p>
<p><label for="search-owner">Search opens</label>
<select id="search-owner"><option value="materialx">This MaterialX site</option><option value="global">FontLab global search</option></select></p>

The default is the local MaterialX site. Both controls sit inside the global
menu. Scroll down: the branding leaves the screen and the compact local controls
stay at the top right. Open the hamburger to find this site's navigation and
the theme switcher at its bottom. Search for **specimen** to find the second page.

## Choose the global menu

Product sites with a few documentation pages can use their global navigation
and search. Set both options to **FontLab global** above. The two icons still
occupy the same positions; their contents change.

## Independent choices

Try local navigation with global search, then global navigation with local
search. Each icon opens exactly one interface. Escape closes the open panel.
The MaterialX navigation appears on the right.

## Desktop

Widen the window to restore MaterialX's standard header, sidebar, palette and
search placement. The mobile configuration does not replace desktop controls.

## Installation

Load the global menu script, shared `theme.css` and shared `theme.js`. Keep
MaterialX's standard drawer, search and palette markup. This example extends
the vanilla MaterialX template only to insert the global menu and footer.

## Configuration

```html
<fontlab-menu mobile-menu="materialx" mobile-search="materialx"></fontlab-menu>
```

Use `global` for either attribute to select the global interface. The Vexy menu
accepts the same attributes. JavaScript configuration uses `mobileMenu` and
`mobileSearch`; explicit HTML attributes take precedence.

## More examples

Visit the [component specimen](https://i.fontlab.com/fltheme26/) or the [authoring guide](https://i.fontlab.com/fltheme26/authoring.html)
for Basecoat and prefixed daisyUI examples. This page tests the navigation
integration separately from component styling.
