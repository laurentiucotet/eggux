# Brand

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Logo Mark](#logo-mark) | 1 | - |
| [Logo](#logo) | 3 | - |

On the Figma page: "Example / language comparison"

## Logo Mark

Component · 1 variant · default size 32 × 32

Brand mark. Replace the "glyph" layer with the client logo (vector, fills bound to tokens) here once; Logo, Sidebar Workspace and every page follow.

Tokens and styles:
- Colors: `background/primary`, `foreground/primary`
- Spacing and size: `spacing/8`
- Radius: `radius/lg`
- Text styles: `body/large`

## Logo

Component set · 3 variants · default size 32 × 32

Product or client logo. mark = square symbol (sidebar collapsed, favicon), wordmark = name only, full = both. Edit the symbol in Logo Mark.

| Variant property | Values |
|---|---|
| Type | mark, wordmark, full |

| Property | Type | Default |
|---|---|---|
| Name | text | Acme |

Built from: `Logo Mark`

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
- Text styles: `body/large`
