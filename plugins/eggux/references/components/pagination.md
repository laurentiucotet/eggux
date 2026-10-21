# Pagination

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Pagination Item](#pagination-item) | 11 | - |
| [Pagination](#pagination) | 1 | Items |

On the Figma page: "Example / table footer", "Stress test / Pagination"

## Pagination Item

Component set · 11 variants · default size 36 × 36

One pagination control (shadcn Pagination). Current page = active (outline). Hide Previous/Next labels on mobile (icons only).

| Variant property | Values |
|---|---|
| Type | page, previous, next, ellipsis |
| State | default, hover, active, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | 1 |

Icons: chevron-left, chevron-right, ellipsis

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/2_5`, `spacing/4`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

## Pagination

Component · 1 variant · default size 386 × 36

Page navigation for long lists and tables. Show first, last, current ±1 and ellipsis. For feeds prefer "Load more"; for tables pair it with the row count and rows-per-page Select.

**Use for**

- Tables and lists where people compare, return to a position or share a page link
- More than ~25 rows that are not virtualized
- Under a table, inside Table Pagination with the range and rows per page

**Not for**

- Feeds, activity and search results browsed once: use a Load more button or infinite scroll
- Fewer than ~25 rows: show them all, no pagination
- Steps of a flow: use Stepper

**Anatomy**

1. Previous: Pagination Item Type=previous
2. Pages: Pagination Item Type=page, the current one in State=active
3. Gaps: Pagination Item Type=ellipsis
4. Next: Pagination Item Type=next
5. Items slot that holds the Pagination Items

**Content and behavior**

- Show first, last, current ±1 and an ellipsis for each gap
- Exactly one page in State=active (outline): the current page
- Previous and Next are disabled on the first and last page, never hidden
- In tables, pair it with the total and a rows-per-page Select: use Table Pagination
- Filters, sort and page live in the URL; changing filters resets to page 1
- Mobile: Previous and Next as icons only, plus "Page 2 of 25"

**Accessibility**

- Wrap it in a nav with aria-label="Pagination"
- The current page has aria-current="page"
- Icon-only Previous and Next have labels: "Previous page", "Next page"
- Every item is reachable with Tab and shows the focus ring (State=focus)

Slots (fill them in the instance, never detach): `Items`

Built from: `Pagination Item`

Tokens and styles:
- Spacing and size: `spacing/1`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

Code: shadcn `Pagination`, `Breadcrumb`
