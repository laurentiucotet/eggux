# Kanban

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Kanban Card](#kanban-card) | 3 | - |
| [Kanban Column](#kanban-column) | 1 | Cards |

## Kanban Card

Component set · 3 variants · default size 272 × 114

Task or deal card on a board: labels (max 2-3), title, due date, comments, assignee. dragging = lifted (shadow/lg, slight tilt) while moving. Click opens the item in a Sheet; keyboard: Space to pick up, arrows to move, Space to drop.

| Variant property | Values |
|---|---|
| State | default, hover, dragging |

| Property | Type | Default |
|---|---|---|
| Title | text | Redesign the onboarding checklist |
| Due date | text | 24 Oct |
| Show labels | boolean | true |
| Show meta | boolean | true |

Built from: `Avatar`, `Badge`. Icons: calendar, inbox

Tokens and styles:
- Colors: `background/card`, `border/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`
- Effects: `shadow/lg`, `shadow/xs`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

## Kanban Column

Component · 1 variant · default size 296 × 466

One stage of a board (To do, In progress, Review, Done). Count in the header; WIP limit shown as "3 / 5" and warning when exceeded. Columns scroll vertically; the board scrolls horizontally.

| Property | Type | Default |
|---|---|---|
| Title | text | In progress |

Slots (fill them in the instance, never detach): `Cards`

Built from: `Badge Count`, `Button`, `Button Icon`, `Kanban Card`

Tokens and styles:
- Colors: `background/muted`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `ui/label`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)
