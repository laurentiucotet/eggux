---
client: "{{client}}"
updated: "{{date}}"
---

# Decisions

Read this file before any design, code or review work. Decisions override `brand.md` and the
EGG UX base rules; the newest decision wins.

## Inbox
Write new requests here, one line each, with date, time and who asked. Claude turns each line
into a decision below (`/eggux:decision-log`), applies it, verifies it and removes the line.
<!-- Example: - 2026-10-21 09:15 · Andrei (manager): cards with 12 px padding instead of 24 -->

## Terminology
| Use | Don't use | Context | Since |
|---|---|---|---|

## Decisions
Newest first. Status: proposed → approved → applied (date) → verified (date); superseded by D-xxx.

### D-001 · {{date}} · Project initialized
- Type: process
- Decision: EGG UX workflow with the EGG UI v2 library.
- Status: verified {{date}}
