# Tabs

Usage guidelines only. Visual specs live in the Figma component.

## Use
- To switch between views of the same object or the same context (Overview, Orders, Invoices).
- Not for steps in a sequence (use a stepper) and not for primary navigation (use the sidebar or nav).
- 2 to 6 tabs. More means the content needs a different structure.

## Rules
- Labels are one or two words, nouns, in the client's terminology. Counts in the Tab's Badge
  Count (Show count) when useful ("Invoices 3"), never typed into the label.
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
- `Tab` Show icon adds a 16 px icon before the label (Icon swap); icons on all tabs or none.
- `Tabs Vertical`: Tab Style=vertical in a 200 wide column for settings and long forms with 4-10
  sections; the content sits on the right. Mobile: a Select or a list that opens each section.
  Example "settings with vertical tabs".

## Tabs or Toggle Group
- Tabs switch between panels of content. Toggle Group sets a value: view mode (list / board),
  period (day / week / month), formatting. If nothing below changes except how data is shown or
  filtered, it is a Toggle Group.
- `Toggle Group` default or outline; items can be icon-only (with accessible label and tooltip).
