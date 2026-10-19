# Card

Usage guidelines only. Visual specs live in the Figma component.

## Use
- To group content about one object or one topic, on a surface (`background/card`) distinct
  from the page.
- Object cards show the attributes marked "card" in `objects.md`, in that order.
- Do not nest cards in cards. Inside a card, separate groups with spacing or a `Separator`.

## Anatomy
Header (title `heading/h4`, optional description `body/small` muted, optional action top right)
→ content → optional footer with actions.

## Rules
- A whole card is clickable only when it has one destination. Then it has a hover state, a focus
  ring and no other buttons inside except a menu. Otherwise, make the title the link.
- Cards in a grid have equal height per row and the same structure, so the eye can scan.
- Footer actions follow button rules: one primary at most, usually none in a grid of cards.
- Metric cards: label (`ui/caption`), value (`heading/h2`), change with direction in text or
  icon, not color alone.
