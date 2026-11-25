---
client: "Shop demo (sample project)"
updated: "2026-11-25"
---

# Objects (OOUX / ORCA)

## Customer account
- **Definition:** a shopper's login and profile.
- **Attributes:** email*, name*, password (hashed, never shown), status*, created date, last sign-in, saved addresses, loyalty points
- **Relationships:** has many Orders, has many Sessions
- **CTAs:** sign up, sign in, sign out, reset password, change password → Shopper, Loyal customer; send reset email → Support agent
- **States:** active, locked (too many failed sign-ins), closed

## Session
- **Definition:** one signed-in device or browser.
- **Attributes:** device*, browser*, approximate location*, started, last active
- **Relationships:** belongs to Customer account
- **CTAs:** sign out this session, sign out everywhere → account owner
- **States:** active, ended

## Order
- **Definition:** a purchase, with items, address and payment.
- **Attributes:** number*, date*, status*, total*, items, delivery address, payment method
- **Relationships:** belongs to Customer account (or a guest email)
- **CTAs:** place, cancel, reorder, return → shopper
- **States:** placed, paid, shipped, delivered, cancelled, returned
