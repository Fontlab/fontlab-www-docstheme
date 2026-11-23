---
this_file: src_docs/md/start/choose.md
---

# Choose a pattern

Choose the smallest structure that carries the distinction you need. A badge
can identify a status. It cannot explain why an export failed. A tab can group
alternatives. It should not hide the next required step.

## Match the reader's task

| The reader needs to… | Start with… | Add structure when… |
| --- | --- | --- |
| Understand one idea | Heading and paragraph | A caption, note or example needs a separate place |
| Follow a sequence | Ordered list | Each step includes a screenshot or a decision |
| Go somewhere | Descriptive link | One route deserves button emphasis |
| Compare choices | Table | Each choice needs an image or a substantial explanation |
| Enter information | Label and native field | Validation, suggestions or grouping are necessary |
| Inspect optional detail | Disclosure | Several independent topics need separate summaries |
| Finish a consequential action | Named button and confirmation | The user must review the consequence before committing |

## Present related implementations together

The same status appears as plain text, a Basecoat badge and a daisyUI badge.
The word carries the meaning in each rendition; colour only adds emphasis.

<!-- specimen:choose-badges html -->
<div class="fltheme-components fl-demo-row">
  <strong>Draft</strong>
  <span class="badge" data-variant="secondary">Draft</span>
  <span class="du-badge du-badge-neutral">Draft</span>
</div>
<!-- /specimen -->

For arbitrary spans, use HTML. Reserve attribute lists for elements Markdown
already creates, such as paragraphs, links, images and headings.

## Read the boundary before copying

MaterialX renders authored documents. Basecoat and daisyUI provide component
styles, and some Basecoat controls include runtime behaviour. None of these
libraries sends your form to a server or decides whether a font is ready to
release.

If the example needs application code, keep that dependency beside it. A
working disclosure can be copied with its native HTML behaviour. A search
panel needs a real search source before it can find your documents.

The [copy guide](copy.md) explains which parts of a specimen travel with the
HTML and which are supplied by the host page.
