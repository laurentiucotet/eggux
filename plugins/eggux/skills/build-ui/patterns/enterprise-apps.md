# Pattern: enterprise and corporate apps

**Problem:** internal tools, admin panels and B2B products look and behave like a startup
landing page: too much air, too few rows, no audit trail, no way to share a filtered view.
**Heuristic:** efficiency of use, consistency and standards, user control, error prevention.

## Start here
- Theme: `Corporate Light` (or `Corporate Dark`) on Semantic and Components, `Compact` on
  Density, for the whole app shell. Default theme stays for marketing and consumer flows.
- Shell: App shell; Sidebar with Org Switcher when users belong to several entities. Admin
  panels and CMS: `Page Shell / Admin Panel` (Sidebar Double when there are several sections of
  many pages each). Editors: Aside=on with a Side Panel for the object's summary, actions fixed
  at the bottom; lists: Aside=off.
- Page grid: navigation column hugs the sidebar, Main flexes, the aside column hugs the Side
  Panel (320, or 48 collapsed); header on top, actions bar fixed at the bottom, only the body
  scrolls.
- Lists over ~50 rows use the data grid (`components/table.md` § Data grid), not cards.

## What enterprise users expect
| Need | Use | Guide |
|---|---|---|
| Work with large lists | Data Grid Toolbar + grid with saved views, groups, totals, bulk actions, export | `components/table.md` |
| Find a precise subset | Filter Builder (conditions, and / or, one nested group), Save as view | `search-and-filter.md` |
| Changes need sign-off | Approval Request with an approval chain | `approvals.md` |
| Know who changed what | Audit Log, Change Item; every approval, permission and export is logged | `audit-log.md` |
| Control access | Roles & Permissions matrix, Owner locked | `settings-and-admin.md` |
| Several companies or tenants | Org Switcher in the Sidebar Workspace | `settings-and-admin.md` |
| Recurring numbers | Report: period, comparison, KPIs, chart, breakdown, export, schedule | `reports.md` |
| Long records | Record Form: section nav, two-column fields, Save Bar, danger zone | `record-page.md` |
| Bring data in | Import: upload, map columns (`Block / Import Mapping`), review problems, import in the background | this file § Import |

## Rules
- Density: Compact rows (`density/*`), but touch targets stay 44 px on mobile and text never
  goes below `body/small`.
- Show provenance: who changed it last and when, on every record header and report.
- Sections of a page open with a Section Heading (default, h3) with its actions on the right;
  groups inside a card use Size=sm. Forms end with an Action Bar (end).
- Nothing destructive or financial happens without confirmation, and nothing important
  without a log entry.
- Keyboard first: search with `/`, command palette `⌘K`, Enter to open a row, Space to select,
  Escape to close. Shortcuts listed in a Help menu.
- Export what you show: CSV / XLSX of the current view (columns, filters, sort), with a row
  count before export and a limit message for large exports.
- Long operations (imports, bulk updates) run in the background with progress and a
  notification when done; never block the page.
- Dates, numbers and currency follow the user's locale; amounts show their currency.
- Every screen has a permission-aware empty state: "You do not have access to invoices.
  Ask an admin" instead of a blank page.
- Org chart: `Block / Org Chart`, at most 3 levels, vacant roles stay in the tree.

## Import
- Steps: Upload (CSV, XLSX; size and row limits shown), Map columns, Review, Import.
- Mapping: auto-match by column name; each file column shows sample values; unmatched columns
  need a field or Skip; required fields must be mapped before Continue.
- Review: count of new, updated and invalid rows; invalid rows can be downloaded, skipped or
  imported with a "Needs review" tag. Never fail the whole file for a few rows.
- Import runs in the background with progress; notify when done with a link to the result
  and an undo window when possible. Save the mapping as a template for next time.

## Figma
Blocks on the Enterprise page (BLOCKS): Filter Builder, Approval Request, Audit Log,
Roles & Permissions, Report, Record Form. Examples: "enterprise invoices" (App shell,
Corporate + Compact) and "theme comparison" (Default vs Corporate). Template:
`Template / data grid (enterprise)` on the Table page.
- The Map columns step uses one `Mapping Row` per source column: sample value, target Select, status
  (mapped, skipped, error), with a summary of counts above. Multi-step automations and approval
  flows use `Workflow Node` on a canvas (@xyflow/react).
- Command palette ⌘K: `Block / Command Palette` (Suggestions, Recent, Go to, shortcuts in Kbd).
