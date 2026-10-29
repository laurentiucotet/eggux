# Accordion

Usage guidelines only. Visual specs live in the Figma component.

## Use
- FAQ and optional detail (Size default).
- Grouping controls in a side panel: filter groups, settings groups (Size sm).
- Never to hide information every user needs to complete the task.

## Filter panels
- One Accordion Item per filter dimension (Status, Owner, Location, Date), in the order actors
  filter most.
- Title = the dimension. Meta = Badge Count of active values in that group, or a short value
  summary ("Last 7 days"). Show leading icon only if it helps scanning; use it on all groups or none.
- Content = the controls: checkbox list (multi), radio group (single), date range, select.
  Long option lists get a search field at the top and "Show all".
- Open by default: the groups with active filters. Panel header: "Filters" + "Clear all".
- Active filters also show as removable Chips above the results (patterns/search-and-filter.md).

## Rules
- The whole trigger row toggles; keyboard: Enter/Space toggles, arrows move between items.
- Several items may be open at once unless the content is mutually exclusive.
- Style=card (separate bordered cards, gap 12) with Icon=plus for marketing FAQs and help
  centers; Style=default with the chevron in apps, panels and filters. One Style per list.

## Figma
`Accordion Item` Size (default, sm) × State × Style (default, card) × Icon (chevron, plus), Meta and
Content native slots; `Accordion` Style (default, card) holds items of the same Style in a slot. Example: "filter panel" on the Accordion page; `Block / Filtered List` on the App blocks page. Example "Accordion styles".
- One long text (a note, a bio, a description) cut to 3 lines uses `Show More`; Accordion is for
  several sections.

## Collapsible
- For optional fields inside a form (advanced settings, "Show 3 more line items") use
  `Collapsible`: a link trigger with a chevron, not an Accordion. Closed by default; open it
  when one of its fields has a value or an error.
- Figma: `Collapsible` State collapsed, expanded; Content slot (kept when collapsed), exposed
  link Button trigger. Example "Collapsible" on the Accordion page.
