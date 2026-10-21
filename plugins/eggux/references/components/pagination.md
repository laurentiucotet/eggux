# Pagination

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Pagination Item](#pagination-item) | 11 | - |
| [Pagination](#pagination) | 1 | Items |

On the Figma page: "Example / table footer"

## Pagination Item

Component set · 11 variants · default size 36 × 36

One pagination control (shadcn Pagination). Current page = active (outline). Hide Previous/Next labels on mobile (icons only).

| Variant property | Values |
|---|---|
| Type | page, previous, next, ellipsis |
| State | default, hover, active, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | 1 |

Icons: chevron-left, chevron-right, ellipsis

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/2_5`, `spacing/4`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

## Pagination

Component · 1 variant · default size 386 × 36

Page navigation for long lists and tables. Show first, last, current ±1 and ellipsis. For feeds prefer "Load more"; for tables pair it with the row count and rows-per-page Select.

Slots (fill them in the instance, never detach): `Items`

Built from: `Pagination Item`

Tokens and styles:
- Spacing and size: `spacing/1`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

Code: shadcn `Pagination`, `Breadcrumb`
