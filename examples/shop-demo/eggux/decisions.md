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
