# Skeleton

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Skeleton](#skeleton) | 3 | - |

On the Figma page: "Example / list row loading", "Stress test / Skeleton"

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

Code: shadcn `Skeleton`, `Spinner`, `Kbd` (`KbdGroup`)
