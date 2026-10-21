# Quote

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Quote](#quote) | 2 | - |

On the Figma page: "Example / pull quote between sections", "Example / quote in an article", "Stress test / Quote"

## Quote

Component set · 2 variants · default size 672 × 92

A quotation in running content: default (left rule, body/large) inside an article or case study; pull (centered, heading/h3, quote mark) to break up a long page with one strong line. Attribution: name and role, optional avatar. Quote real people with permission, word for word; no quotation marks in the text, the component adds the emphasis. Customer quotes on marketing pages use the Testimonial blocks.

**Use for**

- A sentence from a person quoted in an article or case study
- One strong line between sections of a long page (Variant=pull)
- An expert's view next to data

**Not for**

- Customer proof on a marketing page: use the Testimonial blocks
- Notes and warnings: use Alert
- Code or commands: use Code Block

**Anatomy**

1. Rule on the left (default) or a quote mark (pull)
2. Quote text: body/large (default), heading/h3 (pull)
3. Attribution: Avatar (Show avatar), Name, Role (Show attribution)

**Content and behavior**

- Word for word, with permission; no quotation marks in the text
- One pull quote per page section, never two in a row
- Attribution names the person and their role at the time
- Under 40 words; longer passages stay in the body text

**Accessibility**

- Code as blockquote with a figcaption for the attribution
- The quote mark is decorative
- Text contrast as body text, never muted

| Variant property | Values |
|---|---|
| Variant | default, pull |

| Property | Type | Default |
|---|---|---|
| Quote | text | The best onboarding is the product itself, with the next step always visible. |
| Show avatar | boolean | true |
| Name | text | Maria Ilie |
| Role | text | Head of Finance Operations, Acme |
| Show attribution | boolean | true |

Built from: `Avatar`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/3`, `spacing/4`, `spacing/6`
- Text styles: `body/large`, `body/small`, `display`, `heading/h3`, `ui/label`
