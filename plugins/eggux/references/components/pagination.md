# Pagination

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Pagination](#pagination) | 1 | Items |
| [Pagination Item](#pagination-item) | 11 | - |
| [Pagination Compact](#pagination-compact) | 1 | - |
| [Load More](#load-more) | 2 | - |

On the Figma page: "Example / table footer", "Stress test / Load More", "Stress test / Pagination", "Stress test / Pagination Compact"

## Pagination

Component · 1 variant · default size 386 × 36

Page navigation for long lists and tables. Show first, last, current ±1 and ellipsis. For feeds prefer "Load more"; for tables pair it with the row count and rows-per-page Select.

**Use for**

- Tables and lists where people compare, return to a position or share a page link
- More than ~25 rows that are not virtualized
- Under a table, inside Table Pagination with the range and rows per page

**Not for**

- Feeds, activity and search results browsed once: use Load More or infinite scroll
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
- Narrow places (a card, a side panel, mobile): Pagination Compact with "Page 2 of 12"

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

Code: shadcn `Pagination` (`PaginationItem`), `Breadcrumb` (`BreadcrumbItem`) (In tables use `Table Pagination`)

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

Code: shadcn `Pagination` (`PaginationItem`), `Breadcrumb` (`BreadcrumbItem`) (In tables use `Table Pagination`)

## Pagination Compact

Component · 1 variant · default size 163 × 32

Previous and next with "Page 2 of 12" for narrow places: a card, a side panel, mobile, a table in a dashboard. Disable previous on the first page and next on the last (exposed Button Icons, State=disabled). Large lists with jumps use Pagination.

**Use for**

- A list inside a card or a side panel
- Tables in dashboards
- Mobile

**Not for**

- Large lists where people jump to a page: use Pagination
- Tables with rows per page and totals: use Table Pagination
- Feeds: use Load More or infinite scroll

**Anatomy**

1. Previous: Button Icon outline sm (exposed)
2. Label: "Page 2 of 12", body/small, muted
3. Next: Button Icon outline sm (exposed)

**Content and behavior**

- Disable previous on the first page and next on the last; never hide them
- The label counts pages, or items ("21-40 of 248") when that helps more
- Page lives in the URL when the list is a page of its own

**Accessibility**

- nav with aria-label="Pagination"
- Buttons have aria-labels "Previous page" and "Next page"
- The label is announced when the page changes

| Property | Type | Default |
|---|---|---|
| Label | text | Page 2 of 12 |

Built from: `Button Icon`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

Code: shadcn `Pagination` with `PaginationPrevious`, a text item, `PaginationNext`

## Load More

Component set · 2 variants · default size 560 × 60

End of a feed or a long list that grows in place: how many are shown out of the total, and a button that loads the next page. Keeps scroll position and moves focus to the first new item. Use for feeds, activity and search results; tables where people jump to a page use Pagination.

**Use for**

- Feeds and activity
- Search results browsed once
- Lists of cards, comments or reviews

**Not for**

- Tables where people jump to a page: use Pagination
- Tables with rows per page: use Table Pagination
- Narrow lists inside a card: use Pagination Compact

**Anatomy**

1. Count: "Showing 20 of 248 invoices", body/small, muted
2. Button: "Load 20 more", outline (State=loading shows a Spinner)

**Content and behavior**

- The label says how many it loads ("Load 20 more")
- Hide the button when everything is shown; keep the count
- Keep the scroll position and move focus to the first new item
- Loading keeps the button width and disables it
- On error, keep the loaded items and show Retry

**Accessibility**

- The count is in a live region (aria-live="polite") and updates after loading
- The button has aria-busy while loading
- Focus moves to the first new item so keyboard users continue from there

| Variant property | Values |
|---|---|
| State | default, loading |

| Property | Type | Default |
|---|---|---|
| Count | text | Showing 20 of 248 invoices |

Built from: `Button`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `ui/caption`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

Code: shadcn `Button variant="outline"` + count; TanStack Query `useInfiniteQuery` (Focus the first new item; count in `aria-live`)
