# Drawer

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Sheet](#sheet) | 2 | Header, Content, Footer |
| [Drawer](#drawer) | 1 | Header, Content, Footer |
| [Side Panel](#side-panel) | 2 | Actions, Content, Footer |
| [Resizable Panels](#resizable-panels) | 1 | Start, End |

On the Figma page: "Example / Editor with collapsed side panel", "Example / Editor with side panel", "Example / bottom drawer on mobile", "Example / sheet over list", "Stress test / Drawer", "Stress test / Resizable Panels", "Stress test / Sheet", "Stress test / Side Panel"

## Sheet

Component set · 2 variants · default size 384 × 800

Side drawer (shadcn Sheet). Full height, 384 wide. Use for editing or inspecting one object without leaving the list, and for the mobile sidebar (left). Built from Dialog Header + Dialog Footer. Width: 384 details and filters, 480 forms, 640 a record, table or preview; full screen on mobile.

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

- Width: 384 for details and filters, 480 for forms, 640 for a record, a table or a preview; full screen on mobile
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

## Side Panel

Component set · 2 variants · default size 320 × 327

Inline panel beside the page content (an Aside): details, properties or a preview of the object being edited. Header: Title, Actions slot, collapse button (Collapsible). Content slot; optional Footer slot. Collapsed: 48 wide, expand button and vertical title. Use Sheet when the panel opens over the page. Code: an <aside> in the page grid with a collapsible state (shadcn Collapsible).

**Use for**

- Summary of the object being edited next to the form (status, codes, preview)
- Properties or settings of the selected item in an editor or builder
- Context people check while they work: related records, activity, help

**Not for**

- Editing an object from a list without leaving it: use Sheet
- Primary content of the page: put it in Main
- Navigation between pages: use Sidebar or Sidebar Double

**Anatomy**

1. Header: Title, Actions slot (menu or one Button Icon), collapse Button Icon (Collapsible)
2. Content slot: Description List Items, previews, short lists
3. Footer slot: one full-width action (Show footer)
4. Collapsed: expand Button Icon and the Title, vertical

**Content and behavior**

- 320 wide expanded, 48 collapsed; the page grid column hugs it, so Main takes the space back
- Title names what the panel shows ("Showcase info", "Properties"), not the action
- Content reads top to bottom; no tabs inside a Side Panel
- Collapsed state is remembered per user and page
- Below 1024 px open it as a right Sheet instead

**Accessibility**

- An aside landmark labeled by the Title
- Collapse and expand buttons have accessible labels and aria-expanded
- Focus stays where it was when the panel collapses

| Variant property | Values |
|---|---|
| State | expanded, collapsed |

| Property | Type | Default |
|---|---|---|
| Title | text | Details |
| Collapsible | boolean | true |
| Show footer | boolean | false |

Slots (fill them in the instance, never detach): `Actions`, `Content`, `Footer`

Built from: `Button`, `Button Icon`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`, `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [drawer](../../skills/build-ui/components/drawer.md)

Code: `<aside>` in the page grid + shadcn `Collapsible` (Right `Sheet` below 1024 px; persist the collapsed state)

## Resizable Panels

Component · 1 variant · default size 960 × 400

Two panels with a handle to drag the split: list and detail, editor and preview, code and output. Each panel has a minimum width; double-click the handle to reset. The split is remembered per person. Keyboard: focus the handle and use arrows. On narrow screens show one panel at a time.

**Use for**

- List and detail side by side (inbox, tickets)
- Editor and preview
- Code and output, or a query and its results

**Not for**

- A detail that opens on demand over the list: use Sheet
- A fixed panel of properties next to an editor: use Side Panel
- Small screens: use a Sheet for the detail over the list

**Anatomy**

1. Start slot: the first panel
2. Handle: divider with Icon/grip-vertical
3. End slot: the second panel

**Content and behavior**

- Each panel has a minimum width; content never squeezes below it
- Double-click the handle to reset the split
- The split is remembered per person
- On narrow screens show one panel at a time with a way back
- A panel can collapse to a rail when dragged past its minimum

**Accessibility**

- The handle has role="separator" with aria-valuenow, aria-valuemin and aria-valuemax
- Focus the handle and use arrows to resize; Enter collapses or restores
- The handle has a visible focus ring and a 3:1 contrast against the panels

Slots (fill them in the instance, never detach): `Start`, `End`

Icons: grip-vertical

Tokens and styles:
- Colors: `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `body/small`

Guides: [drawer](../../skills/build-ui/components/drawer.md)

Code: shadcn `Resizable` (react-resizable-panels) (`autoSaveId` remembers the split; one panel at a time on mobile)
