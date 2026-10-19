# Tabs

Usage guidelines only. Visual specs live in the Figma component.

## Use
- To switch between views of the same object or the same context (Overview, Appointments, Invoices).
- Not for steps in a sequence (use a stepper) and not for primary navigation (use the sidebar or nav).
- 2 to 6 tabs. More means the content needs a different structure.

## Rules
- Labels are one or two words, nouns, in the client's terminology. Counts in a badge when useful
  ("Invoices 3").
- The selected tab is in the URL, so refresh and links keep it.
- Tab content keeps the user's state (filters, scroll) when they switch back.
- Do not hide something the actor needs to complete the main task behind a non-default tab.
- Keyboard: arrow keys move between tabs, Tab moves into the content.
- On mobile, tabs scroll horizontally; never wrap to two lines.

## Figma
- `Tabs` (pill, shadcn) and `Tabs Line` hold `Tab` instances in a native slot. Exactly one `active`.
- In pill tabs, inactive text is `foreground/default`, not muted: muted text on the muted list
  fails contrast. The active tab is marked by its background and shadow.
- Use `Tabs Line` for page-level sections, pill tabs for switching views inside a card or panel.

## Tabs or Toggle Group
- Tabs switch between panels of content. Toggle Group sets a value: view mode (list / board),
  period (day / week / month), formatting. If nothing below changes except how data is shown or
  filtered, it is a Toggle Group.
- `Toggle Group` default or outline; items can be icon-only (with accessible label and tooltip).
