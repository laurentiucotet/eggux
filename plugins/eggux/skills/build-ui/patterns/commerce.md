# Commerce

Components on the Commerce page (COMPONENTS): Product Card and the parts below. Blocks on the Commerce
page (BLOCKS): Product Detail, Order Summary; examples "cart sheet" and "checkout page". Address and Payment blocks are on Forms; success page is `Block / Result`.

## Rules
- Product Card: image 1:1, name, variant hint, price; sale = new price + struck original + % badge;
  sold out stays visible with "Notify me". The whole card links to the product.
- Product Detail: gallery, name, price, rating, short description, options as Toggle Group
  (unavailable options disabled, not hidden), quantity + Add to cart, delivery promise, details
  in Accordion. Show the selected option name in the label ("Color: Sand").
- Add to cart opens the cart Sheet (or a toast with "View cart"), never a new page.
- Cart: line items with quantity and Remove, subtotal, taxes note, Checkout + Continue shopping.
- Checkout: guest checkout allowed; address, delivery, payment on one page or a short Wizard;
  Order Summary sticky on the right; the pay button shows the amount ("Pay €95.00").
- Prices: currency and tax rules of the market; totals add up visibly; no surprise fees at the end.
  Each line of a summary is a Summary Row (discount in success with a minus sign, total last with a
  Separator above).
- After payment: `Block / Result` success with the order number, email confirmation, next steps.

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
- Category page: `Block / Product Grid` (Filter Sections on the left, active Filter Chips, a grid of Product Cards that FILL, Load More); order history: `Block / Orders`; reviews: `Block / Reviews` under Product Detail.
- Mini Cart is a popover under the header cart button.
