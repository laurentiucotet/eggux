# Filters

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Filter Bar](#filter-bar) | 1 | End, Filters |
| [Filter Chip](#filter-chip) | 6 | - |
| [Faceted Filter](#faceted-filter) | 1 | Items |
| [Facet Option](#facet-option) | 4 | - |
| [Filter Section](#filter-section) | 2 | Options |
| [Filter Group](#filter-group) | 1 | Conditions |
| [Filter Condition](#filter-condition) | 2 | - |
| [Saved View Item](#saved-view-item) | 3 | - |

On the Figma page: "Example / catalog filters", "Example / in filter builder", "Example / invoice filters", "Example / status filter options", "Stress test / Faceted Filter", "Stress test / Filter Group", "Stress test / Filter Section", "Stress test / Filters", "Stress test / Saved View Item"

## Filter Bar

Component · 1 variant · default size 1040 × 76

Above a list or table. First row: search and view controls (End slot: sort, columns, export). Second row: filters as Filter Chips (Filters slot, wraps on narrow screens): empty triggers "+ Owner" and active filters "Status: Overdue, Pending", then Clear all when any filter is on. Show the result count next to the table title, and an Empty State with "Clear filters" when nothing matches.

**Use for**

- Tables and lists with up to 4 common filters: invoices by Status, Owner, Date
- Lists people work in all day, next to sort, columns and export
- Saved views that combine search, filters and sort

**Not for**

- Many attributes or browsing (catalog, search page): use a side panel of Filter Sections
- Precise conditions with and / or and operators: use the Filter Builder (Filter Group)
- Short lists under ~10 rows: no filters, search at most

**Anatomy**

1. Search Input
2. End slot: sort, columns, export
3. Filters slot of Filter Chips: empty triggers "+ Owner"
4. Active Filter Chips: "Status: Overdue, Pending"
5. Clear all (Show clear)

**Content and behavior**

- Filters apply immediately; show the result count next to the table title and keep it updated
- Clear all appears when filters are on (Show clear)
- Filters wrap on narrow screens; on mobile they move to a bottom Drawer
- Search, filters and sort live in the URL
- No results: Empty State that names the query and offers "Clear filters"

**Accessibility**

- Search has a label or aria-label that says what it searches: "Search customers by name or email"
- Result count changes are announced in a live region
- Tab order follows the reading order: search, filters, Clear all, End controls

| Property | Type | Default |
|---|---|---|
| Show clear | boolean | true |
| Show filters | boolean | true |

Slots (fill them in the instance, never detach): `End`, `Filters`

Built from: `Button`, `Filter Chip`, `Input`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [table](../../skills/build-ui/components/table.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) (Faceted values from `column.getFacetedUniqueValues()` (TanStack))

## Filter Chip

Component set · 6 variants · default size 90 × 32

One filter in a Filter Bar. Type=empty: dashed trigger "+ Status" that opens a Faceted Filter. Type=active: field, chosen values (up to 2 names, then "3 selected"), chevron to edit, x to remove. Removing a filter updates the list at once and is announced (aria-live).

| Variant property | Values |
|---|---|
| Type | empty, active |
| State | default, hover, focus |

| Property | Type | Default |
|---|---|---|
| Field | text | Status |
| Value | text | Overdue, Pending |
| Show remove | boolean | true |

Icons: chevron-down, plus, x

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/3`, `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) (Faceted values from `column.getFacetedUniqueValues()` (TanStack))

## Faceted Filter

Component · 1 variant · default size 240 × 247

Popover opened from a Filter Chip: search, values with checkboxes and counts (Items slot of Facet Options), Clear filters. Applies on each click, no Apply button; Escape closes. Over 8 values: keep the search; selected values first.

**Use for**

- Choosing one or more values of a field from a Filter Chip: Status, Owner, Category
- Fields with a known set of values and useful counts
- Fields with many values where search helps: Customer, Project

**Not for**

- Free text, numbers or date ranges: use a Filter Condition with the matching control
- Many fields at once in a side panel: use Filter Section

**Anatomy**

1. Search (Command Input)
2. Items slot of Facet Options: checkbox, label, count
3. Separator
4. Footer with Clear filters (Show footer)

**Content and behavior**

- Applies on each click, no Apply button
- Over 8 values: keep the search and put selected values first
- Counts update with the other filters; show 0 rather than hiding an option
- Chip label shows up to 2 names, then "3 selected"

**Accessibility**

- Escape closes and returns focus to the Filter Chip
- Arrows move through options, Space or Enter toggles
- Each Facet Option is a checkbox with its label; the count is read after the label

| Property | Type | Default |
|---|---|---|
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Button`, `Command Input`, `Facet Option`, `Separator`

Tokens and styles:
- Colors: `background/popover`, `border/default`
- Spacing and size: `spacing/1`
- Radius: `radius/md`
- Effects: `shadow/md`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) (Faceted values from `column.getFacetedUniqueValues()` (TanStack))

## Facet Option

Component set · 4 variants · default size 224 × 32

One value in a Faceted Filter or a Filter Section: checkbox, label, count of matching rows. Counts update with the other filters; show 0 rather than hiding the option.

| Variant property | Values |
|---|---|
| Checked | false, true |
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Label | text | Overdue |
| Count | text | 24 |
| Show count | boolean | true |

Built from: `Checkbox`

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/caption`

Guides: [select](../../skills/build-ui/components/select.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) (Faceted values from `column.getFacetedUniqueValues()` (TanStack))

## Filter Section

Component set · 2 variants · default size 256 × 229

A group in a filter side panel: title, number of selected values, collapse. Options slot holds Facet Options, a Slider (price range) or a Date Range Picker trigger. Show the first 5-6 values, then "Show N more". Collapsed sections keep their count visible.

**Use for**

- Side panels with many attributes: catalogs, search pages, commerce
- Ranges next to checkboxes: a Slider for price, a Date Range Picker trigger
- Mobile filter Drawers with one group per attribute

**Not for**

- Up to 4 common filters above a table: use Filter Chips in a Filter Bar
- Conditions with operators and and / or: use the Filter Builder (Filter Group)

**Anatomy**

1. Title
2. Selected count (Show selected count)
3. Collapse chevron
4. Options slot: Facet Options, Slider or Date Range Picker trigger
5. Show N more (Show more)

**Content and behavior**

- Show the first 5-6 values, then "Show N more"
- Collapsed sections (Expanded=false) keep their count visible
- Counts show 0 rather than hiding the option
- A panel with many fields may apply on a button; say how many results it will show

**Accessibility**

- The title is a button with aria-expanded
- Options are real checkboxes with labels
- Selected count is text, read with the title

| Variant property | Values |
|---|---|
| Expanded | true, false |

| Property | Type | Default |
|---|---|---|
| Title | text | Status |
| Show selected count | boolean | true |
| Show more | boolean | true |

Slots (fill them in the instance, never detach): `Options`

Built from: `Badge Count`, `Button`, `Facet Option`. Icons: chevron-down, chevron-up

Tokens and styles:
- Colors: `border/default`, `foreground/default`
- Spacing and size: `spacing/0`, `spacing/2`, `spacing/4`
- Text styles: `ui/label`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: `Collapsible` + `Checkbox` list

## Filter Group

Component · 1 variant · default size 800 × 126

Nested group of conditions joined by the same and / or, on a muted background. One level of nesting is enough for most products.

**Use for**

- Precise subsets in large lists: finance, operations, CRM
- Conditions that mix and / or: Status is Overdue and (Owner is Alex or Amount > 1000 EUR)
- Filters that become a saved view ("Save as view")

**Not for**

- Picking values of a few fields: use Filter Chips and Faceted Filter
- Browsing a catalog: use Filter Sections in a side panel

**Anatomy**

1. Muted background
2. Conditions slot of Filter Conditions
3. Filter Condition: first starts with "Where", next starts with and / or
4. Field, operator and value controls
5. Add condition Button

**Content and behavior**

- One level of nesting; deeper groups are not supported
- Operators follow the field type: text, number and money, date, sets
- Value control follows the field: Tag Input for sets, Date Range Picker for dates, Number Input for amounts
- Live result count; Apply in the builder footer; active conditions show as chips under the toolbar

**Accessibility**

- Each Select and value control has a label that names the condition
- Remove condition Button Icons have labels
- Adding a condition moves focus to its field Select

Slots (fill them in the instance, never detach): `Conditions`

Built from: `Button`, `Filter Condition`

Tokens and styles:
- Colors: `background/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: custom: `Select`, `Combobox`, `Input`, `Button` (Serialize to the API filter format)

## Filter Condition

Component set · 2 variants · default size 760 × 62

One condition: field, operator (depends on the field type), value. first starts with "Where", next with and / or. The value control follows the field: Tag Input for sets, Date Range Picker for dates, Number Input for amounts.

| Variant property | Values |
|---|---|
| Position | first, next |

Built from: `Button Icon`, `Select`, `Tag Input`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: custom: `Select`, `Combobox`, `Input`, `Button` (Serialize to the API filter format)

## Saved View Item

Component set · 3 variants · default size 240 × 32

One saved filter set (a view) in a list or sidebar: name, shared icon, item count. Click applies the filters and sort; the active view is highlighted. The Filter Bar shows "Save view" when filters change. Menu: rename, share, set as default, delete. Personal views first, then shared.

**Use for**

- A list of views in the sidebar
- The view switcher of a data grid
- Views shared with the team

**Not for**

- Changing the filters: use Filter Bar
- Links to pages: use Nav Link
- Recent chats: use Chat History Item

**Anatomy**

1. Icon: list-filter
2. Name: ui/label, one line
3. Shared (Show shared): users icon
4. Count (Show count): Badge Count

**Content and behavior**

- Click applies the filters, sort and columns; the active view is highlighted
- Personal views first, then shared
- The Filter Bar shows "Save view" when filters change
- Menu: rename, share, set as default, delete (owner only)
- Long names truncate; the full name shows in a Tooltip

**Accessibility**

- A link with aria-current="page" when active
- The menu button is named with the view ("Actions for Overdue over EUR 5k")
- Shared is in text for screen readers ("Shared")

| Variant property | Values |
|---|---|
| State | default, hover, active |

| Property | Type | Default |
|---|---|---|
| Name | text | Overdue over EUR 5k |
| Show shared | boolean | true |
| Show count | boolean | true |

Built from: `Badge Count`. Icons: list-filter, users

Tokens and styles:
- Colors: `background/accent`, `background/secondary`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `SidebarMenuItem` + `SidebarMenuBadge` + `DropdownMenu` (View = serialized filters, sort and columns per user)
