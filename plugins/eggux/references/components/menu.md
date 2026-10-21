# Menu

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Menu Item](#menu-item) | 6 | - |
| [Menu Label](#menu-label) | 1 | - |
| [Menu](#menu) | 1 | Items |
| [Menubar Trigger](#menubar-trigger) | 3 | - |
| [Menubar](#menubar) | 1 | Menus |

On the Figma page: "Example / actions menu under a header button", "Example / menubar open", "Stress test / Menu", "Stress test / Menubar"

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

**Use for**

- Actions on an object when there are more than one or two: row actions, More in a header
- Right-click context menus
- The option list of a Select

**Not for**

- Choosing a value in a form: use Select
- Deep navigation: use Sidebar or Navigation Menu
- Searching many options: use Command (Combobox)

**Anatomy**

1. Items slot
2. Menu Label: group heading, not clickable
3. Menu Item: Leading icon, Label, Shortcut text, Checked
4. Separator between groups
5. Destructive Menu Item last

**Content and behavior**

- Items are verbs: "Edit", "Duplicate", "Archive"; items that open a dialog end with "..."
- Most frequent first, destructive last after a Separator
- Show only permitted actions; disabled items only with a useful reason
- Shortcuts on the right when they exist
- Highlighted destructive uses a filled background/destructive row with white text

**Accessibility**

- Arrows move, Enter selects, Escape closes and returns focus to the trigger
- Trigger is a Button Icon labeled with the object: "Actions for Invoice #1042"
- Menu Item Checked uses menuitemcheckbox or the option role in a Select

Slots (fill them in the instance, never detach): `Items`

Built from: `Menu Item`, `Menu Label`, `Separator`

Tokens and styles:
- Colors: `background/popover`, `border/default`
- Spacing and size: `spacing/1`, `spacing/56`
- Radius: `radius/md`
- Effects: `shadow/md`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `DropdownMenu`, `ContextMenu`

## Menubar Trigger

Component set · 3 variants · default size 48 × 28

One top-level menu in a Menubar. Hover highlights it; open shows the Menu below it. While one menu is open, hovering another trigger opens that one. Use only inside Menubar.

| Variant property | Values |
|---|---|
| State | default, hover, open |

| Property | Type | Default |
|---|---|---|
| Label | text | File |

Tokens and styles:
- Colors: `background/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `ui/label`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md)

Code: shadcn `Menubar` (`MenubarMenu`, `MenubarTrigger`, `MenubarContent`)

## Menubar

Component · 1 variant · default size 233 × 38

Desktop app menus in a row (File, Edit, View, Help), for editors and tools with many commands. Fill the Menus slot with Menubar Triggers; each opens a Menu with items, shortcuts and submenus. Arrow keys move between menus, Esc closes. Not for site navigation: use Navigation or Sidebar.

**Use for**

- Editors and desktop-like tools with many commands
- Products where users expect File, Edit, View menus
- Report or document builders with File, Insert and Format menus

**Not for**

- Site or app navigation: use Navigation Menu or Sidebar
- A few actions on one object: use a Menu from a Button

**Anatomy**

1. Menus slot of Menubar Triggers
2. Menubar Trigger: Label
3. Menu under the open trigger: items, shortcuts, submenus

**Content and behavior**

- Menubar Trigger State: default, hover, open
- Click opens a menu; while one is open, hovering another trigger opens that one
- Every command also has a shortcut or another place in the UI
- Menubar Trigger is used only inside Menubar

**Accessibility**

- Left and right arrows move between menus, Esc closes
- Role menubar with menuitem triggers
- Focus returns to the trigger on close

Slots (fill them in the instance, never detach): `Menus`

Built from: `Menubar Trigger`

Tokens and styles:
- Colors: `background/default`, `border/default`
- Spacing and size: `spacing/1`
- Radius: `radius/md`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md)

Code: shadcn `Menubar` (`MenubarMenu`, `MenubarTrigger`, `MenubarContent`)
