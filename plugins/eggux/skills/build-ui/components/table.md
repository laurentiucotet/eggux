# Table and data table

Usage guidelines only. Visual specs live in the Figma component.

## When
- Table: the actor compares items across several attributes, sorts or scans.
- List or cards: the actor looks at one item at a time, or items have few attributes, or on mobile.
- Columns come from the object's attributes in `objects.md`. Do not add columns nobody asked for.

## Columns
- The first column identifies the row (name, number) and links to the detail.
- Text left-aligned, numbers and currency right-aligned with the same decimals, dates in the
  client's locale.
- Status uses `Badge` with text, never a colored dot alone.
- Row actions: a `DropdownMenu` in the last column (ghost icon button with label "Actions for <name>").
  One frequent action can be visible; the rest go in the menu.
- Empty cells show "-" or "Not set", never blank.
- Products, files and listings use `Table Cell Media` (Thumbnail sm, title, one line of meta);
  people use `Table Cell User`.
- Totals go in one `Table Cell` Type=footer row; stripe (Style=striped) only wide read-only
  tables.

## Behavior
- Sorting: clickable header with a sort indicator; one default sort that makes sense for the task.
- `Table Header Label` Show menu on the hovered column only; Show info (Info Tip) for metric
  definitions. A left-aligned label with both needs about 72 px more than the label.
- Filtering and search follow `patterns/search-and-filter.md`.
- Selection: checkbox column only when bulk actions exist. A toolbar with the bulk actions
  and "N selected" appears when something is selected.
- Selection outside a table (card grids, boards, galleries, inboxes) uses `Bulk Action Bar` at
  the bottom center; tables keep `Table Toolbar`.
- More than ~50 rows: pagination or virtualized scroll. Show the total count.
- Loading: skeleton rows matching the column layout (`patterns/loading-states.md`).
- Empty: `patterns/empty-state.md`, inside the table area, keeping the header when filters are active.
- Wide tables scroll horizontally with the first column sticky. On mobile, switch to a list.

## Data grid (enterprise)
For lists people work in all day (invoices, orders, tickets, users, assets).
- Toolbar (`Data Grid Toolbar`): saved view selector, search, Filters with the active count,
  Columns (show, hide, reorder), Group by, density, Export. Active filters as chips under it.
- Columns opens `Column Settings` (search, `Column Settings Item`s to check and drag, Reset,
  Cancel, Apply); lock the identifying column (State=locked) and keep one column visible.
- Tree rows put `Table Cell Tree` in the first column (indent 24 per level, max Level 3); leaf
  rows use Expander=none.
- Saved views: name, owner, shared or private; the view keeps columns, filters, sort and
  grouping. "Unsaved changes to this view" with Save / Save as new.
- Group rows (`Table Group Row` in an expanded cell): label, count, subtotal, collapsible.
  Collapsed groups use State=collapsed.
- Totals row at the bottom on `background/muted`, strong text.
- Pin the identifying columns (checkbox, id) on horizontal scroll; header sticky on vertical
  scroll.
- Bulk actions replace the toolbar while rows are selected; "Select all 1,284" after
  selecting a page.
- Inline edit only for fields people change often; validation in the cell
  (`Table Cell` editing, error).
- Use Density Compact and the Corporate theme for data-heavy apps.

## Figma
The table is a GRID frame, not a component. Copy `Template / invoices table (grid)` and change
columns and rows. Details: "Tables on auto-layout grid" in `references/figma-library.md`.
- Cells: `Table Cell` (header, body, expanded × default, hover, selected) with a Content slot.
- Content: `Table Header Label` (sorting), `Table Cell Text`, `Table Cell Stack`,
  `Table Cell User`, `Table Cell Amount` (right-aligned, note or change), `Table Cell Status`
  (Badge + note; set it to FILL so a long note ends with an ellipsis), `Table Cell Progress`
  (bar + percent), `Table Cell Actions` (edit + menu, last column), Checkbox without label, Button
  Icon (expand).
- Under the table: `Table Pagination` (range with total, rows per page, pages). Under 900 px
  turn off rows per page.
- Above the table: `Filter Bar` (see `patterns/search-and-filter.md`).
- Nothing to show: `Empty State` Size=sm inside the table frame, under the header row.
- Example: `Example / invoices with filters` and `Example / no results` (Table page).
- Selection: checkbox column, header checkbox indeterminate on partial selection,
  `Table Toolbar` above the grid with "N selected" and the bulk actions.
- `Bulk Action Bar`: Selection text, Show select all ("Select all 48"), Actions slot, Show clear.
  Example "bulk selection in a grid" on the Table page.
- Enterprise: copy `Template / data grid (enterprise)` (toolbar, chips, groups, totals,
  pagination). Grid rows must be HUG; see the API notes.
- More cell parts: `Table Cell Link` (the record or a related object, underlined), `Table Cell Date`
  (one format per column, Show time), `Table Cell File` (icon, name, size), `Table Cell Badges`
  (Badge List with +N), `Table Cell Avatars` (Avatar Group sm). Example "table cell types".
- Plan comparison tables use `Table Cell Check`: a check for included, a dash for excluded, the value when limits differ by plan (Block / Comparison Table).
