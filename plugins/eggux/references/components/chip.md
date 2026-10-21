# Chip

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chip](#chip) | 5 | - |

On the Figma page: "Example / filter chips"

## Chip

Component set · 5 variants · default size 94 × 32

Chip (pill) for filters and multi-selection. selected = active filter (check icon when Leading icon is on). Remove shows an x to clear it; in code the x is a button labelled "Remove <value>". Usage: eggux build-ui/components/badge.md, patterns/search-and-filter.md

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | This week |
| Leading icon | boolean | false |
| Remove | boolean | false |

Icons: calendar, check, x

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `border/input`, `foreground/accent`, `foreground/default`, `foreground/primary`
- Spacing and size: `spacing/1_5`, `spacing/3`, `spacing/8`
- Radius: `radius/full`
- Text styles: `ui/label`

Guides: [badge](../../skills/build-ui/components/badge.md)

Code: custom on `Badge` + remove `Button`
