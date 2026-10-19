# Accordion

Usage guidelines only. Visual specs live in the Figma component.

## Use
- FAQ and optional detail (Density default).
- Grouping controls in a side panel: filter groups, settings groups (Density compact).
- Never to hide information every user needs to complete the task.

## Filter panels
- One Accordion Item per filter dimension (Status, Doctor, Location, Date), in the order actors
  filter most.
- Title = the dimension. Meta = Badge Count of active values in that group, or a short value
  summary ("Last 7 days"). Leading icon only if it helps scanning; use it on all groups or none.
- Content = the controls: checkbox list (multi), radio group (single), date range, select.
  Long option lists get a search field at the top and "Show all".
- Open by default: the groups with active filters. Panel header: "Filters" + "Clear all".
- Active filters also show as removable Chips above the results (patterns/search-and-filter.md).

## Rules
- The whole trigger row toggles; keyboard: Enter/Space toggles, arrows move between items.
- Several items may be open at once unless the content is mutually exclusive.

## Figma
`Accordion Item` Density × State, Meta and Content native slots; `Accordion` holds items in a
slot. Example: "filter panel" on the Accordion page; `Block / Filtered List` on Blocks / App.
