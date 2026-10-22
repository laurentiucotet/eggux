# Table

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Table Cell](#table-cell) | 10 | Content |
| [Table Header Label](#table-header-label) | 8 | - |
| [Table Cell Text](#table-cell-text) | 6 | - |
| [Table Cell Stack](#table-cell-stack) | 1 | - |
| [Table Cell User](#table-cell-user) | 1 | - |
| [Table Cell Amount](#table-cell-amount) | 3 | - |
| [Table Cell Status](#table-cell-status) | 1 | - |
| [Table Cell Progress](#table-cell-progress) | 1 | - |
| [Table Cell Actions](#table-cell-actions) | 1 | - |
| [Table Cell Link](#table-cell-link) | 1 | - |
| [Table Cell Date](#table-cell-date) | 1 | - |
| [Table Cell File](#table-cell-file) | 1 | - |
| [Table Cell Badges](#table-cell-badges) | 1 | - |
| [Table Cell Avatars](#table-cell-avatars) | 1 | - |
| [Table Cell Check](#table-cell-check) | 3 | - |
| [Table Toolbar](#table-toolbar) | 1 | Actions |
| [Data Grid Toolbar](#data-grid-toolbar) | 1 | Start, End |
| [Table Group Row](#table-group-row) | 1 | - |
| [Table Pagination](#table-pagination) | 1 | - |

On the Figma page: "Example / bulk actions on invoices", "Example / density comparison", "Example / in audit log", "Example / inline edit and column resize", "Example / invoice list footer", "Example / invoices grouped by status", "Example / invoices with filters", "Example / no results", "Example / table cell types", "Stress test / Data Grid Toolbar", "Stress test / Table Group Row", "Stress test / Table Pagination", "Stress test / Table Toolbar", "Stress test / Table cells", "Template / data grid (enterprise)", "Template / invoices table (grid)"

## Table Cell

Component set · 10 variants · default size 160 × 40

Grid table cell. Put cells in an auto-layout GRID frame; every cell of a row uses the same State (hover, selected). Expanded = detail row: one cell spanning all columns. Usage: eggux build-ui/components/table.md

**Use for**

- Data people compare across attributes, sort or scan
- Data grids people work in all day: invoices, orders, tickets
- Copy Template / invoices table (grid) and change columns and rows

**Not for**

- One item at a time or few attributes: use a list or cards
- Mobile: switch the table to a list
- Key-value details of one record: use Description List Item rows

**Anatomy**

1. Type=header with Table Header Label (Label, Sort, Align)
2. Type=body with Table Cell Text, Table Cell Stack or Table Cell User
3. Rich body content: Table Cell Amount, Status, Progress, Link, Date, File, Badges, Avatars
4. Plan comparison values: Table Cell Check (Value=included|excluded|text, Text, Note)
5. Last column: Table Cell Actions (edit and menu)
6. Type=expanded: one detail cell spanning all columns

**Content and behavior**

- Every cell of a row uses the same State (hover, selected)
- The first column identifies the row and links to it (Table Cell Text Style=strong)
- Text aligns left; numbers and currency align right with the same decimals
- Status is a Badge with text, never a colored dot alone
- Empty values show "-", never blank
- Inline edit only for fields changed often: State=editing, State=error in the cell
- One date format per column (Table Cell Date); time under it only when it matters
- Links in a cell (Table Cell Link) go where the row goes; one link per row besides the row
- Comparison tables: Table Cell Check centered in plan columns; excluded is a dash, never blank

**Accessibility**

- Header cells are th; the sorted column has aria-sort
- Sortable headers are buttons reachable with the keyboard
- Row icon buttons have a tooltip and an aria-label with the row: "Edit invoice INV-1041"
- Row checkboxes have labels: "Select INV-1041"
- Table Cell Check icons read "Included" or "Not included" (visually hidden text)

| Variant property | Values |
|---|---|
| Type | header, body, expanded |
| State | default, hover, selected, resizing, dragging, editing, error |

Slots (fill them in the instance, never detach): `Content`

Built from: `Table Cell Stack`, `Table Cell Text`, `Table Header Label`

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `background/primary`, `border/default`, `border/input`, `border/ring`, `table/row-expanded`, `table/row-hover`
- Spacing and size: `border-width/2`, `density/cell-padding-y`, `density/table-header-height`, `spacing/0_5`, `spacing/2`, `spacing/4`, `spacing/40`
- Effects: `shadow/md`

Guides: [table](../../skills/build-ui/components/table.md)

## Table Header Label

Component set · 8 variants · default size 160 × 20

Header cell content. Sort: off (not sortable), sortable (inactive), ascending, descending. Numbers and currency columns align right.

| Variant property | Values |
|---|---|
| Sort | off, sortable, ascending, descending |
| Align | left, right |

| Property | Type | Default |
|---|---|---|
| Label | text | Customer |

Icons: arrow-up-down, chevron-down, chevron-up

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/1`
- Text styles: `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

## Table Cell Text

Component set · 6 variants · default size 160 × 20

Text content for body cells. strong = the identifying column; muted = secondary values; right = numbers and currency. Empty values show "-".

| Variant property | Values |
|---|---|
| Style | default, strong, muted |
| Align | left, right |

| Property | Type | Default |
|---|---|---|
| Text | text | Ana Popescu |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Text styles: `body/small`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

## Table Cell Stack

Component · 1 variant · default size 200 × 38

Two-line cell: primary value + secondary detail.

| Property | Type | Default |
|---|---|---|
| Title | text | Website redesign |
| Description | text | Design · 2 h |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`
- Text styles: `ui/caption`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

## Table Cell User

Component · 1 variant · default size 220 × 38

Person cell: Avatar (exposed: initials or photo) + name + email.

| Property | Type | Default |
|---|---|---|
| Name | text | Ana Popescu |
| Email | text | ana.popescu@example.com |
| Show email | boolean | true |

Built from: `Avatar`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`
- Text styles: `ui/caption`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

## Table Cell Amount

Component set · 3 variants · default size 160 × 38

Amount in a table cell, right-aligned, tabular figures, with a note under it. Trend none uses Note (count, currency); up uses Increase, down uses Decrease, each with the sign in the text and a trend icon; color only supports it. Put it in Table Cell (body) with the column header Align=right.

| Variant property | Values |
|---|---|
| Trend | none, up, down |

| Property | Type | Default |
|---|---|---|
| Amount | text | €12,450.00 |
| Note | text | 3 invoices |
| Show note | boolean | true |
| Increase | text | +12.4% vs Sep |
| Decrease | text | −3.1% vs Sep |

Icons: trending-down, trending-up

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`
- Text styles: `ui/caption`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`)

## Table Cell Status

Component · 1 variant · default size 134 × 20

Status in a table cell: Badge (exposed: pick Variant and Label) and an optional note ("12 days", "since Oct 3"). One status per row; the label names the state, color supports it.

| Property | Type | Default |
|---|---|---|
| Note | text | 12 days |
| Show note | boolean | true |

Built from: `Badge`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`)

## Table Cell Progress

Component · 1 variant · default size 136 × 20

Progress in a table cell: bar (exposed Progress, pick Value) and the number as text, so the value is readable without the bar. 96 wide bar; use whole percents.

| Property | Type | Default |
|---|---|---|
| Label | text | 75% |

Built from: `Progress`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/3`
- Text styles: `body/small`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`)

## Table Cell Actions

Component · 1 variant · default size 36 × 36

Row actions, last column, right-aligned: one frequent action as an icon button (Show edit) and the rest in a menu (ellipsis, opens Menu). Icon buttons need a tooltip and an aria-label with the row name ("Edit invoice INV-1041").

| Property | Type | Default |
|---|---|---|
| Show edit | boolean | false |
| Show menu | boolean | true |

Built from: `Button Icon`

Tokens and styles:
- Spacing and size: `spacing/1`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`)

## Table Cell Link

Component · 1 variant · default size 160 × 20

A cell value that opens the record or a related object (invoice number, customer, order). Underlined text in foreground/default, one line, truncates. Only one link per row besides the row itself; the row click and the link go to the same place.

| Property | Type | Default |
|---|---|---|
| Text | text | INV-1041 |

Tokens and styles:
- Colors: `foreground/default`
- Text styles: `body/small`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group (One date format per column)

## Table Cell Date

Component · 1 variant · default size 160 × 20

A date in a table: one format for the whole column (12 Nov 2026), time under it when it matters (Show time). Relative dates ("2 h ago") only in activity lists, with the exact date in a tooltip. Sort newest first by default.

| Property | Type | Default |
|---|---|---|
| Date | text | 12 Nov 2026 |
| Time | text | 15:40 |
| Show time | boolean | false |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`
- Text styles: `body/small`, `ui/caption`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group (One date format per column)

## Table Cell File

Component · 1 variant · default size 220 × 20

A file attached to a row: type icon, name (truncates in the middle in code, full name in a tooltip), size. The name opens a preview (File Preview); download sits in the row actions.

| Property | Type | Default |
|---|---|---|
| Name | text | contract-northwind.pdf |
| Size | text | 240 KB |
| Show size | boolean | true |
| Icon | instance swap | Icon/file-text |

Icons: file-text

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`, `ui/caption`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group (One date format per column)

## Table Cell Badges

Component · 1 variant · default size 200 × 22

Two or three tags in a cell with +N for the rest (Badge List, exposed). Keep the same tag order in every row; the full list opens in a Tooltip from +N.

Built from: `Badge List`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group (One date format per column)

## Table Cell Avatars

Component · 1 variant · default size 200 × 24

People on a row: assignees, approvers, members (Avatar Group sm, exposed). 3 avatars and +N; names in a Tooltip. One person: Table Cell User.

Built from: `Avatar Group`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group (One date format per column)

## Table Cell Check

Component set · 3 variants · default size 16 × 20

Plan comparison value in a table cell: included (check), excluded (dash) or a text value such as "100 GB" or "Unlimited", with an optional note ("per seat"). Use it in pricing comparison tables and feature matrices; center it in plan columns. Excluded shows a dash, never a blank cell; a value is better than a check when the limit differs by plan. Screen readers get "Included" or "Not included", not the icon.


Usage: eggux build-ui/components/table.md

| Variant property | Values |
|---|---|
| Value | included, excluded, text |

| Property | Type | Default |
|---|---|---|
| Text | text | Unlimited |
| Note | text | per seat |
| Show note | boolean | false |

Icons: check, minus

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [table](../../skills/build-ui/components/table.md)

Code: cell renderer: lucide `Check` / `Minus` icon with `sr-only` "Included" / "Not included", or the text value; optional muted note (Plan comparison cells; excluded is a dash, never blank)

## Table Toolbar

Component · 1 variant · default size 720 × 48

Bulk action bar shown above the table while rows are selected: "N selected" + actions.

**Use for**

- Tables with bulk actions and a checkbox column
- Data grids: it replaces the Data Grid Toolbar while rows are selected
- Bulk actions such as Send, Export, Assign or Archive on selected invoices

**Not for**

- Actions on one row: use Table Cell Actions
- Tables without bulk actions: no checkbox column and no toolbar

**Anatomy**

1. Selection count: "2 selected"
2. Actions slot: Buttons for the bulk actions
3. Clear selection

**Content and behavior**

- Shown only while rows are selected, in place of the regular toolbar
- Only actions valid for the whole selection are enabled; disabled ones say why
- After selecting a page, offer "Select all 1,284 invoices"
- Destructive bulk actions confirm with the count
- One toast reports the result with counts and failures: "18 sent, 2 failed"

**Accessibility**

- The selection count is announced when it changes
- role="toolbar" with a label; every action is reachable with the keyboard
- Focus stays in the table when the toolbar appears

| Property | Type | Default |
|---|---|---|
| Selection | text | 2 selected |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`

Tokens and styles:
- Colors: `background/muted`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `ui/label`

Guides: [table](../../skills/build-ui/components/table.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md)

Code: custom bar on shadcn `Table` + TanStack Table row selection (Shows "N selected" and the bulk actions)

## Data Grid Toolbar

Component · 1 variant · default size 1200 × 36

Toolbar above a data grid: saved views, search, filters with active count, columns, group by, export. While rows are selected, show Table Toolbar (bulk actions) in its place.

**Use for**

- Lists people work in all day: invoices, orders, tickets, users
- Grids with saved views, grouping and export
- Audit logs above the event grid

**Not for**

- Simple tables with search and a few filters: use Filter Bar
- While rows are selected: show Table Toolbar in its place

**Anatomy**

1. Start slot: saved view selector and search Input
2. Filters Button with a Badge Count of active filters
3. End slot: Columns, Group by, density, Export
4. Active filters as chips under it

**Content and behavior**

- A saved view keeps columns, filters, sort and grouping
- Unsaved changes to a view offer Save and Save as new
- Filters show the active count; active filters appear as chips
- Export exports the current view
- Search, filters and sort are kept in the URL

**Accessibility**

- role="toolbar" with a label
- Icon-only buttons have a tooltip and an accessible label
- The filter count is part of the button name: "Filters, 3 active"

Slots (fill them in the instance, never detach): `Start`, `End`

Built from: `Badge Count`, `Button`, `Input`

Tokens and styles:
- Spacing and size: `spacing/1`, `spacing/2`

Guides: [table](../../skills/build-ui/components/table.md)

Code: custom on TanStack Table (grouping, aggregation, visibility) (Saved views stored per user)

## Table Group Row

Component · 1 variant · default size 1200 × 20

Content of a group header row: put it in a Table Cell Type=expanded that spans all columns. Chevron collapses the group; count and subtotal summarize it.

**Use for**

- Data grids grouped by status, owner or customer
- Groups that need a subtotal, such as amounts in EUR
- Long grids where collapsing groups helps people scan

**Not for**

- A total for the whole table: use a totals row at the bottom on background/muted
- Detail of one row: use Table Cell Type=expanded with the detail

**Anatomy**

1. chevron-down: collapses the group
2. Label: "Overdue"
3. Count: Badge Count
4. Subtotal (Show subtotal)

**Content and behavior**

- Put it in a Table Cell Type=expanded that spans all columns
- The chevron collapses and expands the group
- Count and subtotal summarize the group; the subtotal uses the column's number format
- Grouping is chosen with Group by in the Data Grid Toolbar

**Accessibility**

- The chevron is a button with aria-expanded and a label: "Collapse Overdue"
- Count and subtotal are text, read together with the label

| Property | Type | Default |
|---|---|---|
| Label | text | Overdue |
| Subtotal | text | Subtotal €5,620.00 |
| Show subtotal | boolean | true |

Built from: `Badge Count`. Icons: chevron-down

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
- Text styles: `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

Code: custom on TanStack Table (grouping, aggregation, visibility) (Saved views stored per user)

## Table Pagination

Component · 1 variant · default size 1040 × 60

Under a table: range with the total and the object name, rows per page (10, 20, 50, 100), Pagination. Keep it when there is one page (range only), so the total is always visible.

**Use for**

- Under every paginated table or data grid
- Kept with one page (range only), so the total stays visible
- Data grids, together with the Data Grid Toolbar above

**Not for**

- Feeds browsed once: use Load More
- Pagination outside a table: use Pagination

**Anatomy**

1. Range: "Showing 1-20 of 1,284 invoices"
2. Rows per page: Select (Show rows per page)
3. Pagination

**Content and behavior**

- The range names the total and the object
- Rows per page: 10, 20, 50, 100
- Under 900 px, turn off Show rows per page
- Changing filters resets to page 1

**Accessibility**

- The rows-per-page Select has a label
- Range changes are announced politely
- Pagination is a nav with aria-label="Pagination"

| Property | Type | Default |
|---|---|---|
| Range | text | Showing 1-20 of 1,284 invoices |
| Show rows per page | boolean | true |

Built from: `Pagination`, `Select`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/6`
- Text styles: `body/small`

Guides: [table](../../skills/build-ui/components/table.md)

Code: shadcn data-table pagination (`Select` for page size + `Pagination`)
