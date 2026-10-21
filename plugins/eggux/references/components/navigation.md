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

On the Figma page: "Example / in navbar", "Example / in page shell / app", "Example / in page shell / docs", "Example / in product detail", "Example / navbar with mega menu", "Stress test / Breadcrumb", "Stress test / Nav Link", "Stress test / Navigation Menu Panel", "Stress test / Page Header", "Stress test / Table of Contents", "Stress test / Top Bar"

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

**Use for**

- Record and nested pages in an app: Customers > Acme
- Docs and help centers with sections
- Settings sub-pages: Settings > Billing > Invoices

**Not for**

- Flat apps with one level: no breadcrumb
- Steps of a flow: use Stepper

**Anatomy**

1. Items slot
2. Breadcrumb Item link: ancestor page
3. Separator (chevron)
4. Breadcrumb Item ellipsis: collapsed middle levels
5. Breadcrumb Item current: this page

**Content and behavior**

- Every item but the last is a link; current is not a link and has Separator off
- Collapse the middle with an ellipsis item past 4 levels; it opens a menu
- Never wrap
- The last item matches the page title
- Start at a meaningful root, not "Home" when the sidebar already does that

**Accessibility**

- nav with aria-label="Breadcrumb"
- Current item has aria-current="page"
- Ellipsis is a labeled button: "Show path"

Slots (fill them in the instance, never detach): `Items`

Built from: `Breadcrumb Item`

Tokens and styles:
- Spacing and size: `spacing/1_5`

Code: shadcn `Pagination`, `Breadcrumb`

## Top Bar

Component · 1 variant · default size 1184 × 56

App top bar (shadcn site header): sidebar trigger, Breadcrumb slot, Actions slot. Sits above the page content in the App page shell.

**Use for**

- Every page of the App page shell from 1024
- Global actions: search, notifications, help, user menu
- The App page shell above the Page Header

**Not for**

- Page-specific actions: use Page Header
- Mobile under 768: use Mobile Header
- Marketing sites: use Navbar

**Anatomy**

1. Sidebar trigger (Sidebar trigger)
2. Separator
3. Breadcrumb slot
4. Actions slot: search, notifications, help, user Avatar

**Content and behavior**

- The Breadcrumb shows list to object: "Customers > Acme"
- Only global actions on the right
- Search opens the Command Dialog (⌘K / Ctrl K) and stays a visible button

**Accessibility**

- Header landmark; icon buttons have labels: "Toggle sidebar", "Notifications"
- Unread count is announced with the notifications label
- Tab order: sidebar trigger, breadcrumb, actions

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

**Use for**

- Top of every app page: lists, settings, reports
- The place for the page primary action: "New project"
- Settings and report pages that need a description

**Not for**

- Global actions (search, notifications): use Top Bar
- A single record with status and facts: use Block / Record Header

**Anatomy**

1. Title (heading/h3)
2. Description (Show description)
3. Actions slot, primary last

**Content and behavior**

- One per page; the title is the only h3 at that level
- Description is one sentence
- Title matches the last Breadcrumb item
- Tabs for sub-views go right under it

**Accessibility**

- Title is the page heading; keep heading levels in order
- Action buttons have verb labels

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

**Use for**

- Top-level links in a marketing Navbar
- Triggers of a Navigation Menu Panel (Chevron on)
- Section links on a marketing site: Pricing, Customers, Docs

**Not for**

- App navigation: use Sidebar Item
- Actions: use Button
- Desktop command menus: use Menubar

**Anatomy**

1. Label (Label)
2. Chevron (Chevron) when it opens a Navigation Menu Panel
3. Active indicator (State=active)

**Content and behavior**

- State: default, hover, active; active = current section
- 4-6 links in a Navbar
- A trigger with a panel still links to an overview page
- On mobile the links move into a Sheet

**Accessibility**

- Active link has aria-current="page"
- Triggers with Chevron expose aria-expanded
- Focus ring uses border/ring

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

**Use for**

- Marketing sites with more than ~5 destinations under one top-level item (Product, Solutions)
- Product and Solutions menus with a featured card
- Resources menus: docs, guides, blog, changelog

**Not for**

- Up to 5 links: use plain Nav Links
- App navigation: use Sidebar
- Actions: use Menu

**Anatomy**

1. Links slot: 2 columns of Navigation Menu Links
2. Navigation Menu Link: icon, title, one-line description
3. Featured slot: featured card (Show featured)

**Content and behavior**

- Up to ~8 links, grouped by what visitors want to do, not internal team names
- Navigation Menu Link description says what the user gets, not what the product is
- Opens on hover with a small delay and on click or Enter
- Mobile: the same links grouped in the full-screen menu

**Accessibility**

- Escape closes and returns focus to the trigger
- Arrows and Tab move through links
- Icons are decorative; the title is the link name

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

**Use for**

- Long articles and docs pages with 3 or more sections
- Help center articles and policies
- Release notes and changelogs with many sections

**Not for**

- Short pages under 3 sections: no table of contents
- Navigation between pages: use Sidebar or Breadcrumb

**Anatomy**

1. Items slot of TOC Items
2. TOC Item Level 1 (h2) and Level 2 (h3)
3. Active TOC Item with primary left bar

**Content and behavior**

- Sticky on the right from 1280 wide; below that a collapsible "On this page" at the top
- TOC Item State: default, hover, active; active = the section in view (scroll spy)
- Clicking scrolls with an offset for sticky headers
- Labels match the heading text

**Accessibility**

- nav with aria-label="On this page"
- Active item has aria-current="true"
- Links move focus to the heading they target

Slots (fill them in the instance, never detach): `Items`

Built from: `TOC Item`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/3`
- Text styles: `ui/overline`

Guides: [content](../../skills/build-ui/components/content.md)

Code: custom with scroll spy
