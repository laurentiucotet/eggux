# Scheduler

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Calendar Event](#calendar-event) | 8 | - |
| [Gantt Bar](#gantt-bar) | 4 | - |
| [Gantt Milestone](#gantt-milestone) | 1 | - |

On the Figma page: "Example / in gantt", "Example / in scheduler week", "Stress test / Calendar Event", "Stress test / Gantt Bar"

## Calendar Event

Component set · 8 variants · default size 146 × 46

Event in day/week views: card surface with a left bar in the calendar's category color (chart/1..4 = one per calendar or type, with a legend). Height = duration; compact for 30 min or less. Overlaps sit side by side. Click opens details in a Popover or Sheet.

**Use for**

- Meetings, shifts, bookings and rooms in day or week views
- Month view cells: Size=compact, up to 3 per day
- One Category per calendar or event type, with a legend

**Not for**

- Items that move through stages without dates: use Kanban Card
- Tasks with dependencies over weeks: use Gantt Bar
- Picking a single date: use Calendar or Date Picker

**Anatomy**

1. Card surface: background/card, shadow/xs
2. Left bar in the category color (Category 1-4 = chart/1 to chart/4)
3. Title
4. Time range ("11:00 - 12:30")

**Content and behavior**

- Height = duration; 30 min or less uses Size=compact
- Category color = one calendar or type, with a legend; never the only signal
- Overlapping events sit side by side
- Month view: up to 3 per day, then "+N more" opens the day in a Popover
- Click opens details in a Popover or Sheet; confirm moves that notify others

**Accessibility**

- Each event is focusable and its name includes title, date and time
- Moving and resizing also work without drag, from the event details
- The calendar or type is written in the details, not only shown by color

| Variant property | Values |
|---|---|
| Size | default, compact |
| Category | 1, 2, 3, 4 |

| Property | Type | Default |
|---|---|---|
| Title | text | Design review |
| Time | text | 11:00 - 12:30 |

Tokens and styles:
- Colors: `background/card`, `chart/1`, `chart/2`, `chart/3`, `chart/4`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Text styles: `ui/caption`, `ui/label-small`
- Effects: `shadow/xs`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: custom grid, or FullCalendar themed with tokens

## Gantt Bar

Component set · 4 variants · default size 200 × 28

A task on a Gantt timeline. Width = duration, left edge = start. Tinted fill with a colored edge; the bottom line shows progress (resize "progress"). Status is also an icon (done, blocked), planned is dashed. Labels truncate; full name in the task list and on hover.

**Use for**

- Projects with dates and dependencies: launches, implementations, rollouts
- Timeline on the right of a task list grouped by phase or owner
- Gantt Milestone for zero-length events: sign-off, review, launch

**Not for**

- Stages without dates: use Kanban
- Meetings and bookings: use Calendar Event in the scheduler
- Mobile: a list grouped by phase with dates; the timeline is desktop only

**Anatomy**

1. Bar: tinted fill with a colored edge
2. Status icon: check (done), circle-alert (blocked)
3. Label: task name, truncates
4. Progress line along the bottom
5. Gantt Milestone: diamond on the date with its Label

**Content and behavior**

- Status is planned, in progress, done or blocked; planned is dashed
- Status is also an icon and written in the task list, never color alone
- Labels truncate; the full name is in the task list and on hover
- Dependencies are finish-to-start arrows that never point backwards
- Drag moves, edges resize, with a tooltip showing the new dates

**Accessibility**

- Each bar is focusable and its name includes task, dates, status and progress
- Dates can be edited in the task list, without drag
- Blocked uses background/destructive plus the icon and the word

| Variant property | Values |
|---|---|
| Status | planned, in progress, done, blocked |

| Property | Type | Default |
|---|---|---|
| Label | text | Visual design |

Icons: check, circle-alert

Tokens and styles:
- Colors: `background/destructive`, `border/input`, `chart/1`, `chart/6`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/7`
- Radius: `radius/md`
- Text styles: `ui/caption`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: SVAR Gantt, Frappe Gantt, or a custom grid with dnd-kit

## Gantt Milestone

Component · 1 variant · default size 104 × 16

A zero-length event on a Gantt timeline (sign-off, review, launch): diamond on the date with its name.

| Property | Type | Default |
|---|---|---|
| Label | text | Design review |

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
- Text styles: `ui/caption`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: SVAR Gantt, Frappe Gantt, or a custom grid with dnd-kit
