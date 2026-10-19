# Skeleton, Spinner and Progress

Usage guidelines only. Visual specs live in the Figma component. When to use each:
`patterns/loading-states.md`.

## Rules
- Skeleton mirrors the real layout (same rows, columns, avatar and text widths), so the page does
  not jump when content arrives.
- Skeletons for content areas; spinners only inside the element that triggered the action
  (button, row, icon).
- Progress bar for known duration or steps (upload, import). Show the percentage or "3 of 10".
- No skeleton for less than ~300 ms of loading: it flashes. Delay showing it.
- Uses `background/muted`; animation is subtle and respects `prefers-reduced-motion`.
- Mark the loading region `aria-busy="true"` and announce completion when it matters.

## Figma
`Skeleton` shapes: text, circle, block. Resize instances; see the "list row loading" example.
