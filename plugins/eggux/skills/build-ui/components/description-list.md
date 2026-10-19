# Description List and Timeline

Usage guidelines only. Visual specs live in the Figma components.

## Description List (record details)
- Use for read-only facts about one object: customer, order, invoice, settings summary.
- Labels are short nouns in sentence case; values are the data, never repeated labels.
- Horizontal (label column 160) in cards and sheets; vertical in narrow columns and grids of 2-3.
- Empty value: "Not set" or "-" in muted, plus an action when the user can fill it.
- Statuses and categories are Badges in the Value slot; people are Avatar + name; long values wrap.
- Edit: one "Edit" action per card that turns the card into a form (or opens a Sheet), not a pencil
  per row, unless rows are edited independently (inline edit, see `table.md`).
- Figma: `Description List Item` Orientation × Label, Divider (off on the last row), Value slot.
- Code: `<dl>` with `<dt>`/`<dd>` and Tailwind grid, no shadcn component.

## Timeline (activity, history)
- Newest first. One event per item: what happened (title), who / where (description), when.
- Tone marks the outcome: success, destructive (failed), primary (created/booked), default (info).
- Time: relative under 24 h ("2 h ago"), then absolute ("22 Oct, 10:30"); full timestamp in a
  tooltip. Group by day for long histories.
- The Content slot holds a note excerpt, attachment or diff; link to the object when there is one.
- Long histories: show the last 5-10 with "View all".
- Figma: `Timeline Item` Tone × Title, Time, Description, Icon, Connector (off on the last),
  Content slot (Show content).
