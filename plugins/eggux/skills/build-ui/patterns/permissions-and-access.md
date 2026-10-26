# Pattern: permissions and access

**Problem:** users see buttons that fail, pages that are blank, or no way to ask for access.
**Heuristic:** error prevention, recognition rather than recall, help and documentation.

## Hide, disable or explain
| Situation | UI |
|---|---|
| The user can never do it (role does not allow it) | Hide the control |
| The user could do it now but a condition is missing (paid plan, required field, status) | Disable it, tooltip with the reason and how to fix it |
| Plan or feature gate | Show it with a lock badge and an upgrade path; never a dead button |
| The whole page is not allowed | "You don't have access" result page: who can grant it, Request access button, link back |
| Read-only access | Show values as text, not disabled inputs; a banner says "View only" and who can edit |

## Rules
- The UI never offers what the server will refuse; the server still checks everything.
- Request access sends a notification to the owner or admins and shows "Request sent".
- Shared links respect permissions: a link to something the viewer cannot open lands on the
  no-access page with Request access, never a 404.
- Admins see why someone has a permission (role, group, direct grant).
- Permission changes take effect immediately and are logged (`audit-log.md`).

## Figma
`Block / Result` Type=no-access, `Tooltip`, `Badge` with lock icon, `Alert` banner for view only,
`Block / Roles & Permissions`.
- The role matrix is a table of `Permission Row`s (Type=header names the roles; locked roles show
  disabled checked boxes), saved with the Save Bar and logged.
- Role matrix: `Permission Row` rows (Type=header, group, permission; Show role 4 and 5); highlight the role being edited by setting its role cell to State=selected in every row (Block / Roles & Permissions).
- At a plan limit show `Block / Upgrade Dialog`: the limit in numbers, current and recommended
  Plan Card, Maybe later.
