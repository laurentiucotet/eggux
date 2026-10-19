# EGG UI v2: what exists in Figma

Inventory of the master library (`BufvaVkSh9vMWPye117Ucd`). Client files start as a duplicate,
so the same names exist there. Use instances of these; build something new only when nothing
fits, and say so. When this list and the file disagree, the file wins: update this list.

## Foundations
- Variables: `Primitives` (Value), `Semantic` (Light, Dark), `Components` (Light, Dark). See `tokens.md`.
- Text styles: see `tokens.md`. Effect styles: `shadow/*`, `blur/*`, `backdrop-blur/*`.

## Components

| Page | Component | Variants | Properties |
|---|---|---|---|
| Icons | `Icon/<name>` | - | Lucide, 24 px, stroke bound to `foreground/default`. Rescale to 16 (UI) or 12 (badge) |
| Button | `Button` | Variant: default, secondary, outline, ghost, destructive, link. Size: sm, default, lg. State: default, hover, focus, disabled | Label; Leading icon, Trailing icon (boolean + swap) |
| Button | `Button Icon` | Variant: default, secondary, outline, ghost, destructive. State: as Button | Icon (swap) |
| Badge | `Badge` | Variant: default, secondary, destructive, outline, success, warning, info | Label; Icon (boolean + swap) |
| Input | `Input` | State: default, focus, error, disabled. Content: placeholder, filled | Value; Leading icon (boolean + swap) |
| Input | `Field` | State: default, error, disabled | Label, Hint, Show hint, Error. Nested Input is exposed |
| Alert | `Alert` | Variant: default, destructive, success, warning, info | Title, Description, Show description |
| Card | `Card` | - | Title, Description, Show description, Show action, Show footer. Content (native slot). Nested buttons exposed |
| Selection controls | `Checkbox` | Checked: false, true, indeterminate. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Radio` | Checked: false, true. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Switch` | Checked: false, true. State: default, focus, disabled | Label, Show label |
| Skeleton | `Skeleton` | Shape: text, circle, block | Resize instances to the real layout |
| Tooltip | `Tooltip` | Side: top, bottom, left, right (where it sits relative to the trigger) | Label |
| Menu | `Menu Item` | Variant: default, destructive. State: default, highlighted, disabled | Label, Leading icon, Shortcut + Shortcut text, Checked |
| Menu | `Menu Label`, `Menu Separator` | - | Label |
| Menu | `Menu` | - | Items (native slot). Base for Dropdown menu, Select options and context menus |
| Select | `Select` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Open state = Select (focus) + Menu with Checked on the selected item |
| Tabs | `Tab` | Style: pill, line. State: default, active, focus, disabled | Label |
| Tabs | `Tabs`, `Tabs Line` | - | Tabs (native slot of Tab instances) |
| Toast | `Toast` | Type: default, success, error, warning, info, loading | Show description, Action (nested Button exposed). Text edited per instance |
| Dialog | `Dialog` | - | Title, Description, Show description, Show footer, Show close. Content (native slot) |
| Dialog | `Alert Dialog` | - | Title, Description. Footer buttons exposed |
| Table | `Table Cell` | Type: header, body. Align: left, right | Text |
| Table | `Table Cell Slot` | - | Content (native slot, default: Badge) |
| Table | `Table Row` | Type: header, body. State: default, hover, selected | Cells (native slot) |

Icons available: plus, minus, check, x, search, chevron-down, chevron-up, chevron-left,
chevron-right, chevrons-up-down, arrow-up-down, info, circle-alert, triangle-alert, circle-check,
loader-circle, mail, trash-2, ellipsis, pencil, copy, archive, user, settings, log-out, calendar. Add more on the Icons page
as Lucide components with the same structure.

## Conventions used
- Variant values use the shadcn prop values (`Variant=outline`, `Size=sm`), so Figma maps 1:1 to code.
- Focus is a 2 px gap (`background/default`) plus a 4 px ring (`border/ring`), as drop shadows.
- Disabled is the variant at `opacity/50`.
- Text inside a variant is bound to a TEXT property, so text styling is shared by all variants.
  Per-variant decoration (like the link hover underline) is drawn with a frame stroke instead.

## Slots
Content areas use Figma native slots (component property type `SLOT`), never instance-swap
placeholders. A slot holds a dashed placeholder by default; in an instance, delete it and put
any layers or instances inside.

- In Figma: select the slot in the instance and add content to it. "Reset slot" brings back the default.
- Through the Plugin API (build-ui): `inst.findOne(n => n.type === 'SLOT')`, remove its
  placeholder, `appendChild` the content, then set `layoutSizingHorizontal = 'FILL'` on each child.
- Creating a slot in a library component: `component.createSlot()` adds the node and a `SLOT`
  property. In a component set, create the slot in every variant before `combineAsVariants`:
  slots with the same name merge into one property. Rename the property with `editComponentProperty(key, { name, description })`, give the
  slot auto layout and token-bound padding, and add a placeholder as default content.
- Use a slot when the content varies per use (card body, dialog body, table cell content). Use
  boolean or TEXT properties when the variation is fixed (show footer, title text).

## Examples on the pages
Some pages hold example frames (not components) that show composition: list row loading
(Skeleton), icon button with tooltip, open select, dialog over page, invoices table. Copy them
as a starting point.

## Not built yet
Combobox, Textarea, Popover, Sheet, Drawer, Date picker, Pagination, Breadcrumb, Avatar, Sidebar.
Until they exist, compose from the components above, tokens and text styles, and flag it.
