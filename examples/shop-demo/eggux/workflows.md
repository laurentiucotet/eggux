---
client: "Shop demo (sample project)"
updated: "2026-11-25"
---

# Workflows

## Sign in
- **Actor:** Loyal customer
- **Goal:** get to the account or finish checkout with saved details.
- **Based on:** Sign in (`patterns/common-flows.md`)
- **Trigger:** "Sign in" in the header or at checkout.
- **Steps:**
  1. Enter email and password → Customer account + sign in → auth pattern
  2. Land on the page they came from
- **Success:** signed in, back where they were.
- **Failure paths:** wrong credentials (one alert, input kept); locked after 5 failed attempts; forgot password (see feature `forgot-password`).
- **Frequency:** weekly

## Guest checkout
- **Actor:** Busy parent
- **Goal:** pay without creating an account.
- **Based on:** Checkout (`patterns/commerce.md`)
- **Trigger:** "Checkout" from the cart.
- **Steps:**
  1. Contact email → Order
  2. Delivery address (separate step, D-003) → Order
  3. Payment → Order + place
  4. Confirmation, with an optional "Save my details" account creation
- **Success:** order placed, confirmation email sent.
- **Failure paths:** card declined; address not deliverable; session expired.
- **Frequency:** monthly
