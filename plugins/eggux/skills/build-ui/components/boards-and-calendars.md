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
  App page. Month view: `Calendar` with event dots, or a grid of days with up to 3 events + "+2 more".
