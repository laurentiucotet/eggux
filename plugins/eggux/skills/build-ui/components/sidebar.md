# Sidebar

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Primary navigation of an app with more than ~5 destinations or with sections.
- Groups follow the actor's work, from `workflows.md`, not the org chart. Labels are nouns in the
  client's terminology.

## Rules
- One active item, matching the current page. A section with sub-pages shows a chevron.
- Badge Count only for something the actor must act on (unread, pending); never decorative.
- Header: workspace or organization switcher. Footer: signed-in user with a menu
  (Settings, Log out).
- Collapsed mode shows icons only; every item has a Tooltip with its label.
- On mobile the sidebar becomes a Sheet opened from the page header trigger (`panel-left`).
- Keyboard: every item is reachable; the collapse trigger has an accessible label.

## Figma
`Sidebar` (Mode expanded 256 / collapsed 48) with native slots Header, Content and Footer, built
from `Sidebar Workspace`, `Sidebar Group` (Items slot of `Sidebar Item`) and `Sidebar User`.
Uses the `sidebar/*` tokens. See the "app shell" example on the Sidebar page.
