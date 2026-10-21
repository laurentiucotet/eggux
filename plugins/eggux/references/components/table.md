# Table

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Table Header Label](#table-header-label) | 8 | - |
| [Table Cell Text](#table-cell-text) | 6 | - |
| [Table Cell Stack](#table-cell-stack) | 1 | - |
| [Table Cell User](#table-cell-user) | 1 | - |
| [Table Cell](#table-cell) | 10 | Content |
| [Table Toolbar](#table-toolbar) | 1 | Actions |
| [Data Grid Toolbar](#data-grid-toolbar) | 1 | Start, End |
| [Table Group Row](#table-group-row) | 1 | - |
| [Table Cell Amount](#table-cell-amount) | 3 | - |
| [Table Cell Status](#table-cell-status) | 1 | - |
| [Table Cell Progress](#table-cell-progress) | 1 | - |
| [Table Cell Actions](#table-cell-actions) | 1 | - |
| [Table Pagination](#table-pagination) | 1 | - |

On the Figma page: "Example / density comparison", "Example / inline edit and column resize", "Example / invoices with filters", "Example / no results", "Stress test / Table cells", "Template / data grid (enterprise)", "Template / invoices table (grid)"

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

## Table Cell

Component set · 10 variants · default size 160 × 40

Grid table cell. Put cells in an auto-layout GRID frame; every cell of a row uses the same State (hover, selected). Expanded = detail row: one cell spanning all columns. Usage: eggux build-ui/components/table.md

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

## Table Toolbar

Component · 1 variant · default size 720 × 48

Bulk action bar shown above the table while rows are selected: "N selected" + actions.

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

## Data Grid Toolbar

Component · 1 variant · default size 1200 × 36

Toolbar above a data grid: saved views, search, filters with active count, columns, group by, export. While rows are selected, show Table Toolbar (bulk actions) in its place.

Slots (fill them in the instance, never detach): `Start`, `End`

Built from: `Badge Count`, `Button`, `Input`

Tokens and styles:
- Spacing and size: `spacing/1`, `spacing/2`

Guides: [table](../../skills/build-ui/components/table.md)

Code: custom on TanStack Table (grouping, aggregation, visibility) (Saved views stored per user)

## Table Group Row

Component · 1 variant · default size 1200 × 20

Content of a group header row: put it in a Table Cell Type=expanded that spans all columns. Chevron collapses the group; count and subtotal summarize it.

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

## Table Pagination

Component · 1 variant · default size 1040 × 60

Under a table: range with the total and the object name, rows per page (10, 20, 50, 100), Pagination. Keep it when there is one page (range only), so the total is always visible.

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
