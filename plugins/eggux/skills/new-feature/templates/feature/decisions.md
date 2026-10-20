---
feature: "{{name}}"
updated: "{{date}}"
---

# Decisions: {{name}}

Decisions that apply to this feature. A decision that changes the whole product (a component,
a token, a term used everywhere) goes to `eggux/decisions.md` as a `D-xxx` and is linked here.
The newest decision wins; feature decisions never override product decisions without saying so.

## Inbox
New input in one line each, with date, time and who: a decision, a detail, a review comment,
a meeting note. `/eggux:update-feature` turns each line into changes across the feature's files
and Figma page, records it below and removes the line.
<!-- Example: - 2026-10-21 14:30 · Maria (client, review): approvers must add a reason when they reject -->

## Decisions
Newest first. Status: proposed → approved → applied (date) → verified (date); superseded by FD-xx.

### FD-01 · {{date}} · Feature started
- Type: process
- Decision: Spec, scenarios and Figma page created with /eggux:new-feature.
- Affects: all files
- Status: verified {{date}}
