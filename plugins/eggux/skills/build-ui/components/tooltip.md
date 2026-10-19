# Tooltip and Popover

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Component | Use |
|---|---|
| `Tooltip` | Name of an icon-only button, or a short hint (one line). Plain text only |
| `HoverCard` | Preview of an object on hover (user, linked record). Never the only way to get it |
| `Popover` | Interactive content on click: a small form, a picker, filter options |

## Rules
- Every icon-only button has a tooltip with the same text as its accessible label.
- Tooltips appear on hover and on keyboard focus, after a short delay, and never contain links
  or buttons.
- Do not hide information the user needs to complete the task in a tooltip; put it on the page.
- Touch devices have no hover: anything in a tooltip must also be reachable another way.
- A Popover closes on Escape and outside click and returns focus to its trigger.

## Figma
`Tooltip` with `Side` = where it sits relative to the trigger (the arrow points at the trigger).
See the "icon button with tooltip" example.
