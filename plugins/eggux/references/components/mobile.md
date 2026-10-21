# Mobile

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Mobile Header](#mobile-header) | 2 | Leading, Trailing |
| [Bottom Nav Item](#bottom-nav-item) | 2 | - |
| [Bottom Nav](#bottom-nav) | 1 | Items |

On the Figma page: "Example / in page shell / mobile", "Stress test / Bottom Nav", "Stress test / Mobile Header"

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
