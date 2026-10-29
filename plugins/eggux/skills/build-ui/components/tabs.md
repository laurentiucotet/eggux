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
- One `Tabs` set holds `Tab` instances in a native slot: Variant default (pill, shadcn), line
  (underlined), vertical, pills and boxed. Each Tab uses the same Variant as its Tabs. Exactly one
  `active`.
- In pill tabs, inactive text is `foreground/default`, not muted: muted text on the muted list
  fails contrast. The active tab is marked by its background and shadow.
- Use Variant=line for page-level sections, Variant=default for switching views inside a card or
  panel.
- Variant=pills (no track, the active tab filled with primary) for list filters on a page, with
  counts when useful. Variant=boxed when the tabs and their panel form one bordered unit: the
  content goes in the Tabs `Panel` slot. Example "Tabs styles".
- `Tab` Show icon adds a 16 px icon before the label (Icon swap); icons on all tabs or none.
- More tabs than fit: `Tabs` Show overflow, the rest in a Menu under "More". Dense headers and
  panels use `Tab` Size=sm; one Size per Tabs. Example "Tabs overflow and sizes".
- Variant=vertical: a 200 wide column for settings and long forms with 4-10 sections; the content
  sits on the right. Mobile: a Select or a list that opens each section. Example "settings with
  vertical tabs".

## Tabs or Toggle Group
- Tabs switch between panels of content. Toggle Group sets a value: view mode (list / board),
  period (day / week / month), formatting. If nothing below changes except how data is shown or
  filtered, it is a Toggle Group.
- `Toggle Group` default, outline or segmented; items can be icon-only (with accessible label and
  tooltip). The chosen `Toggle Group Item` is State=selected; items use the Variant of their group.
- Variant=segmented (a muted track, the selected item raised) looks like Tabs default but sets a
  value: periods on a chart card, Monthly / Yearly on pricing. Example "Toggle Group styles".
- Full width segmented Toggle Group: set the group and its items to FILL, so items share the
  track. In a hugging group keep items on HUG.
- One on/off button (bold, pin, mute) is `Toggle` (Variant default or outline, State=pressed when
  on); Toggle Group sets a value. Icon-only Toggles keep a tooltip. Example "Toggle".
- Sizes sit on the items (`Toggle Group Item` Size, the same on every item): sm in toolbars and
  chart headers, lg for billing period and theme. Example "Toggle Group sizes".

## Related components
- View switches (list, board, calendar) and theme switches (light, dark, system) are plain
  `Toggle Group`s: they set a value and keep the same content. Examples "view switch" and "theme
  switch" on the Toggle Group page.
