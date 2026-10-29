# Kanban

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Kanban Card](#kanban-card) | 3 | - |
| [Kanban Column](#kanban-column) | 3 | Cards |

On the Figma page: "Example / Kanban styles", "Example / in kanban board", "Stress test / Kanban Card", "Stress test / Kanban Column"

## Kanban Card

Component set · 3 variants · default size 272 × 114

Task or deal card on a board: labels (max 2-3), title, due date, comments, assignee. dragging = lifted (shadow/lg, slight tilt) while moving. Click opens the item in a Sheet; keyboard: Space to pick up, arrows to move, Space to drop.
Needs at least 224; in narrower places show the task as a List row instead.


Show cover: a 16:9 image at the top (exposed Image Placeholder) for content, design and marketing boards. Show priority: an exposed Badge sm before the due date (High in soft-destructive, Medium soft-warning, Low soft-neutral); show it only when priority drives the order.


Usage: eggux build-ui/components/kanban.md

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
6. Cover image (Show cover, exposed Image Placeholder 16:9)
7. Priority Badge sm (Show priority, exposed): High soft-destructive, Medium soft-warning, Low soft-neutral

**Content and behavior**

- Max 2-3 labels
- State: default, hover, dragging (lifted with shadow/lg and a slight tilt)
- Click opens the item in a Sheet
- Each card has a "Move to..." menu
- Never delete on drop
- Resize: min width 224; labels wrap to more lines; title up to 3 lines; due date hugs up to 80 and the comment count up to 28, both 1 line with ellipsis
- Covers only on visual boards (content, design, marketing); never on every card of a dense board
- Priority only when it drives the order; text in the badge, not color alone

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
| Show cover | boolean | false |
| Show priority | boolean | false |

Built from: `Avatar`, `Badge`, `Image Placeholder`. Icons: calendar, inbox

Tokens and styles:
- Colors: `background/card`, `border/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`
- Effects: `shadow/lg`, `shadow/xs`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: card `min-w-56`, labels `flex flex-wrap`, title `line-clamp-3`, due `truncate max-w-20`; column `min-w-64 shrink-0`, title `min-w-0 flex-1 truncate` (Board scrolls horizontally (`overflow-x-auto`))

## Kanban Column

Component set · 3 variants · default size 296 × 466

One stage of a board (To do, In progress, Review, Done). Count in the header; Show limit adds the WIP limit as text after the count ("Limit 5"); when the count passes it, set the count Badge Count Variant=destructive. State: default; drop-target (accent fill and a dashed 2 px ring while a card is dragged over it); collapsed (48 wide: count and the title turned 90 degrees, cards hidden; for Done and other columns people rarely open). Columns scroll vertically; the board scrolls horizontally.
Needs at least 256 (a 224 card plus padding) unless collapsed; the board scrolls sideways instead of squeezing columns.


Usage: eggux build-ui/components/kanban.md

**Use for**

- Each stage of a workflow, in order
- Boards with WIP limits per stage
- Pipelines: Lead, Qualified, Proposal, Won, Lost

**Not for**

- Groups without an order: use a list grouped by header
- Dates on a time axis: use Calendar Event in Block / Scheduler Week or Gantt Bar

**Anatomy**

1. Title: fills the header, 1 line with ellipsis (count and actions sit at the right)
2. Count (Badge Count) and the WIP limit (Show limit, Limit text "Limit 5")
3. Header actions (Button Icon)
4. Cards slot of Kanban Cards
5. Add card (Button)
6. State: default, drop-target (background/accent, dashed 2 px border/ring), collapsed (48 wide: count and title turned 90 degrees, cards hidden)

**Content and behavior**

- Count in the header; with Show limit, set the count Badge Count to Variant=destructive when it passes the limit
- Columns scroll vertically; the board scrolls horizontally
- Moving to a final stage (Done, Lost) may ask for a reason
- Always offer a list or table view of the same items
- Resize: min width 256; the title fills and stays on 1 line with ellipsis, the count and actions keep their size at the right
- drop-target only while a card is dragged over the column
- Collapse columns people rarely open (Done, Archived); the count stays visible
- Resize: collapsed is 48 wide and hugs its height

**Accessibility**

- Column is a labeled region named by its title and count
- WIP warning is text, not only color
- Drop placeholder shows where the card lands
- Collapsed columns are buttons named "<Title>, <n> cards, expand"
- Drop target is announced ("Over In progress") during keyboard moves

| Variant property | Values |
|---|---|
| State | default, drop-target, collapsed |

| Property | Type | Default |
|---|---|---|
| Title | text | In progress |
| Limit | text | Limit 5 |
| Show limit | boolean | false |

Slots (fill them in the instance, never detach): `Cards`

Built from: `Badge Count`, `Button`, `Button Icon`, `Kanban Card`

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `ui/caption`, `ui/label`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: card `min-w-56`, labels `flex flex-wrap`, title `line-clamp-3`, due `truncate max-w-20`; column `min-w-64 shrink-0`, title `min-w-0 flex-1 truncate` (Board scrolls horizontally (`overflow-x-auto`))
