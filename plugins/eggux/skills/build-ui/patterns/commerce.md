# Commerce

Blocks on the Commerce page: Product Card, Product Detail, Order Summary; examples "cart sheet"
and "checkout page". Address and Payment blocks are on Forms; success page is `Block / Result`.

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
