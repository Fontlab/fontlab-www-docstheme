---
this_file: review/issue213.md
---

# Issue 213: shared component harmony

Specification: `../Marketing/issues/213.md`, all 37 bullets in order.
Review baseline: `1ca0c18`. Implementation is shared; only pagination's current
page markup and explanatory sentence require a Marketing rebuild.

## Requirement coverage

`harmony.spec.mjs`, `harmony-layout.spec.mjs` and `frame-containment.spec.mjs` exercise the real catalogue
markup against the candidate bundle, and support unmodified live URLs through
`HARMONY_LIVE=1`. The same assertions run at 1440px and 390px in Material Light,
Material Dark, Retro, Miller and Lines. Frames also check 320px reflow.

| # | Requested change | Implementation and acceptance |
|---|---|---|
| 1 | Semantic action margins | Label/input/action spacing; action-row test |
| 2 | Action size/weight margins | Same field rhythm; action-row test |
| 3 | Unified keycaps | Daisy border/palette/mono, Basecoat size, one MaterialX symbol; keycap parity test |
| 4 | Daisy tabs match MaterialX | Header geometry, full baseline, active underline; geometry and arrow-key test |
| 5 | Figure captions | Smaller, upright, reading-edge alignment; caption test |
| 6 | Badge margins | Wrapped rows and inter-row margin; badge test |
| 7 | Four mockup frames | Scoped layout utilities, content padding, compact phone and contained terminal text; reflow/row-containment tests and captures |
| 8 | Subtle pagination | Plain links, current-page pill with aria-current; pagination test |
| 9 | Dropdown chevron | Centered neutral chevron; palette and open/close test |
| 10 | Basecoat drawer padding | Equal header/section/footer padding; dialog test |
| 11 | Daisy drawer overlap | Opaque panel above backdrop, isolated stacking; hit-test and close interaction |
| 12 | Basecoat label | Minimum 8px below; field-spacing test |
| 13 | Daisy label | Shared field typography and gap; field-spacing test |
| 14 | Basecoat input | Label/control spacing; field-spacing test |
| 15 | Daisy input | Smaller label/control gap than inter-field gap; grouped-label test |
| 16 | Daisy textarea | Same grouped-field rhythm; grouped-label test |
| 17 | Checkboxes | Shared 1.5rem size and Basecoat-style check; dimensions and native selection |
| 18 | Radios | Shared size and black dot on white disk; radio test |
| 19 | Preserve native select | Existing Basecoat chevron and native selection retained; select test |
| 20 | Daisy select | Grouped-field rhythm and Basecoat chevron; spacing/chevron/select test |
| 21 | Custom select | Shared surface, width and chevron; real option selection test |
| 22 | Switch | Thumb contained in track, native value/output; switch test |
| 23 | Combobox | Label gap and working filter/selection; combobox test |
| 24 | Filter reset | Fixed-size visible multiplication-sign reset; Text then reset test |
| 25 | Calendar label | Minimum field gap; date/range test |
| 26 | Sliders | Shared thin track/thumb and gaps; native arrow/value/output test |
| 27 | Admonitions | Approved alert palette and text size for native notes/details; parity and disclosure test |
| 28 | Progress | Matching track height, palette and radius; progress test |
| 29 | Skeletons | Restored layout utilities, dimensions, muted surface; dimensions test and captures |
| 30 | Tooltips | Shared scale/surface for Basecoat, Daisy and both MaterialX tooltip classes; hover/focus/parity test |
| 31 | Annotations | Tooltip font size and line height; annotation-open/parity test |
| 32 | Basecoat table caption | Reading-edge alignment; table test |
| 33 | Daisy table headings | Reading-edge alignment; table test |
| 34 | Chart | Contained canvas, separated accessible table, theme refresh; geometry and light/dark test |
| 35 | Countdown | Public value/digits mapped to prefixed vendor variables; authored and changed value test |
| 36 | Hero | Paragraph/action gaps and heading hierarchy; gap test and captures |
| 37 | Content bottom padding | Shared 25vh spacing; viewport-relative measurement |

## Direct cleanup and review

The bounded cleanup plan is `/tmp/issue213/cleanup-plan.md`. No dependency was
added. The existing cascade compiler combines overrides with vendor layers.
Native controls, Basecoat APIs and MaterialX markup remain the behavior owners.
Only keyboard-symbol annotation and the documented Basecoat theme-change event
need runtime adaptation. The immutable symbol map is allocated once.

Visual review found and repaired phone aspect-ratio slack, a doubled Tab symbol,
stale chart colors on theme changes, and tooltip focus handling. A mobile drawer
test initially sampled a point above the viewport; it now scrolls the panel into
view before checking that the panel owns the visible hit target.

Standards review: explicit component scopes, preserved host typography and
keyboard behavior, reduced-motion support, no speculative dependencies. Spec
review: all 37 bullets have an implementation and an acceptance path above.
Publication evidence and final counts are recorded in WORK.md.

## Artifacts

Baseline styles, red regressions, build/test logs, theme matrices and component
screenshots live under `/tmp/issue213/`. Each `<theme>-<width>/report.json` records
the inspected markup, computed styles and bounds alongside the captures.
The live matrix repeats the interactions without candidate asset interception.

Final verdict: standards **APPROVE**, spec **APPROVE**, direct architecture review
**CLEAR**. The final suite has 56 browser tests and 5 Node tests, with 200 live
theme/width checks plus 15 terminal containment checks. All 19 affected catalogue
pages have no page JavaScript errors, and changed CDN assets match the built hashes. Deployment
commits, successful Pages runs and per-theme results are in `issue213-delivery.json`.
