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

## Behavior
- Sorting: clickable header with a sort indicator; one default sort that makes sense for the task.
- Filtering and search follow `patterns/search-and-filter.md`.
- Selection: checkbox column only when bulk actions exist. A toolbar with the bulk actions
  and "N selected" appears when something is selected.
- More than ~50 rows: pagination or virtualized scroll. Show the total count.
- Loading: skeleton rows matching the column layout (`patterns/loading-states.md`).
- Empty: `patterns/empty-state.md`, inside the table area, keeping the header when filters are active.
- Wide tables scroll horizontally with the first column sticky. On mobile, switch to a list.
