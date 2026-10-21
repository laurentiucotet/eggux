# Mobile

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Mobile Header](#mobile-header) | 2 | Leading, Trailing |
| [Bottom Nav](#bottom-nav) | 1 | Items |
| [Bottom Nav Item](#bottom-nav-item) | 2 | - |
| [FAB](#fab) | 2 | - |
| [Action Sheet](#action-sheet) | 1 | - |

On the Figma page: "Example / in page shell / mobile", "Stress test / Action Sheet", "Stress test / Bottom Nav", "Stress test / FAB", "Stress test / Mobile Header"

## Mobile Header

Component set · 2 variants · default size 390 × 56

Top bar on mobile (< 768). app: menu + page title + notifications/avatar. detail: back + object title + actions. Title is the page or object name, truncated to one line. 56 high; add the safe-area inset on top in code.

**Use for**

- Every mobile app screen
- Detail pages with back, object title and actions
- Mobile list pages with search and a menu

**Not for**

- Desktop and tablet app shell: use Top Bar
- Marketing sites: use Block / Navbar Mobile

**Anatomy**

1. Leading slot: menu (app) or back (detail)
2. Title
3. Trailing slot: notifications and Avatar, or actions

**Content and behavior**

- Type app: menu + page title + notifications or avatar
- Type detail: back + object title + actions
- Title is the page or object name, truncated to one line
- Height 56; add the safe-area inset on top in code
- The menu button opens the Sidebar as a left Sheet

**Accessibility**

- Icon buttons have labels: "Open menu", "Back to customers"
- Touch targets at least 44 x 44
- Title is the page heading for screen readers

| Variant property | Values |
|---|---|
| Type | app, detail |

| Property | Type | Default |
|---|---|---|
| Title | text | Customers |

Slots (fill them in the instance, never detach): `Leading`, `Trailing`

Built from: `Avatar`, `Button Icon`

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/14`, `spacing/2`
- Text styles: `heading/h4`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

## Bottom Nav

Component · 1 variant · default size 390 × 81

Bottom navigation for mobile apps with 3-5 top-level destinations used daily. Padding bottom = home-indicator safe area. Hide it on detail pages and while typing.

**Use for**

- Mobile apps with 3-5 daily destinations
- Field and customer apps used mostly on the phone
- Customer apps: Home, Orders, Messages, Account

**Not for**

- More than 5 destinations or rare ones: use the Mobile Header menu with a Sheet
- Detail pages and flows: hide it; use back in Mobile Header

**Anatomy**

1. Items slot of Bottom Nav Items
2. Bottom Nav Item: Icon (20) and Label
3. Bottom safe-area padding

**Content and behavior**

- 3-5 items; everything else under "More" or the menu
- Bottom Nav Item State: default, active; active = foreground, others muted
- Padding bottom = home-indicator safe area
- Hide it on detail pages and while typing

**Accessibility**

- Each item has a visible label, not only an icon
- Active item has aria-current="page"
- The whole cell is the touch target (min 48 x 48)

Slots (fill them in the instance, never detach): `Items`

Built from: `Bottom Nav Item`

Tokens and styles:
- Colors: `background/default`, `border/default`
- Spacing and size: `spacing/2`, `spacing/6`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

## Bottom Nav Item

Component set · 2 variants · default size 78 × 56

One destination in the bottom navigation. Icon 20 + label, active = foreground, others muted. Touch target is the whole cell (min 48 x 48).

| Variant property | Values |
|---|---|
| State | default, active |

| Property | Type | Default |
|---|---|---|
| Label | text | Home |
| Icon | instance swap | Icon/house |

Icons: house

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/14`
- Text styles: `ui/caption`, `ui/label-small`

## FAB

Component set · 2 variants · default size 56 × 56

Floating action button for the one main action on a mobile screen: new invoice, compose, add. Bottom-right, 16 px from the edges, above the Bottom Nav. Extended shows a label; it shrinks to the icon on scroll. One per screen; never for destructive or secondary actions. Desktop uses a primary Button in the page header.

**Use for**

- The main create action on a mobile list (New invoice)
- Compose in a mobile inbox or feed
- Type=extended on a first visit or empty lists, shrinking to the icon on scroll

**Not for**

- Desktop: use a primary Button in the Page Header
- Destructive or secondary actions: use Action Sheet or Menu
- Several actions: use Action Sheet

**Anatomy**

1. Icon: Icon/plus (swap with Icon)
2. Label (Type=extended): "New invoice"

**Content and behavior**

- One per screen, for the main action only
- Bottom right, 16 px from the edges, above the Bottom Nav
- Extended shows a label and shrinks to the icon on scroll
- Never covers the last row of content; add bottom padding to the list
- Hidden while the keyboard is open

**Accessibility**

- Icon only: aria-label with the action ("New invoice")
- Touch target at least 48 by 48 px
- Placed in the DOM after the main content, before the Bottom Nav, so the tab order follows the screen

| Variant property | Values |
|---|---|
| Type | icon, extended |

| Property | Type | Default |
|---|---|---|
| Label | text | New invoice |
| Icon | instance swap | Icon/plus |

Icons: plus

Tokens and styles:
- Colors: `background/primary`, `foreground/primary`
- Spacing and size: `spacing/2`, `spacing/5`
- Radius: `radius/full`
- Text styles: `ui/label`
- Effects: `shadow/lg`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: shadcn `Button size="icon"` `rounded-full shadow-lg fixed bottom-20 right-4` (Mobile only; desktop uses a primary Button)

## Action Sheet

Component · 1 variant · default size 390 × 349

A short list of actions for one item on mobile, rising from the bottom: share, duplicate, download, delete. 2-6 actions, one line each, destructive last and red; Cancel sits apart. Tap outside or swipe down closes it. Content or forms go in a Drawer; desktop uses a Menu.

**Use for**

- Actions on one item on mobile: share, duplicate, download, delete
- The More button on a mobile record page
- A long press on a row in a mobile list

**Not for**

- Content or a form: use Drawer
- Desktop: use Menu
- One main action: use FAB or a Button

**Anatomy**

1. Header (Show header): title (the object) and description
2. Actions: icon and label, one per row
3. Destructive action last, in red
4. Cancel: a separate group below

**Content and behavior**

- 2-6 actions, one line each, verbs
- Destructive last and red; it still asks for confirmation when it cannot be undone
- Cancel sits apart at the bottom
- Tap outside or swipe down closes it
- Title names the object ("INV-2041")

**Accessibility**

- role="menu" with menuitem rows, or a list of buttons in a dialog; focus moves to the first action
- Escape and Cancel close it and return focus to the trigger
- Rows are at least 48 px high; destructive is named by its label, not color alone

| Property | Type | Default |
|---|---|---|
| Title | text | INV-2041 |
| Description | text | Choose what to do with this invoice |
| Show header | boolean | true |

Icons: copy, download, share-2, trash-2

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/xl`
- Text styles: `body/default`, `ui/caption`, `ui/label`
- Effects: `shadow/lg`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: shadcn `Drawer` (vaul) with a list of `Button`s and a separate Cancel (Desktop: `DropdownMenu`)
