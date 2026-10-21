# Sidebar

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Sidebar](#sidebar) | 2 | Header, Content, Footer |
| [Sidebar Item](#sidebar-item) | 12 | - |
| [Sidebar Group Label](#sidebar-group-label) | 1 | - |
| [Sidebar Group](#sidebar-group) | 2 | Items |
| [Sidebar Workspace](#sidebar-workspace) | 2 | - |
| [Sidebar User](#sidebar-user) | 2 | - |
| [Org Switcher](#org-switcher) | 1 | - |
| [Sidebar Double](#sidebar-double) | 2 | Rail header, Rail, Rail footer, Panel actions, Panel |

On the Figma page: "Example / Back office list with double sidebar", "Example / Double sidebar collapsed", "Example / app shell", "Example / switch organization", "Examples / stat cards", "Stress test / Org Switcher", "Stress test / Sidebar", "Stress test / Sidebar Double", "Template / invoices table (grid)"

## Sidebar

Component set · 2 variants · default size 256 × 720

shadcn Sidebar (uses sidebar/* tokens). Header, Content and Footer are native slots. Mode: expanded 256 / collapsed 48 (icon only, labels in tooltips). One active item per sidebar.

**Use for**

- Apps with more than ~5 destinations or with sections
- Desktop app shell (from 1024 px)
- Settings navigation as its own Sidebar Group

**Not for**

- Switching views of one object: use Tabs
- Sites with few pages: use Navigation Menu in a top bar
- Mobile: open it as a left Sheet from the header

**Anatomy**

1. Header slot: Sidebar Workspace (logo, Title, Subtitle, switcher)
2. Content slot: Sidebar Group with a Sidebar Group Label
3. Sidebar Item rows: Icon, Label, optional Badge and Chevron
4. Footer slot: Sidebar User (Avatar, Title, Subtitle, menu)
5. Sidebar Item Level=2: a sub-page row, no icon, label aligned with the parent label

**Content and behavior**

- One active Sidebar Item, matching the current page
- Groups follow the user's work; labels are nouns in the product's terms
- Badge only for something to act on (unread, pending), never decorative
- Chevron marks a section with sub-pages
- Mode expanded 256, collapsed 48: icons only, labels in tooltips
- Mobile: a Sheet opened from the header trigger (panel-left)
- Level 2 only under an expanded parent with a Chevron; one level deep at most

**Accessibility**

- A nav landmark; the active item has aria-current="page"
- Collapsed items have a Tooltip and an accessible label
- The collapse trigger has an accessible label
- Every item is reachable with the keyboard

| Variant property | Values |
|---|---|
| Mode | expanded, collapsed |

Slots (fill them in the instance, never detach): `Header`, `Content`, `Footer`

Built from: `Sidebar Group`, `Sidebar User`, `Sidebar Workspace`

Tokens and styles:
- Colors: `sidebar/background`, `sidebar/border`
- Spacing and size: `spacing/12`, `spacing/2`, `spacing/64`

Guides: [sidebar](../../skills/build-ui/components/sidebar.md)

Code: shadcn `Sidebar`

## Sidebar Item

Component set · 12 variants · default size 224 × 32

shadcn SidebarMenuButton. active = current page (one per sidebar). Badge = Badge Count (exposed). Chevron for a collapsible group. Collapsed = icon only; pair it with a Tooltip showing the label. Level=2: sub-page row without icon, label aligned with the parent; only under an expanded parent with a Chevron.

| Variant property | Values |
|---|---|
| Level | 1, 2 |
| Mode | expanded, collapsed |
| State | default, hover, active, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Dashboard |
| Icon | instance swap | Icon/house |
| Badge | boolean | false |
| Chevron | boolean | false |

Built from: `Badge Count`. Icons: chevron-right, house

Tokens and styles:
- Colors: `sidebar/accent`, `sidebar/accent-foreground`, `sidebar/foreground`
- Spacing and size: `spacing/2`, `spacing/56`, `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [sidebar](../../skills/build-ui/components/sidebar.md)

## Sidebar Group Label

Component · 1 variant · default size 224 × 32

Section label inside a Sidebar Group (shadcn SidebarGroupLabel).

| Property | Type | Default |
|---|---|---|
| Label | text | Workspace |

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/56`, `spacing/8`
- Text styles: `ui/label-small`

## Sidebar Group

Component set · 2 variants · default size 240 × 188

shadcn SidebarGroup: optional label + "Items" native slot.

| Variant property | Values |
|---|---|
| Mode | expanded, collapsed |

| Property | Type | Default |
|---|---|---|
| Show label | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Sidebar Group Label`, `Sidebar Item`

Tokens and styles:
- Spacing and size: `spacing/1`, `spacing/2`

Guides: [sidebar](../../skills/build-ui/components/sidebar.md)

## Sidebar Workspace

Component set · 2 variants · default size 224 × 52

Sidebar header: organization or workspace switcher (opens a Menu).

| Variant property | Values |
|---|---|
| Mode | expanded, collapsed |

| Property | Type | Default |
|---|---|---|
| Title | text | Acme Inc. |
| Subtitle | text | Pro plan |

Built from: `Logo Mark`. Icons: chevrons-up-down

Tokens and styles:
- Colors: `foreground/muted`, `sidebar/foreground`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/56`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [sidebar](../../skills/build-ui/components/sidebar.md)

## Sidebar User

Component set · 2 variants · default size 224 × 52

Sidebar footer: signed-in user (opens a Menu with Settings and Log out).

| Variant property | Values |
|---|---|
| Mode | expanded, collapsed |

| Property | Type | Default |
|---|---|---|
| Title | text | Daniel Pop |
| Subtitle | text | daniel@acme.com |

Built from: `Avatar`. Icons: chevrons-up-down

Tokens and styles:
- Colors: `foreground/muted`, `sidebar/foreground`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/56`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [sidebar](../../skills/build-ui/components/sidebar.md)

## Org Switcher

Component · 1 variant · default size 288 × 283

Switch between organizations, tenants or workspaces from the Sidebar Workspace. Shows the current one with a check, role and plan, search when there are more than 5, and create / manage at the bottom. Switching reloads data and keeps the user on the same kind of page.

**Use for**

- Users who belong to several companies, tenants or workspaces
- Opened from Sidebar Workspace in the Sidebar header
- Agencies or accountants who manage several client companies

**Not for**

- Users in one organization only: show its name in the header, no switcher
- Switching projects inside one workspace: use the Sidebar or a Combobox

**Anatomy**

1. Command Input for search (more than 5 organizations)
2. Organization rows: name, role and plan
3. Check on the current organization
4. Separator
5. Create (plus) and Manage (settings) at the bottom

**Content and behavior**

- The current organization shows a check, role and plan
- Search appears when there are more than 5
- Switching reloads data and keeps the user on the same kind of page
- No toast after switching; the new organization's page is the feedback

**Accessibility**

- Arrows move, Enter switches, Escape closes and returns focus
- The current organization is announced as selected
- After switching, focus moves to the new page heading

Built from: `Command Input`, `Separator`. Icons: check, plus, settings

Tokens and styles:
- Colors: `background/accent`, `background/popover`, `background/primary`, `border/default`, `foreground/muted`, `foreground/popover`, `foreground/primary`
- Spacing and size: `spacing/0`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/7`
- Radius: `radius/md`, `radius/sm`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Code: `DropdownMenu` or `Popover` + `Command`

## Sidebar Double

Component set · 2 variants · default size 288 × 720

Two-level app navigation: an icon rail for sections (Rail header, Rail, Rail footer slots) and a panel for the pages of the active section, with a header (Panel title, Panel actions slot) and the Panel slot for Sidebar Groups. Collapsed shows the rail only. Use when sections have many pages each; one level fits in Sidebar. Code: shadcn Sidebar with collapsible="icon" for the rail plus a second Sidebar for the panel.

**Use for**

- Back offices and admin apps with several sections of 5+ pages each
- Products where people switch sections often and need the section's pages in view
- Content management: one rail item per content area, its types in the panel

**Not for**

- One level of navigation or fewer than ~12 pages: use Sidebar
- Switching views of one object: use Tabs
- Mobile: open the panel as a left Sheet from the header

**Anatomy**

1. Rail header slot: Sidebar Workspace (collapsed)
2. Rail slot: Sidebar Item (collapsed), one per section
3. Rail footer slot: Sidebar User (collapsed)
4. Panel header: Panel title and Panel actions slot
5. Panel slot: Sidebar Groups with the section's pages

**Content and behavior**

- Rail 48 wide, panel 240; Mode=collapsed shows the rail only
- One active rail item (the section) and one active panel item (the page)
- Panel title repeats the rail item's name
- Panel actions only for the section (add a page or an item), one or two Button Icon
- Rail icons have Tooltips with the section name

**Accessibility**

- Two nav landmarks with labels ("Sections", the section name)
- The active items have aria-current
- Rail items are buttons with accessible labels; arrows move between them
- The collapse trigger has an accessible label and aria-expanded

| Variant property | Values |
|---|---|
| Mode | expanded, collapsed |

| Property | Type | Default |
|---|---|---|
| Panel title | text | Projects |

Slots (fill them in the instance, never detach): `Rail header`, `Rail`, `Rail footer`, `Panel actions`, `Panel`

Built from: `Button Icon`, `Sidebar Group`, `Sidebar Item`, `Sidebar User`, `Sidebar Workspace`

Tokens and styles:
- Colors: `sidebar/background`, `sidebar/border`, `sidebar/foreground`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Text styles: `ui/label`

Guides: [sidebar](../../skills/build-ui/components/sidebar.md)

Code: shadcn `Sidebar` `collapsible="icon"` (rail) + a second `Sidebar` (panel) (Panel opens as a left `Sheet` on mobile)
