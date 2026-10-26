# Accordion

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Accordion Item](#accordion-item) | 16 | Meta, Content |
| [Accordion](#accordion) | 2 | Items |
| [Show More](#show-more) | 2 | - |

On the Figma page: "Example / Accordion styles", "Example / customer profile with show more and details", "Example / filter panel", "Stress test / Accordion", "Stress test / Show More"

## Accordion Item

Component set · 16 variants · default size 640 × 53

One collapsible row: Title, optional leading icon and Meta, Content slot shown when expanded. Style=default: divider line under each item (FAQ, settings). Style=card: bordered card with radius/base, used inside Accordion Style=card. Icon=chevron (default) points down when collapsed and up when expanded; Icon=plus shows plus when collapsed and minus when expanded, common on marketing FAQs. Size=sm for side panels and dense lists. Usage: eggux build-ui/components/accordion.md

**Use for**

- Inside Accordion only
- FAQ questions, settings groups, filter groups in a panel

**Not for**

- On its own as a disclosure in running text: use Show More
- Switching between views: use Tabs

**Anatomy**

1. Size: default, sm. State: collapsed, expanded
2. Style: default (bottom divider), card (border on all sides, radius/base, background/default, padding spacing/4; sm spacing/3)
3. Icon: chevron (down when collapsed, up when expanded), plus (plus when collapsed, minus when expanded)
4. Leading icon (Show leading icon), Title, Meta slot (Show meta)
5. Content slot (visible when expanded)

**Content and behavior**

- Same Style, Icon and Size on every item of one Accordion
- Style=card goes inside Accordion Style=card (gap spacing/3)
- Icon=plus is for marketing FAQs; apps keep the chevron
- Title is a question or a group name, one line where possible

**Accessibility**

- The trigger is a button with aria-expanded and aria-controls
- Plus and minus icons are decorative (aria-hidden); the state comes from aria-expanded

| Variant property | Values |
|---|---|
| Size | default, sm |
| State | collapsed, expanded |
| Style | default, card |
| Icon | chevron, plus |

| Property | Type | Default |
|---|---|---|
| Title | text | Can I change my plan later? |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/users |
| Show meta | boolean | false |

Slots (fill them in the instance, never detach): `Meta`, `Content`

Built from: `Badge Count`. Icons: chevron-down, chevron-up, minus, plus, users

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/base`
- Text styles: `body/small`, `ui/label`

Guides: [accordion](../../skills/build-ui/components/accordion.md), [drawer](../../skills/build-ui/components/drawer.md)

Code: shadcn `Accordion` (`AccordionItem`) (Size=sm: smaller padding)

## Accordion

Component set · 2 variants · default size 640 × 248

Vertical stack of Accordion Items for FAQs, settings groups and long details. Style=default: items divided by lines, for FAQ sections and panels. Style=card: each item is a separate bordered card with a gap, for marketing FAQs and help centers on a muted section background. Put Accordion Items of the matching Style in the Items slot. Usage: eggux build-ui/components/accordion.md

**Use for**

- FAQ and optional detail (Density default)
- Filter groups in a side panel, Sheet or Drawer (Density compact)
- Settings groups in a side panel
- Style=card: marketing FAQs, help centers and pricing pages, often on a muted section background

**Not for**

- Information every user needs to finish the task: show it on the page
- Switching between panels of the same level: use Tabs
- Steps in a fixed order: use Stepper

**Anatomy**

1. Style: default (divider lines), card (separate cards, gap spacing/3)
2. Items slot of Accordion Items (use items of the same Style)
3. Trigger row: Leading icon (optional), Title, Meta slot (Show meta), chevron or plus/minus (Icon)
4. Content slot, shown when State=expanded

**Content and behavior**

- The whole trigger row toggles
- Several items may be open at once unless the content is mutually exclusive
- Filters: Title is the dimension; Meta is a Badge Count of active values or a short summary
- Show leading icon on all items or none
- Groups with active filters are open by default
- Style=default in apps, panels and filters; Style=card on marketing and help pages
- Match the item Style to the Accordion Style; never mix both in one list
- Icon=plus (plus/minus) is for marketing FAQs; keep the chevron in apps

**Accessibility**

- Enter or Space toggles; arrow keys move between items
- The trigger is a button with aria-expanded and aria-controls
- Keyboard focus shows the border/ring focus ring on the trigger row

| Variant property | Values |
|---|---|
| Style | default, card |

Slots (fill them in the instance, never detach): `Items`

Built from: `Accordion Item`

Tokens and styles:
- Spacing and size: `spacing/3`

Guides: [accordion](../../skills/build-ui/components/accordion.md)

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
