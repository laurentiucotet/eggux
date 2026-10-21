# Card

Usage guidelines only. Visual specs live in the Figma component.

## Use
- To group content about one object or one topic, on a surface (`background/card`) distinct
  from the page.
- Object cards show the attributes marked "card" in `objects.md`, in that order.
- Do not nest cards in cards. Inside a card, separate groups with spacing or a `Separator`.

## Anatomy
Header (title `body/large`, optional description `body/small` muted, optional action top right)
→ content → optional footer with actions.

## Variants and sizes
| Variant | Looks | Use |
|---|---|---|
| `default` | Card background, border | Most cards |
| `outline` | No fill, border | Cards inside a panel, a dialog or another surface; long lists of cards |
| `muted` | Tinted (`card/muted-background`), no border | Secondary or summary information, empty and placeholder cards, side notes |

| Elevation | Looks | Use |
|---|---|---|
| `false` (default) | Flat | Cards on a page, in grids and lists |
| `true` | Shadow md; an outline card gets the card background so the shadow has a surface | One card that must stand out, or a card floating over content (a draggable card, a card over a map) |

| Size | Padding and gap | Use |
|---|---|---|
| `default` | 24 (16 in Compact) | Page-level cards, forms, detail cards |
| `sm` | 16 (12 in Compact) | Grids of many cards, sidebars, dashboards |

Which one:
- A visual difference used across the product → a Variant or Size of Card.
- Its own anatomy or behavior (metric, selectable option, post preview) → a separate component
  built on Card: Stat Card, Option Card, Post Card.
- A one-off look for one screen → do not add a variant; use an existing one or record a decision.
- Status colors (success, warning, error) are not card variants: use an `Alert`, or a `Badge`
  or Status Dot inside the card. Color alone never carries the status.
- One variant per group of cards; do not mix flat and elevated cards in the same grid.

## Padding
The card has padding top and bottom; Header, Content and Footer each have padding left and
right. A slot set to padding 0 runs edge to edge (a table, an image, a map) while the others
stay aligned. Product-wide changes ("cards with 12 px padding") change the tokens
`density/card-padding` and `density/card-gap` (and the `-sm` pair), never single instances.
Stat Card, Option Card and Post Card use the same tokens.

## Rules
- A whole card is clickable only when it has one destination. Then it has a hover state, a focus
  ring and no other buttons inside except a menu. Otherwise, make the title the link.
- Cards in a grid have equal height per row and the same structure, so the eye can scan.
- Footer actions follow button rules: one primary at most, usually none in a grid of cards.
- Metric cards: label (`body/small` muted), value (`heading/h2`, one line), change with direction
  in text and icon, not color alone.
- Selectable cards (plan, delivery, billing period) use Option Card: the whole card is the target, one selected.

## Figma
- `Card` (Variant × Size × Elevation, 12 variants) = native slots Header (Card Header), Content (placeholder) and Footer (Card Footer).
  Fill the slots in the instance; never detach. Turn off Show header / Show footer when unused.
- `Card Header` has its own Action slot (top right): Button Icon with a menu, a Badge, a Select.
- `Stat Card` (Trend up, down, neutral) for dashboards; `Option Card` for selectable options.
- `Entity Card` for one object in a grid or board (customer, project, vendor): leading avatar or
  icon, title (2 lines), subtitle (1 line), menu, tags, 2-4 details, footer with people and last
  update. Fill Details with the attributes marked "card" in `objects.md`.
- `Progress Card` for a goal against a target; Status on track / at risk / off track names the
  state in text; say the rule behind it in the footnote or a tooltip.
- Examples on the Card page: list, profile, form, empty state, stat cards row.
- `Stress test / Card` (Stress tests section): minimal, typical, long title, full-bleed slot,
  280 and 720 wide, for every variant, sm, Dark, Compact and Corporate Light.
