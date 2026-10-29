# Card

Usage guidelines only. Visual specs live in the Figma component.

## Use
- To group content about one object or one topic, on a surface (`background/card`) distinct
  from the page.
- Object cards show the attributes marked "card" in `objects.md`, in that order.
- Do not nest cards in cards. Inside a card, separate groups with spacing or a `Separator`.
- Text between two lines ("or continue with", "Today") is `Separator` Show label (Show start
  line off puts the label at the start), never a hand-drawn row. Example "Separator styles".

## Anatomy
Header (title `body/large`, optional description `body/small` muted, optional action top right)
→ content → optional footer with actions.

## Variants and sizes
| Variant | Looks | Use |
|---|---|---|
| `default` | Card background, border | Most cards |
| `outline` | No fill, border | Cards inside a panel, a dialog or another surface; long lists of cards |
| `muted` | Tinted (`card/muted-background`), no border | Secondary or summary information, empty and placeholder cards, side notes |
| `inverted` | `bg-foreground text-background` (near white in Dark) | One card per view that must stand out |

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
  ring and no other buttons inside except a menu. Otherwise, make the title the link. Cards that
  are one link use `Card` State=hover and focus; Media=top (a full-bleed 16:9 image) for picture
  tiles.
- Cards in a grid have equal height per row and the same structure, so the eye can scan.
- Footer actions follow button rules: one primary at most, usually none in a grid of cards.
- Metric cards: label (`body/small` muted), value (`heading/h2`, one line), change with direction
  in text and icon, not color alone.
- Selectable cards (plan, delivery, billing period) use Option Card: the whole card is the target, one selected.
  Option Card Layout=media for visual pickers (theme, template), compact for short lists in
  dialogs.
- Card Header `Show icon` names the card type on dashboards; give every card in a row an icon or none.
- Stat Card: the change Badge is exposed: set its Label and Variant per instance. It is soft and its
  tone follows meaning (up success, down destructive, flat neutral; churn down = soft-success).
  Trend sets the icon and sparkline; `Show sparkline` adds a chart/1 trend under the value.
- Stat Card Layout: `vertical` (default), `compact` (Icon Tile + value) for dense rows and
  sidebars, `horizontal` (sparkline on the right) when the trend shape matters. One Layout per row.
- Inverted Card: inside it use `background/default` text and `secondary` or `outline` Buttons,
  never `default`. Content already placed in a slot keeps its own colors when an instance is
  switched to inverted: recolor it.
- Red text on a card (the Danger zone title) is `background/destructive`; `foreground/destructive`
  is only for text on a red fill.

## Figma
- `Card` (Variant × Size × Elevation, 16 variants) = native slots Header (`Card Header`), Content (placeholder) and Footer (`Card Footer`).
  Fill the slots in the instance; never detach. Turn off Show header / Show footer when unused.
- `Card Header` has its own Action slot (top right): Button Icon with a menu, a Badge, a Select.
- `Stat Card` (Trend up, down, neutral × Layout vertical, compact, horizontal) for dashboards; `Option Card` for selectable options.
- `Entity Card` for one object in a grid or board (customer, project, vendor): leading avatar or
  icon, title (2 lines), subtitle (1 line), menu, tags, 2-4 details, footer with people and last
  update. Fill Details with the attributes marked "card" in `objects.md`. Leading takes a 1:1
  image for products and media. The Actions slot (Show actions) holds the one direct action
  people take on every card (add to a selection, remove, pin); a toggled action shows its state:
  plus to add, check (`secondary`) once added, with State=selected. Everything else goes in the
  menu.
- `Person Card` for one person (author, expert, speaker, contact): Avatar, Name, Role,
  Organization, expertise Badges, contact as Meta Items, optional actions. `vertical` in grids of
  3-4, `horizontal` in asides. `photo` (a 3:4 photo above name and role, no surface) for team and
  speaker pages; turn Show tags and Show contact off unless it is a directory. A record with
  details and status stays an Entity Card.
- `Event Card` for one event in a list (`horizontal`) or grid (`vertical`, with image):
  `Date Tile`, format badges, title, time with time zone and place as Meta Items, one action (Register,
  Join waitlist, Watch recording). Sorted by date; past events in their own list.
- `Progress Card` for a goal against a target; Status on-track / at-risk / off-track names the
  state in text; say the rule behind it in the footnote or a tooltip.
- Examples on the Card page: "Examples / cards", "Examples / stat cards", "customer card",
  "people directory", "plan choice", "quarter goal", "events grid".
- `Stress test / Card` (Stress tests section): minimal, typical, long title, full-bleed slot,
  280 and 720 wide, for every variant, sm, Dark, Compact and Corporate Light.
- `Entity Card` Show people hides the Avatar Group in the footer when people do not matter for the
  object.
- To suggest one thing (upgrade, tip, announcement) use `Callout Card`: Layout=horizontal in
  content, stacked in sidebars, one primary action and a dismiss that is remembered (Show close).
  Media slot for an Icon Tile or a Spot Illustration. Example "Callout Card".
- `Product Card` (rules in `patterns/commerce.md`): Show swatches when the product comes in
  colors (4 max); Size=sm for dense grids and Mini Cart recommendations. Example "Product Card
  styles".
- `Link Preview` shows a pasted URL as a card in comments, chat and notes. `Location Card` shows an
  office, store or venue with address, phone, hours and directions; grids of 3 or next to a `Map`.
