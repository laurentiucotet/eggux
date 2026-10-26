# Mobile and responsive

Design mobile for every screen that field staff, customers or end users use on the phone; for
admin panels, at least check that the page does not break below 768.

## Breakpoints (Tailwind)
| Width | Layout |
|---|---|
| < 768 (`md`) | One column. Mobile Header, Bottom Nav or menu Sheet. Dialogs become Drawers |
| 768-1023 | Sidebar collapsed (icons) or in a Sheet; two columns at most |
| ≥ 1024 (`lg`) | Full App shell: Sidebar expanded, Top Bar, multi-column blocks |

## Navigation
- App with 3-5 daily destinations: `Bottom Nav` with one `Bottom Nav Item` each; everything else under "More" or the menu.
- `Bottom Nav` Style=floating (a pill above the safe area) for consumer apps with full-bleed content;
  keep the content padded so the last row clears the pill. Style=default elsewhere.
- Otherwise: menu button in `Mobile Header` opens the Sidebar as a left `Sheet`.
- Detail pages: back button + object title, no Bottom Nav; primary action in a sticky bottom bar.
- Entry screens (sign in, sign up, invite) use `Mobile Header` Type=brand (Logo); later steps use
  Type=detail with back and the flow name.
- Marketing: `Block / Navbar Mobile`; the menu is a full-screen panel with links and full-width CTAs.
- One FAB per screen, bottom right above the Bottom Nav; an Action Sheet slides up from the bottom for the actions of one item.

## Content
- Tables become lists: one List Item per row with the 2-3 most useful fields; the rest on the
  detail page. Bulk actions move to a selection mode.
- Filters go in a bottom `Drawer` (Accordion groups, "Show N results"); search stays visible.
- Forms: one column, labels above, correct keyboard (`inputmode`, `autocomplete`), primary button
  full width at the bottom.
- Dialog → `Drawer`; Popover with rich content → `Drawer` or `Sheet`; Tooltip → visible text
  (no hover on touch).

## Touch and safe areas
- Targets at least 44 x 44; 8 px between targets.
- Respect `env(safe-area-inset-*)`: top under the status bar, bottom above the home indicator
  (Bottom Nav and sticky bars include it).
- Thumb zone: primary actions at the bottom, destructive ones away from them.

## Figma
`Page Shell / Mobile` (390 x 844) on the Page Shells page; examples "mobile list", "mobile
menu open"; `Block / Navbar Mobile` and "mobile nav open" on the Navigation blocks page; bottom
drawer with filters on the Drawer page.
- The one main action on a mobile screen is a `FAB` (bottom right, above the Bottom Nav). Actions on
  one item open an `Action Sheet` (2-6 actions, destructive last, Cancel apart); content and forms
  go in a Drawer.
- App download links use `Store Badge` (App Store first, then Google Play), never a generic
  Button. A mobile app landing page leads with `Block / Hero with Phone` and closes with
  `Block / CTA App Download` (`marketing-pages.md`). A landing page at 390: `Example / Mobile
  landing page` on the Hero page.
