# Pattern: sharing and invites

**Problem:** people do not know who can see what, invites get lost, and shared links leak.
**Heuristic:** visibility of system status, error prevention, match with the real world.

## Invite to the workspace
- Invite by email, several at once, each with a role; validate emails inline.
- Pending invites are visible in the members list with Resend and Revoke; invites expire
  (7 days) and say so.
- The invite email names who invited them and to what; accepting lands in the workspace,
  with sign-up only if needed (`Block / Accept Invite`).
- Seat limits are shown before sending, not after.

## Share an object
- Share dialog: people with access (avatar, name, role per person, remove), add people with a
  role, and a link setting (Restricted, Anyone in the workspace, Anyone with the link).
- Default to the most restrictive option that works; public links show a warning and can
  expire.
- Copy link gives inline "Copied" feedback.
- The object header shows who can see it (avatar group + "Shared with 6").

## Figma
`Dialog` with `Combobox` (people), `Select` (role), `Avatar Group`, `Block / Team Members`,
`Block / Accept Invite`.
