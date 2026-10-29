# Table

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Table Cell](#table-cell) | 12 | Content |
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
| [Table Cell Media](#table-cell-media) | 1 | - |
| [Table Cell Tree](#table-cell-tree) | 12 | - |
| [Table Toolbar](#table-toolbar) | 1 | Actions |
| [Data Grid Toolbar](#data-grid-toolbar) | 1 | Start, End |
| [Table Group Row](#table-group-row) | 2 | - |
| [Table Pagination](#table-pagination) | 1 | - |
| [Bulk Action Bar](#bulk-action-bar) | 1 | Actions |
| [Column Settings](#column-settings) | 1 | Items |
| [Column Settings Item](#column-settings-item) | 4 | - |

On the Figma page: "Example / Table Cell styles", "Example / bulk actions on invoices", "Example / bulk selection in a grid", "Example / density comparison", "Example / in audit log", "Example / inline edit and column resize", "Example / invoice list footer", "Example / invoices grouped by status", "Example / invoices with filters", "Example / no results", "Example / table cell types", "Stress test / Bulk Action Bar", "Stress test / Column Settings", "Stress test / Data Grid Toolbar", "Stress test / Table Group Row", "Stress test / Table Pagination", "Stress test / Table Toolbar", "Stress test / Table cells", "Template / data grid (enterprise)", "Template / invoices table (grid)"

## Table Cell

Component set · 12 variants · default size 160 × 40

Grid table cell. Put cells in an auto-layout GRID frame; every cell of a row uses the same State (hover, selected). Expanded = detail row: one cell spanning all columns. Type=footer: the totals row under the body (muted fill, top border; Table Cell Text Style=strong for labels and Table Cell Amount for sums), one per table. Style=striped: body cells of every second row on a muted fill, for wide read-only tables (reports, invoices, plan comparison); hover and selected look the same with or without stripes. Do not stripe tables that already use dividers and row hover for work.


Usage: eggux build-ui/components/table.md

**Use for**

- Data people compare across attributes, sort or scan
- Data grids people work in all day: invoices, orders, tickets
- Copy Template / invoices table (grid) and change columns and rows
- Column Settings opens from Columns in Data Grid Toolbar to show, hide and reorder columns

**Not for**

- One item at a time or few attributes: use a list or cards
- Mobile: switch the table to a list
- Key-value details of one record: use Description List Item rows

**Anatomy**

1. Type=header with Table Header Label (Label, Sort, Align, Show info: Info Tip Trigger after the label, Show menu: ellipsis Button Icon xs for the column menu)
2. Type=body with Table Cell Text, Table Cell Stack or Table Cell User
3. Products, files and listings: Table Cell Media (Thumbnail sm exposed, Title, Meta, Show meta)
4. Tree rows: Table Cell Tree in the first column (Level 0-3, Expander collapsed, expanded, none; Label, Show icon, Icon)
5. Rich body content: Table Cell Amount, Status (Badge + Note that fills the cell and ends with an ellipsis), Progress, Link, Date, File, Badges, Avatars
6. Plan comparison values: Table Cell Check (Value=included|excluded|text, Text, Note)
7. Last column: Table Cell Actions (edit and menu)
8. Type=expanded: one detail cell spanning all columns
9. Type=footer: totals row (card/muted-background, top border) with Table Cell Text Style=strong and Table Cell Amount
10. Style=striped (body, State=default): every second row on card/muted-background

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
- Table Cell Status: set it to FILL in the cell so a long Note truncates with an ellipsis; hugging, the note shows in full
- Footer: one totals row under the body; label left ("Total, 4 products"), sums right-aligned
- Stripes only for wide read-only tables (reports, invoices, plan comparison); hover and selected look the same with or without stripes
- Tree rows: indent 24 per level up to Level 3; leaf rows use Expander=none so labels line up; Level 3 needs at least 192
- Show menu on the hovered or focused header only; Show info for metric definitions
- Resize: Table Cell Media min 160 (text column min 96, title and meta 1 line with ellipsis); Table Cell Tree min 120 to 192 by level, label 1 line with ellipsis; Header Label Align=right truncates the label, Align=left labels hug (keep them short)

**Accessibility**

- Header cells are th; the sorted column has aria-sort
- Sortable headers are buttons reachable with the keyboard
- Row icon buttons have a tooltip and an aria-label with the row: "Edit invoice INV-1041"
- Row checkboxes have labels: "Select INV-1041"
- Table Cell Check icons read "Included" or "Not included" (visually hidden text)
- Tree rows: role="treegrid", aria-level and aria-expanded on the row; Right and Left arrows expand and collapse
- Header menu and info buttons have labels: "Column options for Amount", "More about Amount"
- Footer is a tfoot row; striped and footer muted text keeps 4.54:1 Light, 6.0:1 Dark, 6.92:1 Corporate Light

| Variant property | Values |
|---|---|
| Type | header, body, expanded, footer |
| State | default, hover, selected, resizing, dragging, editing, error |
| Style | default, striped |

Slots (fill them in the instance, never detach): `Content`

Built from: `Table Cell Stack`, `Table Cell Text`, `Table Header Label`

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `background/primary`, `border/default`, `border/input`, `border/ring`, `card/muted-background`, `table/row-expanded`, `table/row-hover`
- Spacing and size: `border-width/2`, `density/cell-padding-y`, `density/table-header-height`, `spacing/0_5`, `spacing/2`, `spacing/4`, `spacing/40`
- Effects: `shadow/md`

Guides: [table](../../skills/build-ui/components/table.md)

Code: `TableFooter` row `bg-muted/50 border-t font-medium`; striped `TableBody className="[&_tr:nth-child(even)]:bg-muted/50"` (Stripes only on read-only tables)

## Table Header Label

Component set · 8 variants · default size 160 × 20

Header cell content. Sort: off (not sortable), sortable (inactive), ascending, descending. Numbers and currency columns align right. Show info adds an Info Tip Trigger after the label for a metric definition (click opens an Info Tip). Show menu adds an ellipsis Button Icon xs at the far end of the cell (start of the cell in right-aligned columns) that opens a column Menu: sort ascending, sort descending, filter, pin, hide column. In code the menu shows on hover and focus of the header; in Figma turn it on for the hovered column only.


Usage: eggux build-ui/components/table.md

| Variant property | Values |
|---|---|
| Sort | off, sortable, ascending, descending |
| Align | left, right |

| Property | Type | Default |
|---|---|---|
| Label | text | Customer |
| Show info | boolean | false |
| Show menu | boolean | false |

Built from: `Button Icon`, `Info Tip Trigger`. Icons: arrow-up-down, chevron-down, chevron-up

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/1`
- Text styles: `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

Code: Info Tip after the label; `DropdownMenu` on `Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"` (`Ellipsis`) with Sort asc, Sort desc, Filter, Pin, Hide (`th className="group"`; Align=right label `truncate text-right`)

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

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`; Table Cell Status note `min-w-0 truncate` so it fills the cell)

## Table Cell Status

Component · 1 variant · default size 133 × 20

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

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`; Table Cell Status note `min-w-0 truncate` so it fills the cell)

## Table Cell Progress

Component · 1 variant · default size 138 × 20

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

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`; Table Cell Status note `min-w-0 truncate` so it fills the cell)

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

Code: cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` (Amounts with `Intl.NumberFormat`, `tabular-nums`; Table Cell Status note `min-w-0 truncate` so it fills the cell)

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

## Table Cell Media

Component · 1 variant · default size 240 × 38

Body cell content for a product, file or listing: Thumbnail (exposed, sm 32 by default; set Show image off for the fallback icon) + Title + one line of Meta (SKU, size, variant count). Title and Meta end with an ellipsis on one line. People use Table Cell User; files without an image use Table Cell File.


Usage: eggux build-ui/components/table.md

| Property | Type | Default |
|---|---|---|
| Title | text | Linen tote bag |
| Meta | text | SKU 10482 · 3 variants |
| Show meta | boolean | true |

Built from: `Thumbnail`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`
- Text styles: `ui/caption`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

Code: `div className="flex min-w-40 items-center gap-3"` + Thumbnail sm + `div className="min-w-24 flex-1"` with title `truncate text-sm font-medium` and meta `truncate text-xs text-muted-foreground` (Products, files, listings; people use Table Cell User)

## Table Cell Tree

Component set · 12 variants · default size 240 × 20

First-column content for tree rows in a table (nested tasks, budget categories, chart of accounts, folders, permission groups). Level 0 to 3 indents 24 per level; Expander: collapsed (chevron right), expanded (chevron down), none (leaf rows keep the 20 px space so labels line up). Level 0 labels are medium weight. Show icon + Icon (folder, file-text...). Label ends with an ellipsis on one line, min 80. Every other cell of the row stays a normal Table Cell. In code: role="treegrid", aria-level and aria-expanded on the row; Right and Left arrows expand and collapse.


Usage: eggux build-ui/components/table.md

| Variant property | Values |
|---|---|
| Level | 0, 1, 2, 3 |
| Expander | collapsed, expanded, none |

| Property | Type | Default |
|---|---|---|
| Label | text | Marketing |
| Show icon | boolean | true |
| Icon | instance swap | Icon/folder |

Icons: chevron-down, chevron-right, folder

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/12`, `spacing/1_5`, `spacing/5`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

Code: first-column cell `div style={{ paddingLeft: row.depth * 24 }} className="flex items-center gap-1.5"`: expander ghost Button (`ChevronRight` / `ChevronDown`, `aria-expanded`) or a `size-5` spacer, lucide icon, `truncate` label (TanStack `getSubRows`, `row.getToggleExpandedHandler()`; table `role="treegrid"`, rows `aria-level`; min width 120 + 24 per level)

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
- Resize: the selection text fills (at least 128, 1 line); the row wraps, so in narrow tables the Actions drop under it

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

Code: custom (`flex flex-wrap gap-2`; selection `min-w-32 flex-1 truncate`)

## Data Grid Toolbar

Component · 1 variant · default size 1200 × 36

Toolbar above a data grid: saved views, search, filters with active count, columns, group by, export. While rows are selected, show Table Toolbar (bulk actions) in its place.


Needs at least 512; the End slot wraps under the Start slot when both do not fit.

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
- Resize: the row wraps; when Start and End do not fit, the End slot drops under the Start slot
- Needs at least 512; in narrower places keep search and a Filters button only

**Accessibility**

- role="toolbar" with a label
- Icon-only buttons have a tooltip and an accessible label
- The filter count is part of the button name: "Filters, 3 active"

Slots (fill them in the instance, never detach): `Start`, `End`

Built from: `Badge Count`, `Button`, `Input`

Tokens and styles:
- Spacing and size: `spacing/1`, `spacing/2`

Guides: [table](../../skills/build-ui/components/table.md)

Code: custom on TanStack Table (grouping, aggregation, visibility) (Saved views stored per user. Table Group Row State=expanded / collapsed = `row.getIsExpanded()`, chevron-down / chevron-right with `aria-expanded`)

## Table Group Row

Component set · 2 variants · default size 1200 × 20

Content of a group header row: put it in a Table Cell Type=expanded that spans all columns. State=expanded (chevron-down) or collapsed (chevron-right): the chevron collapses the group; count and subtotal summarize it.

**Use for**

- Data grids grouped by status, owner or customer
- Groups that need a subtotal, such as amounts in EUR
- Long grids where collapsing groups helps people scan

**Not for**

- A total for the whole table: use a totals row at the bottom on background/muted
- Detail of one row: use Table Cell Type=expanded with the detail

**Anatomy**

1. Chevron: chevron-down on State=expanded, chevron-right on State=collapsed
2. Label: "Overdue"
3. Count: Badge Count
4. Subtotal (Show subtotal)

**Content and behavior**

- Put it in a Table Cell Type=expanded that spans all columns
- State: expanded (rows below), collapsed (rows hidden, chevron right); never swap the chevron by hand
- The chevron collapses and expands the group
- Count and subtotal summarize the group; the subtotal uses the column's number format
- Grouping is chosen with Group by in the Data Grid Toolbar
- Resize: the label fills (at least 48, 1 line with an ellipsis); the count hugs; the subtotal hugs up to 160 with an ellipsis

**Accessibility**

- The chevron is a button with aria-expanded (true on expanded) and a label: "Collapse Overdue" or "Expand Paid"
- Count and subtotal are text, read together with the label

| Variant property | Values |
|---|---|
| State | expanded, collapsed |

| Property | Type | Default |
|---|---|---|
| Label | text | Overdue |
| Subtotal | text | Subtotal €5,620.00 |
| Show subtotal | boolean | true |

Built from: `Badge Count`. Icons: chevron-down, chevron-right

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
- Text styles: `ui/label`

Guides: [table](../../skills/build-ui/components/table.md)

Code: custom on TanStack Table (grouping, aggregation, visibility) (Saved views stored per user. Table Group Row State=expanded / collapsed = `row.getIsExpanded()`, chevron-down / chevron-right with `aria-expanded`)

## Table Pagination

Component · 1 variant · default size 1040 × 60

Under a table: range with the total and the object name, rows per page (10, 20, 50, 100), Pagination. Keep it when there is one page (range only), so the total is always visible.


Needs at least 448; when the row is too narrow, Pagination wraps to its own line.

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
- Resize: the range fills (at least 160, 1 line with an ellipsis); the row wraps, so under about 800 Pagination drops to its own line
- Needs at least 448

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

Code: shadcn data-table pagination (Container `flex flex-wrap gap-y-3 min-w-[448px]`; range `min-w-40 flex-1 truncate`)

## Bulk Action Bar

Component · 1 variant · default size 467 × 50

A floating bar at the bottom center of the screen while items are selected in a card grid, board, gallery, file grid or inbox: the count (Selection, "3 selected"), an optional "Select all 48" link (Show select all), a Separator, the bulk actions (Actions, native slot: outline sm Buttons with icons) and Clear (Show clear, x Button Icon). Popover surface, radius/lg, shadow/lg. It appears with the first selection and leaves when the selection is cleared. Tables use Table Toolbar above the table instead.


Usage: eggux build-ui/components/table.md

**Use for**

- Selection in card grids where there is no table: Grid List, File Manager grid, Gallery
- Selection in boards and inboxes: Kanban Board, Inbox, Approval Inbox
- Mobile lists with selection mode

**Not for**

- Rows selected in a table: use Table Toolbar above the table
- Unsaved changes: use Save Bar
- Actions on one item: use the item's menu

**Anatomy**

1. Selection (TEXT): "3 selected"
2. Select all (Show select all): Button link sm, exposed ("Select all 48")
3. Separator vertical
4. Actions (native slot): outline sm Buttons with icons; on phones ghost sm Button Icons
5. Clear (Show clear): Button Icon ghost sm with x
6. Surface: background/popover, border/default, radius/lg, shadow/lg

**Content and behavior**

- Appears with the first selection, bottom center, 24 px above the bottom edge (above Bottom Nav on mobile); leaves when the selection is empty
- The count updates on every change; after a page is selected offer "Select all 48"
- 3 actions at most in the bar; more go into a Menu behind an ellipsis Button Icon
- Destructive actions confirm with the count ("Delete 3 files?")
- One toast reports the result: "3 files moved"
- Resize: hugs its content; on phones (under 480) the actions become Button Icons with tooltips so the bar fits 328

**Accessibility**

- role="toolbar" with aria-label="Bulk actions"; the count is in a live region
- Escape or Clear empties the selection and returns focus to the last selected item
- Text foreground/default on background/popover 19.8:1 Light, 17.2:1 Dark; Select all link 6.7:1 Light, 7.1:1 Dark

| Property | Type | Default |
|---|---|---|
| Selection | text | 3 selected |
| Show select all | boolean | false |
| Show clear | boolean | true |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`, `Button Icon`, `Separator`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/label`
- Effects: `shadow/lg`

Guides: [table](../../skills/build-ui/components/table.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md)

Code: custom (Chakra ActionBar pattern): `fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-lg border bg-popover px-4 py-2 shadow-lg` with shadcn `Button variant="outline" size="sm"` and a ghost `Button size="icon-sm"` to clear (`role="toolbar"`, count in `aria-live="polite"`; under `sm` the actions are icon buttons with tooltips; selection from TanStack `rowSelection` or local state)

## Column Settings

Component · 1 variant · default size 288 × 340

Popover that opens from "Columns" in Data Grid Toolbar (Carbon Datagrid customize columns, Ant Pro column settings): Popover Header ("Columns"), Search Field (Show search, for more than 8 columns), Items (native slot of Column Settings Item: checkbox shows or hides, grip reorders, the identifying column is locked) and Popover Footer (Reset to the default columns, Cancel, Apply; Show footer off when changes apply at once). 288 wide, min 240; keep at least one column visible.


Usage: eggux build-ui/components/table.md

**Use for**

- Data Table, User Directory, Grouped Table and enterprise data grids with more columns than fit
- Saved views that store the visible columns per user

**Not for**

- Tables with 5 columns or fewer: show them all
- Filtering rows: use Faceted Filter or Filter Builder
- Sorting: use the header (Table Header Label Sort or Show menu)

**Anatomy**

1. Popover Header (exposed): "Columns", close
2. Search Field (Show search, exposed): for more than 8 columns
3. Items (native slot) of Column Settings Item: grip, Checkbox (exposed), Label; State default, hover, dragging, locked
4. Popover Footer (Show footer, exposed): Reset, Cancel, Apply
5. 288 wide (popover tokens, shadow/md), min 240

**Content and behavior**

- Items list columns in their table order; dragging changes the order
- The identifying column is State=locked: always shown, no grip
- Keep at least one column visible; disable the last checked box
- Reset returns to the default columns of the view
- Show footer off when changes apply at once; on when Apply saves a view
- Resize: 288 by default, min 240; labels end with an ellipsis on one line; grip, checkbox and lock keep their size

**Accessibility**

- The list is a listbox or a list of checkboxes with the column names as labels
- Reorder works without drag: Alt + Arrow up or down moves the focused column, announced with its new position
- The popover traps focus and Escape closes it, returning focus to Columns

| Property | Type | Default |
|---|---|---|
| Show search | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Column Settings Item`, `Popover Footer`, `Popover Header`, `Search Field`

Tokens and styles:
- Colors: `background/popover`, `border/default`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/72`
- Radius: `radius/md`
- Effects: `shadow/md`

Guides: [table](../../skills/build-ui/components/table.md)

Code: `Popover` with header, `Input` search, dnd-kit `SortableContext` list of rows (`GripVertical` handle, `Checkbox` bound to `column.getIsVisible()` / `toggleVisibility`, label `truncate`; locked row `Lock` icon and disabled checkbox), footer Reset / Cancel / Apply (`table.setColumnOrder`; Alt + Arrow keys reorder; keep one column visible)

## Column Settings Item

Component set · 4 variants · default size 256 × 32

One column in Column Settings: grip handle, Checkbox (exposed: Checked shows or hides the column) and Label. State: default, hover, dragging (lifted with shadow/md while reordering), locked (the identifying column: always shown, checkbox disabled, lock icon, no grip). Keyboard: Space toggles, Alt + arrow keys move the column.


Usage: eggux build-ui/components/table.md

| Variant property | Values |
|---|---|
| State | default, hover, dragging, locked |

| Property | Type | Default |
|---|---|---|
| Label | text | Customer |

Built from: `Checkbox`. Icons: grip-vertical, lock

Tokens and styles:
- Colors: `background/accent`, `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/8`
- Radius: `radius/sm`
- Text styles: `body/small`
- Effects: `shadow/md`

Guides: [table](../../skills/build-ui/components/table.md)

Code: `Popover` with header, `Input` search, dnd-kit `SortableContext` list of rows (`GripVertical` handle, `Checkbox` bound to `column.getIsVisible()` / `toggleVisibility`, label `truncate`; locked row `Lock` icon and disabled checkbox), footer Reset / Cancel / Apply (`table.setColumnOrder`; Alt + Arrow keys reorder; keep one column visible)
