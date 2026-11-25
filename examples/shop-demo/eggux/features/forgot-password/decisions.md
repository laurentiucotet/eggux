---
feature: "Forgot password"
updated: "2026-11-25"
---

# Decisions: Forgot password

## Inbox

## Decisions
Newest first. Status: proposed → approved → applied (date) → verified (date); superseded by FD-xx.

### FD-06 · 2026-11-25 · Support agents can send the reset email
- Type: access
- Decision: in this version; same email as self-service; logged with agent, customer and time; agents never see passwords.
- Affects: S-03, F-02, actors.md, objects.md
- Source: owner, interview
- Status: approved

### FD-05 · 2026-11-25 · Resend limits (default)
- Type: rule
- Decision: resend after 60 s; at most 5 reset emails per hour per address and 20 per hour per IP; the limit message shows the same way for any email; a new link invalidates older ones.
- Affects: E-02, E-03
- Source: pattern default
- Status: approved

### FD-04 · 2026-11-25 · Other devices are signed out after a reset
- Type: rule
- Decision: every session except the one created by the reset ends; the "Password changed" email says so.
- Affects: S-01, S-02
- Source: owner, interview
- Status: approved

### FD-03 · 2026-11-25 · Signed in after reset, back where they were
- Type: flow
- Decision: after "Save password" the shopper is signed in and returns to the page that started the reset (checkout step included); on another device, to the account home.
- Affects: S-01, S-02, F-01 step 7
- Source: owner, interview
- Status: approved

### FD-02 · 2026-11-25 · Reset link valid for 30 minutes, single use
- Type: rule
- Decision: 30 minutes, one use.
- Affects: E-02, reset email copy
- Source: owner, interview
- Status: approved

### FD-01 · 2026-11-25 · Feature started
- Type: process
- Decision: spec, scenarios and handoff created with /eggux:new-feature. No Figma page: the sample project has no Figma file.
- Affects: all files
- Status: verified 2026-11-25
