---
updated: "2026-11-25"
---

# Questions

What needs deciding, with options. Claude proposes options; you choose. A choice becomes a
decision in decisions.md and a task in tasks.md.

## Q-014 · What is the target for the share of resets that end signed in?
- Type: unknown
- Source: feature:forgot-password
- Category: behavior
- Status: open
- Blocks: nothing

## Q-013 · Does a successful reset unlock an account locked after failed sign-ins?
- Type: unknown
- Source: feature:forgot-password
- Category: behavior
- Status: open
- Recommended: A
- Blocks: backend only; build with the proposed answer

### A · Yes, a successful reset unlocks it
- By: claude

## Q-012 · Do we email an address that has no account?
- Type: unknown
- Source: feature:forgot-password
- Category: behavior
- Status: open
- Recommended: A
- Blocks: backend only; build with the proposed answer

### A · Send nothing, and show the same message as for a known address
- By: claude

## Q-011 · What do we do about: Offer express payment on the product page so the busy parent can buy without typing?
- Type: finding
- Source: research:best-practices-on-product-pages-for-digital-produc F-04
- Category: behavior
- Status: open
- Recommended: A

### A · Wallet button on the product page, under Add to cart
- Pro: Busy parent buys one item in a few taps with Apple Pay or Google Pay. The wallet fills in email, address and card, so there is nothing to type
- Pro: Fits the goals of finishing in under 2 minutes and never creating an account
- Pro: Works with one hand and forgotten passwords: Face ID or fingerprint replaces any sign-in
- Pro: Only shows on devices that support a wallet. Everyone else sees the normal Add to cart, so nobody hits a dead end
- Con: Two buttons on the product page compete. Add to cart has to stay primary and the wallet button sits second
- Con: Buys only this item. Parents who want several items still go through the cart
- Con: Skips the cart, so cart upsells and order review are lost on these orders
- Con: The wallet address may not be deliverable. The wallet sheet needs an address check and a clear error, which adds work to the 'address not deliverable' failure path
- By: claude

### B · Wallet button only at the top of the cart and checkout step 1
- Pro: Product page keeps one clear primary action (Add to cart)
- Pro: Covers orders with several items, the most common basket for a monthly shop
- Pro: Fits the guest checkout steps and the fixed bottom bar (D-005, D-009) with no new page pattern
- Pro: Cart review and upsells stay in place
- Con: At least two extra steps (cart, then checkout) before a parent can pay without typing
- Con: Misses the research finding (F-04) that express payment works best on the product page
- Con: More chances to drop out on a weak mobile connection, with each extra page load
- By: claude

## Q-010 · What do we do about: Use the same 48 px sticky primary button bar on product pages as in checkout?
- Type: finding
- Source: research:best-practices-on-product-pages-for-digital-produc F-03
- Category: component
- Status: open
- Recommended: A

### A · Same 48 px sticky bar, shown once the inline Buy button scrolls out of view
- Pro: Reuses the checkout bar (D-005, D-006, D-009), so there is one component and one behavior to build and test
- Pro: Buy stays in the thumb zone on long product pages, which fits the busy parent's one-handed, short-session use
- Pro: Shoppers see the same bar from product page to Place order
- Con: Covers about 48 px plus padding at the bottom of the page, so content needs matching bottom space
- Con: The bar must show and hide based on scroll, which adds a little logic and needs a reduced-motion check
- Con: With the keyboard open or the cookie banner up, the bar can stack with other fixed elements
- By: claude

### B · Inline primary button only, no sticky bar on product pages
- Pro: More of the screen for product images, description and reviews
- Pro: Simpler page with no fixed elements to manage
- Pro: The sticky bar stays a checkout-only signal that means 'you are paying now'
- Con: On long pages Buy goes out of reach, so the shopper has to scroll back up with one hand
- Con: Product pages and checkout behave differently, which makes the system less consistent
- Con: Likely more drop-off between product and cart for mobile shoppers in a hurry
- By: claude

## Q-009 · What do we do about: Skip the delivery address step (D-003) when the cart holds only digital items?
- Type: finding
- Source: research:best-practices-on-product-pages-for-digital-produc F-02
- Category: behavior
- Status: open
- Recommended: A

### A · Skip the address step for digital-only carts
- Pro: Checkout goes from 4 steps to 3 (email, payment, confirmation), which supports the busy parent's goal of finishing in under 2 minutes
- Pro: The shop doesn't ask for an address it will never use, so there's less typing on a phone with one hand
- Pro: The 'address not deliverable' failure can't happen for these orders
- Pro: D-003 still applies to every cart that holds a physical item, so mixed carts keep the separate address step
- Con: The step indicator and flow need a second version with 3 steps, which means more states to design and test
- Con: Payment may still need billing fields (postcode or country) for card checks or tax, and those must go in the payment step
- Con: The Order object needs 'delivery address' to be optional and a new 'digital' flag on items
- Con: If the shopper adds a physical item later, the address step has to come back without losing what they entered
- By: claude

### B · Keep the address step for every order
- Pro: One flow for all carts, so there's less to design, build and test
- Pro: Billing and tax details are always collected in one known place
- Pro: D-003 stays as it is, with no exceptions
- Con: Shoppers fill in an address that is never used, which is pointless work and goes against the research finding (F-02)
- Con: An extra step on mobile raises the risk of abandonment, and the busy parent has very little time
- Con: It may confuse shoppers, who could think something will be shipped to them
- By: claude

## Q-008 · What do we do about: Show format, delivery method, timing and refund terms near the price on digital product pages?
- Type: finding
- Source: research:best-practices-on-product-pages-for-digital-produc F-01
- Category: content
- Status: open
- Recommended: A

### A · Short facts row right under the price
- Pro: Shopper sees format, delivery method, timing and refund terms before tapping buy, so there is no doubt at the moment of decision
- Pro: Fits the busy parent on a phone: 3-4 short lines with icons that can be read in seconds with one hand
- Pro: Fewer support emails like "where is my file?" or "can I get a refund?"
- Pro: Same facts can be repeated in the confirmation email and order page, which keeps the content consistent
- Con: Takes vertical space above the fold on mobile and can push the description down
- Con: Each digital product needs these 4 facts filled in, which adds work for the content team
- Con: Refund terms must be short here, with a link to the full policy
- By: claude

### B · Facts in an expandable "Details" section below the description
- Pro: Keeps the area around the price and the fixed bottom bar (D-009) clean
- Pro: Room for the full refund policy and delivery details in one place
- Pro: Easy to add to existing product page templates
- Con: Most mobile shoppers don't open accordions, so they buy without knowing how or when they get the product
- Con: Doubt about delivery or refunds shows up at checkout or after payment, which leads to drop-off and support tickets
- Con: Goes against the research finding (F-01), which says these facts belong near the price
- By: claude

## Q-007 · What do we do about: Keep account saving after payment, never before. The current step 4 placement is right?
- Type: finding
- Source: research:saving-an-account-right-after-a-guest-checkout F-01
- Category: behavior
- Status: decided A (D-008)
- Recommended: A

### A · Keep saving at step 4, after payment
- Pro: Matches the busy parent's goal: never create an account just to pay
- Pro: Adds no fields or decisions before payment, so the 2-minute target and the Pay button flow (D-005) stay clean
- Pro: The order is already placed, so the offer feels like a bonus rather than a gate
- Pro: Email and address from the order can be reused, so saving needs one action at most (a password, or an email link for people who forget passwords)
- Con: Some shoppers close the confirmation page without seeing the offer
- Con: We need a fallback, such as a 'Save my details' link in the confirmation email
- Con: The guest order has to be linked to the new account afterwards (Order belongs to account or guest email)
- By: claude

### B · Offer an optional 'Create account' choice before payment (at step 1)
- Pro: Every shopper sees the offer, so more people may sign up
- Pro: The account exists before payment, so the order links to it right away
- Con: Goes against the actor's goal and adds a choice on a weak connection with one hand free
- Con: Adds a password field before payment, which risks drop-off and forgotten passwords later
- Con: Looks like a forced sign-up and weakens trust in guest checkout
- Con: Makes the contact step longer, which works against the separate, short steps from D-003
- By: claude

## Q-006 · What do we do about: Offer a passkey or emailed set-up link before a typed password, since both actors forget passwords?
- Type: finding
- Source: research:saving-an-account-right-after-a-guest-checkout F-04
- Category: behavior
- Status: decided A (D-007)
- Recommended: A

### A · Passkey first, emailed link as fallback, no password at save
- Pro: The busy parent saves the account with one tap and Face ID or a fingerprint on the confirmation screen, so they stay in the checkout flow
- Pro: Works with one hand and adds no extra screen, in line with D-005 and D-006
- Pro: Passkeys sync through iCloud or Google, which helps the loyal customer who forgets the password on a rarely used device
- Pro: Nothing to remember, and support agents still never see a password
- Con: Needs a passkey attribute added to Customer account in objects.md, plus a passkey or link path in the Sign in workflow
- Con: Some shoppers don't know what a passkey is, so the button needs one short line of plain copy
- Con: Two paths to design and test: passkey, and link for devices without passkey support
- By: claude

### B · Emailed set-up link only, passkey or password added later in the account
- Pro: Simplest to build: reuses the reset email that support agents already send
- Pro: Works on any device and browser
- Pro: Nothing to type on the confirmation screen, because the email is already known from step 1
- Con: The shopper has to leave the shop for their email app, and on a weak connection the account may never get finished
- Con: Adds a step after the order, which works against the goal of finishing in under 2 minutes
- Con: The loyal customer still has nothing quick for signing in on a new device unless they set up a passkey later
- By: claude

## Q-005 · What do we do about: Keep the primary button in the thumb zone?
- Type: finding
- Source: research:checkout-patterns-on-mobile F-04
- Category: design
- Status: decided A (D-009)
- Recommended: A

### A · Fixed bottom bar for the primary button on every checkout step
- Pro: Extends D-005 from "Pay" to Contact, Delivery address (D-003) and Payment, so all steps behave the same way
- Pro: Busy parent with one hand free always finds the next action in the same spot
- Pro: No scrolling needed to continue, which helps the under-2-minutes goal
- Pro: Uses the 48 px button height from D-006 in a single shared component
- Con: The bar covers part of the form, so focused fields and error messages need scroll padding
- Con: The on-screen keyboard can cover or push the bar, so each step needs a keyboard-open behavior
- Con: The button can be tapped before the form is complete, so the validation and the disabled state must be clear
- By: claude

### B · Fixed bottom bar only for "Pay" / "Place order", other buttons inline after the form
- Pro: Keeps D-005 as it is, with the smallest change
- Pro: Short steps like Contact email leave the whole screen to the form
- Pro: Fewer keyboard and overlay edge cases to design and test
- Con: Buttons move between steps, so one-handed users have to look for them each time
- Con: Inline buttons on longer steps such as Delivery address end up out of thumb reach or below the fold
- Con: Two button placements in one flow means more specs and less consistency
- By: claude

## Q-004 · What do we do about: Address autocomplete reduces abandonment?
- Type: finding
- Source: research:checkout-patterns-on-mobile F-03
- Category: behavior
- Status: decided A (D-010)
- Recommended: A

### A · Address autocomplete with manual fallback
- Pro: Fewer taps and less typing for a shopper with one hand free, which helps the under-2-minute goal
- Pro: Fewer typos, so fewer 'address not deliverable' failures and fewer support tickets
- Pro: Fits the separate delivery address step (D-003): one search field opens the step, and the full fields fill in after a pick
- Pro: Matches research F-03, so abandonment should drop where shoppers leave most
- Con: Needs a paid address lookup service, which adds cost and a third-party dependency
- Con: Suggestions need the network, so on a weak connection they can be slow or never arrive
- Con: New addresses, rural addresses and flat numbers are often missing or wrong in lookup data
- Con: Each keystroke goes to an outside service, so this needs a privacy review
- By: claude

### B · Manual fields tuned for browser autofill
- Pro: No service cost and works offline, so a weak connection does not matter
- Pro: Browser and OS autofill (autocomplete attributes, correct keyboards) already fills saved addresses in one tap
- Pro: Nothing typed leaves the shop, and there is no extra vendor to maintain
- Pro: Simple to build and test
- Con: First-time guests without a saved browser address still type every field
- Con: More typos, so more 'address not deliverable' errors at payment
- Con: Ignores research F-03, so abandonment on the address step likely stays the same
- By: claude

## Q-003 · One-handed checkout on mobile
- Type: blindspot
- Source: Suggested by Claude: nobody has checked the thumb zone
- Category: behavior
- Status: decided A (D-005)

### A · "Pay" button fixed at the bottom
- Pro: Always within reach
- Con: Covers part of the form
- By: claude

### B · Button at the end of the form
- Pro: Clean screen
- Con: Scrolling to the end on small screens
- By: claude

## Q-002 · How big should buttons be on mobile?
- Type: finding
- Source: research:checkout-patterns-on-mobile F-01
- Category: design
- Status: decided B (D-006)
- Recommended: A

### A · 44 px high
- Pro: The WCAG and iOS minimum
- Pro: Two buttons fit on one row
- Con: Tight for large thumbs
- By: claude

### B · 48 px high
- Pro: Easier to tap
- Pro: Material standard
- Con: The payment screen grows by about 40 px
- By: claude

## Q-001 · Delivery address: separate step or on the payment screen?
- Type: finding
- Source: Analytics: shoppers abandon at the address
- Category: behavior
- Status: decided A (D-003)

### A · Separate step
- Pro: Clearer
- Con: One more tap
- By: claude

### B · Same screen as payment
- Pro: Faster
- Con: Long screen
- By: claude
