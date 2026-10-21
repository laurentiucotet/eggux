# List & Tree

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [List Item](#list-item) | 5 | Leading, Trailing |
| [Tree Item](#tree-item) | 36 | - |
| [Sortable List Item](#sortable-list-item) | 4 | Trailing |

On the Figma page: "Example / in notifications", "Example / navigation tree", "Example / permissions tree", "Example / table columns", "Stress test / List Item", "Stress test / Sortable List Item", "Stress test / Tree Item"

## List Item

Component set · 5 variants · default size 384 × 58

Row in a content list (people, files, appointments). Different from Menu Item (an action in a popover) and Sidebar Item (navigation). Leading and Trailing are native slots.

**Use for**

- Lists of people, files, customers or orders
- Tables on mobile: one List Item per row with 2-3 fields
- Search results, recent items and notifications

**Not for**

- Actions in a popover: use Menu Item
- Navigation destinations: use Sidebar Item
- Comparing items across several attributes: use Table
- Hierarchies: use Tree Item

**Anatomy**

1. Leading slot: Avatar or icon
2. Title
3. Description (Show description)
4. Trailing slot: meta, Badge, chevron or one action

**Content and behavior**

- State: default, hover, selected, focus, disabled
- The whole row opens the item when it has one destination; otherwise only the title links
- Trailing holds at most one action plus meta; more actions go in a Button Icon with a Menu
- Every list has an empty state

**Accessibility**

- The row is one link or button with an accessible name from the title
- Focus state uses border/ring
- Selected is shown with more than color (check or aria-selected)

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

**Use for**

- Folders and nested navigation
- Permission trees with checkboxes
- Locations or categories with levels

**Not for**

- Flat lists: use List Item
- Deeper than 4 levels: use a different structure, such as drill-down pages

**Anatomy**

1. Indent (16 px per Level)
2. Chevron (Type collapsed or expanded; none for leaf)
3. Checkbox (Checkbox)
4. Icon (Icon, Icon type)
5. Label
6. Count (Count)

**Content and behavior**

- Type: collapsed, expanded, leaf; State: default, hover, selected; Level 0-3
- Chevron toggles expansion; clicking the label selects
- With checkboxes a parent is checked when all children are, indeterminate when some are
- Counts only where they help the task (unread, items to review)

**Accessibility**

- Role tree / treeitem with aria-expanded and aria-level
- Keyboard: up and down move, right expands, left collapses
- Checkbox state includes indeterminate (aria-checked="mixed")

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

**Use for**

- Columns of a view, fields of a form, steps of a process
- Priorities and the Selected side of a Transfer List
- Ordering of navigation items or dashboard widgets

**Not for**

- Order that does not matter: use List Item
- Moving cards between stages: use Kanban

**Anatomy**

1. Drag handle (grip-vertical)
2. Label
3. Description (Show description)
4. Trailing slot: Switch or menu

**Content and behavior**

- State: default, hover, dragging (lifted with shadow), drop-target (primary line where it lands)
- Drag by the handle only, so the row stays clickable
- Save on drop and allow Undo
- Label truncates on one line, Description on two
- Show the order number when it matters

**Accessibility**

- Focus the handle, Space picks up, arrows move, Space drops, Escape cancels
- Announce the new position: "Invoice number moved to position 2 of 6"
- Offer Move up and Move down in the row menu

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
