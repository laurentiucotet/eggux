# Kanban and Scheduler

Usage guidelines only. Visual specs live in the Figma components (Kanban, Scheduler pages).

## Kanban
- For items that move through stages (tasks, deals, tickets, candidates). Always offer a list or
  table view too: boards show flow, lists help find and bulk-edit.
- Columns = stages in order, with count (and WIP limit "3 / 5" when used). Cards show only what
  helps decide the next move: labels (2-3), title, due date, assignee, comments.
- Drag and drop with a lifted card and a drop placeholder; keyboard alternative (Space to pick
  up, arrows to move, Space to drop) and a "Move to…" menu on each card.
- Moving to a final stage (Done, Lost) may ask for a reason; never delete on drop.
- Figma: `Kanban Card` (State: default, hover, dragging), `Kanban Column` (Cards slot),
  `Block / Kanban Board` on the App page.

## Scheduler (day / week)
- For bookings, shifts, meetings and rooms. Toolbar: Today, previous / next, range title,
  Day / Week / Month, New event.
- Show working hours by default (scroll for the rest), today marked, current-time line, weekend
  muted. Events sized by duration; 30 min or less use the compact event.
- Event color = calendar or type (`chart/1..4`) with a legend, never the only signal; overlapping
  events sit side by side.
- Click an empty slot to create, drag to move or resize; confirm moves that notify others.
- Time zone visible when users or attendees can be in different zones.
- Mobile: day view with a week strip.
- Figma: `Calendar Event` (Size × Category) on the Scheduler page, `Block / Scheduler Week` on the
  App page.

## Gantt (project timeline)
- For projects with dependencies and dates (launches, implementations, construction). For
  stages without dates use Kanban; for appointments use the Scheduler.
- Task list on the left (grouped by phase, owner), timeline on the right; both scroll together.
- Bars from start to end date with progress; milestones as diamonds; finish-to-start
  dependencies as arrows that never point backwards; a today line.
- Status is written in the list and shown on the bar with an icon (done, blocked), never color
  alone; blocked tasks are counted in the header.
- Zoom: Week, Month, Quarter; Today scrolls to now.
- Drag to move, drag edges to resize, with a tooltip showing the new dates; moving a task with
  dependents asks whether to move them too.
- Mobile: list view grouped by phase with dates; the timeline is desktop only.
- Figma: `Gantt Bar` (Status), `Gantt Milestone` on the Scheduler page; `Block / Gantt` on the App page.

## Month view
- For planning and an overview of busy days. Up to 3 events per day (compact `Calendar Event`),
  then "+N more" that opens the day in a Popover.
- Today marked, days of other months muted, weekends muted when the product works on weekdays.
- Click a day to open the day view or create an event; drag events between days.
- Mobile: a small `Calendar` with event dots and the list of the selected day under it.
- Figma: `Block / Scheduler Month` on the App page.

## Related components
- Switch between list, board and calendar views of the same records with `View Switcher`; keep the
  view in the URL and keep filters on switch.
- Day lists outside the grid use `Agenda Item` (sorted by start, all-day on top, State=now and
  past). A meeting people are about to join uses `Meeting Card`, with Join primary from 5 minutes
  before the start.
