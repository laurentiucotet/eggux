# Scroll Area

Generated from the EGG UI master library on 2026-10-23 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Scroll Area](#scroll-area) | 2 | Content |

On the Figma page: "Example / release notes panel", "Stress test / Scroll Area"

## Scroll Area

Component set · 2 variants · default size 320 × 240

Content is a native slot: put the list, rows or cards in it in the instance; the viewport clips it and the scrollbar shows that more exists.

**Use for**

- Long lists in a popover or menu
- Sidebar content taller than the screen
- A table body under a fixed header
- A row of cards (Orientation=horizontal)

**Not for**

- The page content itself: the page is the main scroll
- A second scroll in the same direction inside another: restructure the layout
- Very long tables: use Pagination or virtualized scroll

**Anatomy**

1. Viewport: clips the content on purpose
2. Content (native slot): the list, rows or cards; vertical fills the width, horizontal fills the height
3. Scrollbar track
4. Thumb: border/default, wider on hover

**Content and behavior**

- The page stays the main scroll
- Never nest two scroll areas in the same direction
- Show that more content exists: a cut item, a fade or the scrollbar
- Give it a fixed or max height; it clips its content on purpose
- Fill the Content slot in the instance; never detach to change what scrolls

**Accessibility**

- Keyboard scrolling keeps working: arrows, Page Up, Page Down
- Without focusable content inside, the region itself is focusable
- A region that holds a distinct section has an accessible name

| Variant property | Values |
|---|---|
| Orientation | vertical, horizontal |

Slots (fill them in the instance, never detach): `Content`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/md`
- Text styles: `body/small`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

Code: shadcn `ScrollArea`, `ScrollBar orientation="horizontal"` (The Content slot is the `ScrollArea` children)
