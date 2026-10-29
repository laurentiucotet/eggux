# Mobile

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Mobile Header](#mobile-header) | 6 | Leading, Trailing |
| [Bottom Nav Item](#bottom-nav-item) | 2 | - |
| [Bottom Nav](#bottom-nav) | 2 | Items |
| [FAB](#fab) | 2 | - |
| [Action Sheet](#action-sheet) | 1 | - |
| [Store Badge](#store-badge) | 2 | - |
| [QR Code](#qr-code) | 3 | - |

On the Figma page: "Example / Bottom Nav styles", "Example / Mobile Header styles", "Example / in cta app download", "Example / in hero with phone", "Example / invoices on mobile", "Stress test / Action Sheet", "Stress test / Bottom Nav", "Stress test / FAB", "Stress test / Mobile Header", "Stress test / QR Code", "Stress test / Store Badge"

## Mobile Header

Component set · 6 variants · default size 390 × 56

Top bar on mobile (< 768). app: menu + page title + notifications/avatar. detail: back + object title + actions. brand: the Logo (swap) on entry screens such as sign in and sign up, nothing to go back to; Trailing can hold one link or button. Title is the page or object name, truncated to one line. 56 high; add the safe-area inset on top in code.


Type=search: a Search Field (exposed, no shortcut) fills the bar, back in Leading and a Cancel Button in Trailing; for mobile lists, directories and store search once the person taps search. Size=large (app, detail): the bar keeps Leading and Trailing and the Title moves under it in heading/h2 (up to 2 lines); use it at the top of a list scrolled to the top (Customers, Notifications, Orders) and switch to Size=default when the list scrolls (the large title collapses into the bar). Entry screens keep brand.


Usage: eggux build-ui/patterns/mobile.md

**Use for**

- Every mobile app screen
- Detail pages with back, object title and actions
- Mobile list pages with search and a menu
- Entry screens with nothing to go back to (sign in, sign up): Type=brand
- Searching a mobile list or directory after tapping search (Type=search)
- The top of a mobile list scrolled to the top, with a large title (Size=large)

**Not for**

- Desktop and tablet app shell: use Top Bar
- Marketing sites: use Block / Navbar Mobile

**Anatomy**

1. Leading slot: menu (app) or back (detail); hidden in brand
2. Title (app, detail)
3. Logo (brand): Logo swap
4. Trailing slot: notifications and Avatar, or actions; in brand empty or one link
5. Type=search: Leading (back), Search Field (exposed, no shortcut) that fills the bar, Trailing (Cancel Button)
6. Size=large (app, detail): the bar with Leading and Trailing, then the Title in heading/h2 under it, up to 2 lines

**Content and behavior**

- Type app: menu + page title + notifications or avatar
- Type detail: back + object title + actions
- Type brand: the Logo on entry screens (sign in, sign up, invite); later steps of a flow use detail with back and the flow name
- Title is the page or object name, truncated to one line
- Height 56; add the safe-area inset on top in code
- The menu button opens the Sidebar as a left Sheet
- Size=large only at the top of a list; it collapses to Size=default when the content scrolls
- Type=search opens with the keyboard and focus in the field; Cancel returns to the list and clears the query

**Accessibility**

- Icon buttons have labels: "Open menu", "Back to customers"
- Touch targets at least 44 x 44
- Title is the page heading for screen readers
- In brand the Logo links home and has the product name as its label
- Type=search: role="search"; Cancel is a text button
- Size=large: the large title is the page heading; the collapsed bar title is aria-hidden while the large one shows

| Variant property | Values |
|---|---|
| Type | app, detail, brand, search |
| Size | default, large |

| Property | Type | Default |
|---|---|---|
| Title | text | Customers |
| Logo | instance swap | Type=full |

Slots (fill them in the instance, never detach): `Leading`, `Trailing`

Built from: `Avatar`, `Button`, `Button Icon`, `Logo`, `Search Field`

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/14`, `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `heading/h2`, `heading/h4`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: custom header with shadcn `Button size="icon"` and `Avatar`; Type=brand renders the product `Logo` (link to home) in place of the back button and title (Entry screens (sign in, sign up) use brand)

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

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: custom `<nav>` of links with `env(safe-area-inset-bottom)` (Current item `aria-current="page"`)

## Bottom Nav

Component set · 2 variants · default size 390 × 81

Bottom navigation for mobile apps with 3-5 top-level destinations used daily. Style=default: full-width bar with a top border and the safe-area padding inside. Style=floating: the items sit in a pill with a border and shadow/md, inset spacing/4 from the sides and lifted above the safe area, for consumer apps with full-bleed content (maps, media, feeds) that should show around the bar. Items slot holds 3-5 Bottom Nav Items. Usage: eggux build-ui/patterns/mobile.md

**Use for**

- Mobile apps with 3-5 daily destinations
- Field and customer apps used mostly on the phone
- Customer apps: Home, Orders, Messages, Account
- Style=floating: consumer apps with full-bleed content (maps, media, feeds) that should show around the bar

**Not for**

- More than 5 destinations or rare ones: use the Mobile Header menu with a Sheet
- Detail pages and flows: hide it; use back in Mobile Header

**Anatomy**

1. Style: default (full width, top border), floating (pill bar inset spacing/4, border, button/radius, shadow/md)
2. Items slot of Bottom Nav Items
3. Bottom Nav Item: Icon (20) and Label
4. Bottom safe-area padding (outside the pill in Style=floating)

**Content and behavior**

- 3-5 items; everything else under "More" or the menu
- Bottom Nav Item State: default, active; active = foreground, others muted
- Padding bottom = home-indicator safe area
- Hide it on detail pages and while typing
- Style=floating: content scrolls under the bar; leave bottom padding so the last row is not hidden

**Accessibility**

- Each item has a visible label, not only an icon
- Active item has aria-current="page"
- The whole cell is the touch target (min 48 x 48)

| Variant property | Values |
|---|---|
| Style | default, floating |

Slots (fill them in the instance, never detach): `Items`

Built from: `Bottom Nav Item`

Tokens and styles:
- Colors: `background/default`, `border/default`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `button/radius`
- Effects: `shadow/md`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: custom `<nav>` of links with `env(safe-area-inset-bottom)` (Current item `aria-current="page"`)

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

1. Header (Show header): Title (the object) and Description
2. Actions: Action 1, Action 2, Action 3, each with an icon swap (Action 1 icon ...), one per row
3. Destructive action (+ Destructive action icon): last, in red
4. Cancel: a separate group below

**Content and behavior**

- 2-6 actions, one line each, verbs
- Destructive last and red; it still asks for confirmation when it cannot be undone
- Cancel sits apart at the bottom
- Tap outside or swipe down closes it
- Title names the object ("INV-2041")
- Resize: title (2 lines) and description (3 lines) fill and wrap; action labels fill and stay on 1 line with ellipsis; Cancel is centered on 1 line

**Accessibility**

- role="menu" with menuitem rows, or a list of buttons in a dialog; focus moves to the first action
- Escape and Cancel close it and return focus to the trigger
- Rows are at least 48 px high; destructive is named by its label, not color alone

| Property | Type | Default |
|---|---|---|
| Title | text | INV-2041 |
| Description | text | Choose what to do with this invoice |
| Show header | boolean | true |
| Action 1 | text | Share |
| Action 1 icon | instance swap | Icon/share-2 |
| Action 2 | text | Duplicate |
| Action 2 icon | instance swap | Icon/copy |
| Action 3 | text | Download PDF |
| Action 3 icon | instance swap | Icon/download |
| Destructive action | text | Delete |
| Destructive action icon | instance swap | Icon/trash-2 |
| Cancel | text | Cancel |

Icons: copy, download, share-2, trash-2

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/xl`
- Text styles: `body/default`, `ui/caption`, `ui/label`
- Effects: `shadow/lg`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: title `line-clamp-2`, description `line-clamp-3`, action labels `min-w-0 flex-1 truncate`

## Store Badge

Component set · 2 variants · default size 163 × 58

App store download badge: the store mark, a small line ("Download on the", "Get it on") and the store name. Follows the theme: dark badge in Light, light badge in Dark.


Use under a mobile app hero or in a footer, side by side (App Store first), linking to the store listing.


Avoid as a generic button or for web sign-up: use Button.


Rules
One badge per store, same height, 8 to 12 px apart.
Keep the store text as the stores write it; translate the small line only with the store's localized badge.
Link each badge to the listing; the accessible name is the store, e.g. "Download on the App Store".


Never narrower than its artwork (store guidelines); in a narrow column stack the two badges.


Usage: eggux build-ui/patterns/mobile.md

**Use for**

- Under a mobile app hero (Block / Hero with Phone)
- In a footer or download section that links to the store listings

**Not for**

- As a generic button or for web sign-up: use Button
- Recoloring it or changing the store text

**Anatomy**

1. Store (variant): app-store, google-play
2. glyph: Apple or Google Play mark, 24 px, background/default
3. label: ui/caption, "Download on the" or "Get it on"
4. store: heading/h4, "App Store" or "Google Play"
5. Container: foreground/default fill, border/default 1 px, radius/lg

**Content and behavior**

- App Store first, then Google Play, same height, 8 to 12 px apart
- Keep the store text as the stores write it; translate only with the store's localized badge
- Link each badge to its listing
- Resize: never narrower than its artwork (min width = badge width); in a narrow column stack the badges instead of shrinking them

**Accessibility**

- It is a link: accessible name "Download on the App Store" or "Get it on Google Play"
- Glyph is decorative (aria-hidden)
- Contrast follows foreground/default and background/default (16:1 or more)

| Variant property | Values |
|---|---|
| Store | app-store, google-play |

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `heading/h4`, `ui/caption`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

Code: fixed size image, `shrink-0` (Stack badges in narrow columns)

## QR Code

Component set · 3 variants · default size 128 × 128

A sample QR code on a card tile (background/card, modules in foreground/card, radius/lg), for app download sections, printed handouts and sign-in on another device. Size: sm 96, default 128, lg 160 (the quiet zone grows with the size). The pattern is sample artwork and does not scan: replace it with the real generated code (SVG) before shipping. In code keep the real code dark on a light tile in every theme, because many scanners read inverted codes poorly. Always put the action in text next to it ("Scan to get the app") plus a link or store badges for people who cannot scan.


Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Next to store badges in an app download section (Block / CTA App Download)
- Printed handouts, event badges and posters that link to a page
- Sign in or pair on another device (TV, desktop app)

**Not for**

- As the only way to reach the link: always add a link or store badges
- On a phone screen that people would have to scan with the same phone
- Decoration or a pattern

**Anatomy**

1. Tile: background/card, bound radius, padding is the quiet zone (sm 8, default 12, lg 16)
2. modules: one vector of sample QR modules in foreground/card, scales with the size
3. Size: sm 96, default 128, lg 160

**Content and behavior**

- The pattern is sample artwork and does not scan: replace it with the real generated code (SVG) before shipping
- Put the action in text next to it ("Scan to get the app") and a caption that says what opens
- In code keep the code dark on a light tile in every theme; scanners read inverted codes poorly
- Default (128) in sections, sm (96) beside small text, lg (160) for print or a TV pairing screen

**Accessibility**

- The image has alt text that says where it leads ("QR code to the Acme app in the App Store")
- Offer the same link as text or buttons next to it
- Contrast between modules and tile stays above 4.5:1

| Variant property | Values |
|---|---|
| Size | default, sm, lg |

Tokens and styles:
- Colors: `background/card`, `foreground/card`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `qrcode.react` `<QRCodeSVG value={url} size={128} marginSize={2} />` (or a generated SVG) in a `rounded-xl bg-card p-3` tile (Size=sm 96, default 128, lg 160; the Figma pattern is sample art; keep the real code dark on light in every theme; alt text names the destination)
