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

## Rules
- A whole card is clickable only when it has one destination. Then it has a hover state, a focus
  ring and no other buttons inside except a menu. Otherwise, make the title the link.
- Cards in a grid have equal height per row and the same structure, so the eye can scan.
- Footer actions follow button rules: one primary at most, usually none in a grid of cards.
- Metric cards: label (`body/small` muted), value (`heading/h2`, one line), change with direction
  in text and icon, not color alone.
- Selectable cards (plan, visit type) use Option Card: the whole card is the target, one selected.

## Figma
- `Card` = native slots Header (Card Header), Content (placeholder) and Footer (Card Footer).
  Fill the slots in the instance; never detach. Turn off Show header / Show footer when unused.
- `Card Header` has its own Action slot (top right): Button Icon with a menu, a Badge, a Select.
- `Stat Card` (Trend up, down, neutral) for dashboards; `Option Card` for selectable options.
- Examples on the Card page: list, profile, form, empty state, stat cards row.
