# Drawer

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Sheet](#sheet) | 2 | Header, Content, Footer |
| [Drawer](#drawer) | 1 | Header, Content, Footer |

On the Figma page: "Example / bottom drawer on mobile", "Example / sheet over list"

## Sheet

Component set · 2 variants · default size 384 × 800

Side drawer (shadcn Sheet). Full height, 384 wide. Use for editing or inspecting one object without leaving the list, and for the mobile sidebar (left). Built from Dialog Header + Dialog Footer.

| Variant property | Values |
|---|---|
| Side | right, left |

Slots (fill them in the instance, never detach): `Header`, `Content`, `Footer`

Built from: `Dialog Footer`, `Dialog Header`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/4`, `spacing/6`, `spacing/96`
- Radius: `radius/md`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md), [popover](../../skills/build-ui/components/popover.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [mobile](../../skills/build-ui/patterns/mobile.md)

Code: shadcn `Sheet`, `Drawer` (vaul)

## Drawer

Component · 1 variant · default size 390 × 393

Bottom drawer (shadcn Drawer / vaul). Mobile-first: filters, quick actions, short forms, confirmations. Drag handle on top, full-width stacked buttons. On desktop the same content usually becomes a Dialog or Sheet.

| Property | Type | Default |
|---|---|---|
| Handle | boolean | true |

Slots (fill them in the instance, never detach): `Header`, `Content`, `Footer`

Built from: `Button`, `Dialog Header`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/24`, `spacing/4`, `spacing/6`
- Radius: `radius/full`, `radius/md`, `radius/xl`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md), [tour](../../skills/build-ui/components/tour.md), [mobile](../../skills/build-ui/patterns/mobile.md)

Code: shadcn `Sheet`, `Drawer` (vaul)
