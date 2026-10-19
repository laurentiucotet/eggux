# Common flows

Reusable flows that most products have. In `eggux/workflows.md`, refer to a flow by name and
write only what differs for the client ("Create customer: uses Create object, plus a VAT check").
Each flow lists its steps, the patterns and blocks it uses, the feedback and the failure paths.

## Create object
1. List → "New <object>" (primary button in the Page Header).
2. Form: Sheet or Dialog for up to ~8 fields, a page or Wizard for more (`form-validation.md`,
   `multi-step-form.md`).
3. Save → validation inline; on success the feedback from `action-feedback.md` (Create).
- Failure: server error keeps the form; duplicates are caught before save ("A customer with
  this VAT ID exists. Open it").

## Edit object
1. Detail page → Edit (or inline edit for single fields, `table.md`).
2. Explicit save with `Save Bar` on long forms, autosave on documents (`unsaved-changes.md`).
- Failure: conflict with another editor (`errors-and-recovery.md`).

## Delete, archive, restore
1. Row menu or detail menu → Archive (Undo) or Delete (confirm by cost, `delete-confirmation.md`).
2. Restore from Archive or Trash puts it back where it was.

## Bulk change
Select → action → confirm by risk → progress → summary with failures (`bulk-actions.md`).

## Find and open
Search or filters (`search-and-filter.md`) → open detail → Back returns to the same list
state and scroll position.

## Invite teammate
Settings → Members → Invite (emails + role) → pending invite → accepted → member
(`sharing-and-invites.md`, `Block / Team Members`, `Block / Accept Invite`).

## Share object
Object header → Share → people and roles, link setting → Copy link (`sharing-and-invites.md`).

## Sign up and onboard
Sign up → verify email (`Block / Check Email`) → minimal setup (`Page Shell / Wizard`) → first
value → Onboarding Checklist for the rest (`auth.md`, `empty-state.md`).

## Sign in and recover
Sign in → 2FA when enabled → last visited page; Forgot password → email → reset → signed in
(`auth.md`). Session expiry re-authenticates in place (`errors-and-recovery.md`).

## Request and approve
Submit for approval → chain notified → approve, reject with reason or request changes →
requester notified (`approvals.md`, `notifications.md`).

## Import data
Upload → map columns → review problems → import in the background → notification
(`enterprise-apps.md` § Import).

## Export data
Export current view → format → small: download now; large: background job and notification
with the file link (`action-feedback.md`).

## Change plan and pay
Billing → compare plans → change → payment if needed → confirmation with what changes and
when; downgrades say what will be lost before confirming (`settings-and-admin.md`, `commerce.md`).

## Act on a notification
Notification → opens the object at the right place (comment, approval step) → act → the
notification is marked read (`notifications.md`).
