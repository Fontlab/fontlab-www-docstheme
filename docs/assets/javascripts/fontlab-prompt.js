// this_file: src_docs/md/assets/javascripts/fontlab-prompt.js
//
// On prompt pages, the fenced ```markdown blocks hold prompt templates. Render
// them as formatted Markdown client-side (markdown-wasm) so readers see the
// prompt, not raw source — while a Copy button still copies the raw Markdown.
// Only prompt pages are touched, so MaterialX syntax highlighting elsewhere is
// untouched.

import { init, parse, ParseFlags } from "https://cdn.jsdelivr.net/npm/markdown-wasm-es@1.2.1/+esm";

const IS_PROMPT_PAGE = /\/prompt-/.test(location.pathname);

async function renderPrompts() {
  const blocks = Array.from(
    document.querySelectorAll(".md-content .highlight")
  ).filter((hl) => hl.querySelector("pre > code"));
  if (!blocks.length) return;

  await init("https://esm.sh/markdown-wasm@1.2.0/dist/markdown.wasm");

  for (const hl of blocks) {
    const code = hl.querySelector("pre > code");
    const raw = code.textContent; // textContent is already entity-decoded
    let html;
    try {
      html = parse(raw, {
        parseFlags: ParseFlags.DEFAULT,
        format: "html",
        allowJSURIs: false,
      });
    } catch (_error) {
      continue; // leave the original block untouched on failure
    }

    const rendered = document.createElement("div");
    rendered.className = "fl-prompt md-typeset";

    const bar = document.createElement("div");
    bar.className = "fl-prompt__bar";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "fl-prompt__copy";
    copy.textContent = "Copy Markdown";
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(raw).then(function () {
        copy.textContent = "Copied";
        window.setTimeout(function () {
          copy.textContent = "Copy Markdown";
        }, 1500);
      });
    });
    bar.appendChild(copy);

    const body = document.createElement("div");
    body.className = "fl-prompt__body";
    body.innerHTML = html;

    rendered.appendChild(bar);
    rendered.appendChild(body);

    hl.style.display = "none"; // keep raw in the DOM (copy source), hide visually
    hl.insertAdjacentElement("afterend", rendered);
  }
}

if (IS_PROMPT_PAGE) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPrompts);
  } else {
    renderPrompts();
  }
}
