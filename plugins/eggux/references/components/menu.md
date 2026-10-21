# Menu

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Menu Item](#menu-item) | 6 | - |
| [Menu Label](#menu-label) | 1 | - |
| [Menu](#menu) | 1 | Items |

## Menu Item

Component set · 6 variants · default size 216 × 32

Row inside Menu (Dropdown, Select, Context menu). Checked shows the selected value in a Select. Destructive goes last, after a separator. Usage: eggux build-ui/components/dropdown-menu.md

| Variant property | Values |
|---|---|
| Variant | default, destructive |
| State | default, highlighted, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Edit |
| Leading icon | boolean | false |
| Shortcut | boolean | false |
| Shortcut text | text | ⌘E |
| Checked | boolean | false |

Icons: check, pencil, trash-2

Tokens and styles:
- Colors: `background/accent`, `background/destructive`, `foreground/accent`, `foreground/destructive`, `foreground/muted`, `foreground/popover`
- Spacing and size: `density/menu-padding-y`, `spacing/2`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/caption`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `DropdownMenu`, `ContextMenu`

## Menu Label

Component · 1 variant · default size 216 × 32

Group heading inside a Menu (ui/caption, muted). Use with a Separator between groups; not clickable.

| Property | Type | Default |
|---|---|---|
| Label | text | Details |

Tokens and styles:
- Colors: `foreground/popover`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `ui/label`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [popover](../../skills/build-ui/components/popover.md)

## Menu

Component · 1 variant · default size 224 × 179

Popover list for Dropdown menu, Select and context menus. "Items" is a native slot: add Menu Item, Menu Label and Menu Separator instances. Usage: eggux build-ui/components/dropdown-menu.md

Slots (fill them in the instance, never detach): `Items`

Built from: `Menu Item`, `Menu Label`, `Separator`

Tokens and styles:
- Colors: `background/popover`, `border/default`
- Spacing and size: `spacing/1`, `spacing/56`
- Radius: `radius/md`
- Effects: `shadow/md`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `DropdownMenu`, `ContextMenu`
