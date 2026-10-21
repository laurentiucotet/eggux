# Dropdown menu

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Actions on an object when there are more than one or two (row actions, "More" in a header).
- Not for choosing a value in a form (use `Select`) and not for navigation with many levels.

## Rules
- Items are verbs, in the client's terminology: "Edit", "Duplicate", "Archive".
- Order: most frequent first, destructive last, separated by a `Separator` and in the destructive style.
- Show only actions the actor is permitted (`actors.md`). Disabled items only when the reason is
  useful to know, with the reason shown.
- Items that open a dialog end with "..." ("Rename...").
- Shortcuts shown on the right when they exist.
- Trigger: ghost icon button with an accessible label that names the object ("Actions for Invoice #1042").
- Keyboard: arrows move, Enter selects, Escape closes and returns focus to the trigger.

## Figma
`Menu` holds `Menu Item`, `Menu Label` and `Menu Separator` instances in its native slot `Items`.
A highlighted destructive item uses a filled `background/destructive` row with white text, because
red text on a light red tint fails contrast.
- `Menu Item` Show description adds a muted second line (visibility, roles: on every item of that
  group); Submenu adds a chevron that opens a second Menu, one level deep. Example "menu with
  descriptions".

## Menubar
- Desktop-style menus in a row (File, Edit, View, Help) for editors and tools with many
  commands. Not for site or app navigation: use Navigation or Sidebar.
- Click opens a menu; while one is open, hover moves to the next. Arrows move between menus,
  Esc closes. Every command also has a shortcut or another place in the UI.
- Figma: `Menubar Trigger` (default, hover, open; Label) in the `Menus` slot of `Menubar`.
  Example "menubar open" on the Menu page.

## Related components
- The avatar in the Top Bar or Sidebar User opens `Account Menu`: name and email, Profile, Settings,
  Theme, Keyboard shortcuts, then Log out last. Workspace switching stays in Org Switcher.
