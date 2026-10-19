# Pattern: audit log

**Problem:** in regulated or multi-user products, people need to prove who changed what,
when and from where, and to undo mistakes with evidence.
**Heuristic:** visibility of system status, help users recognize and recover from errors.

## Rules
- Read only. Entries are never edited or deleted from the UI; retention is stated
  ("kept for 400 days").
- Each entry: time with seconds and time zone, actor (person, API key or "System"), action
  as a stable code (`invoice.updated`), object with a link, source (web, API, scheduled job,
  IP and location when relevant).
- Expanding an entry shows field changes (`Change Item`: field, old, new) and metadata
  (request id, user agent). Sensitive values are masked.
- Filters: actor, action, object type, date range; search by object id. Export the current
  view for compliance.
- Log at least: sign-in and failed sign-in, permission and role changes, approvals,
  exports, deletions, settings and security changes, API key changes.
- Show a short "History" tab on record pages filtered to that record; the full log lives in
  admin settings.

## Figma
`Change Item` on the Audit page; `Block / Audit Log` on the Enterprise page (Data Grid Toolbar
+ grid with an expanded row).
