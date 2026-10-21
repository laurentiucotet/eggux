# Rating

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Rating](#rating) | 12 | - |

## Rating

Component set · 12 variants · default size 78 × 14

Star rating, display (reviews, products) or input (feedback). Filled stars in background/warning; always show the number too ("4.7 (128)"), color is not the only signal. As input: radio group of 5, hover previews, half stars only for display.

| Variant property | Values |
|---|---|
| Size | sm, default |
| Value | 0, 1, 2, 3, 4, 5 |

| Property | Type | Default |
|---|---|---|
| Show value | boolean | false |
| Show count | boolean | false |
| Count | text | (128) |

Tokens and styles:
- Colors: `background/warning`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/3_5`, `spacing/5`
- Text styles: `ui/caption`, `ui/label`

Guides: [rating](../../skills/build-ui/components/rating.md)

Code: custom `RadioGroup`
