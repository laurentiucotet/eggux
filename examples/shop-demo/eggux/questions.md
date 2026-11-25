---
updated: "2026-11-25"
---

# Questions

What needs deciding, with options. Claude proposes options; you choose. A choice becomes a
decision in decisions.md and a task in tasks.md.

## Q-006 · What do we do about: Offer a passkey or emailed set-up link before a typed password, since both actors forget passwords?
- Type: finding
- Source: research:saving-an-account-right-after-a-guest-checkout F-04
- Category: behavior
- Status: open
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
- Status: open
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
- Status: open
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
