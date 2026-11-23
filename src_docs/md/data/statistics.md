---
this_file: src_docs/md/data/statistics.md
mermaid: true
math: true
chart: true
---

# Statistics and charts

Start with the question the figure answers. A statistic gives a snapshot; a chart shows a relationship; a diagram explains a process. Keep the underlying values or conclusion in text. All numerical data on this page is illustrative.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Stat · daisyUI { #daisyui-stat }

The figures describe a fictional font family. Keep the unit and explanation beside each number and link to the underlying data when it exists.

<!-- specimen:daisyui-stat html -->
<div class="fltheme-components">
<div class="du-stats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr))"><div class="du-stat"><div class="du-stat-title">Sample styles</div><div class="du-stat-value">4</div><div class="du-stat-desc">Regular through bold</div></div><div class="du-stat"><div class="du-stat-title">Sample masters</div><div class="du-stat-value">2</div><div class="du-stat-desc">Upright design</div></div></div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/stat/)

## Chart · Basecoat { #basecoat-chart }

This chart needs Chart.js 4.5.1 and Basecoat’s separate chart module, in addition to the shared runtime. The page loads the pinned files and initializes the named canvas with the values in the table. The compiled HTML includes the initialization script; a canvas alone does not draw a chart.

<!-- specimen:basecoat-chart html -->
<div class="fltheme-components">
<div class="chart" style="height:16rem"><canvas aria-label="Illustrative glyph counts: Latin 240, Greek 80, Cyrillic 120" id="basecoat-chart-sample-coverage-chart"></canvas></div><table class="table"><caption>Illustrative glyph counts</caption><thead><tr><th scope="col">Script</th><th scope="col">Glyphs</th></tr></thead><tbody><tr><th scope="row">Latin</th><td>240</td></tr><tr><th scope="row">Greek</th><td>80</td></tr><tr><th scope="row">Cyrillic</th><td>120</td></tr></tbody></table>
</div>
<script>
function drawCoverageExample() {
  window.basecoat.chart('#basecoat-chart-sample-coverage-chart', {
    type: 'bar',
    labelKey: 'script',
    data: [
      {script: 'Latin', glyphs: 240},
      {script: 'Greek', glyphs: 80},
      {script: 'Cyrillic', glyphs: 120}
    ],
    series: {glyphs: {label: 'Illustrative glyph count', color: 'var(--chart-1)'}},
    options: {animation: false, scales: {y: {beginAtZero: true}}}
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', drawCoverageExample, {once: true});
} else {
  drawCoverageExample();
}
</script>
<!-- /specimen -->

[Syntax and variants in Basecoat](https://basecoatui.com/components/chart/)

For a destination outside this site, load these files after the shared
`basecoat.js` and before running the copied initialization script:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/basecoat-css@1.0.2/dist/js/chart.min.js"></script>
```

In this guide, `chart: true` in page metadata loads those files in order.
Keep the table as a text alternative to the canvas. The figures describe a
fictional family and do not measure a FontLab or Vexy product.

## Diagrams · MaterialX { #materialx-diagrams }

Mermaid renders this process after page load. Keep `mermaid: true` in page metadata and the site’s pinned Mermaid loader when you copy the HTML. The compiled snippet contains diagram source; the runtime creates the SVG. The process is also stated in the node labels.

<!-- specimen:materialx-diagrams -->
``` mermaid
flowchart LR
  A[Source files] --> B[Conversion]
  B --> C[Inspect names and outlines]
  C --> D[Compare spacing and kerning]
```
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/diagrams.md)

## Math · MaterialX { #materialx-math }

The page-scoped MathJax loader renders the compiled TeX after page load. Keep `math: true` in page metadata or supply the same runtime on the destination. The formula below describes linear interpolation, not a claim about every font interpolation model.

<!-- specimen:materialx-math -->
A simple linear interpolation uses two endpoints. At $t=0$ the result is $a$; at $t=1$ it is $b$.

$$
f(t) = (1-t)a + tb
$$
<!-- /specimen -->

[Syntax and variants in MaterialX](https://github.com/jaywhj/mkdocs-materialx/blob/main/docs/reference/math.md)

## Diagrams: authoring details

### Using flowcharts { #materialx-diagrams-using-flowcharts }

**Adapted/live:** use flowcharts for movement or decisions.

<!-- specimen:materialx-diagrams-using-flowcharts-sample -->
``` mermaid
flowchart LR
  Markdown --> Build --> HTML
```
<!-- /specimen -->

### Using sequence diagrams { #materialx-diagrams-using-sequence-diagrams }

**Adapted/live:** use sequence diagrams for messages ordered in time.

<!-- specimen:materialx-diagrams-using-sequence-diagrams-sample -->
``` mermaid
sequenceDiagram
  Author->>Build: Markdown
```
<!-- /specimen -->

### Using state diagrams { #materialx-diagrams-using-state-diagrams }

**Adapted/live:** use state diagrams for finite states and transitions.

<!-- specimen:materialx-diagrams-using-state-diagrams-sample -->
``` mermaid
stateDiagram-v2
  Draft --> Published
```
<!-- /specimen -->

### Using class diagrams { #materialx-diagrams-using-class-diagrams }

**Adapted/live:** use class diagrams for types and relationships.

<!-- specimen:materialx-diagrams-using-class-diagrams-sample -->
``` mermaid
classDiagram
  class Page
```
<!-- /specimen -->

### Using entity-relationship diagrams { #materialx-diagrams-using-entity-relationship-diagrams }

**Adapted/live:** use ER diagrams for stored entities and cardinality.

<!-- specimen:materialx-diagrams-using-entity-relationship-diagrams-sample -->
``` mermaid
erDiagram
  PAGE ||--o{ SECTION : contains
```
<!-- /specimen -->

### Other diagram types { #materialx-diagrams-other-diagram-types }

**Reference-only:** additional Mermaid layouts are not among the five pinned,
verified specimens and some are poor on small screens. Consult the tracked
upstream source before proposing one; do not add a live specimen here.


## Math: authoring details

### MathJax { #materialx-math-mathjax }

**Adapted/live:** the pinned MathJax integration renders the supported inline
and block syntax; see the [MathJax specimen](../renderer-capabilities.md#renderer-mathjax).

### KaTeX { #materialx-math-katex }

**Reference-only:** KaTeX needs a separate runtime and is not part of the
locked renderer stack. It remains an upstream alternative; do not add KaTeX
assets or a live specimen here.

### Using block syntax { #materialx-math-using-block-syntax }

**Adapted/live:** put display math between `$$` delimiters on separate lines;
see the verified [block specimen](../renderer-capabilities.md#renderer-mathjax-block).

### Using inline block syntax { #materialx-math-using-inline-block-syntax }

**Adapted/live:** use `\(...\)` for an expression within a sentence; see the
verified [inline specimen](../renderer-capabilities.md#renderer-mathjax-inline).
