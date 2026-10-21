# List & Tree

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [List Item](#list-item) | 5 | Leading, Trailing |
| [Tree Item](#tree-item) | 36 | - |
| [Sortable List Item](#sortable-list-item) | 4 | Trailing |

On the Figma page: "Example / navigation tree", "Example / permissions tree", "Stress test / Sortable List Item"

## List Item

Component set · 5 variants · default size 384 × 58

Row in a content list (people, files, appointments). Different from Menu Item (an action in a popover) and Sidebar Item (navigation). Leading and Trailing are native slots.

| Variant property | Values |
|---|---|
| State | default, hover, selected, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Title | text | Ana Popescu |
| Description | text | Last order: 12 Nov, 09:30 |
| Show description | boolean | true |

Slots (fill them in the instance, never detach): `Leading`, `Trailing`

Built from: `Avatar`, `Badge`. Icons: chevron-right

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/muted`, `foreground/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/list-padding-y`, `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/96`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

## Tree Item

Component set · 36 variants · default size 256 × 32

Row of a tree (navigation, folders, permissions). Type: collapsed, expanded, leaf. Level 0-3 sets the indent (16 px per level). Checkbox (exposed) for multi-select trees: a parent shows indeterminate when some children are checked.

| Variant property | Values |
|---|---|
| Type | collapsed, expanded, leaf |
| State | default, hover, selected |
| Level | 0, 1, 2, 3 |

| Property | Type | Default |
|---|---|---|
| Label | text | Design |
| Checkbox | boolean | false |
| Icon | boolean | true |
| Icon type | instance swap | Icon/file-text |
| Count | boolean | false |

Built from: `Badge Count`, `Checkbox`. Icons: chevron-down, chevron-right, file-text

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `foreground/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/14`, `spacing/2`, `spacing/6`, `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

## Sortable List Item

Component set · 4 variants · default size 480 × 58

A row people reorder (columns, form fields, steps, priorities): drag handle, label, description, Trailing slot (switch, menu). dragging = lifted with shadow; drop-target = primary line where it will land. Keyboard: focus the handle, Space to pick up, arrows to move, Space to drop; announce the new position. Offer Move up / Move down in the menu too. Label truncates on one line, description on two.

| Variant property | Values |
|---|---|
| State | default, hover, dragging, drop-target |

| Property | Type | Default |
|---|---|---|
| Label | text | Invoice number |
| Description | text | Shown in the table and in exports |
| Show description | boolean | true |

Slots (fill them in the instance, never detach): `Trailing`

Built from: `Button Icon`. Icons: grip-vertical

Tokens and styles:
- Colors: `background/card`, `background/muted`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/2`, `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/lg`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md), [select](../../skills/build-ui/components/select.md)

Code: `@dnd-kit/sortable` with keyboard sensor and announcements (Drag handle = `useSortable` listeners)
