# Tooltip and Popover

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Component | Use |
|---|---|
| `Tooltip` | Name of an icon-only button, or a short hint (one line). Plain text only |
| `Info Tip` | A definition or short explanation on click (i icon): Field Show info, table headers, stat labels |
| `HoverCard` | Preview of an object on hover (user, linked record). Never the only way to get it |
| `Popover` | Interactive content on click: a small form, a picker, filter options |

## Rules
- Every icon-only button has a tooltip with the same text as its accessible label.
- Tooltips appear on hover and on keyboard focus, after a short delay, and never contain links
  or buttons.
- Do not hide information the user needs to complete the task in a tooltip; put it on the page.
- Touch devices have no hover: anything in a tooltip must also be reachable another way.
  Definitions people may need on touch use `Info Tip` (click), not Tooltip (hover).
- A Popover closes on Escape and outside click and returns focus to its trigger.

## Figma
`Tooltip` with `Side` = where it sits relative to the trigger (the arrow points at the trigger).
See the "icon button with tooltip" example.
- Variant=default (primary fill) is the standard. Variant=light (popover surface, border, shadow)
  for dense data screens, charts and editors where a filled tooltip is too loud, and over dark or
  colored areas. One Variant per product. Example "Tooltip styles".
- Show shortcut adds a Kbd after the text ("Search ⌘K"). Show title makes a rich tooltip: a title
  and up to three lines, wrapping at 280. Still no links or buttons: those need a Popover. Example
  "rich tooltip and shortcut".
- `Info Tip Trigger` (State default, hover, focus, open) opens `Info Tip` (Side bottom or top;
  Title, Text, Show link for "Learn more"). One Info Tip per label; text over 3 lines belongs on
  the page. Example "Info Tip" on the Tooltip page.
