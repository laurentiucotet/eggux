# Pattern: loading states

**Problem:** waiting without feedback feels broken; the wrong indicator makes the page jump or flash.
**Heuristic:** visibility of system status.

## Choose by duration and scope
| Wait | Scope | UI |
|---|---|---|
| < 300 ms | Any | Nothing extra; the state change is the feedback |
| 300 ms - 2 s | Content area (page, table, card) | Skeleton matching the layout |
| 300 ms - 2 s | One element (button, row, toggle) | Spinner inside it, element blocked |
| > 2 s, known length | Upload, import, export | Progress bar with percentage or "N of M" |
| > 10 s | Background job | Let the user continue; notify on completion (toast, badge) |

## Rules
- First load of a page: skeleton for content, real header and navigation immediately.
- Refetching data the user already sees: keep the old content, show a subtle indicator, never
  replace it with a skeleton.
- Optimistic update when the action almost always succeeds (toggle, rename, reorder); roll back
  with an inline error or toast if it fails.
- Long operations can be cancelled when the system allows it.
- A load that fails shows the error empty state (`empty-state.md`) with "Try again", in the same
  area the content would occupy.

## shadcn / Figma
`Skeleton`, `Progress`, spinner icon inside `Button`. See `components/skeleton.md`.

Spinner, Progress and Skeleton components: `components/indicators.md`, `components/progress-and-slider.md`.
- When a card reloads in place, cover its content (not its header) with a Loading Overlay and disable the control that triggered it.

## Related components
- Refetching a region the user already sees uses `Loading Overlay` (old content faded, Spinner and
  label). Background jobs over ~10 s use `Background Job` in a panel or corner, with Download when done
  and Retry when failed. AI writing in place uses `AI Loading`.
