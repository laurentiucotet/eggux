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

Icons available: plus, chevron-down, chevron-right, search, check, x, info, circle-alert,
triangle-alert, circle-check, loader-circle, mail, trash-2, ellipsis. Add more on the Icons page
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
  property. Rename the property with `editComponentProperty(key, { name, description })`, give the
  slot auto layout and token-bound padding, and add a placeholder as default content.
- Use a slot when the content varies per use (card body, dialog body, table cell content). Use
  boolean or TEXT properties when the variation is fixed (show footer, title text).

## Not built yet
Dialog, Select, Checkbox, Radio, Switch, Tabs, Table, Toast, Tooltip, Dropdown menu, Skeleton.
Their usage guides exist in `skills/build-ui/components/`. Until they exist in Figma, compose
from tokens and text styles and flag it.
