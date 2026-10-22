# Pattern: search and filter

**Problem:** in long collections users cannot find what they need, or lose track of why the list
looks the way it does.
**Heuristic:** recognition rather than recall, user control and freedom, visibility of system status.

## Search
- One search field above the collection, with a placeholder that says what it searches
  ("Search customers by name or email").
- Results update as the user types, debounced (~300 ms), when search is fast; otherwise on Enter.
- Matching text highlighted in results when it helps scanning.
- Clear button inside the field when it has text. Escape clears it.

## Filters
- Choose filters from the object's attributes that actors actually filter by (`objects.md`).
  3-5 visible filters; the rest behind "More filters".
- Each active filter is visible as a chip with its value and a remove button.
- "Clear all" appears when more than one filter is active.
- Filters apply immediately in a toolbar; in a filter panel with many fields, apply on a button.
- Show the result count ("24 orders") and keep it updated.

## Advanced filters
For large lists where people need precise subsets (finance, operations, CRM):
- Filter Builder in a popover from the Filters button: conditions (field, operator, value),
  joined by and / or, at most one nested group.
- Operators follow the field type: text (contains, is, is empty), number and money (=, >, <,
  between), date (before, after, in the last N days), sets (is any of, is none of).
- Live result count; Apply in the footer; "Save as view" turns the result into a saved view.
- Active conditions show as chips under the toolbar; editing a chip opens the builder.
- Figma: `Filter Condition`, `Filter Group` (Filters page), `Block / Filter Builder`.

## State
- Search, filters, sort and page live in the URL, so back, refresh and shared links keep them.
- Returning to the list from a detail page restores the exact state and scroll position.
- No results: the "No results" empty state names the query and offers "Clear filters".
- Saved views only when actors repeat the same combination often; confirm with the client first.

## Components (Figma, Filters page)
- `Filter Bar`: first row search + view controls; second row the filters and Clear all.
- `Filter Chip` Type=empty is the trigger ("+ Owner"); Type=active shows field and values (two
  names, then "3 selected"), edits on click, removes with x.
- `Faceted Filter`: the popover of one chip, `Facet Option` rows with counts; applies on each
  click, no Apply button.
- `Filter Section`: groups for a side panel (many attributes, commerce, search pages); first 5-6
  values, then "Show N more".
- Pick: up to 4 common filters → chips in the Filter Bar; many attributes or browsing → side
  panel of Filter Sections; precise conditions (and / or, operators) → Filter Builder.
- Shop listings use Filter Section in a left panel plus active Filter Chips; Faceted Filter is the popover version for toolbars.

## shadcn / Figma
`Input` with search icon, `Popover` + `Command` for filter options, `Badge` chips, `Button variant="ghost"` for "Clear all".

## Related components
- The search box is `Search Field` (placeholder names what is searched, clear, ⌘K hint). Min and max
  filters (price, amount) use `Range Input`, next to a range Slider when people scan values.
- Search pages list `Search Result Item`s (path, title link, two-line snippet with the matched words
  in bold, type and date), grouped by type when there are several kinds. List pages use
  `Page Toolbar` when filters sit behind one Filters button.
- Saved views are listed with `Saved View Item` (personal first, then shared; the active one
  highlighted); the Filter Bar offers "Save view" when filters change.
