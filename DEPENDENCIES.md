---
this_file: DEPENDENCIES.md
---

# Dependencies

Exact versions are pinned in package.json and package-lock.json.

- Basecoat 1.0.2 supplies HTML component CSS and interactive controllers.
- daisyUI 5.7.44 supplies the `du-` component family.
- Tailwind CSS and its CLI 4.3.3 compile both upstream component libraries.
- PostCSS, postcss-prefix-selector and postcss-selector-parser scope styles,
  separate the conflicting border token and enumerate complete daisyUI classes.
- Playwright runs real Chromium interaction and layout checks.
- Node's built-in test runner verifies transformations and build artifacts.

Redistributed Basecoat, daisyUI and Tailwind license notices ship with the CDN.
The two legacy editorial vendor sheets are retained source artifacts from the
existing sites; their hashes and origins are recorded in provenance.json.

Official contracts checked on 2026-09-23:

- https://basecoatui.com/installation/
- https://basecoatui.com/components/tabs/
- https://daisyui.com/docs/config/
- https://tailwindcss.com/docs/preflight
- https://properdocs.org/user-guide/customizing-your-theme/
- https://properdocs.org/dev-guide/themes/

Installed upstream source confirms the Basecoat registration/lifecycle methods
and its dark variant, plus PostCSS prefix transformation behavior.

- postcss-nesting and @csstools/postcss-cascade-layers preserve nesting and
  layer precedence when integrating with unlayered host styles. All vendor,
  theme and specimen styles are compiled in one pass, then separated by source.
  daisyUI 5.7.44 reset fallbacks are compared against native layers in Chromium.
  Official implementation contracts:
  https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-cascade-layers
  and https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting.

- The vanilla MaterialX integration specimen is compiled with uv and Python 3.13,
  using ProperDocs 1.6.7, MkDocs 1.6.1 and mkdocs-materialx 10.1.8.
  These exact pins live in scripts/build.mjs; no frontend framework was added.
