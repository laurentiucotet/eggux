# Scheduler

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Calendar Event](#calendar-event) | 24 | - |
| [Gantt Bar](#gantt-bar) | 4 | - |
| [Gantt Milestone](#gantt-milestone) | 1 | - |
| [Agenda Item](#agenda-item) | 3 | - |
| [Meeting Card](#meeting-card) | 2 | - |
| [Availability Row](#availability-row) | 2 | - |
| [Time Slot](#time-slot) | 4 | - |

On the Figma page: "Example / Calendar Event styles", "Example / in agenda", "Example / in booking", "Example / in gantt", "Stress test / Agenda Item", "Stress test / Availability Row", "Stress test / Calendar Event", "Stress test / Gantt Bar", "Stress test / Meeting Card", "Stress test / Time Slot"

## Calendar Event

Component set · 24 variants · default size 146 × 46

Event in day/week views: card surface with a left bar in the calendar's category color (chart/1..4 = one per calendar or type, with a legend). Height = duration; compact for 30 min or less. Overlaps sit side by side. Click opens details in a Popover or Sheet.


State (Size=default): selected (2 px border/ring outline while its details are open), dragging (shadow/lg while it moves to another time; show the new time in Time). Status (Size=default): tentative (dashed outline in the calendar color on the page background, for invites not yet answered or holds), cancelled (muted fill, title struck through and muted; keep it visible until the day passes). Confirmed is the default.


Usage: eggux build-ui/components/scheduler.md

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
5. State (Size=default): default, selected (2 px border/ring outline), dragging (shadow/lg)
6. Status (Size=default): confirmed, tentative (dashed outline in the calendar color, background/default), cancelled (card/muted-background, title at 70%)

**Content and behavior**

- Height = duration; 30 min or less uses Size=compact
- Category color = one calendar or type, with a legend; never the only signal
- Overlapping events sit side by side
- Month view: up to 3 per day, then "+N more" opens the day in a Popover
- Click opens details in a Popover or Sheet; confirm moves that notify others
- Resize: the event clips to its time slot; title 1 line with an ellipsis; time 1 line (Size=default fills, Size=sm hugs next to the title)
- Selected while its details are open; one selected event at a time
- Dragging shows the new time in Time while moving
- Tentative for invites not answered and holds; cancelled stays visible until the day passes, never deleted silently
- Cancelled is not shown by color only: say "Cancelled" in the details and strike the title in code

**Accessibility**

- Each event is focusable and its name includes title, date and time
- Moving and resizing also work without drag, from the event details
- The calendar or type is written in the details, not only shown by color
- Status is part of the event name: "Weekly sync, cancelled, 16:00 to 16:30"
- Cancelled text keeps 4.5:1: title 7.3:1 Light, time 4.54:1 Light

| Variant property | Values |
|---|---|
| Size | default, sm |
| Series | 1, 2, 3, 4 |
| State | default, selected, dragging |
| Status | confirmed, tentative, cancelled |

| Property | Type | Default |
|---|---|---|
| Title | text | Design review |
| Time | text | 11:00 - 12:30 |

Tokens and styles:
- Colors: `background/card`, `background/default`, `border/ring`, `card/muted-background`, `chart/1`, `chart/2`, `chart/3`, `chart/4`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Text styles: `ui/caption`, `ui/label-small`
- Effects: `shadow/lg`, `shadow/xs`

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

- Stages without dates: use Kanban Card in a Kanban Column
- Meetings and bookings: use Calendar Event in the scheduler
- Mobile: a list grouped by phase with dates; the timeline is desktop only

**Anatomy**

1. Bar: tinted fill with a colored edge
2. Status icon: check (done), circle-alert (blocked)
3. Label: task name, truncates
4. Progress line along the bottom
5. Gantt Milestone: diamond on the date with its Label

**Content and behavior**

- Status is planned, in-progress, done or blocked; planned is dashed
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
| Status | planned, in-progress, done, blocked |

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

## Agenda Item

Component set · 3 variants · default size 400 × 54

One event in a day agenda (dashboard "Today", side panel, mobile): start and end, a color bar for the calendar, title, place and people. now is highlighted with a Now badge; past is muted. Sort by start time; all-day events on top. The row opens the event.

**Use for**

- "Today" on a dashboard
- An agenda in a side panel or on mobile
- The events of the day picked in a Calendar

**Not for**

- Events placed on a day or week time grid: use Calendar Event
- A meeting people are about to join, with Join: use Meeting Card
- Public events with an image and registration: use Event Card

**Anatomy**

1. Time: start (ui/label) over end (ui/caption, muted)
2. Color bar: the color of the calendar
3. Title: ui/label, one line; Now Badge when State=now
4. Meta: place and people, body/small, muted ("Room 2 · 4 people")

**Content and behavior**

- Sort by start time; all-day events go on top with "All day" in place of the times
- State=now highlights the running event with a Now badge; past events are muted, never hidden
- Title stays on one line and truncates; the event page shows it in full
- The color bar never carries meaning alone: the calendar name is in the event and in the legend
- The whole row opens the event; no buttons inside the row

**Accessibility**

- The row is one link or button named by title, time and place ("Weekly cash review, 09:30 to 10:15, Room 2")
- Times in <time datetime>; the list is a ul with an aria-label ("Today")
- Muted past rows still meet 4.5:1

| Variant property | Values |
|---|---|
| State | upcoming, now, past |

| Property | Type | Default |
|---|---|---|
| Title | text | Weekly cash review |
| Start | text | 09:30 |
| End | text | 10:15 |
| Meta | text | Room 2 · 4 people |

Built from: `Badge`

Tokens and styles:
- Colors: `background/accent`, `border/default`, `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/full`, `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: custom `<li>` with `<time>` pairs; shadcn `Card` + `Meta Item`, `Avatar` group, `Button` (Join is an `<a>` to the meeting URL; live from 5 min before the start)

## Meeting Card

Component set · 2 variants · default size 360 × 212

A meeting people are about to join: title, time with time zone, place or video link, who is invited, Join. live from 5 minutes before the start (Join becomes primary). In a dashboard, a record's activity or a notification. Recurring meetings say so in the time line.


Needs at least 240.

**Use for**

- The next meeting on a dashboard
- A call in the activity of a record (a customer, a deal)
- A meeting reminder in a notification panel

**Not for**

- A row in a day list: use Agenda Item
- A block on a day or week grid: use Calendar Event
- Public events with registration: use Event Card

**Anatomy**

1. Title: one line, two at most
2. Meta Items: time with time zone, place or video link
3. People: Avatar Group of the invitees
4. Actions: Join Button (primary when State=live) and Details Button

**Content and behavior**

- State=live from 5 minutes before the start until the end; Join becomes primary
- The time line says day, start and end, and time zone ("Tue 22 Oct · 14:00-15:00 EET"); recurring meetings say so ("Weekly")
- Place is a room or the video provider ("Google Meet"), never a raw URL
- Avatar Group shows up to 4 people, then +N; the organizer first
- Ended meetings leave the dashboard; in a record they stay with a link to notes
- Resize: the title wraps to 2 lines with an ellipsis
- Needs at least 240

**Accessibility**

- The card is an article with the title as its heading
- Join is a link named with the meeting ("Join Q4 planning with Northwind")
- The live state is in text ("Starting now"), never color alone
- Times in <time datetime>

| Variant property | Values |
|---|---|
| State | upcoming, live |

| Property | Type | Default |
|---|---|---|
| Title | text | Q4 planning with Northwind |

Built from: `Avatar Group`, `Badge`, `Button`, `Meta Item`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/5`
- Radius: `radius/xl`
- Text styles: `body/large`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md)

Code: custom `<li>` with `<time>` pairs; shadcn `Card` + `Meta Item`, `Avatar` group, `Button` (Join is an `<a>` to the meeting URL; live from 5 min before the start)

## Availability Row

Component set · 2 variants · default size 560 × 53

Working hours for one weekday in booking and team settings: on/off, the day, one or more time ranges, add a range. Seven rows, Monday first unless the locale starts on Sunday. Overlapping ranges merge on save; the time zone is said once above the list.

**Use for**

- When people can book you (booking settings)
- Team or support hours
- Opening hours of a location

**Not for**

- One on/off setting: use Setting Row
- Picking one time: use Time Picker
- Days off and holidays: use Date Range Picker

**Anatomy**

1. Switch: available on this day
2. Day: ui/label
3. Hours: start Select, a separator, end Select
4. Add range: Button Icon (plus)

**Content and behavior**

- Seven rows, Monday first unless the locale starts on Sunday
- State=unavailable hides the hours and says "Unavailable"
- Times in 15 or 30 minute steps; the end is after the start; overlapping ranges merge on save
- Extra ranges stack under the first, each with a remove button
- The time zone is said once above the list; "Copy to all days" in the header saves repeat work
- Resize: the row wraps; under about 430 the hours (two Selects and the add button) drop under the switch and day

**Accessibility**

- The Switch is labelled with the day ("Available on Monday")
- The Selects are labelled "Monday start" and "Monday end"; Add range has aria-label "Add hours on Monday"
- Errors show under the row and are linked with aria-describedby

| Variant property | Values |
|---|---|
| State | available, unavailable |

| Property | Type | Default |
|---|---|---|
| Day | text | Monday |

Built from: `Button Icon`, `Select`, `Switch`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `body/small`, `ui/label`

Guides: [booking](../../skills/build-ui/patterns/booking.md)

Code: custom (`flex flex-wrap gap-y-2`; hours group `shrink-0`)

## Time Slot

Component set · 4 variants · default size 112 × 36

One bookable start time in a booking flow: a grid of slots under the chosen day, 3-4 per row. selected is primary; taken slots are disabled with a strikethrough, or hidden when most are free. Show the time zone above the grid and the length of the slot ("30 min").

**Use for**

- Booking a call, a demo or an appointment
- A delivery or pickup window
- Rescheduling a booking

**Not for**

- A time people pick freely: use Time Picker
- Picking the day: use Calendar
- A few options that need more text: use Option Card

**Anatomy**

1. Time: ui/label, centered ("09:30")
2. State: default, hover, selected (primary), disabled (strikethrough)

**Content and behavior**

- Grid of 3-4 slots per row under the chosen day; one selected at a time
- Taken slots are disabled with a strikethrough, or hidden when most slots are free
- Show the time zone above the grid and the length of a slot ("30 min")
- A day with no free slots says so and links to the next free day
- A slot taken during checkout: explain and show the nearest free slots

**Accessibility**

- The grid is a radiogroup; each slot has role="radio" and aria-checked; arrow keys move
- Disabled slots have aria-disabled and "unavailable" in the name
- The footer repeats the choice in text ("Tue, 22 Oct · 09:30"), so the state is not color alone

| Variant property | Values |
|---|---|
| State | default, hover, selected, disabled |

| Property | Type | Default |
|---|---|---|
| Time | text | 09:30 |

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `border/input`, `foreground/default`, `foreground/primary`
- Spacing and size: `density/control-height`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [booking](../../skills/build-ui/patterns/booking.md)

Code: shadcn `ToggleGroup type="single"` (or `RadioGroup`) of outline `Button`s (Times from the availability API; time zone above the grid)
