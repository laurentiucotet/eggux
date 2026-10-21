# Scheduler

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Calendar Event](#calendar-event) | 8 | - |
| [Gantt Bar](#gantt-bar) | 4 | - |
| [Gantt Milestone](#gantt-milestone) | 1 | - |

## Calendar Event

Component set · 8 variants · default size 146 × 46

Event in day/week views: card surface with a left bar in the calendar's category color (chart/1..4 = one per calendar or type, with a legend). Height = duration; compact for 30 min or less. Overlaps sit side by side. Click opens details in a Popover or Sheet.

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
