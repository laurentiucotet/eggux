# Dropdown menu

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Actions on an object when there are more than one or two (row actions, "More" in a header).
- Not for choosing a value in a form (use `Select`) and not for navigation with many levels.

## Rules
- Items are verbs, in the client's terminology: "Edit", "Duplicate", "Archive".
- Order: most frequent first, destructive last, separated by a `Separator` and in the destructive style.
- Show only actions the actor is permitted (`actors.md`). Disabled items only when the reason is
  useful to know, with the reason shown.
- Items that open a dialog end with "..." ("Rename...").
- Shortcuts shown on the right when they exist.
- Trigger: ghost icon button with an accessible label that names the object ("Actions for Invoice #1042").
- Keyboard: arrows move, Enter selects, Escape closes and returns focus to the trigger.

## Figma
`Menu` holds `Menu Item`, `Menu Label` and `Menu Separator` instances in its native slot `Items`.
A highlighted destructive item uses a filled `background/destructive` row with white text, because
red text on a light red tint fails contrast.
