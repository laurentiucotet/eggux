# Pagination

Usage guidelines only. Visual specs live in the Figma components (Pagination page).

## Which one
| Content | Use |
|---|---|
| Tables and lists where users compare, return to a position or share a page | `Pagination` |
| Feeds, activity, search results browsed once | "Load more" button or infinite scroll |
| Fewer than ~25 rows | Nothing; show all |

## Rules
- Show first, last, current ±1 and ellipsis. Current page = `active` (outline), with
  `aria-current="page"`.
- Previous/Next are disabled (not hidden) on the first and last page.
- Pair with the total ("248 patients") and a rows-per-page Select (10, 25, 50) in tables.
- Keep filters, sort and page in the URL so the view can be shared and survives reload.
- Changing filters resets to page 1. Keep row selection across pages only when the bulk action
  says so ("12 selected across 3 pages").
- Mobile: Previous/Next as icon buttons + "Page 2 of 25".

## Figma
`Pagination Item` Type (page, previous, next, ellipsis) × State; `Pagination` with an `Items`
slot. Example "table footer" (selection count, rows per page, pagination).
