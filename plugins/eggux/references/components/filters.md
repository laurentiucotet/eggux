# Filters

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Filter Condition](#filter-condition) | 2 | - |
| [Filter Group](#filter-group) | 1 | Conditions |
| [Filter Chip](#filter-chip) | 6 | - |
| [Facet Option](#facet-option) | 4 | - |
| [Faceted Filter](#faceted-filter) | 1 | Items |
| [Filter Section](#filter-section) | 2 | Options |
| [Filter Bar](#filter-bar) | 1 | End, Filters |

On the Figma page: "Stress test / Filters"

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

## Filter Group

Component · 1 variant · default size 800 × 126

Nested group of conditions joined by the same and / or, on a muted background. One level of nesting is enough for most products.

Slots (fill them in the instance, never detach): `Conditions`

Built from: `Button`, `Filter Condition`

Tokens and styles:
- Colors: `background/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: custom: `Select`, `Combobox`, `Input`, `Button` (Serialize to the API filter format)

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

## Faceted Filter

Component · 1 variant · default size 240 × 247

Popover opened from a Filter Chip: search, values with checkboxes and counts (Items slot of Facet Options), Clear filters. Applies on each click, no Apply button; Escape closes. Over 8 values: keep the search; selected values first.

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

## Filter Section

Component set · 2 variants · default size 256 × 229

A group in a filter side panel: title, number of selected values, collapse. Options slot holds Facet Options, a Slider (price range) or a Date Range Picker trigger. Show the first 5-6 values, then "Show N more". Collapsed sections keep their count visible.

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

## Filter Bar

Component · 1 variant · default size 1040 × 76

Above a list or table. First row: search and view controls (End slot: sort, columns, export). Second row: filters as Filter Chips (Filters slot, wraps on narrow screens): empty triggers "+ Owner" and active filters "Status: Overdue, Pending", then Clear all when any filter is on. Show the result count next to the table title, and an Empty State with "Clear filters" when nothing matches.

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
