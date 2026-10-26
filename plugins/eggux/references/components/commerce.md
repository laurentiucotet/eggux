# Commerce

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Product Card](#product-card) | 9 | - |
| [Line Item](#line-item) | 2 | - |
| [Mini Cart](#mini-cart) | 1 | Items |
| [Order Row](#order-row) | 18 | - |
| [Shipment Tracker](#shipment-tracker) | 1 | - |
| [Address Card](#address-card) | 2 | - |
| [Payment Method Card](#payment-method-card) | 2 | - |
| [Payment Method Mark](#payment-method-mark) | 1 | - |

On the Figma page: "Example / Product Card styles", "Example / in billing", "Example / in orders", "Example / mini cart opened from the store header", "Example / payment methods", "Stress test / Address Card", "Stress test / Line Item", "Stress test / Mini Cart", "Stress test / Order Row", "Stress test / Payment Method Card", "Stress test / Payment Method Mark", "Stress test / Product Card", "Stress test / Shipment Tracker"

## Product Card

Component set · 9 variants · default size 264 × 384

A product in a grid, carousel or list: photo, sale or sold-out badges, wishlist, name, variant text, Price and Old price, optional quick add. Layout: vertical (default) for product grids, set the card to Fill in a Grid auto layout (min width 160), the photo height follows the width; horizontal (120 px photo left, details and action right, no wishlist) for search result lists, wishlists, recently viewed and cart suggestions; overlay (name, variant text and price over the photo on a media/scrim panel, wishlist on the photo, no action button) for editorial grids, lookbooks and category tiles where the photo sells. Pick the photo ratio on the exposed Image (1:1 default, 3:4 for fashion), the same across a grid. Overlay text is media/foreground on media/scrim, 5.7:1 over the brightest pixel. One Layout per grid.


Usage: eggux build-ui/patterns/commerce.md

**Use for**

- Product grids and category pages (3-4 per row on desktop, 2 on mobile): Layout=vertical
- Carousels of related products
- Product search results, wishlists, recently viewed and cart suggestions: Layout=horizontal
- Editorial grids, lookbooks and category tiles where the photo sells: Layout=overlay

**Not for**

- Articles and case studies: use Post Card
- A product in a cart or an order: use Line Item
- The product page itself: use Block / Product Detail

**Anatomy**

1. Layout: vertical (default), horizontal (400 wide, 120 px photo left), overlay (264 x 352, text over the photo)
2. Image (exposed Image Placeholder): Ratio 1:1 by default, 3:4 or 4:3 per instance; height follows the card width
3. Badges: sale %, new or sold out (State)
4. Wishlist: Button Icon ghost, top right (Show wishlist)
5. Name: 2 lines
6. Variant text: "Sand · 3 colors"
7. Rating (Show rating, off by default): exposed Rating sm with Count ("(128)"), set Value and Count on the instance
8. Price, Old price (State=sale shows Old price struck through)
9. Action: Button (Show action) "Add to cart"; State=sold-out shows "Notify me" with its own Show notify, independent of Show action
10. Horizontal: no wishlist; details column with name, variant text, rating, price and the action (hug)
11. Overlay: media/scrim-fade to media/scrim gradient and a media/scrim panel with name, variant text and price in media/foreground; wishlist and badges stay on the photo; no action or Notify me

**Content and behavior**

- One Layout per grid or list; overlay only where the photo is the point and there is no quick add
- The whole card opens the product; Wishlist and the action button are the only other controls
- Name in 2 lines at most, then cut
- State=sale: new price, struck original and the sale % Badge
- State=sold-out stays visible, image dimmed, action becomes "Notify me"
- Add to cart opens the Mini Cart, never a new page
- Same photo ratio and background across a grid
- In grids set the card to Fill in a Grid auto layout (4 columns desktop, 2 mobile); minimum width 160
- Pick the photo ratio once per grid on the exposed Image, never by resizing the image layer
- Show rating on every card of a grid or on none; the count is the number of reviews
- Sold out keeps Notify me even when quick add (Show action) is off in the grid; turn Show notify off only when there is no restock

**Accessibility**

- One link for the card (on the name, stretched over the card)
- Wishlist and Add to cart are separate buttons with the product name in their labels
- The image alt is empty when the name sits next to it; the price reads old and new
- Overlay text is media/foreground on media/scrim (black 60%): 5.7:1 over the brightest pixel

| Variant property | Values |
|---|---|
| Layout | vertical, horizontal, overlay |
| State | default, sale, sold-out |

| Property | Type | Default |
|---|---|---|
| Name | text | Linen shirt, relaxed fit |
| Variant text | text | Sand · 4 colors |
| Show action | boolean | true |
| Show wishlist | boolean | true |
| Price | text | €59.00 |
| Old price | text | €59.00 |
| Show rating | boolean | false |
| Show notify | boolean | true |

Built from: `Badge`, `Button`, `Button Icon`, `Image Placeholder`, `Rating`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`, `media/foreground`, `media/scrim`
- Spacing and size: `spacing/0`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Card` with an `<a>` stretched over the card, `Badge`, `Button` (icon) for wishlist (Whole card is one link; Add to cart opens the `Mini Cart`)

## Line Item

Component set · 2 variants · default size 480 × 100

One product in a cart, checkout summary, order or invoice: image, name, variant, quantity, line total. cart lets people change the quantity and remove; summary is read-only ("Qty 2"). The line total updates at once; removing offers Undo. Totals below use Summary Row.

**Use for**

- Cart page and Mini Cart (Layout=cart)
- Checkout order summary (Layout=summary)
- Order details, invoices and confirmation pages

**Not for**

- Subtotal, taxes and discounts: use Summary Row
- Orders in an order history: use Order Row
- A product in a grid: use Product Card

**Anatomy**

1. Image Placeholder 1:1
2. Name
3. Variant: "Sand · M"
4. Quantity: Number Input sm (cart) or "Qty 2" (summary)
5. Total: line total
6. Remove: Button (cart)

**Content and behavior**

- cart lets people change the quantity and remove; summary is read-only
- The line total updates at once
- Removing offers Undo in a Toast
- Name in 2 lines at most; variant in one line
- When quantity is above 1, show the unit price ("€47.20 each")

**Accessibility**

- Code as a <ul> of items
- Remove names the product ("Remove Linen shirt")
- Total changes are announced in an aria-live="polite" region
- The image is decorative next to the name (alt="")

| Variant property | Values |
|---|---|
| Layout | cart, summary |

| Property | Type | Default |
|---|---|---|
| Name | text | Linen shirt, relaxed fit |
| Variant | text | Sand · M |
| Total | text | €94.40 |
| Quantity | text | Qty 2 |

Built from: `Button`, `Image Placeholder`, `Number Input`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`
- Text styles: `ui/caption`, `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: custom `<li class="flex gap-4">`: `<img>`, text, `Number Input` (Size=sm), amount, ghost `Button` (`tabular-nums`; Undo in `Sonner` toast)

## Mini Cart

Component · 1 variant · default size 360 × 359

The cart in a popover after Add to cart or from the cart icon: items with quantity and line total, subtotal, View cart and Checkout. Open for 4 s after adding, then on demand. Changing quantities happens on the cart page; this panel only shows and removes. Empty: "Your cart is empty" and a link to keep shopping.

**Use for**

- After Add to cart (open for 4 s)
- From the cart icon in the Navbar
- A quick check before checkout

**Not for**

- Changing quantities and applying codes: use Line Item Layout=cart on the cart page
- The cart on mobile: use Sheet
- A confirmation only: use Toast with "View cart"

**Anatomy**

1. Header: title and close Button Icon
2. Items slot: Line Items
3. Separator
4. Subtotal: Summary Row
5. Note: shipping and taxes at checkout
6. Actions: View cart (outline), Checkout (primary)

**Content and behavior**

- Opens for 4 s after adding, then on demand; hover or focus keeps it open
- Shows and removes only; quantities change on the cart page
- Empty: "Your cart is empty" and a link to keep shopping
- 3-4 items, then the list scrolls
- The note says what the subtotal leaves out

**Accessibility**

- Opened after adding, it does not take focus; "Added to cart" is announced in an aria-live region
- Opened from the icon, focus moves into it; Esc closes and returns focus to the icon
- The cart icon names the count ("Cart, 2 items")

Slots (fill them in the instance, never detach): `Items`

Built from: `Button`, `Button Icon`, `Line Item`, `Separator`, `Summary Row`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Popover` (`Sheet` on mobile) + `Line Item`s, `Summary Row`, `Button`s (Auto-open 4 s without moving focus)

## Order Row

Component set · 18 variants · default size 720 × 63

One order or invoice in an account history: number, date and item count, status, total, chevron to the order page. Status: processing, shipped, delivered, cancelled for orders; paid and refunded for invoices and payments. State: default, hover, selected (the order open beside the list). Newest first. Status names come from one list across email, page and support. Search by number above the list when there are more than 20.


Usage: eggux build-ui/patterns/commerce.md

**Use for**

- Order history in an account
- Invoice history in billing settings
- Recent orders on an account overview
- A customer's orders in a support tool

**Not for**

- Many orders with sorting and bulk actions: use a table of Table Cells
- The items inside an order: use Line Item
- Where a delivery is: use Shipment Tracker

**Anatomy**

1. Number: "Order #10482", or the invoice date or number
2. Meta: date · item count, or plan · seats
3. Status Badge: processing, shipped, delivered, cancelled (orders); paid, refunded (invoices)
4. Total
5. Chevron right
6. State: default, hover (background/muted), selected (background/accent, the order open next to the list)

**Content and behavior**

- Newest first
- Invoices use Status=paid or refunded, never an order status with a changed label
- Status names come from one list across email, page and support
- Search by order number above the list when there are more than 20
- The whole row opens the order page
- Cancelled orders stay in the list with their total
- In a list with the order detail beside it, the open order is State=selected; never a fill override

**Accessibility**

- The row is one link named by number, status and total ("Order #10482, Shipped, €112.40")
- Status is text in the Badge, not color alone; the chevron is aria-hidden
- Dates in a <time> element
- The selected row has aria-current="true"

| Variant property | Values |
|---|---|
| Status | processing, shipped, delivered, cancelled, paid, refunded |
| State | default, hover, selected |

| Property | Type | Default |
|---|---|---|
| Number | text | Order #10482 |
| Meta | text | 12 Nov 2026 · 3 items |
| Total | text | €112.40 |

Built from: `Badge`. Icons: chevron-right

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/4`
- Text styles: `ui/caption`, `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: `<a>` row + shadcn `Badge`, `<time>` (Status names from one shared list)

## Shipment Tracker

Component · 1 variant · default size 640 × 144

Where an order is: the expected day first, carrier and tracking number, then the steps with dates (Ordered, Shipped, Out for delivery, Delivered). Problems (delayed, returned) replace the step with an error and say what happens next. Link to the carrier for the full scan history.

**Use for**

- The order page
- The page a shipping email links to
- A support view of an order

**Not for**

- A process people go through: use Stepper
- A history of changes: use Timeline Item
- A list of orders: use Order Row

**Anatomy**

1. Header: package icon, ETA, carrier · tracking number, Track Button
2. Steps: Ordered, Shipped, Out for delivery, Delivered, with dates

**Content and behavior**

- The expected day comes first ("Arriving Thursday, 14 Nov")
- Problems (delayed, returned) replace the step with an error and say what happens next
- Track links to the carrier for the full scan history
- The tracking number can be copied
- Several parcels: one tracker per parcel

**Accessibility**

- Steps as an <ol>; the current step has aria-current="step"
- Step states are text (done, current, delayed), not color alone
- The Track link names the carrier and says it opens a new tab

| Property | Type | Default |
|---|---|---|
| ETA | text | Arriving Thursday, 14 Nov |
| Carrier | text | DHL · 1Z999AA10123456784 |

Built from: `Button`, `Step`. Icons: package

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/5`
- Radius: `radius/xl`
- Text styles: `heading/h4`, `ui/caption`

Guides: [stepper](../../skills/build-ui/components/stepper.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: custom header + `<ol>` of `Step` (`aria-current="step"`; carrier tracking URL)

## Address Card

Component set · 2 variants · default size 320 × 154

A saved address to pick or manage: name, address lines in the country's format, phone, Default badge, Edit and Remove (Show actions). In checkout with a radio (pick one, State=selected); in account settings without it; read-only places (order details) turn off Show actions. Add new address as the last card.


Usage: eggux build-ui/patterns/commerce.md

**Use for**

- Choosing an address in checkout (Show radio)
- The address book in account settings
- Billing address in billing settings

**Not for**

- Entering a new address: use Block / Address or Address Autocomplete
- An office or a store people visit: use Location Card
- A choice with a price or a description: use Option Card

**Anatomy**

1. Radio (Show radio)
2. Name and Default Badge (Show default)
3. Address: lines in the country's format, phone
4. Actions (Show actions): Edit, Remove Buttons

**Content and behavior**

- Lines in the format of the country
- Checkout: a radio, pick one, State=selected; account settings: no radio
- Add new address is the last card
- Remove asks to confirm (Confirm Popover)
- One default address; the Default badge sits next to the name
- Read-only places (order details, receipts) turn off Show actions and Show radio

**Accessibility**

- In checkout the cards are a radiogroup; the whole card is the label of its radio
- Edit and Remove name the address ("Edit address, Elena Popa")
- Lines in an <address> element

| Variant property | Values |
|---|---|
| State | default, selected |

| Property | Type | Default |
|---|---|---|
| Name | text | Elena Popa |
| Address | text | Strada Exemplu 12, Floor 3 ⏎ 010101 Bucharest, Romania ⏎ +40 712 345 678 |
| Show default | boolean | true |
| Show radio | boolean | true |
| Show actions | boolean | true |

Built from: `Badge`, `Button`, `Radio`

Tokens and styles:
- Colors: `background/card`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `RadioGroup` + `Card` items (`Label` wraps the card), `<address>`

## Payment Method Card

Component set · 2 variants · default size 400 × 64

A saved card or account: brand, last 4 digits, expiry, Default badge (Show default) and a menu. State=expired shows Update. Card and expiry cut with an ellipsis when narrow. Turn off Show default on receipts and past orders.


Usage: eggux build-ui/patterns/commerce.md

**Use for**

- Billing settings (Block / Billing)
- Saved methods in checkout
- Subscription management

**Not for**

- Entering a new card: use Block / Payment
- A saved address: use Address Card
- Invoices and charges: use a table of Table Cells

**Anatomy**

1. Brand: "VISA"
2. Card: "Visa ending in 4242" and expiry, one line each, cut with an ellipsis when narrow
3. Default Badge (Show default)
4. Menu: Button Icon (Make default, Remove)
5. State: default, expired (expired shows Update instead of the Badge)

**Content and behavior**

- Never show more than the last 4 digits
- expired says it in destructive and offers Update
- Removing the default asks which method replaces it
- Brand marks come from the payment provider
- Show default only where the default can change (billing settings); turn it off on receipts and past orders

**Accessibility**

- The card reads as text ("Visa ending in 4242, expires 08/28"), not dots
- Expired is said in text, not color alone
- The menu button names the method ("Options for Visa ending in 4242")

| Variant property | Values |
|---|---|
| State | default, expired |

| Property | Type | Default |
|---|---|---|
| Card | text | Visa ending in 4242 |
| Brand | text | VISA |
| Show default | boolean | true |

Built from: `Badge`, `Button`, `Button Icon`

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `ui/caption`, `ui/label`, `ui/label-small`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Card` + `Badge` + `DropdownMenu` (Data from the payment provider (Stripe `PaymentMethod`); last 4 digits only)

## Payment Method Mark

Component · 1 variant · default size 42 × 24

A small card-shaped mark that names one accepted payment method (Visa, Mastercard, PayPal, Apple Pay, Klarna, SEPA) in text.


Use in a row in the store footer, under the pay button or in the cart, to show which methods are accepted before checkout.


Rules
One mark per method, in a row with an 8 px gap; list the methods the market actually accepts.
The name stays text: the library draws no real brand logos. Swap in the official artwork from each provider in the product, following their brand rules.
Not a control: for choosing how to pay use Option Card or Payment Method Card.


Usage: eggux build-ui/patterns/commerce.md

**Use for**

- A row of accepted methods in the store footer
- Under the pay button or in the cart summary

**Not for**

- Choosing how to pay: use Option Card or Payment Method Card
- Drawing real brand logos in the library

**Anatomy**

1. Container: 24 high, min 40 wide, border/default, background/card, radius/sm
2. Name (TEXT): the method, ui/label-small

**Content and behavior**

- One mark per method, 8 px apart, only methods the market accepts
- The name stays text; the product swaps in each provider's official artwork under its brand rules

**Accessibility**

- Give the row a label such as "Accepted payment methods"; each mark reads as its name

| Property | Type | Default |
|---|---|---|
| Name | text | Visa |

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`
- Spacing and size: `spacing/2`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `ui/label-small`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)
