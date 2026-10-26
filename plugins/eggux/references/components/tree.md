# Tree

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tree Item](#tree-item) | 36 | - |

On the Figma page: "Example / navigation tree", "Example / permissions tree", "Stress test / Tree Item"

## Tree Item

Component set · 36 variants · default size 256 × 32

Row of a tree (navigation, folders, permissions). Type: collapsed, expanded, leaf. Level 0-3 sets the indent (16 px per level). Checkbox (exposed) for multi-select trees: a parent shows indeterminate when some children are checked. Show count shows a Badge Count; the Badge Count is exposed, so set its Count in the panel (unread, items to review).

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
3. Checkbox (Show checkbox)
4. Icon (Show icon, Icon)
5. Label
6. Count (Show count): Badge Count, exposed; set its Count in the panel

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
| Show checkbox | boolean | false |
| Show icon | boolean | true |
| Icon | instance swap | Icon/file-text |
| Show count | boolean | false |

Built from: `Badge Count`, `Checkbox`. Icons: chevron-down, chevron-right, file-text

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `foreground/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/14`, `spacing/2`, `spacing/6`, `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

Code: custom tree (`role="tree"`) with shadcn `Checkbox` and `Badge` (Arrow keys expand and collapse)
