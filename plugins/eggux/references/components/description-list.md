# Description List

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Description List Item](#description-list-item) | 2 | Value |

On the Figma page: "Example / in billing", "Stress test / Description List Item"

## Description List Item

Component set · 2 variants · default size 560 × 45

Label-value pair for record details (shadcn has no component; dl/dt/dd in code). Horizontal in cards and sheets, vertical in narrow columns and grids. Divider off on the last row. Empty value: "-" or "Not set" in muted, never blank.

**Use for**

- Details card on a record page
- Details of one object in a Sheet
- What is requested in an approval
- Orientation=vertical in narrow columns and grids of 2-3

**Not for**

- Editable fields: use Field with Input, or Inline Edit for single rows
- Many objects compared side by side: use a Table
- History of events: use Timeline Item

**Anatomy**

1. Label: a short noun in sentence case
2. Value slot: text, Badge, Avatar + name, or a link
3. Divider (off on the last row)

**Content and behavior**

- Horizontal (label column 160) in cards and sheets; vertical in narrow columns
- Empty value: "-" or "Not set" in muted, never blank
- Values never repeat the label; long values wrap
- One Edit action per card, not a pencil per row
- Fill the Value slot in the instance; never detach

**Accessibility**

- Code as dl with dt and dd, so each label is read with its value
- Statuses in the Value slot are Badges with text, not color alone
- Muted empty values still keep 4.5:1

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
