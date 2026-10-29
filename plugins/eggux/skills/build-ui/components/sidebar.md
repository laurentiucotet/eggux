# Sidebar

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Primary navigation of an app with more than ~5 destinations or with sections.
- Groups follow the actor's work, from `workflows.md`, not the org chart. Labels are nouns in the
  client's terminology.

## Rules
- One active item, matching the current page. A section with sub-pages shows a chevron.
- Badge Count (Show badge) only for something the actor must act on (unread, pending); never
  decorative.
- Header: the workspace; with several organizations it opens the `Org Switcher` menu. Footer:
  signed-in user with a menu (Settings, Log out).
- Collapsed mode shows icons only; every item has a Tooltip with its label.
- On mobile the sidebar becomes a Sheet opened from the page header trigger (`panel-left`).
- Keyboard: every item is reachable; the collapse trigger has an accessible label.

## Sidebar or Sidebar Double
| Navigation | Use |
|---|---|
| `Sidebar` | One level, up to ~12 destinations in a few groups |
| `Sidebar Double` | Several sections with 5+ pages each (admin panels, CMS): an icon rail for the sections, a panel for the pages of the active section |

- Sidebar Double: one active rail item (the section) and one active panel item (the page). The
  panel title repeats the section name; Panel actions hold one or two Button Icon for the
  section (add a page or an item).
- Collapsed shows the rail only; rail icons have Tooltips. On mobile the panel opens as a left
  Sheet from the header.
- Rail 48, panel 240: both fixed widths. The page grid column hugs the sidebar, so collapsing
  gives the space back to the page.

## Figma
`Sidebar` (Mode expanded 256 / collapsed 48) with native slots Header, Content and Footer, built
from `Sidebar Workspace`, `Sidebar Group` (a `Sidebar Group Label` and an Items slot of
`Sidebar Item`) and `Sidebar User`.
Uses the `sidebar/*` tokens. See the "app shell" example on the Sidebar page.
- Variant: default (border on the right) for most apps; floating (a rounded panel with a shadow)
  for brand and Showcase products on a muted canvas; inset (no border) when the page should read
  as a raised card next to it. One Variant per product. Example "Sidebar styles".
- Group actions (`Sidebar Group Label` Show action, plus) add to the group; item actions
  (`Sidebar Item` Show action, ellipsis Menu) show on hover and on the active item. Example
  "Sidebar actions".

`Sidebar Double` (Mode expanded 288 / collapsed 48) with slots Rail header, Rail, Rail footer
(collapsed `Sidebar Workspace`, `Sidebar Item`, `Sidebar User`), the Panel title text, Panel
actions and Panel (`Sidebar Group`). Mode=collapsed keeps the Panel slot as a hidden layer, so
its content survives a switch back to expanded. Examples: "Admin panel list with double sidebar"
and "Double sidebar collapsed".
- `Sidebar Item` Level=2 for sub-pages: no icon, label aligned with the parent label; only under an
  expanded parent with Show chevron on, one level deep.
