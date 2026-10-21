# Drawer

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Sheet](#sheet) | 2 | Header, Content, Footer |
| [Drawer](#drawer) | 1 | Header, Content, Footer |

On the Figma page: "Example / bottom drawer on mobile", "Example / sheet over list", "Stress test / Drawer", "Stress test / Sheet"

## Sheet

Component set · 2 variants · default size 384 × 800

Side drawer (shadcn Sheet). Full height, 384 wide. Use for editing or inspecting one object without leaving the list, and for the mobile sidebar (left). Built from Dialog Header + Dialog Footer.

**Use for**

- Side=right: edit or inspect one customer, invoice or order from a list
- Side=right: filters with many groups on desktop, or bulk edit
- Side=left: navigation on mobile and tablet (Sidebar inside)

**Not for**

- Short focused task without the list behind it: use Dialog
- More than ~8 fields, several steps or linkable content: use a page
- Filters and quick actions on mobile: use Drawer

**Anatomy**

1. Overlay (dialog/overlay)
2. Header slot: Dialog Header, title names the object or task
3. Content slot, scrolls
4. Footer slot: Dialog Footer, fixed, primary right, Cancel outline left

**Content and behavior**

- 384 wide (spacing/96); up to 640 only for tables or previews
- Footer stays fixed at the bottom; Content scrolls
- Never open a Sheet from a Sheet; a Dialog on top only for a confirmation
- Outside click and Esc close it; unsaved input follows the unsaved changes pattern
- Filters: one compact Accordion Item per group with a Badge Count of active options

**Accessibility**

- Focus moves to the first field (or the title) on open and returns to the trigger on close
- Focus stays inside while open; Esc closes
- Close X has an accessible label; the title is the accessible name

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

**Use for**

- Mobile filters in Accordion groups, with "Show N results"
- Sort and quick actions on mobile
- A short form or confirmation within thumb reach
- Replaces a Dialog below 768 (md)

**Not for**

- Desktop: the same content becomes a Dialog (short) or Sheet (long)
- Content taller than ~70% of the screen: use Sheet or a page
- Navigation menu on mobile: use a left Sheet

**Anatomy**

1. Handle on top (Handle)
2. Header slot: Dialog Header with Close off
3. Content slot
4. Footer slot: full-width buttons stacked, primary first

**Content and behavior**

- Keep it under ~70% of the screen height
- Primary label says the result ("Show 24 results", not "Apply")
- Drag down, outside tap and Esc close it
- Keep the same Header, Content and Footer as the desktop Dialog or Sheet
- Respect the bottom safe area

**Accessibility**

- Focus moves to the first field or the title on open and returns to the trigger on close
- Dragging is never the only way to close: outside tap, Esc and Cancel also work
- Buttons at least 44 x 44

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
