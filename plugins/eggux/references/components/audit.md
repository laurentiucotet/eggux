# Audit

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Change Item](#change-item) | 1 | - |

## Change Item

Component · 1 variant · default size 560 × 24

One field changed in an audit entry: field, old value, new value. Empty old value shows "(empty)". Sensitive values are masked (••••).

| Property | Type | Default |
|---|---|---|
| Field | text | Due date |
| Old | text | 7 Oct 2026 |
| New | text | 21 Oct 2026 |

Icons: arrow-right

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `foreground/accent`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/caption`

Guides: [audit-log](../../skills/build-ui/patterns/audit-log.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md)

Code: custom
