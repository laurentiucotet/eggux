# Navigation

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Breadcrumb Item](#breadcrumb-item) | 4 | - |
| [Breadcrumb](#breadcrumb) | 1 | Items |
| [Top Bar](#top-bar) | 1 | Breadcrumb, Actions |
| [Page Header](#page-header) | 1 | Actions |
| [Nav Link](#nav-link) | 3 | - |
| [Navigation Menu Link](#navigation-menu-link) | 2 | - |
| [Navigation Menu Panel](#navigation-menu-panel) | 1 | Links, Featured |
| [TOC Item](#toc-item) | 6 | - |
| [Table of Contents](#table-of-contents) | 1 | Items |

On the Figma page: "Example / navbar with mega menu"

## Breadcrumb Item

Component set · 4 variants · default size 74 × 20

shadcn BreadcrumbItem. link = ancestor page; current = this page (not a link, Separator off); ellipsis = collapsed middle levels (opens a menu).

| Variant property | Values |
|---|---|
| Type | link, current, ellipsis |
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Label | text | Projects |
| Separator | boolean | true |

Icons: chevron-right, ellipsis

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`
- Text styles: `body/small`

## Breadcrumb

Component · 1 variant · default size 261 × 20

shadcn Breadcrumb. Show the path from a meaningful root; collapse the middle with an ellipsis item when it has more than 4 levels.

Slots (fill them in the instance, never detach): `Items`

Built from: `Breadcrumb Item`

Tokens and styles:
- Spacing and size: `spacing/1_5`

Code: shadcn `Pagination`, `Breadcrumb`

## Top Bar

Component · 1 variant · default size 1184 × 56

App top bar (shadcn site header): sidebar trigger, Breadcrumb slot, Actions slot. Sits above the page content in the App page shell.

| Property | Type | Default |
|---|---|---|
| Sidebar trigger | boolean | true |

Slots (fill them in the instance, never detach): `Breadcrumb`, `Actions`

Built from: `Avatar`, `Breadcrumb`, `Button Icon`, `Separator`

Tokens and styles:
- Colors: `background/default`, `border/default`
- Spacing and size: `spacing/14`, `spacing/2`, `spacing/4`

## Page Header

Component · 1 variant · default size 1136 × 56

Title of a page inside the app shell: one h3 per page (heading/h3), short description, page actions slot.

| Property | Type | Default |
|---|---|---|
| Title | text | Projects |
| Description | text | All projects across your workspace. |
| Show description | boolean | true |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `heading/h3`

## Nav Link

Component set · 3 variants · default size 91 × 36

shadcn NavigationMenu trigger / link for marketing navbars. active = current section. Chevron when it opens a submenu.

| Variant property | Values |
|---|---|
| State | default, hover, active |

| Property | Type | Default |
|---|---|---|
| Label | text | Features |
| Chevron | boolean | false |

Icons: chevron-down

Tokens and styles:
- Colors: `background/accent`, `foreground/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/4`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`

## Navigation Menu Link

Component set · 2 variants · default size 280 × 78

Link inside a mega menu panel: icon, title, one-line description. The description says what the user gets, not what the product is.

| Variant property | Values |
|---|---|
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Title | text | Analytics |
| Description | text | Dashboards and reports for every team. |
| Show icon | boolean | true |
| Icon | instance swap | Icon/chart-column |

Icons: chart-column

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [navigation](../../skills/build-ui/components/navigation.md)

## Navigation Menu Panel

Component · 1 variant · default size 834 × 260

Mega menu panel under a Navbar Nav Link with Chevron (shadcn Navigation Menu). Opens on hover with a small delay and on click/Enter; Escape closes. Group links by what users want to do, not by internal team names.

| Property | Type | Default |
|---|---|---|
| Show featured | boolean | true |

Slots (fill them in the instance, never detach): `Links`, `Featured`

Built from: `Button`, `Navigation Menu Link`

Tokens and styles:
- Colors: `background/muted`, `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/60`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [navigation](../../skills/build-ui/components/navigation.md)

## TOC Item

Component set · 6 variants · default size 224 × 28

Entry of an on-page table of contents. Level 1 = h2, level 2 = h3. active = the section in view (scroll spy), primary left bar.

| Variant property | Values |
|---|---|
| Level | 1, 2 |
| State | default, hover, active |

| Property | Type | Default |
|---|---|---|
| Label | text | Installation |

Tokens and styles:
- Colors: `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/6`
- Text styles: `body/small`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md)

Code: custom with scroll spy

## Table of Contents

Component · 1 variant · default size 224 × 224

On-page navigation for long articles and docs, sticky on the right from 1280 wide. Hidden below; then a "On this page" disclosure at the top.

Slots (fill them in the instance, never detach): `Items`

Built from: `TOC Item`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/3`
- Text styles: `ui/overline`

Guides: [content](../../skills/build-ui/components/content.md)

Code: custom with scroll spy
