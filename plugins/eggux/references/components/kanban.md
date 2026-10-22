# Kanban

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Kanban Card](#kanban-card) | 3 | - |
| [Kanban Column](#kanban-column) | 1 | Cards |

On the Figma page: "Example / in kanban board", "Stress test / Kanban Card", "Stress test / Kanban Column"

## Kanban Card

Component set · 3 variants · default size 272 × 114

Task or deal card on a board: labels (max 2-3), title, due date, comments, assignee. dragging = lifted (shadow/lg, slight tilt) while moving. Click opens the item in a Sheet; keyboard: Space to pick up, arrows to move, Space to drop.

**Use for**

- Items that move through stages: tasks, deals, tickets, candidates
- Inside a Kanban Column
- Sales pipelines and support queues on a board view

**Not for**

- Finding and bulk-editing items: use a table of Table Cells or a list view
- Dated tasks with dependencies: use Gantt

**Anatomy**

1. Labels (Show labels)
2. Title
3. Due date (Show meta)
4. Comments count
5. Assignee Avatar

**Content and behavior**

- Max 2-3 labels
- State: default, hover, dragging (lifted with shadow/lg and a slight tilt)
- Click opens the item in a Sheet
- Each card has a "Move to..." menu
- Never delete on drop

**Accessibility**

- Keyboard: Space picks up, arrows move, Space drops; announce the new column and position
- Labels carry text, not only color
- The card is a focusable button named by its title

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

Code: dnd-kit + custom

## Kanban Column

Component · 1 variant · default size 296 × 466

One stage of a board (To do, In progress, Review, Done). Count in the header; WIP limit shown as "3 / 5" and warning when exceeded. Columns scroll vertically; the board scrolls horizontally.

**Use for**

- Each stage of a workflow, in order
- Boards with WIP limits per stage
- Pipelines: Lead, Qualified, Proposal, Won, Lost

**Not for**

- Groups without an order: use a list grouped by header
- Dates on a time axis: use Calendar Event in Block / Scheduler Week or Gantt Bar

**Anatomy**

1. Title
2. Count (Badge Count), or "3 / 5" with a WIP limit
3. Header actions (Button Icon)
4. Cards slot of Kanban Cards
5. Add card (Button)

**Content and behavior**

- Count in the header; WIP limit shown as "3 / 5" and a warning when exceeded
- Columns scroll vertically; the board scrolls horizontally
- Moving to a final stage (Done, Lost) may ask for a reason
- Always offer a list or table view of the same items

**Accessibility**

- Column is a labeled region named by its title and count
- WIP warning is text, not only color
- Drop placeholder shows where the card lands

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

Code: dnd-kit + custom
