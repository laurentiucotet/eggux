# Commerce

Components on the Commerce page (COMPONENTS): Product Card and the parts below. Blocks on the Commerce
page (BLOCKS): the Storefront family (Store Navbar, Storefront Hero, Category Tiles, Promo Section,
Incentives, Product Carousel, Store Footer), Category Filters, Product Grid, Product Detail, Product
Quick View, Shopping Cart Page, Checkout Single Page, Order Confirmation, Order Summary; examples "cart sheet",
"checkout page", "Storefront home", "Category page", "Product page", "Cart page". Address and
Payment blocks are on Forms; success page is `Block / Result`; the store back office is
`Block / Commerce Admin` on the App page.

## Rules
- Product Card: image 1:1, name, variant hint, price; sale = new price + struck original + % badge;
  sold out stays visible with "Notify me". The whole card links to the product.
- Product Card Layout: `vertical` in grids; `horizontal` (image left) for search lists, wishlists
  and cart suggestions; `overlay` (text on the photo) for editorial tiles without quick add.
- Product Detail: gallery, name, price, rating, short description, options as Toggle Group
  (unavailable options disabled, not hidden), quantity + Add to cart, delivery promise, details
  in Accordion. Show the selected option name in the label ("Color: Sand").
- Add to cart opens the cart Sheet (or a toast with "View cart"), never a new page.
- Quick view (`Block / Product Quick View`) adds to cart from a listing in a dialog: gallery,
  price, options, quantity, Add to cart and View full details; no reviews or accordions.
- Cart: line items with quantity and Remove, subtotal, taxes note, Checkout + Continue shopping.
  Cart page: `Block / Shopping Cart Page` (Line Items with a Separator after each, Order Summary
  with delivery and discount before checkout, recommendations). Example: `Example / Cart page`.
- The cart button in the header carries a Badge Count of items and opens the Mini Cart; hide the
  count at zero.
- Checkout: guest checkout allowed; address, delivery, payment on one page or a short Wizard;
  Order Summary sticky on the right; the pay button shows the amount ("Pay €95.00"). On one
  page: `Block / Checkout Single Page`; the pay button, the payment description and the Total
  show the same amount; opt-in unchecked by default.
- Localize Field Preset defaults (postal-code hint, region label) to the shop's market.
- Prices: currency and tax rules of the market; totals add up visibly; no surprise fees at the end.
  Each line of a summary is a Summary Row (discount in success with a minus sign, total last with a
  Separator above).
- After payment: `Block / Order Confirmation` (order number, where the email went, Shipment
  Tracker, items and totals as charged, addresses, payment) when the order has details;
  `Block / Result` success with the order number, email confirmation and next steps for simple
  confirmations.
- Accepted payment methods are a row of `Payment Method Mark` (names as text) in the footer and
  under the pay button; the product swaps in official artwork.
- Order status in admin lists uses soft Badges: paid and delivered success, processing warning,
  shipped info, refunded neutral, cancelled destructive (`Block / Commerce Admin`).

- Store home order: Announcement Banner, Navbar with cart, photo hero, proof stats, bestsellers
  (Product Cards with ratings), one promo band, category tiles with photos, a featured collection
  with a lifestyle photo, reviews with photos, Newsletter with a first-order code, a service strip
  (Trust Badges), Footer with payment methods. Build it from `Block / Store Navbar`,
  `Storefront Hero`, `Incentives`, `Product Carousel` (bestsellers), `Category Tiles`,
  `Promo Section`, a Testimonial Grid with store reviews and `Store Footer`. Examples:
  `Example / Storefront home`, `Example / Showcase / Tidewater store`.
- Service strip under the store hero or above the footer: `Block / Incentives` (Commerce page)
  or `Block / Trust Strip` (Sections page), Trust Badges for delivery, returns, warranty or
  secure checkout and support, same wording as checkout and policies.
- A Promo Section countdown matches the end date in its badge and never resets.
- Turn on `Show rating` on every Product Card of a grid or on none; sold-out cards keep Notify me
  (`Show notify`) even with quick add off.
- Sale prices sit on `background/default` or the muted section band, never on `background/muted`
  (red on it drops to 4.43:1 in Light).
- The order confirmation email repeats the order number, items with photos, totals and delivery
  address (`Screen / Email / Order confirmation`).

## Related components
- Checkout addresses use `Address Autocomplete` with manual entry; coupon codes use `Inline Form`;
  prices and limits with a currency use `Currency Input`.
- Components on the Commerce page: `Product Card`, `Line Item` (cart or summary), `Mini Cart`
  after Add to cart, and `Summary Row` for totals. Product options use `Swatch` (Color Picker
  page): Type=color or label, Size=default, State selected or unavailable, under a label like
  "Color: Sand". Quantity is a `Number Input` (Size=sm in Line Item). Stock is a `Status Dot`
  with its label (example "stock status" on the Badge page). Save for later is a `Button Icon`
  ghost with the heart icon (example "wishlist" on the Button page).
- Account pages: `Order Row` for order history (newest first), `Shipment Tracker` on the order page,
  `Address Card` and `Payment Method Card` for saved addresses and payment methods (last 4 digits
  only). Reviews: `Rating Summary` above a list of `Review Item`.
- Category page: `Block / Category Filters` (sidebar on desktop, Layout=drawer on phones with a
  Show N products button) or `Block / Product Grid` (Filter Sections on the left, active Filter
  Chips, a grid of Product Cards that FILL, Load More). Each active filter is a Filter Chip; the
  count, chips and Load More agree. Example: `Example / Category page`. Order history:
  `Block / Orders`; reviews: `Block / Reviews` under Product Detail.
- Mini Cart is a popover under the header cart button.
- Shop search results use `Search Result Item` Type=product; category listings stay on Product Card grids.
