# Description List

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Description List Item](#description-list-item) | 2 | Value |

## Description List Item

Component set · 2 variants · default size 560 × 45

Label-value pair for record details (shadcn has no component; dl/dt/dd in code). Horizontal in cards and sheets, vertical in narrow columns and grids. Divider off on the last row. Empty value: "-" or "Not set" in muted, never blank.

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |

| Property | Type | Default |
|---|---|---|
| Label | text | Phone |
| Divider | boolean | true |

Slots (fill them in the instance, never detach): `Value`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/40`
- Text styles: `body/small`, `ui/label`

Guides: [description-list](../../skills/build-ui/components/description-list.md)
