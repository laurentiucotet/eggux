# Skeleton

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Skeleton](#skeleton) | 3 | - |
| [Skeleton Preset](#skeleton-preset) | 5 | - |

On the Figma page: "Example / Skeleton presets", "Example / list row loading", "Stress test / Skeleton", "Stress test / Skeleton Preset"

## Skeleton

Component set · 3 variants · default size 240 × 16

shadcn Skeleton (bg-accent). Resize instances to mirror the real layout. Show only after ~300 ms. Usage: eggux build-ui/components/skeleton.md, patterns/loading-states.md

**Use for**

- First load of a page, table, card or list
- Waits of ~300 ms to 2 s in a content area
- Table rows that match the column layout

**Not for**

- Loading inside one element (button, row): use Spinner
- Known progress: use Progress
- Refetching data already on screen: keep the old content
- Under ~300 ms: show nothing

**Anatomy**

1. Shape=text: one line of text
2. Shape=circle: an avatar
3. Shape=block: an image, card or chart

**Content and behavior**

- Mirror the real layout: same rows, columns, avatar and text widths
- Show it only after ~300 ms, so it does not flash
- Header and navigation render immediately; only content uses skeletons
- Animation is subtle and stops with reduced motion
- Resize instances to fit; never detach

**Accessibility**

- The loading region has aria-busy="true"
- Skeleton shapes are hidden from screen readers
- Announce completion when it matters

| Variant property | Values |
|---|---|
| Shape | text, circle, block |

Tokens and styles:
- Colors: `background/accent`
- Radius: `radius/full`, `radius/md`, `radius/xl`

Guides: [skeleton](../../skills/build-ui/components/skeleton.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Skeleton`, `Spinner`, `Kbd` (`KbdGroup`) (Kbd text `text-foreground` (not `text-muted-foreground`): muted text on `bg-muted` is 4.35:1 in Light)

## Skeleton Preset

Component set · 5 variants · default size 360 × 64

Ready-made loading placeholders built from Skeleton shapes, in the shape of the content they stand for. Type: list-row (avatar, two lines, a trailing value; lists, inboxes, feeds), card (image, title and two lines; card grids), table-row (checkbox, avatar, name, status, two values; repeat it under the real table header), stat (label, value, footnote; Stat Card and Metric Strip), chart (title, bars and axis; Chart Card and Dashboard Widget).


Every preset FILLs the width it is given (list-row min 240, card 220, table-row 480, stat 160, chart 320). Repeat a row 3 to 5 times, never more than the screen shows. Show only after ~300 ms; swap for the real content without moving the layout. Mark the region aria-busy and never animate it for people who prefer reduced motion.


Use Skeleton (Shape) to draw a custom layout, a Spinner for a short action, and Loading Overlay when old content stays visible.


Usage: eggux build-ui/components/skeleton.md

**Use for**

- Lists, inboxes and feeds: Type=list-row
- Card grids: Type=card
- Tables: Type=table-row under the real header
- Stat Card and Metric Strip: Type=stat
- Chart Card and Dashboard Widget: Type=chart

**Not for**

- A layout no preset matches: draw it with Skeleton shapes
- Short actions: use Spinner
- Content that stays visible while it reloads: use Loading Overlay

**Anatomy**

1. list-row: circle 40, two text lines, a trailing value
2. card: block 16:9, title and two lines, card surface
3. table-row: checkbox, avatar, name (FILL), status, two values, bottom border
4. stat: label, value, footnote, card surface
5. chart: title and subtitle, 10 bars, axis labels, card surface
6. Shapes are Skeleton instances (background/accent)

**Content and behavior**

- Mirror the real layout so nothing moves when content arrives
- Repeat rows 3 to 5 times, never more than the screen shows
- Show only after ~300 ms
- Every preset FILLs its column: min widths list-row 240, card 220, table-row 480, stat 160, chart 320

**Accessibility**

- Mark the region aria-busy="true" and announce "Loading…" once
- No pulse animation with prefers-reduced-motion

| Variant property | Values |
|---|---|
| Type | list-row, card, table-row, stat, chart |

Built from: `Skeleton`

Tokens and styles:
- Colors: `background/card`, `border/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`
- Radius: `radius/xl`

Guides: [skeleton](../../skills/build-ui/components/skeleton.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Skeleton` composed per type: list-row `flex items-center gap-4 px-4 py-3` (`size-10 rounded-full`, lines `h-4 w-full`, `h-3 w-32`); card `Card p-4 space-y-3` (`aspect-video`); table-row `TableRow` of `Skeleton` cells; stat `Card p-5 space-y-3` (`h-8 w-36`); chart `Card p-5` with `flex items-end gap-3 h-40` bars (Wrap the region in `aria-busy="true"`; repeat 3 to 5 rows)
