---
this_file: DESIGN-TOKENS.md
---

# fly-january design tokens

The `--fly-*` custom properties that every fly-january rule reads. SPEC.md §4 is the
contract; this file records the values, where they came from and why. The sources are
`src/fly/tokens/`, one file per concern, every rule inside `@layer fly.tokens`:

| File | Holds |
|---|---|
| `grid.css` | the root size and the line unit |
| `size.css` | the three text sizes |
| `type.css` | the typographic roles, heading sizes included |
| `color.css` | twelve hues, greys and surfaces, light and dark |
| `semantic.css` | accent, primary, link, status and admonition colours |
| `materialx.css` | MaterialX `--md-*` colour and font variables, set from the above |
| `components.css` | shared control metrics, surface borders and focus |

`tests/fly-tokens.test.mjs` (run by `npm test`) checks every token named in this file
exists, every colour token in the CSS is named here, every role has all its properties,
the heading table below matches the CSS, and the contrast and hue-spacing limits hold.

## Contracts other parts rely on

- **Overrides go on `:root`.** Role and size variables are resolved on `:root`. A site or
  page override (the fly plugin's `<style>`) must set them on `:root`; set lower in the
  tree, a `-scale` does not reach the `-size` already computed from it.
- **`data-fly-hue` sits on `<body>`**, the element where MaterialX puts
  `data-md-color-scheme`, or on an element inside it. Semantic colours are re-declared on
  every element carrying either attribute so they resolve against that element's light or
  dark hues. Accepted values: `cherry`, `tangerine`, `amber`, `lime`, `emerald`, `teal`, `sky`, `cobalt`, `indigo`, `violet`, `magenta`, `rose` and `gray` (neutral pages: the index and the
  bug-fix chapter of a what's-new book).
- **Cascade layers.** MaterialX ships unlayered CSS, which beats any layer. The
  `fly.tokens` rules that compete with it (`html` font size, the `--md-*` bridge) take
  effect once the build flattens layers into selector weight (`scripts/cascade.mjs`, as
  for the fltheme26 bundle) or loads MaterialX into a lower layer.
- **Root size per test width.** 14.4px at 390, 1024 and 1440px viewports; 15.84px at
  1920px (the 100em step); 17.28px from 2000px.

## Grid

| Token | Value | Meaning |
|---|---|---|
| `--fly-half` | `1rem` | half a body line; the step for every vertical length in flowing text |
| `--fly-line` | `2rem` | the body line, 28.8px at the default root |

`html` is `90%`, `99%` from `100em` and `108%` from `125em`: MaterialX's 125%, 137.5% and
150% times 0.72, so 1rem stays half of an 18px body's 1.6 line and wide screens scale as
before. Percentages keep the reader's own font-size setting. MaterialX's own rem values
are rescaled by the plugin (SPEC §4.1).

Inline code in running text is an atomic inline box (components/inline.css) with a tight
line-height of its own, so a short token moves to the next line whole and a one-line token
keeps the paragraph on the grid. Known limit: a token wider than the whole line wraps
inside its box at that tight pitch, so that one paragraph leaves the grid. The box never
overflows the text column (verify-fly `code.long-token-contained`); break such a token
in the source or put it in a code block.

## Sizes

Continuous text and navigation use exactly three sizes:

| Token | Value | px at 14.4px root | Use |
|---|---|---|---|
| `--fly-size-xs` | `0.9722rem` | 14 | captions, `th`, navigation, footers |
| `--fly-size-sm` | `1.25rem` | 18 | body text |
| `--fly-size-md` | `1.625rem` | 23.4 | lead paragraphs, blockquotes |

Headings are fluid: `--fly-h<n>-size` is `calc(clamp(floor, base + slope, ceiling) *
var(--fly-h<n>-scale))`, a rem floor, a rem-plus-vw slope and a rem ceiling. The technique
is the `clamp(floor, base + vw, ceil)` of the fontlab-9-zvx release-notes page
(`Marketing/src/fontlab-9-zvx/fl9-relinfo-1/release-notes/fontlab-page/style.css`), with the
per-role unitless multiplier of the gav0zux newspaper tool
(`Marketing/src/gav0zux/site/newspaper/state.mjs`: one size per role, stepped scales set
through custom properties; `site/shared/spacing.mjs` writes lengths as `em ± rem`, which
the heading leadings below follow by rounding an em leading to rem steps).

The release-notes prototype describes its phone H1 as 1.5 times H2 and its H5 card
titles as the same size as H2. Fly uses the prototype’s fluid card-title clamp for
both H2 and H5. H1 grows continuously between the prototype’s phone and desktop sizes.
H3 sits 0.125rem above H4 throughout the range. H5 keeps its separate card-title role.

Computed sizes in CSS px (scale 1); the browser test asserts them within 0.5px:

| Heading | 390px | 1024px | 1440px | 1920px | `clamp()` |
|---|---|---|---|---|---|
| h1 | 37.8 | 61.4 | 86.4 | 95.0 | `2.625rem, 6vw, 6rem` |
| h2 | 25.2 | 28.2 | 31.5 | 34.6 | `1.75rem, 1.25rem + 1vw, 2.1875rem` |
| h3 | 18.9 | 19.8 | 19.8 | 21.8 | `1.3125rem, 1.125rem + 0.5vw, 1.375rem` |
| h4 | 17.1 | 18.0 | 18.0 | 19.8 | `1.1875rem, 1rem + 0.5vw, 1.25rem` |
| h5 | 25.2 | 28.2 | 31.5 | 34.6 | `1.75rem, 1.25rem + 1vw, 2.1875rem` |
| h6 | 17.1 | 18.0 | 18.0 | 19.8 | `1.1875rem, 1rem + 0.5vw, 1.25rem` |

## Typographic roles

Roles: `h1 h2 h3 h4 h5 h6 body lead nav table caption code`. Each has nine variables,
`--fly-<role>-family`, `-weight`, `-stretch`, `-features`, `-variation`, `-size`,
`-leading`, `-tracking` and `-scale` (unitless, default `1`); for example
`--fly-h1-family`, `--fly-h2-scale`, `--fly-body-size`, `--fly-nav-stretch`,
`--fly-table-features`, `--fly-caption-leading`, `--fly-code-tracking`. `th` uses the
control face at caption size and weight 600. Data cells use `table`.

| Role | family | weight | stretch | features | variation | size | leading | tracking |
|---|---|---|---|---|---|---|---|---|
| `h1` | `'polymath-display', Arial, sans-serif` | `900` | `normal` | `normal` | `normal` | `calc(clamp(2.625rem, 6vw, 6rem) * var(--fly-h1-scale))` | `round(up, 0.8em, 1rem)` | `-0.01em` |
| `h2` | `'polymath', Arial, sans-serif` | `500` | `normal` | `normal` | `normal` | `calc(clamp(1.75rem, 1.25rem + 1vw, 2.1875rem) * var(--fly-h2-scale))` | `round(up, 1em, 1rem)` | `0` |
| `h3` | `var(--fly-nav-family)` | `400` | `var(--fly-nav-stretch)` | `normal` | `var(--fly-nav-variation)` | `calc(clamp(1.1875rem, 1rem + 0.5vw, 1.25rem) * var(--fly-h3-scale))` | `round(up, 1.3em, 1rem)` | `0` |
| `h4` | `var(--fly-nav-family)` | `300` | `var(--fly-nav-stretch)` | `normal` | `var(--fly-nav-variation)` | `calc(clamp(1.1875rem, 1rem + 0.5vw, 1.25rem) * var(--fly-h4-scale))` | `round(up, 1.3em, 1rem)` | `0` |
| `h5` | `var(--fly-sans-family)` | `400` | `normal` | `normal` | `normal` | `calc(clamp(1.75rem, 1.25rem + 1vw, 2.1875rem) * var(--fly-h5-scale))` | `round(up, 1.1em, 1rem)` | `0` |
| `h6` | `var(--fly-sans-family)` | `500` | `var(--fly-sans-stretch)` | `normal` | `'slnt' 0` | `calc(clamp(1.1875rem, 1rem + 0.5vw, 1.25rem) * var(--fly-h6-scale))` | `var(--fly-line)` | `0` |
| `body` | `'sole-serif-small-variable', Georgia, serif` | `400` | `normal` | `normal` | `normal` | `calc(var(--fly-size-sm) * var(--fly-body-scale))` | `var(--fly-line)` | `0` |
| `lead` | `var(--fly-h2-family)` | `500` | `normal` | `normal` | `normal` | `calc(var(--fly-size-md) * var(--fly-lead-scale))` | `var(--fly-line)` | `0` |
| `nav` | `'grtsk-vf', Arial, sans-serif` | `400` | `60%` | `normal` | `'wdth' 60, 'slnt' 0` | `calc(var(--fly-size-xs) * var(--fly-nav-scale))` | `1.25` | `0` |
| `table` | `var(--fly-body-family)` | `var(--fly-body-weight)` | `var(--fly-body-stretch)` | `var(--fly-body-features)` | `var(--fly-body-variation)` | `calc(var(--fly-body-size) * 0.9 * var(--fly-table-scale))` | `1.3` | `0` |
| `caption` | `var(--fly-nav-family)` | `500` | `var(--fly-nav-stretch)` | `normal` | `var(--fly-nav-variation)` | `calc(var(--fly-size-xs) * var(--fly-caption-scale))` | `1.35` | `0` |
| `code` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | `400` | `normal` | `normal` | `normal` | `calc(var(--fly-size-xs) * var(--fly-code-scale))` | `1.5` | `0` |

Every `-scale` is `1`. Leadings in flowing text are whole multiples of `1rem`: `body`,
`lead` and `h6` take `var(--fly-line)`; `h1`–`h5` round their design leading
(0.8, 1, 1.3, 1.3 and 1.1 em, the prototype's) up to the next rem with `round()`, and fall
back to those unitless values where `round()` is missing. Tables keep the prototype's
1.3 (the scroll wrapper still rounds the table block to whole lines); `nav`, `caption` and
`code` are xs text; SPEC §4.1 lets tables and small text leave the grid. Below 60em h3
and h4 move into the text column and switch to the sans at its 90% width, h3 at 600 and
h4 at 500 (a media-query override of their role variables in `type.css`).
The default kits supply Polymath Display for H1 and Polymath for H2 and the lead
(`xht3uat`), Sole Serif Small for body text and data cells (`cna4jfp`), and Grtsk for navigation,
H3–H6, table headers, captions and inline sans (`wck5koo`).

Inline roles `em`, `strong` and `mono` have `-family`, `-weight` and `-adjust`, an em
multiplier that evens out x-heights when families are mixed (`--fly-strong-adjust`
`--fly-sans-adjust`, `0.95`: Grtsk runs set inside the serif). As in the prototype, `em`
is set like `strong`: the sans at 550, upright. The multiplier applies once: `a`, `strong`, `em`
and `mark` inside table cells inherit the cell's size,
and a run nested in another run (`a`, `strong`, `em`, `mark`) inherits instead of compounding
the adjust. `mono` is always `--fly-mono-adjust` times the text around it. `--fly-em-style` (`normal`) is the
`em` font-style; the `em` role's `style` property sets it (`italic`). The `sans` role sets the
values of `--fly-sans-family`, `-stretch`, `-variation` and `-adjust`:

| Role | family | weight | adjust |
|---|---|---|---|
| `em` | `var(--fly-sans-family)` | `550` | `0.95` |
| `strong` | `var(--fly-sans-family)` | `550` | `0.95` |
| `mono` | `var(--fly-code-family)` | `400` | `0.95` |

Faces outside the roles, used by the rules in `src/fly/`:

| Token | Value | Use |
|---|---|---|
| `--fly-body-ratio` | `1.6` | `.md-typeset` line-height as a ratio, inherited by smaller nested text (paragraphs get `--fly-body-leading`) |
| `--fly-sans-family` | `'grtsk-vf', Arial, sans-serif` | inline sans runs (links, strong, em, mark), h6 |
| `--fly-sans-stretch` | `90%` | width of the inline sans and of h6 |
| `--fly-sans-variation` | `'slnt' 0` | the root's variation settings; h3/h4 below 60em |
| `--fly-sans-adjust` | `0.95` | inline sans size relative to the text around it |
| `--fly-button-family` | `var(--fly-control-font)` | button family |
| `--fly-button-size` | `var(--fly-control-size)` | default button label size |
| `--fly-button-weight` | `var(--fly-control-weight)` | button label weight |
| `--fly-button-tracking` | `normal` | button letter-spacing |
| `--fly-ui-family` | `system-ui, sans-serif` | search results, drawer close button |
| `--fly-icon-family` | `'Material Symbols Outlined'` | palette toggle, arrows |
| `--fly-nav-current-weight` | `600` | the current page in L1, the page title over L2 |
| `--fly-nav-section-weight` | `500` | the current section in L2 |

## Components

MaterialX and native HTML controls in `.fly-form` share these values with Basecoat
and prefixed daisyUI inside `.md-typeset .fltheme-components`. The default button
and text-entry field height is at least 44px. Button variants
can change height while retaining the shared family and weight.

| Token | Default | Applies to |
|---|---|---|
| `--fly-control-height` | `max(44px, 3rem)` | standard buttons, single-line fields and minimum tab height |
| `--fly-control-radius` | `0.5rem` | standard buttons, text fields, badges and keycaps |
| `--fly-control-font` | `var(--fly-sans-family)` | controls, labels and component titles |
| `--fly-control-size` | 90% of body size | default control text |
| `--fly-control-weight` | `500` | labels and buttons |
| `--fly-selection` | `var(--fly-ink)` | primary actions, selected tabs, choice marks and range fill |
| `--fly-control-border` | 58% ink mixed into paper 3 in sRGB | controls that need a visible boundary |
| `--fly-surface-raised` | `var(--fly-paper-2)` | cards, modal panels and quiet fills |
| `--fly-focus-ring` | `var(--fly-accent-text)` | 2px keyboard outline on buttons and fields |
| `--fly-card-padding` | `var(--fly-half)` | inset for cards and related panels |
| `--fly-card-radius` | `0.75rem` | cards and modal panels |
| `--fly-card-border` | 35% ink mixed into paper 3 in sRGB | surface outlines |
| `--fly-card-title-size` | `var(--fly-size-md)` | card, alert and dialog titles in the control face at weight 600 |
| `--fly-dialog-width` | `28rem` | preferred modal panel width, limited by the available viewport |

Colour aliases resolve on the active scheme or hue. The control border targets
at least 3:1 on the canvas and raised paper, while surface outlines target 1.5:1
on the canvas.

## Layout

`src/fly/tokens/layout.css` holds the sheet geometry the layout layer reads (the
prototype's values):

| Token | Value | Use |
|---|---|---|
| `--fly-rail` | `clamp(13.8889rem, 17vw, 25rem)` | full L1 rail; the L2 width from 100em |
| `--fly-part-rail` | `clamp(12.5rem, 15vw, 19.4444rem)` | L2 rail |
| `--fly-sliver` | `10rem` at 76.25em–100em | exposed part of L1 under an extended L2 |
| `--fly-l1` | `var(--fly-rail)`; sliver, rail or `0.5208rem` per width | the L1 width L2 starts after |
| `--fly-l1-reveal` | `var(--fly-rail)` | exposed L1 width when L2 retracts |
| `--fly-notch` | `var(--fly-size-sm)` | heading permalink notch height |
| `--fly-margin-col` | `clamp(11.1111rem, 20cqi, 20.8333rem)` | the margin column (`--m`) from 66.67rem of canvas; the blog post layout takes half of `--fly-post-bar` off it |
| `--fly-bar-h` | `3.8889rem` | the global bar's height (56px at the default root); sticky rails and anchors clear it |
| `--fly-post-bar` | `16.8rem` | the blog post sidebar's width; half comes off each margin so the post's text column matches other pages |
| `--fly-h1-measure` | `16ch` | H1 maximum width |
| `--fly-h2-measure` | `20ch` | H2 maximum width from 76.25em |

Both measures are also the `measure` property of the `h1` and `h2` roles: a site, preset or page
sets `roles: {h1: {measure: 12ch}}` (a plain length in ch, rem, em, px or %, or `none`) and the fly plugin writes
`--fly-h1-measure` on `:root` like the other role variables.

In the mid-desktop band, L1 labels wrap within the exposed strip. Hover or keyboard
focus still retracts L2. On phones, alternate-style content tab labels scroll within the article column. The in-page
navigation panel slides within a fixed shell clipped horizontally at the viewport edges.
Code blocks with a toolbar reserve an inline-end gutter sized to the controls, so the code
scrolls in its own column.

## Colour

### Sources studied

- **Mood image** named in SPEC §4.4, the vexy.art front page
  ([4k PNG](https://res.cloudinary.com/fontlab/image/upload/c_limit,w_3000/f_auto,q_auto,dpr_auto/vw/6a3e97f80d8bed4238e52e97_vexy.art--front-4k.png)):
  flat, fully saturated bands. Sampled and converted to OKLCH (L C h): yellow
  #ffca06 (0.861 0.175 89), orange #ff6f00 (0.708 0.197 47), magenta #fc0298 (0.648 0.266
  355), violet #a612e4 (0.558 0.273 311), cornflower #4990e2 (0.646 0.143 254), petrol
  #006b7b (0.485 0.085 213), green #009c6d (0.613 0.132 163), bright green #00b951 (0.686
  0.193 149). Chroma near the sRGB limit, no pastel, no greyed "earthy" tones.
- **Tailwind CSS v4 palette** ([tailwindcss.com/docs/colors](https://tailwindcss.com/docs/colors)):
  defined in OKLCH, 11 steps per hue; its 500 steps (e.g. red `oklch(63.7% 0.237 25.331)`)
  show how far chroma can go per hue while staying in sRGB, and how lightness has to vary
  per hue (yellow and lime light, blue and violet dark) for equal visual weight.
- **Radix Colors** ([understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)):
  12 steps, each for a use (step 9 solid backgrounds, 11 low-contrast text, 12
  high-contrast text), with separately tuned dark scales rather than inverted light ones.
  The four fly variants follow that split: lead ≈ solid, deep / soft ≈ text, tint ≈
  background; dark values are designed, not flipped.
- **Material Design 3** ([how the system works](https://m3.material.io/styles/color/system/how-the-system-works)):
  tonal palettes in HCT with tones 0–100, accessible pairs chosen by tone difference; chroma
  drops where a hue cannot reach it at a given tone. Here OKLab lightness plays the role of
  tone, and chroma is capped at a share of each hue's sRGB maximum at that lightness.
- **Apple system colours** ([HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color)):
  each system colour has light and dark (and increased-contrast) variants that shift
  subtly to keep contrast and differentiation in each appearance. Dark leads here are a
  little lighter and less chromatic than light ones, the same move.
- **Open Color** ([yeun.github.io/open-color](https://yeun.github.io/open-color/)): 13 hues ×
  10 steps tuned for UI text, backgrounds and borders, a check on hue naming and order.
- **OKLab / OKLCH** ([Björn Ottosson](https://bottosson.github.io/posts/oklab/)): the space
  used for the values, the gamut test and the ΔE(OK) distance.

### Reasoning

- **Hue angles** (OKLCH h): cherry 25, tangerine 48, amber 78, lime 128, emerald 160, teal
  195, sky 230, cobalt 258, indigo 278, violet 305, magenta 340, rose 5. Equal angles are
  not equal perceptual steps, so the angles bunch where the eye separates hues easily
  (blue–violet) and spread where it does not (yellow–green). Rose sits between magenta and
  cherry at a higher lightness, so the two reds part on lightness as well as hue.
- **Leads** are set at 95% of the chroma sRGB allows at their lightness, capped at 0.27:
  as saturated as the screen permits, like the mood image. Lightness varies per hue (amber
  and lime 0.80, indigo 0.52) so the twelve carry similar weight. That avoids the two
  failure modes: primary-school colours come from equal lightness and full-strength sRGB
  primaries (#ff0000, #00ff00), fashion palettes from desaturated, greyed tones.
- **Deep** (light scheme) is the lightest value at which text on `--fly-paper-3` reaches
  4.75:1 (a margin over 4.5), never above the lead minus 0.08. **Soft** is lighter and a
  little calmer (75% of the possible chroma). **Tint** is L 0.965 with chroma ≤ 0.03: a
  wash for surfaces.
- **Dark scheme**: leads +0.05 lightness, 90% chroma (vivid fills on dark paper glare);
  soft is the text colour, at least L 0.80 and above the lead, reaching 4.75:1 on the dark
  `--fly-paper-3`; deep is the darker fill; tint is L 0.30, a coloured dark wash.
- **Fallbacks**: every OKLCH value lies inside sRGB, so the `@supports not (color: oklch(0%
  0 0))` hex values are the same colours, not approximations (test: ΔE(OK) ≤ 0.005).
- The spacing limit (ΔE(OK) ≥ 0.08) applies to the lead colours of adjacent hues, rose
  wrapping to cherry. The variants are not held to it: tints are meant to be quiet.

### Hues, light scheme

| Hue | Lead | Soft | Deep | Tint |
|---|---|---|---|---|
| cherry | `--fly-cherry`<br>`oklch(60% 0.231 25)` #ea1e2f | `--fly-cherry-soft`<br>`oklch(72% 0.131 25)` #eb827a | `--fly-cherry-deep`<br>`oklch(52% 0.194 25)` #bf1e28 | `--fly-cherry-tint`<br>`oklch(96.5% 0.015 25)` #fef0ee |
| tangerine | `--fly-tangerine`<br>`oklch(70% 0.181 48)` #f5741d | `--fly-tangerine-soft`<br>`oklch(82% 0.083 48)` #f1b495 | `--fly-tangerine-deep`<br>`oklch(56.6% 0.142 48)` #b7571a | `--fly-tangerine-tint`<br>`oklch(96.5% 0.017 48)` #fef0ea |
| amber | `--fly-amber`<br>`oklch(80% 0.158 78)` #f5af26 | `--fly-amber-soft`<br>`oklch(92% 0.053 78)` #f8e1be | `--fly-amber-deep`<br>`oklch(55.7% 0.107 78)` #966b19 | `--fly-amber-tint`<br>`oklch(96.5% 0.027 78)` #fef2e0 |
| lime | `--fly-lime`<br>`oklch(80% 0.199 128)` #98d425 | `--fly-lime-soft`<br>`oklch(92% 0.14 128)` #caf68e | `--fly-lime-deep`<br>`oklch(54.4% 0.131 128)` #597d19 | `--fly-lime-tint`<br>`oklch(96.5% 0.03 128)` #eef8e2 |
| emerald | `--fly-emerald`<br>`oklch(66% 0.142 160)` #1eac73 | `--fly-emerald-soft`<br>`oklch(78% 0.132 160)` #5fd19a | `--fly-emerald-deep`<br>`oklch(54% 0.112 160)` #1d8258 | `--fly-emerald-tint`<br>`oklch(96.5% 0.03 160)` #e3faed |
| teal | `--fly-teal`<br>`oklch(62% 0.101 195)` #1a9999 | `--fly-teal-soft`<br>`oklch(74% 0.095 195)` #57bebd | `--fly-teal-deep`<br>`oklch(54% 0.085 195)` #1c7e7e | `--fly-teal-tint`<br>`oklch(96.5% 0.03 195)` #ddfafa |
| sky | `--fly-sky`<br>`oklch(68% 0.129 230)` #1fa6d8 | `--fly-sky-soft`<br>`oklch(80% 0.095 230)` #7ac9ef | `--fly-sky-deep`<br>`oklch(54.7% 0.1 230)` #1d7ba0 | `--fly-sky-tint`<br>`oklch(96.5% 0.019 230)` #e7f6fe |
| cobalt | `--fly-cobalt`<br>`oklch(56% 0.197 258)` #126ee5 | `--fly-cobalt-soft`<br>`oklch(68% 0.128 258)` #6599e6 | `--fly-cobalt-deep`<br>`oklch(48% 0.164 258)` #1259b8 | `--fly-cobalt-tint`<br>`oklch(96.5% 0.015 258)` #edf4fe |
| indigo | `--fly-indigo`<br>`oklch(52% 0.259 278)` #543df8 | `--fly-indigo-soft`<br>`oklch(64% 0.14 278)` #7981df | `--fly-indigo-deep`<br>`oklch(44% 0.2 278)` #4136bc | `--fly-indigo-tint`<br>`oklch(96.5% 0.015 278)` #f1f3fe |
| violet | `--fly-violet`<br>`oklch(56% 0.27 305)` #9b23ef | `--fly-violet-soft`<br>`oklch(68% 0.14 305)` #ad80dd | `--fly-violet-deep`<br>`oklch(48% 0.2 305)` #792fb5 | `--fly-violet-tint`<br>`oklch(96.5% 0.019 305)` #f6f0fe |
| magenta | `--fly-magenta`<br>`oklch(62% 0.256 340)` #e01eb5 | `--fly-magenta-soft`<br>`oklch(74% 0.14 340)` #e486c6 | `--fly-magenta-deep`<br>`oklch(54% 0.2 340)` #b42c92 | `--fly-magenta-tint`<br>`oklch(96.5% 0.021 340)` #feeef8 |
| rose | `--fly-rose`<br>`oklch(68% 0.21 5)` #fb4f87 | `--fly-rose-soft`<br>`oklch(80% 0.09 5)` #f0a6b6 | `--fly-rose-deep`<br>`oklch(57.9% 0.2 5)` #d2306a | `--fly-rose-tint`<br>`oklch(96.5% 0.016 5)` #feeff2 |

### Hues, dark scheme

| Hue | Lead | Soft | Deep | Tint |
|---|---|---|---|---|
| cherry | `--fly-cherry`<br>`oklch(65% 0.212 25)` #f54647 | `--fly-cherry-soft`<br>`oklch(80% 0.097 25)` #f6a59e | `--fly-cherry-deep`<br>`oklch(46% 0.168 25)` #a11b22 | `--fly-cherry-tint`<br>`oklch(30% 0.05 25)` #442321 |
| tangerine | `--fly-tangerine`<br>`oklch(75% 0.147 48)` #f88e55 | `--fly-tangerine-soft`<br>`oklch(81% 0.1 48)` #f7ad88 | `--fly-tangerine-deep`<br>`oklch(56% 0.137 48)` #b3571e | `--fly-tangerine-tint`<br>`oklch(30% 0.05 48)` #422617 |
| amber | `--fly-amber`<br>`oklch(85% 0.124 78)` #fac36a | `--fly-amber-soft`<br>`oklch(91% 0.068 78)` #fbddaf | `--fly-amber-deep`<br>`oklch(66% 0.124 78)` #bb8727 | `--fly-amber-tint`<br>`oklch(30% 0.05 78)` #3c2a0d |
| lime | `--fly-lime`<br>`oklch(85% 0.2 128)` #a7e53d | `--fly-lime-soft`<br>`oklch(91% 0.17 128)` #c0f673 | `--fly-lime-deep`<br>`oklch(66% 0.155 128)` #76a329 | `--fly-lime-tint`<br>`oklch(30% 0.05 128)` #263316 |
| emerald | `--fly-emerald`<br>`oklch(71% 0.145 160)` #33bc82 | `--fly-emerald-soft`<br>`oklch(80% 0.154 160)` #4cdb9b | `--fly-emerald-deep`<br>`oklch(52% 0.106 160)` #1e7b53 | `--fly-emerald-tint`<br>`oklch(30% 0.05 160)` #143525 |
| teal | `--fly-teal`<br>`oklch(67% 0.103 195)` #2fa9a9 | `--fly-teal-soft`<br>`oklch(80% 0.116 195)` #4cd5d5 | `--fly-teal-deep`<br>`oklch(48% 0.074 195)` #1a6a6a | `--fly-teal-tint`<br>`oklch(30% 0.046 195)` #083535 |
| sky | `--fly-sky`<br>`oklch(73% 0.131 230)` #34b6ea | `--fly-sky-soft`<br>`oklch(80% 0.107 230)` #6ecbf5 | `--fly-sky-deep`<br>`oklch(54% 0.097 230)` #1f789c | `--fly-sky-tint`<br>`oklch(30% 0.05 230)` #0d3242 |
| cobalt | `--fly-cobalt`<br>`oklch(61% 0.192 258)` #2b7ff3 | `--fly-cobalt-soft`<br>`oklch(80% 0.086 258)` #9bc0f5 | `--fly-cobalt-deep`<br>`oklch(42% 0.14 258)` #104a97 | `--fly-cobalt-tint`<br>`oklch(30% 0.05 258)` #1e2e47 |
| indigo | `--fly-indigo`<br>`oklch(57% 0.216 278)` #615df2 | `--fly-indigo-soft`<br>`oklch(80% 0.087 278)` #b0b9f6 | `--fly-indigo-deep`<br>`oklch(42% 0.2 278)` #3d2fb6 | `--fly-indigo-tint`<br>`oklch(30% 0.05 278)` #282b47 |
| violet | `--fly-violet`<br>`oklch(61% 0.24 305)` #a64bf3 | `--fly-violet-soft`<br>`oklch(80% 0.107 305)` #ceacf5 | `--fly-violet-deep`<br>`oklch(42% 0.197 305)` #6719a0 | `--fly-violet-tint`<br>`oklch(30% 0.05 305)` #342742 |
| magenta | `--fly-magenta`<br>`oklch(67% 0.25 340)` #f03cc4 | `--fly-magenta-soft`<br>`oklch(80% 0.133 340)` #f69bd9 | `--fly-magenta-deep`<br>`oklch(48% 0.188 340)` #9c1c7e | `--fly-magenta-tint`<br>`oklch(30% 0.05 340)` #3e2336 |
| rose | `--fly-rose`<br>`oklch(73% 0.158 5)` #f7799a | `--fly-rose-soft`<br>`oklch(80% 0.102 5)` #f6a2b5 | `--fly-rose-deep`<br>`oklch(54% 0.195 5)` #c3245f | `--fly-rose-tint`<br>`oklch(30% 0.05 5)` #43232a |

### Checks

Contrast against `--fly-paper-3` (light #fefefe, dark #1d1e1f) and OKLab distance between
each lead and the next hue's lead:

| Hue | deep on light paper-3 | soft on dark paper-3 | ΔE to next hue, light | ΔE to next hue, dark |
|---|---|---|---|---|
| cherry | 6.04:1 | 8.60:1 | 0.138 (tangerine) | 0.138 (tangerine) |
| tangerine | 4.76:1 | 8.98:1 | 0.135 (amber) | 0.124 (amber) |
| amber | 4.74:1 | 12.72:1 | 0.155 (lime) | 0.153 (lime) |
| lime | 4.74:1 | 13.29:1 | 0.177 (emerald) | 0.177 (emerald) |
| emerald | 4.74:1 | 9.51:1 | 0.092 (teal) | 0.094 (teal) |
| teal | 4.81:1 | 9.36:1 | 0.095 (sky) | 0.096 (sky) |
| sky | 4.76:1 | 9.14:1 | 0.158 (cobalt) | 0.155 (cobalt) |
| cobalt | 6.63:1 | 8.94:1 | 0.108 (indigo) | 0.085 (indigo) |
| indigo | 8.36:1 | 8.82:1 | 0.130 (violet) | 0.116 (violet) |
| violet | 7.22:1 | 8.63:1 | 0.170 (magenta) | 0.159 (magenta) |
| magenta | 5.62:1 | 8.43:1 | 0.126 (rose) | 0.140 (rose) |
| rose | 4.75:1 | 8.55:1 | 0.113 (cherry) | 0.116 (cherry) |

### Greys and surfaces

| Token | Light | Dark |
|---|---|---|
| `--fly-gray-1` | `oklch(95.5% 0.004 95)` #f1f0ed | `oklch(25% 0.004 95)` #22221f |
| `--fly-gray-2` | `oklch(91% 0.004 95)` #e2e1de | `oklch(30% 0.004 95)` #2e2e2c |
| `--fly-gray-3` | `oklch(85% 0.004 95)` #cececb | `oklch(36% 0.004 95)` #3e3d3b |
| `--fly-gray-4` | `oklch(77% 0.004 95)` #b5b4b1 | `oklch(44% 0.004 95)` #535250 |
| `--fly-gray-5` | `oklch(67% 0.004 95)` #969592 | `oklch(53% 0.004 95)` #6c6c69 |
| `--fly-gray-6` | `oklch(57% 0.004 95)` #787775 | `oklch(62% 0.004 95)` #878683 |
| `--fly-gray-7` | `oklch(47% 0.004 95)` #5b5b58 | `oklch(72% 0.004 95)` #a5a4a2 |
| `--fly-gray-8` | `oklch(37% 0.004 95)` #40403d | `oklch(82% 0.004 95)` #c5c4c1 |
| `--fly-gray-9` | `oklch(27% 0.004 95)` #272624 | `oklch(91% 0.004 95)` #e2e1de |

`--fly-gray-1` is nearest the canvas and `--fly-gray-9` nearest the ink in both schemes, so
the dark scale runs from dark to light.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--fly-paper-1` | #e4e4e2 | #24252a | first sheet: site navigation |
| `--fly-paper-2` | #f1f1ef | #24252a | second sheet: page navigation, code |
| `--fly-paper-3` | #fefefe | #1d1e1f | the reading canvas |
| `--fly-ink` | #191917 | #e9e9e6 | text |
| `--fly-quiet` | #5c5c58 | #a9a9a4 | secondary text |
| `--fly-edge` | #19191729 | #000000a0 | sheet edges and borders |
| `--fly-rule` | #cececb | #3e3d3b | hairlines drawn on the canvas (the hr); at least 1.3:1 against `--fly-paper-3` in both schemes, which `--fly-edge` is not in the dark one |
| `--fly-hover` | #0000000d | #ffffff12 | hover wash |
| `--fly-shadow-ink` | rgb(0 0 0 / 12%) | same | screenshot and strip shadows (the prototype's value in both schemes) |
| `--fly-bar` | #24252a | same | global menu, footer, previous/next strip |
| `--fly-bar-drop` | #1d1e1f | same | dropdowns on the bar |
| `--fly-bar-ink` | #e9e9e6 | same | text on the bar and on dark primary fills (never on lime or amber) |
| `--fly-key` | #f4f4f5 | #313137 | key cap fill |
| `--fly-scrollbar` | rgb(128 128 128 / 30%) | same | scrollbar thumbs |
| `--fly-scrim` | #00000088 | same | behind the search panel |
| `--fly-scrim-strong` | #000000bb | same | under lightbox captions |

Shadows are declared on `:root` and on every `[data-md-color-scheme]`, so their
`--fly-shadow-ink` resolves per scheme:

| Token | Value | Use |
|---|---|---|
| `--fly-shadow` | `-1px 0 3px rgb(0 0 0 / 8%)` | vertical sheet edges |
| `--fly-shadow-down` | `0 2px 6px var(--fly-shadow-ink)` | light-edged screenshots |
| `--fly-shadow-up` | `0 -2px 6px var(--fly-shadow-ink)` | previous/next strip, cast up |
| `--fly-drawer-shadow` | `-2px 0 8px rgb(0 0 0 / 20%)` | phone navigation drawer |

### Semantic colours

Semantic tokens reference hue tokens through `var()` only. Primary buttons, alerts, marks
and focus rings use these, never a hue directly.

| Tokens | Hue |
|---|---|
| `--fly-accent` `--fly-accent-soft` `--fly-accent-deep` `--fly-accent-tint` `--fly-accent-text` | cobalt (or the page hue) |
| `--fly-primary` `--fly-primary-soft` `--fly-primary-deep` `--fly-primary-tint` `--fly-primary-text` | accent |
| `--fly-info` `--fly-info-soft` `--fly-info-deep` `--fly-info-tint` `--fly-info-text` | cobalt |
| `--fly-success` `--fly-success-soft` `--fly-success-deep` `--fly-success-tint` `--fly-success-text` | emerald |
| `--fly-warning` `--fly-warning-soft` `--fly-warning-deep` `--fly-warning-tint` `--fly-warning-text` | amber |
| `--fly-danger` `--fly-danger-soft` `--fly-danger-deep` `--fly-danger-tint` `--fly-danger-text` | cherry |
| `--fly-link` | `--fly-accent-text` |
| `--fly-link-color` | undefined (article links inherit); `--fly-link` under `data-fly-links="accent"` (`extra.fly.links: accent`) |
| `--fly-link-hover-color` | undefined; `--fly-ink` under `data-fly-links="accent"` |
| `--fly-h1-color` | `--fly-ink`; `--fly-accent-text` under `data-fly-h1="accent"` (page-level hue, or `h1: accent`) |
| `--fly-focus` | `--fly-accent` |
| `--fly-mark` | `--fly-accent-tint` |

The H1 is set in `--fly-h1-color` (`.md-typeset h1`; the H2 stays ink). It is ink unless the plugin
puts `data-fly-h1="accent"` on the body: a page that sets its own hue (front matter or preset) does,
as does a site with `h1: accent`; a site hue alone does not, and a page's `h1: ink` wins. The
hue's `-text` variant is used, which reaches 4.5:1 on the canvas in both
schemes (`gray` gives a dark grey). A site that wants another title colour sets the token on
`.md-typeset h1`, not `--fly-ink`. Buttons are neutral and take no hue: `.md-button` is ink on paper
with an ink outline, `.md-button--primary` is paper (`--fly-paper-3`) on ink, hover and focus
fill with `--fly-hover` or `--fly-quiet`; labels are never underlined. `mark` inherits its colour.

`-text` is the variant that reads as text on the canvas: `-deep` in the light scheme,
`-soft` in the dark one. SPEC §4.4's table is read as: primary and link follow the accent
(the site default being cobalt); info is cobalt always.

Admonitions:

| Token | Maps to | MaterialX types |
|---|---|---|
| `--fly-admonition-note`, `--fly-admonition-info` | `--fly-info` (cobalt) | note, info |
| `--fly-admonition-tip`, `--fly-admonition-success` | `--fly-success` (emerald) | tip, success |
| `--fly-admonition-warning` | `--fly-warning` (amber) | warning |
| `--fly-admonition-danger`, `--fly-admonition-failure`, `--fly-admonition-bug` | `--fly-danger` (cherry) | danger, failure, bug |
| `--fly-admonition-question` | `--fly-violet` | question |
| `--fly-admonition-example` | `--fly-indigo` | example |
| `--fly-admonition-abstract` | `--fly-teal` | abstract |
| `--fly-admonition-quote` | `--fly-gray-5` | quote |

`[data-fly-hue='<hue>']` sets `--fly-accent`, `--fly-accent-soft`, `--fly-accent-deep` and
`--fly-accent-tint` to that hue's variants; `gray` uses greys 6, 4, 8 and 1 (soft and
deep swap in the dark scheme).

## MaterialX bridge

`materialx.css` sets MaterialX's variables on `:root`, on both `[data-md-color-scheme]`
values and on `[data-fly-hue]` elements: text and code fonts from `--fly-body-family`
and `--fly-code-family`; default foreground and background from ink, quiet and
`--fly-paper-3`; primary and accent from `--fly-primary` and `--fly-accent`; typeset link,
mark, del, ins, kbd and table colours; code colours from `--fly-paper-2` and the hues
(syntax colours use `-deep` in light, `-soft` in dark); admonition colours from the
admonition tokens; footer colours from the bar tokens. Translucent MaterialX variants are
`color-mix(in srgb, var(--fly-…) N%, transparent)`.
