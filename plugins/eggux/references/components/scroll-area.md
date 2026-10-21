# Scroll Area

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Scroll Area](#scroll-area) | 2 | - |

On the Figma page: "Stress test / Scroll Area"

## Scroll Area

Component set · 2 variants · default size 320 × 240

A region that scrolls inside the page (shadcn Scroll Area): long lists in a popover, a sidebar, a table body with a fixed header, a row of cards. Clips its content on purpose and shows a thin scrollbar (thumb on border/default, wider on hover). Keep the page itself as the main scroll; never nest two scroll areas in one direction.

| Variant property | Values |
|---|---|
| Orientation | vertical, horizontal |

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/md`
- Text styles: `body/small`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

Code: shadcn `ScrollArea`, `ScrollBar orientation="horizontal"`
