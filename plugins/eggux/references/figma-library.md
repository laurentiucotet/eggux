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
| Card | `Card` | - | Title, Description, Show description, Show action, Show footer, Content (swap). Nested buttons exposed |
| Card | `Slot` | - | Placeholder for swappable content. Build the content as a local component and swap it in |

Icons available: plus, chevron-down, chevron-right, search, check, x, info, circle-alert,
triangle-alert, circle-check, loader-circle, mail, trash-2, ellipsis. Add more on the Icons page
as Lucide components with the same structure.

## Conventions used
- Variant values use the shadcn prop values (`Variant=outline`, `Size=sm`), so Figma maps 1:1 to code.
- Focus is a 2 px gap (`background/default`) plus a 4 px ring (`border/ring`), as drop shadows.
- Disabled is the variant at `opacity/50`.
- Text inside a variant is bound to a TEXT property, so text styling is shared by all variants.
  Per-variant decoration (like the link hover underline) is drawn with a frame stroke instead.

## Not built yet
Dialog, Select, Checkbox, Radio, Switch, Tabs, Table, Toast, Tooltip, Dropdown menu, Skeleton.
Their usage guides exist in `skills/build-ui/components/`. Until they exist in Figma, compose
from tokens and text styles and flag it.
