# Pattern: search and filter

**Problem:** in long collections users cannot find what they need, or lose track of why the list
looks the way it does.
**Heuristic:** recognition rather than recall, user control and freedom, visibility of system status.

## Search
- One search field above the collection, with a placeholder that says what it searches
  ("Search patients by name or phone").
- Results update as the user types, debounced (~300 ms), when search is fast; otherwise on Enter.
- Matching text highlighted in results when it helps scanning.
- Clear button inside the field when it has text. Escape clears it.

## Filters
- Choose filters from the object's attributes that actors actually filter by (`objects.md`).
  3-5 visible filters; the rest behind "More filters".
- Each active filter is visible as a chip with its value and a remove button.
- "Clear all" appears when more than one filter is active.
- Filters apply immediately in a toolbar; in a filter panel with many fields, apply on a button.
- Show the result count ("24 appointments") and keep it updated.

## State
- Search, filters, sort and page live in the URL, so back, refresh and shared links keep them.
- Returning to the list from a detail page restores the exact state and scroll position.
- No results: the "No results" empty state names the query and offers "Clear filters".
- Saved views only when actors repeat the same combination often; confirm with the client first.

## shadcn / Figma
`Input` with search icon, `Popover` + `Command` for filter options, `Badge` chips, `Button variant="ghost"` for "Clear all".
