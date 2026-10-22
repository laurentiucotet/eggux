# Accordion

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Accordion](#accordion) | 1 | Items |
| [Accordion Item](#accordion-item) | 4 | Meta, Content |
| [Show More](#show-more) | 2 | - |

On the Figma page: "Example / filter panel", "Stress test / Accordion", "Stress test / Show More"

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
- Show leading icon on all items or none
- Groups with active filters are open by default

**Accessibility**

- Enter or Space toggles; arrow keys move between items
- The trigger is a button with aria-expanded and aria-controls
- Keyboard focus shows the border/ring focus ring on the trigger row

Slots (fill them in the instance, never detach): `Items`

Built from: `Accordion Item`

Guides: [accordion](../../skills/build-ui/components/accordion.md)

Code: shadcn `Accordion` (`AccordionItem`) (Size=sm: smaller padding)

## Accordion Item

Component set · 4 variants · default size 640 × 53

shadcn AccordionItem. default for FAQ and long content; compact for filter groups and side panels. Leading icon and Meta (count of active filters, value summary) are optional. Whole trigger row is clickable.

| Variant property | Values |
|---|---|
| Size | default, sm |
| State | collapsed, expanded |

| Property | Type | Default |
|---|---|---|
| Title | text | Can I change my plan later? |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/users |
| Show meta | boolean | false |

Slots (fill them in the instance, never detach): `Meta`, `Content`

Built from: `Badge Count`. Icons: chevron-down, chevron-up, users

Tokens and styles:
- Colors: `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Guides: [accordion](../../skills/build-ui/components/accordion.md), [drawer](../../skills/build-ui/components/drawer.md)

Code: shadcn `Accordion` (`AccordionItem`) (Size=sm: smaller padding)

## Show More

Component set · 2 variants · default size 560 × 124

A long text cut to 3 lines with Show more / Show less: notes, descriptions, bios, reviews. Only when the full text is rarely needed; key information stays above the cut. Keyboard focus stays on the toggle; the expanded text is announced. Several sections to open: Accordion.

**Use for**

- Notes, descriptions and bios on a record page
- Long reviews or comments in a list
- Product or job descriptions where the start says enough

**Not for**

- Several sections to open: use Accordion
- A whole article or long rich content: use Sheet or a page of its own
- Long lists of items: use Load More

**Anatomy**

1. Text: body/default, 3 lines when collapsed, fade or ellipsis at the cut
2. Toggle: Button link "Show more" / "Show less"

**Content and behavior**

- Only when the full text is rarely needed; key information stays above the cut
- Show the toggle only when the text is longer than 3 lines
- Show less returns to the same scroll position
- Never cut in the middle of a word

**Accessibility**

- The toggle is a button with aria-expanded and aria-controls on the text
- Focus stays on the toggle; the expanded text is announced
- The full text is in the DOM, cut with line-clamp, so screen readers can reach it

| Variant property | Values |
|---|---|
| State | collapsed, expanded |

| Property | Type | Default |
|---|---|---|
| Text | text | Northwind Traders has bought from Acme since 2019 and pays on average 6 days after the due date. Their finance team prefers invoices by email in German, with the purchase order number in the subject. Approvals above €10,000 go to Laura Becker; smaller ones to the accounts payable inbox. In 2026 they moved to quarterly contracts with volume pricing from 50 seats. |

Built from: `Button`

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
- Text styles: `body/default`

Guides: [accordion](../../skills/build-ui/components/accordion.md)

Code: shadcn `Collapsible` or `line-clamp-3` + `Button variant="link"` (`aria-expanded` on the toggle)
