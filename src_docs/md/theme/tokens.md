---
this_file: src_docs/md/theme/tokens.md
---

# Tokens

Every fly-january rule reads `--fly-*` custom properties. The swatches and specimens on
this page are drawn from those variables as the browser resolves them, so they show the
values this release ships. [DESIGN-TOKENS.md](https://github.com/Fontlab/fontlab-www-docstheme/blob/main/DESIGN-TOKENS.md)
records where each value came from; `fly-tokens.css` on the [assets page](assets.md)
carries the same tokens for pages outside MkDocs.

## Palette

Twelve hues, each with a lead colour and a soft (lighter), deep (darker) and tint
(surface wash) variant, nine greys and the paper surfaces. Light values apply to the
default scheme, dark values to the slate scheme. Both panels keep their scheme whichever the palette toggle
selects for the rest of the page. The columns are `--fly-<hue>`,
`--fly-<hue>-soft`, `--fly-<hue>-deep` and `--fly-<hue>-tint`; hover a swatch for its name.

### Light

<div class="fly-demo-palette" data-md-color-scheme="default" markdown="0">
<table class="fly-demo-swatches">
<thead><tr><th scope="col">Hue</th><th scope="col">lead</th><th scope="col">soft</th><th scope="col">deep</th><th scope="col">tint</th></tr></thead>
<tbody>
<tr><th scope="row">cherry</th><td><span class="fly-demo-chip" style="background: var(--fly-cherry)" title="--fly-cherry"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cherry-soft)" title="--fly-cherry-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cherry-deep)" title="--fly-cherry-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cherry-tint)" title="--fly-cherry-tint"></span></td></tr>
<tr><th scope="row">tangerine</th><td><span class="fly-demo-chip" style="background: var(--fly-tangerine)" title="--fly-tangerine"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-tangerine-soft)" title="--fly-tangerine-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-tangerine-deep)" title="--fly-tangerine-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-tangerine-tint)" title="--fly-tangerine-tint"></span></td></tr>
<tr><th scope="row">amber</th><td><span class="fly-demo-chip" style="background: var(--fly-amber)" title="--fly-amber"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-amber-soft)" title="--fly-amber-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-amber-deep)" title="--fly-amber-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-amber-tint)" title="--fly-amber-tint"></span></td></tr>
<tr><th scope="row">lime</th><td><span class="fly-demo-chip" style="background: var(--fly-lime)" title="--fly-lime"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-lime-soft)" title="--fly-lime-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-lime-deep)" title="--fly-lime-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-lime-tint)" title="--fly-lime-tint"></span></td></tr>
<tr><th scope="row">emerald</th><td><span class="fly-demo-chip" style="background: var(--fly-emerald)" title="--fly-emerald"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-emerald-soft)" title="--fly-emerald-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-emerald-deep)" title="--fly-emerald-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-emerald-tint)" title="--fly-emerald-tint"></span></td></tr>
<tr><th scope="row">teal</th><td><span class="fly-demo-chip" style="background: var(--fly-teal)" title="--fly-teal"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-teal-soft)" title="--fly-teal-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-teal-deep)" title="--fly-teal-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-teal-tint)" title="--fly-teal-tint"></span></td></tr>
<tr><th scope="row">sky</th><td><span class="fly-demo-chip" style="background: var(--fly-sky)" title="--fly-sky"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-sky-soft)" title="--fly-sky-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-sky-deep)" title="--fly-sky-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-sky-tint)" title="--fly-sky-tint"></span></td></tr>
<tr><th scope="row">cobalt</th><td><span class="fly-demo-chip" style="background: var(--fly-cobalt)" title="--fly-cobalt"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cobalt-soft)" title="--fly-cobalt-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cobalt-deep)" title="--fly-cobalt-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cobalt-tint)" title="--fly-cobalt-tint"></span></td></tr>
<tr><th scope="row">indigo</th><td><span class="fly-demo-chip" style="background: var(--fly-indigo)" title="--fly-indigo"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-indigo-soft)" title="--fly-indigo-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-indigo-deep)" title="--fly-indigo-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-indigo-tint)" title="--fly-indigo-tint"></span></td></tr>
<tr><th scope="row">violet</th><td><span class="fly-demo-chip" style="background: var(--fly-violet)" title="--fly-violet"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-violet-soft)" title="--fly-violet-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-violet-deep)" title="--fly-violet-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-violet-tint)" title="--fly-violet-tint"></span></td></tr>
<tr><th scope="row">magenta</th><td><span class="fly-demo-chip" style="background: var(--fly-magenta)" title="--fly-magenta"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-magenta-soft)" title="--fly-magenta-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-magenta-deep)" title="--fly-magenta-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-magenta-tint)" title="--fly-magenta-tint"></span></td></tr>
<tr><th scope="row">rose</th><td><span class="fly-demo-chip" style="background: var(--fly-rose)" title="--fly-rose"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-rose-soft)" title="--fly-rose-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-rose-deep)" title="--fly-rose-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-rose-tint)" title="--fly-rose-tint"></span></td></tr>
</tbody>
</table>
<div class="fly-demo-greys"><span class="fly-demo-grey" style="background: var(--fly-gray-1)"><code>gray-1</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-2)"><code>gray-2</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-3)"><code>gray-3</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-4)"><code>gray-4</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-5)"><code>gray-5</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-6)"><code>gray-6</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-7)"><code>gray-7</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-8)"><code>gray-8</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-9)"><code>gray-9</code></span></div>
<div class="fly-demo-papers"><span class="fly-demo-grey" style="background: var(--fly-paper-1)"><code>paper-1</code></span><span class="fly-demo-grey" style="background: var(--fly-paper-2)"><code>paper-2</code></span><span class="fly-demo-grey" style="background: var(--fly-paper-3)"><code>paper-3</code></span><span class="fly-demo-grey" style="background: var(--fly-ink)"><code>ink</code></span><span class="fly-demo-grey" style="background: var(--fly-quiet)"><code>quiet</code></span><span class="fly-demo-grey" style="background: var(--fly-edge)"><code>edge</code></span><span class="fly-demo-grey" style="background: var(--fly-bar)"><code>bar</code></span></div>
</div>

### Dark

<div class="fly-demo-palette" data-md-color-scheme="slate" markdown="0">
<table class="fly-demo-swatches">
<thead><tr><th scope="col">Hue</th><th scope="col">lead</th><th scope="col">soft</th><th scope="col">deep</th><th scope="col">tint</th></tr></thead>
<tbody>
<tr><th scope="row">cherry</th><td><span class="fly-demo-chip" style="background: var(--fly-cherry)" title="--fly-cherry"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cherry-soft)" title="--fly-cherry-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cherry-deep)" title="--fly-cherry-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cherry-tint)" title="--fly-cherry-tint"></span></td></tr>
<tr><th scope="row">tangerine</th><td><span class="fly-demo-chip" style="background: var(--fly-tangerine)" title="--fly-tangerine"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-tangerine-soft)" title="--fly-tangerine-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-tangerine-deep)" title="--fly-tangerine-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-tangerine-tint)" title="--fly-tangerine-tint"></span></td></tr>
<tr><th scope="row">amber</th><td><span class="fly-demo-chip" style="background: var(--fly-amber)" title="--fly-amber"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-amber-soft)" title="--fly-amber-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-amber-deep)" title="--fly-amber-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-amber-tint)" title="--fly-amber-tint"></span></td></tr>
<tr><th scope="row">lime</th><td><span class="fly-demo-chip" style="background: var(--fly-lime)" title="--fly-lime"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-lime-soft)" title="--fly-lime-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-lime-deep)" title="--fly-lime-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-lime-tint)" title="--fly-lime-tint"></span></td></tr>
<tr><th scope="row">emerald</th><td><span class="fly-demo-chip" style="background: var(--fly-emerald)" title="--fly-emerald"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-emerald-soft)" title="--fly-emerald-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-emerald-deep)" title="--fly-emerald-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-emerald-tint)" title="--fly-emerald-tint"></span></td></tr>
<tr><th scope="row">teal</th><td><span class="fly-demo-chip" style="background: var(--fly-teal)" title="--fly-teal"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-teal-soft)" title="--fly-teal-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-teal-deep)" title="--fly-teal-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-teal-tint)" title="--fly-teal-tint"></span></td></tr>
<tr><th scope="row">sky</th><td><span class="fly-demo-chip" style="background: var(--fly-sky)" title="--fly-sky"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-sky-soft)" title="--fly-sky-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-sky-deep)" title="--fly-sky-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-sky-tint)" title="--fly-sky-tint"></span></td></tr>
<tr><th scope="row">cobalt</th><td><span class="fly-demo-chip" style="background: var(--fly-cobalt)" title="--fly-cobalt"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cobalt-soft)" title="--fly-cobalt-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cobalt-deep)" title="--fly-cobalt-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-cobalt-tint)" title="--fly-cobalt-tint"></span></td></tr>
<tr><th scope="row">indigo</th><td><span class="fly-demo-chip" style="background: var(--fly-indigo)" title="--fly-indigo"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-indigo-soft)" title="--fly-indigo-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-indigo-deep)" title="--fly-indigo-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-indigo-tint)" title="--fly-indigo-tint"></span></td></tr>
<tr><th scope="row">violet</th><td><span class="fly-demo-chip" style="background: var(--fly-violet)" title="--fly-violet"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-violet-soft)" title="--fly-violet-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-violet-deep)" title="--fly-violet-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-violet-tint)" title="--fly-violet-tint"></span></td></tr>
<tr><th scope="row">magenta</th><td><span class="fly-demo-chip" style="background: var(--fly-magenta)" title="--fly-magenta"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-magenta-soft)" title="--fly-magenta-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-magenta-deep)" title="--fly-magenta-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-magenta-tint)" title="--fly-magenta-tint"></span></td></tr>
<tr><th scope="row">rose</th><td><span class="fly-demo-chip" style="background: var(--fly-rose)" title="--fly-rose"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-rose-soft)" title="--fly-rose-soft"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-rose-deep)" title="--fly-rose-deep"></span></td><td><span class="fly-demo-chip" style="background: var(--fly-rose-tint)" title="--fly-rose-tint"></span></td></tr>
</tbody>
</table>
<div class="fly-demo-greys"><span class="fly-demo-grey" style="background: var(--fly-gray-1)"><code>gray-1</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-2)"><code>gray-2</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-3)"><code>gray-3</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-4)"><code>gray-4</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-5)"><code>gray-5</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-6)"><code>gray-6</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-7)"><code>gray-7</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-8)"><code>gray-8</code></span><span class="fly-demo-grey" style="background: var(--fly-gray-9)"><code>gray-9</code></span></div>
<div class="fly-demo-papers"><span class="fly-demo-grey" style="background: var(--fly-paper-1)"><code>paper-1</code></span><span class="fly-demo-grey" style="background: var(--fly-paper-2)"><code>paper-2</code></span><span class="fly-demo-grey" style="background: var(--fly-paper-3)"><code>paper-3</code></span><span class="fly-demo-grey" style="background: var(--fly-ink)"><code>ink</code></span><span class="fly-demo-grey" style="background: var(--fly-quiet)"><code>quiet</code></span><span class="fly-demo-grey" style="background: var(--fly-edge)"><code>edge</code></span><span class="fly-demo-grey" style="background: var(--fly-bar)"><code>bar</code></span></div>
</div>

A site picks its accent with `extra.fly.hue`, a page with `fly: {hue: …}`; links,
primary buttons and the active navigation follow it. `gray` is a thirteenth, neutral
accent for index pages.

## Type roles

Twelve block roles, each with nine variables: `--fly-<role>-family`, `-weight`,
`-stretch`, `-features`, `-variation`, `-size`, `-leading`, `-tracking` and
`-scale`. This site sets the families of `h1`, `h2`, `body`, `lead`, `nav` and
`caption` in `extra.fly.fonts.roles` (see [configuration](configuration.md)); the
other roles keep the theme defaults or follow the role they reference.

<div class="fly-demo-roles" markdown="0">
<div class="fly-demo-role"><code>h1</code><p style="font-family: var(--fly-h1-family); font-weight: var(--fly-h1-weight); font-stretch: var(--fly-h1-stretch); font-feature-settings: var(--fly-h1-features); font-variation-settings: var(--fly-h1-variation); font-size: var(--fly-h1-size); line-height: var(--fly-h1-leading); letter-spacing: var(--fly-h1-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>h2</code><p style="font-family: var(--fly-h2-family); font-weight: var(--fly-h2-weight); font-stretch: var(--fly-h2-stretch); font-feature-settings: var(--fly-h2-features); font-variation-settings: var(--fly-h2-variation); font-size: var(--fly-h2-size); line-height: var(--fly-h2-leading); letter-spacing: var(--fly-h2-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>h3</code><p style="font-family: var(--fly-h3-family); font-weight: var(--fly-h3-weight); font-stretch: var(--fly-h3-stretch); font-feature-settings: var(--fly-h3-features); font-variation-settings: var(--fly-h3-variation); font-size: var(--fly-h3-size); line-height: var(--fly-h3-leading); letter-spacing: var(--fly-h3-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>h4</code><p style="font-family: var(--fly-h4-family); font-weight: var(--fly-h4-weight); font-stretch: var(--fly-h4-stretch); font-feature-settings: var(--fly-h4-features); font-variation-settings: var(--fly-h4-variation); font-size: var(--fly-h4-size); line-height: var(--fly-h4-leading); letter-spacing: var(--fly-h4-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>h5</code><p style="font-family: var(--fly-h5-family); font-weight: var(--fly-h5-weight); font-stretch: var(--fly-h5-stretch); font-feature-settings: var(--fly-h5-features); font-variation-settings: var(--fly-h5-variation); font-size: var(--fly-h5-size); line-height: var(--fly-h5-leading); letter-spacing: var(--fly-h5-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>h6</code><p style="font-family: var(--fly-h6-family); font-weight: var(--fly-h6-weight); font-stretch: var(--fly-h6-stretch); font-feature-settings: var(--fly-h6-features); font-variation-settings: var(--fly-h6-variation); font-size: var(--fly-h6-size); line-height: var(--fly-h6-leading); letter-spacing: var(--fly-h6-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>body</code><p style="font-family: var(--fly-body-family); font-weight: var(--fly-body-weight); font-stretch: var(--fly-body-stretch); font-feature-settings: var(--fly-body-features); font-variation-settings: var(--fly-body-variation); font-size: var(--fly-body-size); line-height: var(--fly-body-leading); letter-spacing: var(--fly-body-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>lead</code><p style="font-family: var(--fly-lead-family); font-weight: var(--fly-lead-weight); font-stretch: var(--fly-lead-stretch); font-feature-settings: var(--fly-lead-features); font-variation-settings: var(--fly-lead-variation); font-size: var(--fly-lead-size); line-height: var(--fly-lead-leading); letter-spacing: var(--fly-lead-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>nav</code><p style="font-family: var(--fly-nav-family); font-weight: var(--fly-nav-weight); font-stretch: var(--fly-nav-stretch); font-feature-settings: var(--fly-nav-features); font-variation-settings: var(--fly-nav-variation); font-size: var(--fly-nav-size); line-height: var(--fly-nav-leading); letter-spacing: var(--fly-nav-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>table</code><p style="font-family: var(--fly-table-family); font-weight: var(--fly-table-weight); font-stretch: var(--fly-table-stretch); font-feature-settings: var(--fly-table-features); font-variation-settings: var(--fly-table-variation); font-size: var(--fly-table-size); line-height: var(--fly-table-leading); letter-spacing: var(--fly-table-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>caption</code><p style="font-family: var(--fly-caption-family); font-weight: var(--fly-caption-weight); font-stretch: var(--fly-caption-stretch); font-feature-settings: var(--fly-caption-features); font-variation-settings: var(--fly-caption-variation); font-size: var(--fly-caption-size); line-height: var(--fly-caption-leading); letter-spacing: var(--fly-caption-tracking)">Hamburgefonstiv 0123</p></div>
<div class="fly-demo-role"><code>code</code><p style="font-family: var(--fly-code-family); font-weight: var(--fly-code-weight); font-stretch: var(--fly-code-stretch); font-feature-settings: var(--fly-code-features); font-variation-settings: var(--fly-code-variation); font-size: var(--fly-code-size); line-height: var(--fly-code-leading); letter-spacing: var(--fly-code-tracking)">Hamburgefonstiv 0123</p></div>
</div>

The inline roles `em`, `strong` and `mono` have `-family`, `-weight` and `-adjust`
(an x-height multiplier for mixed families): *emphasis*, **strong** and `mono`.

## Grid and sizes

`1rem` is half a body line, and every vertical length in flowing text is a whole
number of rems. Continuous text uses exactly three sizes.

| Token | Value | At the 14.4px root | Use |
|---|---|---|---|
| `--fly-half` | `1rem` | 14.4px | half a line; the vertical step |
| `--fly-line` | `2rem` | 28.8px | the body line |
| `--fly-size-xs` | `0.9722rem` | 14px | captions, table heads, navigation, footers |
| `--fly-size-sm` | `1.25rem` | 18px | body text, tables |
| `--fly-size-md` | `1.625rem` | 23.4px | lead paragraphs, blockquotes |

<div class="fly-demo-sizes" markdown="0">
<p style="font-size: var(--fly-size-xs)"><code>xs</code> Captions and navigation sit at the small size.</p>
<p style="font-size: var(--fly-size-sm)"><code>sm</code> Body text and tables use the middle size.</p>
<p style="font-size: var(--fly-size-md)"><code>md</code> Lead paragraphs use the large size.</p>
</div>

The root is 90% of the browser's font size (14.4px by default), 99% from 100em and 108%
from 125em, so wide screens scale the whole grid while 1rem stays half a line.
