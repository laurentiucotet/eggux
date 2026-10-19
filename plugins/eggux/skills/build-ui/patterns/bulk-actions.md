# Pattern: bulk actions

**Problem:** acting on many items at once hides which ones failed, runs on the wrong set, or
blocks the page.
**Heuristic:** visibility of system status, error prevention, help users recover from errors.

## Rules
- Selection: checkbox column; header checkbox selects the page (indeterminate when partial);
  after selecting a page, offer "Select all 1,284 invoices" across pages.
- While selected, `Table Toolbar` replaces the toolbar: "N selected", the actions, Clear.
- Only actions valid for the whole selection are enabled; a disabled action says why on
  hover ("2 selected invoices are already paid").
- Destructive bulk actions confirm with the count and type to confirm above ~100 items.
- Under ~2 s: run inline. Longer: background job with progress, the page stays usable.
- Result: one toast with counts ("18 sent, 2 failed") and a link to the failures; failed rows
  stay selected and marked with the reason.
- Bulk edit: a Sheet with only the fields that can change together; fields left empty stay
  unchanged, say so in the sheet.
- Every bulk change is one audit log entry with the list of objects.

## Figma
Data grid template (Table page), `Table Toolbar`, `Checkbox`, `Toast`, `Sheet`, `Progress`.
