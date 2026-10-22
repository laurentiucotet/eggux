# Pattern: action feedback

**Problem:** some actions answer with a toast, some with nothing, some with a dialog; users
click twice, miss errors, or get buried in notifications for things they can already see.
**Heuristic:** visibility of system status, consistency and standards, user control.

## The rule
Every action gets feedback within 100 ms. The channel depends on where the result is:
- **The result is visible where the user is** (a row changes, a switch flips, a card moves):
  the change itself is the feedback. No toast.
- **The result is not visible** (the object left the view, the work happens elsewhere, or
  later): toast.
- **The action can be undone:** toast with Undo, even if the result is visible.
- **The action failed:** inline error where the user acted, keep their input; toast only for
  failures of background work.

## By action
| Action | Feedback | Where the user lands |
|---|---|---|
| Create (dialog, sheet) | Close, new item appears highlighted at its place in the list; toast "Customer created" with "Open" when it is outside the view | Stays on the list |
| Create (full page) | Toast "Invoice INV-1048 created" | The new object's page |
| Edit and save (form) | Button shows saving, then toast "Changes saved" | Same page, form clean |
| Inline edit, toggle, reorder | The value itself changes; error inline with the old value restored | Same place |
| Autosave | Quiet status text "Saved" / "Saving…" next to the title; no toast | Same place |
| Delete or archive (restorable) | Item disappears, toast "Project archived" + Undo (5-10 s) | Same list |
| Delete (not restorable) | Confirm first (`delete-confirmation.md`), then toast "Project deleted" | Parent list |
| Bulk action | Progress for long runs, then toast with the count and failures: "18 invoices sent, 2 failed. View" | Same list, failed rows marked |
| Send, submit, request approval | Toast that says what happens next: "Sent to Elena for approval" | The object, status updated |
| Copy (link, value) | Button icon turns to a check for 2 s, label "Copied"; no toast | Same place |
| Export, import, long jobs | Toast "Export started"; notification when ready with a link; never block the page | Same place |
| Invite, share | Toast "Invitation sent to ana@acme.com"; pending invite visible in the list | Same place |
| Sign out, switch org | No toast; the destination is the feedback | Sign-in or new org home |

## Writing
- Name the object and the result, past tense: "Invoice INV-1048 sent", not "Success!".
- One toast per action; bulk actions summarize in one toast.
- Errors say what happened and what to do (`feedback-messages.md`).

## Never
- A toast for something the user is looking at.
- A dialog to say something succeeded.
- A toast as the only place for information the user needs later (ids, links, codes).
- Silent failure, or a success toast before the server confirmed (use optimistic UI only with
  rollback and an error message).

## Figma
`Toast` (Type default, success, error, loading; Show action, the Button exposed for Undo / Open),
`Button` State=loading while saving (a spinner replaces the leading icon), `Badge` and row states
for inline results.
