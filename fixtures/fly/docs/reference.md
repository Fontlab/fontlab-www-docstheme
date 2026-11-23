---
this_file: fixtures/fly/docs/reference.md
subtheme: plain
margin_side: right
classes:
  main: [ref-main]
fly:
  hue: teal
  h1: ink
  fonts:
    sources: [typekit:abc1def]
    roles:
      h1: {weight: 300}
      body: {features: '"onum" 1'}
---

# Reference

A third page.

Code inside links keeps the underline: [`extra.fly`](guide.md) and the [`--fly-line`
token](guide.md).

A token wider than the line wraps inside its box and never overflows the column:
`fly-january-a-token-with-no-spaces-wider-than-any-text-column-abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij`.
