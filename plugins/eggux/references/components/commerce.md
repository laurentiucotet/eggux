# Commerce

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Quantity Selector](#quantity-selector) | 4 | - |
| [Stock Indicator](#stock-indicator) | 3 | - |
| [Wishlist Button](#wishlist-button) | 2 | - |
| [Variant Swatch](#variant-swatch) | 6 | - |
| [Product Card](#product-card) | 3 | - |
| [Line Item](#line-item) | 2 | - |
| [Mini Cart](#mini-cart) | 1 | Items |
| [Order Row](#order-row) | 4 | - |
| [Shipment Tracker](#shipment-tracker) | 1 | - |
| [Address Card](#address-card) | 2 | - |
| [Payment Method Card](#payment-method-card) | 2 | - |

On the Figma page: "Stress test / Address Card", "Stress test / Line Item", "Stress test / Mini Cart", "Stress test / Order Row", "Stress test / Payment Method Card", "Stress test / Product Card", "Stress test / Quantity Selector", "Stress test / Shipment Tracker", "Stress test / Stock Indicator", "Stress test / Variant Swatch", "Stress test / Wishlist Button"

## Quantity Selector

Component set · 4 variants · default size 102 × 38

Change a quantity in steps of one: minus, the number, plus. State=min disables minus at the lowest quantity (1, or 0 when removing is allowed). The number is also typeable. Max from stock; say it when reached ("Only 3 left"). sm in cart lines, default on product pages.

**Use for**

- Cart lines (Size=sm)
- Product page next to Add to cart (Size=default)
- Order forms with several items

**Not for**

- Decimals or large ranges: use Number Input
- A value on a scale: use Slider
- A read-only quantity: use Line Item Layout=summary

**Anatomy**

1. Decrease: Button Icon (minus)
2. Value: the number, typeable
3. Increase: Button Icon (plus)
4. Size: sm, default; State: default, min

**Content and behavior**

- State=min disables minus at the lowest quantity (1, or 0 when removing is allowed)
- Max comes from stock; say it when reached ("Only 3 left") and disable plus
- Typed values outside the range go back to the nearest allowed one, with a message
- Totals update at once

**Accessibility**

- The value is an input with a label that names the product ("Quantity, Linen shirt") and min and max
- Buttons have aria-labels "Decrease quantity" and "Increase quantity"
- Arrow keys change the value; a disabled button keeps focus on the input

| Variant property | Values |
|---|---|
| Size | sm, default |
| State | default, min |

| Property | Type | Default |
|---|---|---|
| Value | text | 2 |

Built from: `Button Icon`

Tokens and styles:
- Colors: `border/input`, `foreground/default`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: two shadcn `Button size="icon"` + `Input type="number" inputMode="numeric"` (min and max from stock)

## Stock Indicator

Component set · 3 variants · default size 68 × 20

Availability of a product or variant: in stock, low (with the number left), out of stock (with Notify me or the restock date nearby). Next to the price on product pages and in carts. Low stock only when it is true; never use it to create pressure.

**Use for**

- Next to the price on a product page
- Cart lines
- Product Card when stock matters

**Not for**

- The status of an order or a record: use Badge
- Delivery progress: use Shipment Tracker
- System status: use Service Status Row

**Anatomy**

1. Status Dot with the level as text: "In stock", "Only 3 left", "Out of stock"
2. Level: in stock, low, out

**Content and behavior**

- Low only when it is true, with the number left; never to create pressure
- Out of stock keeps the product visible with Notify me or the restock date nearby
- Follows the selected variant and updates when it changes
- Text says the level; color is never the only cue

**Accessibility**

- The dot is aria-hidden; the text carries the meaning
- A change after a variant switch is announced in an aria-live="polite" region
- Text meets 4.5:1

| Variant property | Values |
|---|---|
| Level | in stock, low, out |

Built from: `Status Dot`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: `Status Dot` + text `<span>` (Per selected variant; `aria-live="polite"` on change)

## Wishlist Button

Component set · 2 variants · default size 36 × 36

Save a product for later: heart outline, filled when saved. Toggles at once with a short toast only the first time ("Saved to your list"). Accessible name says the state ("Save Linen shirt", "Remove Linen shirt from saved"). On product cards top right, on product pages next to Add to cart.

**Use for**

- Product Card, top right over the image
- Product page, next to Add to cart
- Cart lines, to move an item to saved

**Not for**

- Reacting to content or messages: use Reaction
- Adding to the cart: use Button
- Sharing a product: use Social Share

**Anatomy**

1. Button Icon: heart, outline when Saved=false, filled when Saved=true

**Content and behavior**

- Toggles at once, with a short toast only the first time ("Saved to your list")
- Never leaves the page
- Over a photo, the button keeps its background for contrast
- Signed-out people can save too; ask to sign in when they open the list

**Accessibility**

- The accessible name says the state and the product ("Save Linen shirt", "Remove Linen shirt from saved")
- Visible focus ring over images; touch target at least 44 px on mobile
- The heart icon is aria-hidden

| Variant property | Values |
|---|---|
| Saved | false, true |

Built from: `Button Icon`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Button size="icon" variant="ghost"` + lucide `Heart` (`fill-current` when saved) (Optimistic toggle; aria-label names state and product)

## Variant Swatch

Component set · 6 variants · default size 36 × 36

One option of a product variant: a color dot or a size box. Group them under a label that names the choice ("Color: Sand"). selected has a 2 px ring; unavailable stays visible, muted or struck through, and says "Out of stock" on hover. Colors come from the product photo, set as the fill of the "color" layer.

**Use for**

- Colors and sizes on a product page
- Material or finish choices
- A quick add dialog from a Product Card

**Not for**

- Picking any color: use Color Picker or Swatch Picker
- Options with a price or a description: use Option Card
- Long lists of options: use Select

**Anatomy**

1. Color: fill from the product photo (Type=color)
2. Label: "M" (Type=size)
3. State: default, selected, unavailable

**Content and behavior**

- Group swatches under a label that names the choice and the value ("Color: Sand")
- Selected has a 2 px ring
- Unavailable stays visible, muted or struck through, and says "Out of stock" on hover
- Colors come from the product photo
- Choosing a swatch updates photo, price and stock

**Accessibility**

- The group is a radiogroup with a label; each swatch is a radio named by its value ("Sand", "M")
- Unavailable swatches stay focusable with aria-disabled and "Out of stock" in the name
- Arrow keys move between swatches; color is never the only cue

| Variant property | Values |
|---|---|
| Type | color, size |
| State | default, selected, unavailable |

| Property | Type | Default |
|---|---|---|
| Label | text | M |

Tokens and styles:
- Colors: `border/default`, `border/input`, `chart/2`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/3`
- Radius: `radius/full`, `radius/md`
- Text styles: `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `RadioGroup` (or `ToggleGroup type="single"`) with custom items (Unavailable: `aria-disabled`, still focusable)

## Product Card

Component set · 3 variants · default size 264 × 384

Product tile for grids and carousels: image 1:1, badges (sale %, new, sold out), wishlist, name, variant hint, price (sale price + struck original), optional quick add. The whole card links to the product page.

**Use for**

- Product grids and category pages (3-4 per row on desktop, 2 on mobile)
- Carousels of related products
- Product search results

**Not for**

- Articles and case studies: use Post Card
- A product in a cart or an order: use Line Item
- The product page itself: use Block / Product Detail

**Anatomy**

1. Image Placeholder 1:1
2. Badges: sale %, new or sold out (State)
3. Wishlist: Button Icon ghost, top right (Show wishlist)
4. Name: 2 lines
5. Variant text: "Sand · 3 colors"
6. Price: sale price and struck original when State=sale
7. Action: Button (Show action), "Add to cart" or "Notify me" when sold out

**Content and behavior**

- The whole card opens the product; Wishlist and the action button are the only other controls
- Name in 2 lines at most, then cut
- State=sale: new price, struck original and the sale % Badge
- State=sold-out stays visible, image dimmed, action becomes "Notify me"
- Add to cart opens the Mini Cart, never a new page
- Same photo ratio and background across a grid

**Accessibility**

- One link for the card (on the name, stretched over the card)
- Wishlist and Add to cart are separate buttons with the product name in their labels
- The image alt is empty when the name sits next to it; the price reads old and new

| Variant property | Values |
|---|---|
| State | default, sale, sold-out |

| Property | Type | Default |
|---|---|---|
| Name | text | Linen shirt, relaxed fit |
| Variant text | text | Sand · 4 colors |
| Show action | boolean | true |
| Show wishlist | boolean | true |

Built from: `Badge`, `Button`, `Button Icon`, `Image Placeholder`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Card` with an `<a>` stretched over the card, `Badge`, `Button` (icon) for wishlist (Whole card is one link; Add to cart opens the `Mini Cart`)

## Line Item

Component set · 2 variants · default size 480 × 106

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
4. Quantity: Quantity Selector sm (cart) or "Qty 2" (summary)
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

Built from: `Button`, `Image Placeholder`, `Quantity Selector`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`
- Text styles: `ui/caption`, `ui/label`

Code: custom `<li class="flex gap-4">`: `<img>`, text, `Quantity Selector`, amount, ghost `Button` (`tabular-nums`; Undo in `Sonner` toast)

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

Component set · 4 variants · default size 720 × 63

One order in an account's order history: number, date and item count, status, total, chevron to the order page. Newest first. Status names come from one list across email, page and support. Search by order number above the list when there are more than 20.

**Use for**

- Order history in an account
- Recent orders on an account overview
- A customer's orders in a support tool

**Not for**

- Many orders with sorting and bulk actions: use Table
- The items inside an order: use Line Item
- Where a delivery is: use Shipment Tracker

**Anatomy**

1. Number: "Order #10482"
2. Meta: date · item count
3. Status Badge: processing, shipped, delivered, cancelled
4. Total
5. Chevron right

**Content and behavior**

- Newest first
- Status names come from one list across email, page and support
- Search by order number above the list when there are more than 20
- The whole row opens the order page
- Cancelled orders stay in the list with their total

**Accessibility**

- The row is one link named by number, status and total ("Order #10482, Shipped, €112.40")
- Status is text in the Badge, not color alone; the chevron is aria-hidden
- Dates in a <time> element

| Variant property | Values |
|---|---|
| Status | processing, shipped, delivered, cancelled |

| Property | Type | Default |
|---|---|---|
| Number | text | Order #10482 |
| Meta | text | 12 Nov 2026 · 3 items |
| Total | text | €112.40 |

Built from: `Badge`. Icons: chevron-right

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
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

A saved address to pick or manage: name, address lines in the country's format, phone, Default badge, Edit and Remove. In checkout with a radio (pick one, Selected=true); in account settings without it. Add new address as the last card.

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
4. Actions: Edit, Remove Buttons

**Content and behavior**

- Lines in the format of the country
- Checkout: a radio, pick one, Selected=true; account settings: no radio
- Add new address is the last card
- Remove asks to confirm (Confirm Popover)
- One default address; the Default badge sits next to the name

**Accessibility**

- In checkout the cards are a radiogroup; the whole card is the label of its radio
- Edit and Remove name the address ("Edit address, Elena Popa")
- Lines in an <address> element

| Variant property | Values |
|---|---|
| Selected | false, true |

| Property | Type | Default |
|---|---|---|
| Name | text | Elena Popa |
| Address | text | Strada Exemplu 12, Floor 3 ⏎ 010101 Bucharest, Romania ⏎ +40 712 345 678 |
| Show default | boolean | true |
| Show radio | boolean | true |

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

A saved card, bank account or wallet in billing settings or checkout: brand, last 4 digits, expiry, Default badge, menu (Make default, Remove). expired says it in destructive and offers Update. Never show more than the last 4 digits. Removing the default asks which one replaces it.

**Use for**

- Billing settings (Block / Billing)
- Saved methods in checkout
- Subscription management

**Not for**

- Entering a new card: use Block / Payment
- A saved address: use Address Card
- Invoices and charges: use Table

**Anatomy**

1. Brand: "VISA"
2. Card: "Visa ending in 4242" and expiry
3. Default Badge
4. Menu: Button Icon (Make default, Remove)
5. State: default, expired

**Content and behavior**

- Never show more than the last 4 digits
- expired says it in destructive and offers Update
- Removing the default asks which method replaces it
- Brand marks come from the payment provider

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

Built from: `Badge`, `Button`, `Button Icon`

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `ui/caption`, `ui/label`, `ui/label-small`

Guides: [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Card` + `Badge` + `DropdownMenu` (Data from the payment provider (Stripe `PaymentMethod`); last 4 digits only)
