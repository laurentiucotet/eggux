# Accordion

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Accordion](#accordion) | 1 | Items |
| [Accordion Item](#accordion-item) | 4 | Meta, Content |

On the Figma page: "Example / filter panel"

## Accordion

Component · 1 variant · default size 640 × 248

shadcn Accordion: Items slot of Accordion Item instances.

Slots (fill them in the instance, never detach): `Items`

Built from: `Accordion Item`

Guides: [accordion](../../skills/build-ui/components/accordion.md)

Code: shadcn `Accordion`

## Accordion Item

Component set · 4 variants · default size 640 × 53

shadcn AccordionItem. default for FAQ and long content; compact for filter groups and side panels. Leading icon and Meta (count of active filters, value summary) are optional. Whole trigger row is clickable.

| Variant property | Values |
|---|---|
| Density | default, compact |
| State | collapsed, expanded |

| Property | Type | Default |
|---|---|---|
| Title | text | Can I change my plan later? |
| Leading icon | boolean | false |
| Leading icon type | instance swap | Icon/users |
| Show meta | boolean | false |

Slots (fill them in the instance, never detach): `Meta`, `Content`

Built from: `Badge Count`. Icons: chevron-down, chevron-up, users

Tokens and styles:
- Colors: `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Guides: [accordion](../../skills/build-ui/components/accordion.md), [drawer](../../skills/build-ui/components/drawer.md)
