# Accordion

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Accordion](#accordion) | 1 | Items |
| [Accordion Item](#accordion-item) | 4 | Meta, Content |

On the Figma page: "Example / filter panel", "Stress test / Accordion"

## Accordion

Component · 1 variant · default size 640 × 248

shadcn Accordion: Items slot of Accordion Item instances.

**Use for**

- FAQ and optional detail (Density default)
- Filter groups in a side panel, Sheet or Drawer (Density compact)
- Settings groups in a side panel

**Not for**

- Information every user needs to finish the task: show it on the page
- Switching between panels of the same level: use Tabs
- Steps in a fixed order: use Stepper

**Anatomy**

1. Items slot of Accordion Items
2. Trigger row: Leading icon (optional), Title, Meta slot (Show meta), chevron
3. Content slot, shown when State=expanded

**Content and behavior**

- The whole trigger row toggles
- Several items may be open at once unless the content is mutually exclusive
- Filters: Title is the dimension; Meta is a Badge Count of active values or a short summary
- Leading icon on all items or none
- Groups with active filters are open by default

**Accessibility**

- Enter or Space toggles; arrow keys move between items
- The trigger is a button with aria-expanded and aria-controls
- Keyboard focus shows the border/ring focus ring on the trigger row

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
