---
client: "Shop demo (sample project)"
updated: "2026-11-25"
---

# Decisions

Read this file before any design, code or review work. Decisions override `brand.md` and the
EGG UX base rules; the newest decision wins.

## Inbox
Write new requests here, one line each, with date, time and who asked. Claude turns each line
into a decision below (`/eggux:decision-log`), applies it, verifies it and removes the line.

## Terminology
| Use | Don't use | Context | Since |
|---|---|---|---|
| Place order | Finish, Complete | Checkout primary button | D-004 |
| Sign in | Log in, Login | Everywhere | D-001 |

## Decisions
Newest first. Status: proposed → approved → applied (date) → verified (date); superseded by D-xxx.

### D-010 · 2026-11-25 11:31 · What do we do about: Address autocomplete reduces abandonment: Address autocomplete with manual fallback
- Type: behavior
- Decision: Address autocomplete with manual fallback. Pros: Fewer taps and less typing for a shopper with one hand free, which helps the under-2-minute goal; Fewer typos, so fewer 'address not deliverable' failures and fewer support tickets; Fits the separate delivery address step (D-003): one search field opens the step, and the full fields fill in after a pick; Matches research F-03, so abandonment should drop where shoppers leave most. Cons: Needs a paid address lookup service, which adds cost and a third-party dependency; Suggestions need the network, so on a weak connection they can be slow or never arrive; New addresses, rural addresses and flat numbers are often missing or wrong in lookup data; Each keystroke goes to an outside service, so this needs a privacy review.
- Reason: Option A of Q-004 (research:checkout-patterns-on-mobile F-03). Source: Decide, 2026-11-25 11:31.
- Status: approved

### D-009 · 2026-11-25 11:31 · What do we do about: Keep the primary button in the thumb zone: Fixed bottom bar for the primary button on every checkout step
- Type: design
- Decision: Fixed bottom bar for the primary button on every checkout step. Pros: Extends D-005 from "Pay" to Contact, Delivery address (D-003) and Payment, so all steps behave the same way; Busy parent with one hand free always finds the next action in the same spot; No scrolling needed to continue, which helps the under-2-minutes goal; Uses the 48 px button height from D-006 in a single shared component. Cons: The bar covers part of the form, so focused fields and error messages need scroll padding; The on-screen keyboard can cover or push the bar, so each step needs a keyboard-open behavior; The button can be tapped before the form is complete, so the validation and the disabled state must be clear.
- Reason: Option A of Q-005 (research:checkout-patterns-on-mobile F-04). Source: Decide, 2026-11-25 11:31.
- Status: approved

### D-008 · 2026-11-25 11:31 · What do we do about: Keep account saving after payment, never before. The current step 4 placement is right: Keep saving at step 4, after pa
- Type: behavior
- Decision: Keep saving at step 4, after payment. Pros: Matches the busy parent's goal: never create an account just to pay; Adds no fields or decisions before payment, so the 2-minute target and the Pay button flow (D-005) stay clean; The order is already placed, so the offer feels like a bonus rather than a gate; Email and address from the order can be reused, so saving needs one action at most (a password, or an email link for people who forget passwords). Cons: Some shoppers close the confirmation page without seeing the offer; We need a fallback, such as a 'Save my details' link in the confirmation email; The guest order has to be linked to the new account afterwards (Order belongs to account or guest email).
- Reason: Option A of Q-007 (research:saving-an-account-right-after-a-guest-checkout F-01). Source: Decide, 2026-11-25 11:31.
- Status: approved

### D-007 · 2026-11-25 11:31 · What do we do about: Offer a passkey or emailed set-up link before a typed password, since both actors forget passwords: Passkey first, emai
- Type: behavior
- Decision: Passkey first, emailed link as fallback, no password at save. Pros: The busy parent saves the account with one tap and Face ID or a fingerprint on the confirmation screen, so they stay in the checkout flow; Works with one hand and adds no extra screen, in line with D-005 and D-006; Passkeys sync through iCloud or Google, which helps the loyal customer who forgets the password on a rarely used device; Nothing to remember, and support agents still never see a password. Cons: Needs a passkey attribute added to Customer account in objects.md, plus a passkey or link path in the Sign in workflow; Some shoppers don't know what a passkey is, so the button needs one short line of plain copy; Two paths to design and test: passkey, and link for devices without passkey support.
- Reason: Option A of Q-006 (research:saving-an-account-right-after-a-guest-checkout F-04). Source: Decide, 2026-11-25 11:31.
- Status: approved

### D-006 · 2026-11-25 10:17 · How big should buttons be on mobile: 48 px high
- Type: design
- Decision: 48 px high. Pros: Easier to tap; Material standard. Cons: The payment screen grows by about 40 px.
- Reason: Option B of Q-002 (research:checkout-patterns-on-mobile F-01). Source: Decide, 2026-11-25 10:17.
- Status: approved

### D-005 · 2026-11-25 10:16 · One-handed checkout on mobile: "Pay" button fixed at the bottom
- Type: behavior
- Decision: "Pay" button fixed at the bottom. Pros: Always within reach. Cons: Covers part of the form.
- Reason: Option A of Q-003 (Suggested by Claude: nobody has checked the thumb zone). Source: Decide, 2026-11-25 10:16.
- Status: approved

### D-004 · 2026-11-20 · "Place order" replaces "Finish"
- Type: terminology
- Decision: the checkout primary button says "Place order".
- Status: applied 2026-11-25

### D-003 · 2026-11-24 · Delivery address is a separate checkout step
- Type: flow
- Decision: address gets its own step before payment, with address autocomplete.
- Status: approved

### D-002 · 2026-11-18 · Primary buttons have 8 px corners
- Type: branding
- Decision: from the client's new brand book.
- Status: applied 2026-11-18

### D-001 · 2026-11-10 · Project initialized
- Type: process
- Decision: EGG UX workflow with the EGG UI library. Mobile first. "Sign in", never "Log in".
- Status: verified 2026-11-10
