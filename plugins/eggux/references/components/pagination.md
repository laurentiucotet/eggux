# Pagination

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Pagination Item](#pagination-item) | 11 | - |
| [Pagination](#pagination) | 3 | Items |
| [Pagination Compact](#pagination-compact) | 1 | - |
| [Load More](#load-more) | 2 | - |
| [Pager Link](#pager-link) | 6 | - |

On the Figma page: "Example / Pagination styles", "Example / in docs page footer", "Example / in product grid", "Example / recent payments card", "Example / table footer", "Stress test / Load More", "Stress test / Pager Link", "Stress test / Pagination", "Stress test / Pagination Compact"

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
- Radius: `button/radius`
- Text styles: `ui/label`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

Code: shadcn `Pagination` (`PaginationItem`), `Breadcrumb` (`BreadcrumbItem`) (In tables use `Table Pagination`)

## Pagination

Component set · 3 variants · default size 386 × 36

Page navigation. Style=numbered (default): previous, pages with the current one active, ellipsis and next, for tables and long lists people jump around in; show first, last, current ±1. Style=simple: Previous, "Page 2 of 10" (Label) and Next, for articles, search results and mobile lists where people only step forward and back; disable Previous on the first page and Next on the last (exposed items). Style=dots: Carousel Indicator dots for onboarding and carousels, never for data lists. For feeds prefer Load More; in tables use Table Pagination.


Never narrower than its items (numbered 386, simple 278, dots 76); in narrow places use Pagination Compact or Style=simple.


Usage: eggux build-ui/components/pagination.md

**Use for**

- Tables and lists where people compare, return to a position or share a page link
- More than ~25 rows that are not virtualized
- Under a table, inside Table Pagination with the range and rows per page
- Style=simple: article lists, search results and mobile, where people only step forward and back
- Style=dots: onboarding steps, carousels and image galleries with up to ~7 positions

**Not for**

- Feeds, activity and search results browsed once: use Load More or infinite scroll
- Fewer than ~25 rows: show them all, no pagination
- Steps of a flow: use Stepper
- Style=dots for data lists: people cannot jump or see the count

**Anatomy**

1. Style: numbered (default), simple, dots
2. numbered: Items slot with Pagination Items (previous, pages, ellipsis, next); current page State=active
3. simple: Pagination Item previous (exposed), Label "Page 2 of 10" (body/small, muted), Pagination Item next (exposed)
4. dots: Carousel Indicator Type=dots (exposed); the Items slot is hidden in simple and dots

**Content and behavior**

- Show first, last, current ±1 and an ellipsis for each gap
- Exactly one page in State=active (outline): the current page
- Previous and Next are disabled on the first and last page, never hidden
- In tables, pair it with the total and a rows-per-page Select: use Table Pagination
- Filters, sort and page live in the URL; changing filters resets to page 1
- Mobile: Previous and Next as icons only, plus "Page 2 of 25"
- Narrow places (a card, a side panel, mobile): Pagination Compact with "Page 2 of 12"
- Style=simple: disable previous on the first page and next on the last (exposed items, State=disabled)
- Style=dots: one dot per position, the current one active; pair with swipe and arrows, never as the only control in a data list
- Never narrower than its items (numbered 386, simple 278, dots 76): the minimum width is set; in narrow places use Pagination Compact or Style=simple

**Accessibility**

- Wrap it in a nav with aria-label="Pagination"
- The current page has aria-current="page"
- Icon-only Previous and Next have labels: "Previous page", "Next page"
- Every item is reachable with Tab and shows the focus ring (State=focus)

| Variant property | Values |
|---|---|
| Style | numbered, simple, dots |

| Property | Type | Default |
|---|---|---|
| Label | text | Page 2 of 10 |

Slots (fill them in the instance, never detach): `Items`

Built from: `Carousel Indicator`, `Pagination Item`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`
- Text styles: `body/small`

Guides: [pagination](../../skills/build-ui/components/pagination.md)

Code: shadcn `Pagination` (`PaginationItem`), `Breadcrumb` (`BreadcrumbItem`) (In tables use `Table Pagination`)

## Pagination Compact

Component · 1 variant · default size 158 × 32

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

End of a feed or long list that grows in place: "Showing 20 of 248 invoices" and an outline Button. The Button is exposed: set its Label to how many it loads ("Load 20 more"). State=loading disables it with a Spinner.


Usage: eggux build-ui/components/pagination.md

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
2. Button (exposed instance): Label "Load 20 more", outline (State=loading shows a Spinner)

**Content and behavior**

- The label says how many it loads ("Load 20 more")
- Hide the button when everything is shown; keep the count
- Keep the scroll position and move focus to the first new item
- Loading keeps the button width and disables it
- On error, keep the loaded items and show Retry
- Resize: the count fills, centered, up to 2 lines with an ellipsis; the button hugs

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

Code: custom (Count `w-full text-center line-clamp-2`)

## Pager Link

Component set · 6 variants · default size 376 × 74

Previous / next link at the end of a docs page or article: a bordered card with a caption and an arrow on the matching side, then the title of the linked page (Title). Direction=previous sits left and reads "Previous"; Direction=next sits right and reads "Next" (override the caption text directly to localize it). Use both in a row of two equal columns, or only one on the first and last page. The whole card is the link (State=hover, focus). For pages of a table or list use Pagination. Usage: eggux build-ui/components/pagination.md

**Use for**

- The end of a docs page, before the footer (Block / Docs Page Footer)
- Moving through the articles of a guide or a course in order
- Previous and next post at the end of a blog article

**Not for**

- Pages of a table or list: use Pagination
- Steps of a flow or form: use Stepper
- Related links that are not in a sequence: use Post Card Layout=compact or List Item

**Anatomy**

1. Caption row: chevron icon on the side of the Direction and the caption text set by variant ("Previous" / "Next"), ui/caption, muted
2. Title: title of the linked page, ui/label
3. Card: background/card, border/default, radius/xl

**Content and behavior**

- Direction=previous on the left, Direction=next on the right, in two equal columns
- The caption text comes from the Direction ("Previous" / "Next"); override the text layer directly only to localize it
- Title is the exact title of the linked page, never "Next page"
- On the first page show only Next, on the last only Previous; keep the empty column so Next stays on the right
- The whole card is the link: State=hover and State=focus

**Accessibility**

- Wrap both links in a nav with aria-label="Previous and next page"
- The link text reads "Previous: <title>"; the chevron is aria-hidden
- Focus shows the focus ring (State=focus)

| Variant property | Values |
|---|---|
| Direction | previous, next |
| State | default, hover, focus |

| Property | Type | Default |
|---|---|---|
| Title | text | Approval limits by amount |

Icons: chevron-left, chevron-right

Tokens and styles:
- Colors: `background/accent`, `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/4`, `spacing/5`
- Radius: `radius/xl`
- Text styles: `ui/caption`, `ui/label`

Guides: [pagination](../../skills/build-ui/components/pagination.md), [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: `<a>` card (`rounded-xl border p-4 hover:bg-accent focus-visible:ring`) with lucide `ChevronLeft` / `ChevronRight`, two of them in a `<nav>` (Docs prev/next; for tables and lists use `Pagination`)
