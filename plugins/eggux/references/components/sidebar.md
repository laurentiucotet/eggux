# Sidebar

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Sidebar Item](#sidebar-item) | 8 | - |
| [Sidebar Group Label](#sidebar-group-label) | 1 | - |
| [Sidebar Group](#sidebar-group) | 2 | Items |
| [Sidebar Workspace](#sidebar-workspace) | 2 | - |
| [Sidebar User](#sidebar-user) | 2 | - |
| [Sidebar](#sidebar) | 2 | Header, Content, Footer |
| [Org Switcher](#org-switcher) | 1 | - |

On the Figma page: "Example / app shell", "Template / invoices table (grid)"

## Sidebar Item

Component set · 8 variants · default size 224 × 32

shadcn SidebarMenuButton. active = current page (one per sidebar). Badge = Badge Count (exposed). Chevron for a collapsible group. Collapsed = icon only; pair it with a Tooltip showing the label.

| Variant property | Values |
|---|---|
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

## Sidebar

Component set · 2 variants · default size 256 × 720

shadcn Sidebar (uses sidebar/* tokens). Header, Content and Footer are native slots. Mode: expanded 256 / collapsed 48 (icon only, labels in tooltips). One active item per sidebar.

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

## Org Switcher

Component · 1 variant · default size 288 × 283

Switch between organizations, tenants or workspaces from the Sidebar Workspace. Shows the current one with a check, role and plan, search when there are more than 5, and create / manage at the bottom. Switching reloads data and keeps the user on the same kind of page.

Built from: `Command Input`, `Separator`. Icons: check, plus, settings

Tokens and styles:
- Colors: `background/accent`, `background/popover`, `background/primary`, `border/default`, `foreground/muted`, `foreground/popover`, `foreground/primary`
- Spacing and size: `spacing/0`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/7`
- Radius: `radius/md`, `radius/sm`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Code: `DropdownMenu` or `Popover` + `Command`
