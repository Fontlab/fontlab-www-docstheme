---
this_file: review/visual-review.md
---

# Component specimen comparison

Reference: [generated concept](concept.png). Chromium captures:
[desktop](desktop.png), [mobile](mobile.png), [dark](dark.png).
Both reference and rendered desktop were inspected with view_image on
2026-09-23. The concept is 1505×1045; the desktop viewport is 1505×1045,
with a full-page capture extending to the footer. Mobile is 390×844.

The browser plugin was initialized but listed no available browsers. Its
permitted Playwright fallback supplied screenshots and interaction checks.

| Comparison | Reference and rendered evidence | Resolution |
| --- | --- | --- |
| Copy | Heading, intro, navigation, tab labels, form label/value/action, badge, step labels and disclosure match | No above-the-fold copy additions, removals or renames |
| Layout | 864px centered reading column, charcoal header and two divided sections | Preserved |
| Typography | Outfit loaded through the existing Adobe kit; 60px heading, 30px intro, 40px section headings, 17px form labels | Native web font rendering retained; generated raster lettering is not an exact font specimen |
| Palette | White canvas, charcoal header/button, light-gray input panel, red active-tab line and blue outline badge | Fixed cascade conflict that had erased badge borders and button fill |
| Controls | Full-width underline tabs, 468px input and compact action button | Fixed vendor specificity conflict that reverted these to small pill controls |
| Steps/disclosure | Three labeled native daisyUI steps and an initially open details control | Native daisyUI evenly spaced steps and upward open chevron retained intentionally; concept has wider step spacing and downward open chevron |
| Mobile | Same content order; header wraps, input fits column, no horizontal overflow | Verified at 390px; no separate mobile concept was requested |
| Host integration | Marketing and FontLab MaterialX pages retain their typography and navigation | Browser checks assert actual foreground/background colors, not just visible button height |

Tabs switch by click and keyboard, the in-memory form reports its saved value,
and the details control opens/closes. Host dark mode updates scoped tokens.
The implementation preserves the generated design's composition and copy;
intentional native-component geometry differences are listed above.
