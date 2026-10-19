# Pattern: errors and recovery

**Problem:** people lose work to expired sessions, lost connections, conflicting edits and
deletes they regret.
**Heuristic:** help users recognize, diagnose and recover from errors; user control and freedom.

## Never lose the user's input
- Session expired: sign in again in a dialog over the page, then retry the action. Never
  redirect away from a form with unsaved input.
- Connection lost: banner "You're offline. Changes will sync when you're back"; queue safe
  actions, block only what needs the server, keep drafts locally.
- Server error: keep the form filled, inline error with Retry; after two failures, offer
  "Copy details" for support.

## Conflicts
- Someone else changed the record while the user edited: on save, show both versions of the
  changed fields and let the user choose; never overwrite silently.
- Live lists: new or changed items appear with a short highlight; do not move the row the
  user is about to click.
- Stale data: "Updated 5 min ago · Refresh" on long-open pages.

## Undo, trash and history
- Prefer Undo (toast, 5-10 s) to confirmation for restorable actions (`delete-confirmation.md`).
- Deleted objects go to a Trash for 30 days when possible; restore puts them back in place.
- Important objects keep a version history: who changed what, restore a version.

## Rate limits and quotas
- Say what limit was hit and when it resets; offer the upgrade or the wait, never a generic
  error.

## Figma
`Alert` (banner for offline and view only), `Dialog` for re-authentication, `Toast` with Undo,
`Change Item` for conflict and history views, `Block / Result` for server errors.
