# Result and error pages

`Block / Result` (Results blocks page): not-found (404), server-error (500), no-access (403),
maintenance, success. Put it centered in the Page slot of the shell the user was in.

## Rules
- Say what happened in plain words; no blame, no jokes on errors that cost the user work.
- Reassure about data when relevant ("Nothing you saved is lost").
- Always a next step: primary (Go to dashboard, Try again, Request access) + an alternative.
- 404: keep navigation (shell) visible; offer search or the parent page.
- 500: Try again + support contact; include an error ID the user can quote.
- 403: say who can grant access; offer switching account.
- Maintenance: until when (time zone) and a status page link.
- Success pages only for milestones (order placed, account created); otherwise a toast.
